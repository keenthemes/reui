"use client"

import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"
import {
  DataGridColumnEditor,
  DataGridEditingTableMeta,
} from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import { RowData } from "@tanstack/react-table"

type EditableRow = RowData

export interface EditableDataGridColumn<TData extends EditableRow> {
  id: string
  editor: DataGridColumnEditor<TData, unknown>
}

export interface EditableDataGridCellSaveParams<TData extends EditableRow> {
  rowId: string
  columnId: string
  row: TData
  previousValue: unknown
  value: unknown
  nextRow: TData
}

export interface EditableDataGridRowSaveParams<TData extends EditableRow> {
  rowId: string
  row: TData
  draft: Partial<TData>
  nextRow: TData
}

export interface EditableDataGridErrorContext<TData extends EditableRow> {
  source: "cell" | "dialog"
  rowId: string
  columnId?: string
  row: TData
  message: string
}

export interface UseEditableDataGridOptions<TData extends EditableRow> {
  data: TData[]
  setData: Dispatch<SetStateAction<TData[]>>
  getRowId: (row: TData) => string
  editorColumns: EditableDataGridColumn<TData>[]
  onSaveCell?: (
    params: EditableDataGridCellSaveParams<TData>
  ) => Promise<TData | void> | TData | void
  onSaveRow?: (
    params: EditableDataGridRowSaveParams<TData>
  ) => Promise<TData | void> | TData | void
  onError?: (
    error: unknown,
    context: EditableDataGridErrorContext<TData>
  ) => void
}

function getCellKey(rowId: string, columnId: string) {
  return `${rowId}::${columnId}`
}

function humanizeColumnId(columnId: string) {
  return columnId
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (value) => value.toUpperCase())
}

function getRecordValue<TData extends EditableRow>(
  row: TData,
  columnId: string
) {
  return (row as Record<string, unknown>)[columnId]
}

function setRecordValue<TData extends EditableRow>(
  row: TData,
  columnId: string,
  value: unknown
) {
  return {
    ...(row as Record<string, unknown>),
    [columnId]: value,
  } as TData
}

function replaceRow<TData extends EditableRow>(
  rows: TData[],
  rowId: string,
  getRowId: (row: TData) => string,
  nextRow: TData
) {
  return rows.map((row) => (getRowId(row) === rowId ? nextRow : row))
}

function isEmptyValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  return value === null || value === undefined
}

function normalizeErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error
  }

  return fallback
}

export function useEditableDataGrid<TData extends EditableRow>({
  data,
  setData,
  getRowId,
  editorColumns,
  onSaveCell,
  onSaveRow,
  onError,
}: UseEditableDataGridOptions<TData>): DataGridEditingTableMeta<TData> {
  const [activeCell, setActiveCell] = useState<{
    rowId: string
    columnId: string
  } | null>(null)
  const [cellDrafts, setCellDrafts] = useState<Record<string, unknown>>({})
  const [cellErrors, setCellErrors] = useState<
    Record<string, string | undefined>
  >({})
  const [pendingCells, setPendingCells] = useState<Record<string, boolean>>({})
  const [pendingRows, setPendingRows] = useState<Record<string, boolean>>({})
  const [dialogRowId, setDialogRowId] = useState<string | null>(null)
  const [dialogDraft, setDialogDraft] = useState<Partial<TData> | null>(null)
  const [dialogErrors, setDialogErrors] = useState<
    Record<string, string | undefined>
  >({})
  const [dialogMessage, setDialogMessage] = useState<string | null>(null)

  const editorMap = useMemo(
    () => new Map(editorColumns.map((column) => [column.id, column.editor])),
    [editorColumns]
  )

  const findRowById = useCallback(
    (rowId: string) => data.find((row) => getRowId(row) === rowId) ?? null,
    [data, getRowId]
  )

  const dialogRow = useMemo(
    () => (dialogRowId ? findRowById(dialogRowId) : null),
    [dialogRowId, findRowById]
  )

  const getEditor = useCallback(
    (columnId: string) => editorMap.get(columnId),
    [editorMap]
  )

  const parseValue = useCallback(
    (
      editor: DataGridColumnEditor<TData, unknown>,
      value: unknown,
      row: TData
    ) => {
      if (editor.parse) {
        return editor.parse(value, row)
      }

      switch (editor.kind) {
        case "number": {
          if (typeof value === "number") {
            return value
          }

          if (typeof value === "string") {
            const normalizedValue = value.replace(/,/g, "").trim()
            return normalizedValue.length > 0
              ? Number(normalizedValue)
              : undefined
          }

          return value
        }

        case "checkbox":
        case "switch":
          return value === true

        case "rating":
          return typeof value === "number" ? value : Number(value)

        default:
          return value
      }
    },
    []
  )

  const validateValue = useCallback(
    (
      columnId: string,
      editor: DataGridColumnEditor<TData, unknown>,
      value: unknown,
      row: TData
    ) => {
      const fieldLabel = editor.label ?? humanizeColumnId(columnId)

      if (editor.required && isEmptyValue(value)) {
        return `${fieldLabel} is required.`
      }

      if (editor.kind === "number" && value !== undefined && value !== null) {
        if (typeof value !== "number" || Number.isNaN(value)) {
          return `${fieldLabel} must be a valid number.`
        }

        if (typeof editor.min === "number" && value < editor.min) {
          return `${fieldLabel} must be at least ${editor.min}.`
        }

        if (typeof editor.max === "number" && value > editor.max) {
          return `${fieldLabel} must be at most ${editor.max}.`
        }
      }

      if (editor.validate) {
        return editor.validate(value, row) ?? null
      }

      return null
    },
    []
  )

  const clearCellState = useCallback((rowId: string, columnId: string) => {
    const cellKey = getCellKey(rowId, columnId)

    setCellDrafts((currentDrafts) => {
      if (!(cellKey in currentDrafts)) {
        return currentDrafts
      }

      const nextDrafts = { ...currentDrafts }
      delete nextDrafts[cellKey]
      return nextDrafts
    })

    setCellErrors((currentErrors) => {
      if (!(cellKey in currentErrors)) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[cellKey]
      return nextErrors
    })
  }, [])

  const startCellEdit = useCallback(
    (row: TData, columnId: string) => {
      const rowId = getRowId(row)
      if (pendingRows[rowId]) {
        return
      }

      setDialogMessage(null)
      setActiveCell({ rowId, columnId })
      setCellDrafts((currentDrafts) => ({
        ...currentDrafts,
        [getCellKey(rowId, columnId)]: getRecordValue(row, columnId),
      }))
      setCellErrors((currentErrors) => ({
        ...currentErrors,
        [getCellKey(rowId, columnId)]: undefined,
      }))
    },
    [getRowId, pendingRows]
  )

  const cancelCellEdit = useCallback(
    (rowId?: string, columnId?: string) => {
      const target = rowId && columnId ? { rowId, columnId } : activeCell
      if (!target) {
        return
      }

      clearCellState(target.rowId, target.columnId)
      setActiveCell((currentCell) =>
        currentCell?.rowId === target.rowId &&
        currentCell?.columnId === target.columnId
          ? null
          : currentCell
      )
    },
    [activeCell, clearCellState]
  )

  const updateCellDraft = useCallback(
    (rowId: string, columnId: string, value: unknown) => {
      const cellKey = getCellKey(rowId, columnId)

      setCellDrafts((currentDrafts) => ({
        ...currentDrafts,
        [cellKey]: value,
      }))

      setCellErrors((currentErrors) => ({
        ...currentErrors,
        [cellKey]: undefined,
      }))
      setDialogMessage(null)
    },
    []
  )

  const commitCellEdit = useCallback(
    async (row: TData, columnId: string, value?: unknown) => {
      const rowId = getRowId(row)
      const cellKey = getCellKey(rowId, columnId)
      const editor = getEditor(columnId)

      if (!editor || pendingRows[rowId] || pendingCells[cellKey]) {
        return false
      }

      const currentRow = findRowById(rowId) ?? row
      const rawValue =
        value !== undefined
          ? value
          : (cellDrafts[cellKey] ?? getRecordValue(currentRow, columnId))
      const parsedValue = parseValue(editor, rawValue, currentRow)
      const validationError = validateValue(
        columnId,
        editor,
        parsedValue,
        currentRow
      )

      if (validationError) {
        setCellErrors((currentErrors) => ({
          ...currentErrors,
          [cellKey]: validationError,
        }))
        return false
      }

      const previousValue = getRecordValue(currentRow, columnId)
      const nextRow = setRecordValue(currentRow, columnId, parsedValue)

      if (Object.is(previousValue, parsedValue)) {
        clearCellState(rowId, columnId)
        setActiveCell((currentCell) =>
          currentCell?.rowId === rowId && currentCell?.columnId === columnId
            ? null
            : currentCell
        )
        return true
      }

      setPendingCells((currentPendingCells) => ({
        ...currentPendingCells,
        [cellKey]: true,
      }))
      setCellErrors((currentErrors) => ({
        ...currentErrors,
        [cellKey]: undefined,
      }))
      setData((currentRows) =>
        replaceRow(currentRows, rowId, getRowId, nextRow)
      )

      try {
        const savedRow =
          (await onSaveCell?.({
            rowId,
            columnId,
            row: currentRow,
            previousValue,
            value: parsedValue,
            nextRow,
          })) ?? nextRow

        setData((currentRows) =>
          replaceRow(currentRows, rowId, getRowId, savedRow)
        )
        clearCellState(rowId, columnId)
        setActiveCell((currentCell) =>
          currentCell?.rowId === rowId && currentCell?.columnId === columnId
            ? null
            : currentCell
        )

        return true
      } catch (error) {
        const message = normalizeErrorMessage(
          error,
          `${editor.label ?? humanizeColumnId(columnId)} could not be saved.`
        )

        setData((currentRows) =>
          replaceRow(currentRows, rowId, getRowId, currentRow)
        )
        setCellErrors((currentErrors) => ({
          ...currentErrors,
          [cellKey]: message,
        }))
        onError?.(error, {
          source: "cell",
          rowId,
          columnId,
          row: currentRow,
          message,
        })

        return false
      } finally {
        setPendingCells((currentPendingCells) => ({
          ...currentPendingCells,
          [cellKey]: false,
        }))
      }
    },
    [
      cellDrafts,
      clearCellState,
      findRowById,
      getEditor,
      getRowId,
      onError,
      onSaveCell,
      parseValue,
      pendingCells,
      pendingRows,
      setData,
      validateValue,
    ]
  )

  const openDialog = useCallback(
    (row: TData) => {
      const rowId = getRowId(row)
      if (pendingRows[rowId]) {
        return
      }

      setDialogRowId(rowId)
      setDialogDraft({
        ...(row as Record<string, unknown>),
      } as Partial<TData>)
      setDialogErrors({})
      setDialogMessage(null)
    },
    [getRowId, pendingRows]
  )

  const closeDialog = useCallback(() => {
    if (dialogRowId && pendingRows[dialogRowId]) {
      return
    }

    setDialogRowId(null)
    setDialogDraft(null)
    setDialogErrors({})
    setDialogMessage(null)
  }, [dialogRowId, pendingRows])

  const updateDialogDraft = useCallback((columnId: string, value: unknown) => {
    setDialogDraft(
      (currentDraft) =>
        ({
          ...(currentDraft ?? {}),
          [columnId]: value,
        }) as Partial<TData>
    )
    setDialogErrors((currentErrors) => ({
      ...currentErrors,
      [columnId]: undefined,
    }))
    setDialogMessage(null)
  }, [])

  const getDialogValue = useCallback(
    (columnId: string) => dialogDraft?.[columnId as keyof TData],
    [dialogDraft]
  )

  const saveDialog = useCallback(async () => {
    if (!dialogRowId || !dialogDraft) {
      return false
    }

    const currentRow = findRowById(dialogRowId)
    if (!currentRow || pendingRows[dialogRowId]) {
      return false
    }

    const nextRow = { ...currentRow } as TData
    const nextErrors: Record<string, string | undefined> = {}

    for (const { id, editor } of editorColumns) {
      if (editor.inlineOnly) {
        continue
      }

      const rawValue =
        dialogDraft[id as keyof TData] ?? getRecordValue(currentRow, id)
      const parsedValue = parseValue(editor, rawValue, currentRow)
      const validationError = validateValue(id, editor, parsedValue, currentRow)

      if (validationError) {
        nextErrors[id] = validationError
      } else {
        ;(nextRow as Record<string, unknown>)[id] = parsedValue
      }
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setDialogErrors(nextErrors)
      return false
    }

    setDialogErrors({})
    setDialogMessage(null)
    setPendingRows((currentPendingRows) => ({
      ...currentPendingRows,
      [dialogRowId]: true,
    }))
    setData((currentRows) =>
      replaceRow(currentRows, dialogRowId, getRowId, nextRow)
    )

    try {
      const savedRow =
        (await onSaveRow?.({
          rowId: dialogRowId,
          row: currentRow,
          draft: dialogDraft,
          nextRow,
        })) ?? nextRow

      setData((currentRows) =>
        replaceRow(currentRows, dialogRowId, getRowId, savedRow)
      )
      closeDialog()

      return true
    } catch (error) {
      const message = normalizeErrorMessage(
        error,
        "The record could not be saved."
      )

      setData((currentRows) =>
        replaceRow(currentRows, dialogRowId, getRowId, currentRow)
      )
      setDialogMessage(message)
      onError?.(error, {
        source: "dialog",
        rowId: dialogRowId,
        row: currentRow,
        message,
      })

      return false
    } finally {
      setPendingRows((currentPendingRows) => ({
        ...currentPendingRows,
        [dialogRowId]: false,
      }))
    }
  }, [
    closeDialog,
    dialogDraft,
    dialogRowId,
    editorColumns,
    findRowById,
    getRowId,
    onError,
    onSaveRow,
    parseValue,
    pendingRows,
    setData,
    validateValue,
  ])

  const isCellEditing = useCallback(
    (rowId: string, columnId: string) =>
      activeCell?.rowId === rowId && activeCell?.columnId === columnId,
    [activeCell]
  )

  const isCellPending = useCallback(
    (rowId: string, columnId: string) =>
      Boolean(pendingRows[rowId] || pendingCells[getCellKey(rowId, columnId)]),
    [pendingCells, pendingRows]
  )

  const isRowPending = useCallback(
    (rowId: string) =>
      Boolean(
        pendingRows[rowId] ||
        Object.entries(pendingCells).some(
          ([cellKey, isPending]) =>
            isPending && cellKey.startsWith(`${rowId}::`)
        )
      ),
    [pendingCells, pendingRows]
  )

  const isGridPending = useCallback(
    () =>
      Object.values(pendingRows).some(Boolean) ||
      Object.values(pendingCells).some(Boolean),
    [pendingCells, pendingRows]
  )

  const getCellDraftValue = useCallback(
    (row: TData, columnId: string) =>
      cellDrafts[getCellKey(getRowId(row), columnId)] ??
      getRecordValue(row, columnId),
    [cellDrafts, getRowId]
  )

  const getCellError = useCallback(
    (rowId: string, columnId: string) =>
      cellErrors[getCellKey(rowId, columnId)],
    [cellErrors]
  )

  const getDialogError = useCallback(
    (columnId: string) => dialogErrors[columnId],
    [dialogErrors]
  )

  const clearDialogMessage = useCallback(() => {
    setDialogMessage(null)
  }, [])

  return useMemo(
    () => ({
      activeCell,
      dialogOpen: Boolean(dialogRowId && dialogDraft),
      dialogRow,
      dialogRowId,
      dialogDraft,
      dialogErrors,
      dialogMessage,
      startCellEdit,
      cancelCellEdit,
      updateCellDraft,
      commitCellEdit,
      isCellEditing,
      isCellPending,
      getCellDraftValue,
      getCellError,
      openDialog,
      closeDialog,
      updateDialogDraft,
      saveDialog,
      getDialogValue,
      getDialogError,
      clearDialogMessage,
      isRowPending,
      isGridPending,
    }),
    [
      activeCell,
      cancelCellEdit,
      clearDialogMessage,
      closeDialog,
      commitCellEdit,
      dialogDraft,
      dialogErrors,
      dialogMessage,
      dialogRow,
      dialogRowId,
      getCellDraftValue,
      getCellError,
      getDialogError,
      getDialogValue,
      isCellEditing,
      isCellPending,
      isGridPending,
      isRowPending,
      openDialog,
      saveDialog,
      startCellEdit,
      updateCellDraft,
      updateDialogDraft,
    ]
  )
}
