"use client"

import {
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  DataGridColumnEditor,
  DataGridColumnEditorRenderProps,
  getDataGridColumnEditor,
} from "@/registry-reui/bases/base/reui/data-grid/data-grid"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry-reui/bases/base/reui/number-field"
import { Rating } from "@/registry-reui/bases/base/reui/rating"
import { Cell, RowData, Table } from "@tanstack/react-table"

import { cn } from "@/registry/bases/base/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Checkbox } from "@/registry/bases/base/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/base/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/bases/base/ui/field"
import { Input } from "@/registry/bases/base/ui/input"
import { Label } from "@/registry/bases/base/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/bases/base/ui/radio-group"
import { ScrollArea } from "@/registry/bases/base/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { Spinner } from "@/registry/bases/base/ui/spinner"
import { Switch } from "@/registry/bases/base/ui/switch"
import { Textarea } from "@/registry/bases/base/ui/textarea"

type EditableRow = RowData

interface DataGridEditableCellProps<
  TData extends EditableRow,
  TValue = unknown,
> {
  cell: Cell<TData, TValue>
  className?: string
  emptyLabel?: string
}

interface DataGridEditDialogProps<TData extends EditableRow> {
  table: Table<TData>
  title?: string
  description?: string
  submitLabel?: string
}

function normalizeOptionValue(value: unknown) {
  return value === null || value === undefined ? null : String(value)
}

function getOptionValue<TData extends EditableRow>(
  editor: DataGridColumnEditor<TData, unknown>,
  value: string | null
) {
  const matchedOption = editor.options?.find(
    (option) => normalizeOptionValue(option.value) === value
  )

  return matchedOption?.value ?? value
}

function getOptionLabel<TData extends EditableRow>(
  editor: DataGridColumnEditor<TData, unknown>,
  value: unknown
) {
  return editor.options?.find(
    (option) =>
      normalizeOptionValue(option.value) === normalizeOptionValue(value)
  )?.label
}

function getDisplayValue(value: unknown, emptyLabel = "Click to edit") {
  if (typeof value === "string") {
    return value.trim().length > 0 ? value : emptyLabel
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value)
  }

  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled"
  }

  if (value === null || value === undefined) {
    return emptyLabel
  }

  return String(value)
}

function getEditorDisplayValue<TData extends EditableRow>(
  editor: DataGridColumnEditor<TData, unknown>,
  value: unknown,
  emptyLabel = "Click to edit"
) {
  return getOptionLabel(editor, value) ?? getDisplayValue(value, emptyLabel)
}

function getDefaultInlineEditorProps<TData extends EditableRow>(
  table: Table<TData>,
  row: TData,
  rowId: string,
  columnId: string,
  editor: DataGridColumnEditor<TData, unknown>,
  value: unknown,
  setValue: (value: unknown) => void,
  commit: (value?: unknown) => Promise<boolean>,
  cancel: () => void,
  isEditing: boolean,
  isPending: boolean,
  error?: string | null
): DataGridColumnEditorRenderProps<TData, unknown> {
  return {
    table,
    row,
    rowId,
    columnId,
    value,
    setValue,
    commit,
    cancel,
    isEditing,
    isPending,
    error,
    editor,
  }
}

function renderBaseSelectField<TData extends EditableRow>({
  editor,
  value,
  setValue,
  isPending,
  open,
  onOpenChange,
  triggerAutoFocus,
  onTriggerKeyDown,
}: {
  editor: DataGridColumnEditor<TData, unknown>
  value: unknown
  setValue: (value: unknown) => void
  isPending: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerAutoFocus?: boolean
  onTriggerKeyDown?: (event: ReactKeyboardEvent<HTMLButtonElement>) => void
}) {
  const normalizedValue = normalizeOptionValue(value)
  const items = (editor.options ?? []).map((option) => ({
    label: option.label,
    value: normalizeOptionValue(option.value),
  }))

  return (
    <Select
      value={normalizedValue}
      onValueChange={(nextValue) => setValue(getOptionValue(editor, nextValue))}
      items={items}
      disabled={isPending}
      open={open}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger
        className="w-full"
        autoFocus={triggerAutoFocus}
        onKeyDown={onTriggerKeyDown}
      >
        <SelectValue placeholder={editor.placeholder ?? "Select an option"} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {(editor.options ?? []).map((option) => {
          const optionValue = normalizeOptionValue(option.value)
          return (
            <SelectItem
              key={`${optionValue ?? "empty"}-${option.label}`}
              value={optionValue}
            >
              {option.label}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

function DataGridInlineSelectEditor<TData extends EditableRow>(
  props: DataGridColumnEditorRenderProps<TData, unknown>
) {
  const {
    table,
    row,
    columnId,
    editor,
    value,
    setValue,
    commit,
    cancel,
    isEditing,
    isPending,
  } = props
  const [open, setOpen] = useState(false)
  const ignoreCloseCancelRef = useRef(false)

  useEffect(() => {
    if (isEditing && !isPending) {
      setOpen(true)
      ignoreCloseCancelRef.current = false
      return
    }

    setOpen(false)
  }, [isEditing, isPending])

  useEffect(() => {
    if (isEditing && !open && !isPending) {
      ignoreCloseCancelRef.current = false
    }
  }, [isEditing, open, isPending])

  if (!isEditing) {
    return (
      <button
        type="button"
        className={cn(
          "text-foreground hover:bg-muted/60 flex min-h-9 w-full items-center rounded-md px-2 py-1 text-left transition-colors",
          !value && "text-muted-foreground"
        )}
        onClick={() =>
          table.options.meta?.editing?.startCellEdit(row, columnId)
        }
        disabled={isPending}
      >
        {getEditorDisplayValue(
          editor,
          value,
          editor.placeholder ?? "Select an option"
        )}
      </button>
    )
  }

  return renderBaseSelectField({
    editor,
    value,
    setValue: (nextValue) => {
      ignoreCloseCancelRef.current = true
      setValue(nextValue)
      void commit(nextValue)
    },
    isPending,
    open,
    onOpenChange: (nextOpen) => {
      setOpen(nextOpen)

      if (!nextOpen && !isPending) {
        if (ignoreCloseCancelRef.current) {
          ignoreCloseCancelRef.current = false
          return
        }

        cancel()
      }
    },
    triggerAutoFocus: true,
    onTriggerKeyDown: (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        cancel()
      }
    },
  })
}

function renderInlineEditor<TData extends EditableRow>({
  table,
  row,
  rowId,
  columnId,
  editor,
  value,
  setValue,
  commit,
  cancel,
  isEditing,
  isPending,
  error,
}: DataGridColumnEditorRenderProps<TData, unknown>) {
  if (editor.renderInline) {
    return editor.renderInline(
      getDefaultInlineEditorProps(
        table,
        row,
        rowId,
        columnId,
        editor,
        value,
        setValue,
        commit,
        cancel,
        isEditing,
        isPending,
        error
      )
    )
  }

  const handleTextKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      void commit()
    }

    if (event.key === "Escape") {
      event.preventDefault()
      cancel()
    }
  }

  if (editor.kind === "text" || editor.kind === "email") {
    if (!isEditing) {
      return (
        <button
          type="button"
          className={cn(
            "text-foreground hover:bg-muted/60 flex w-full items-center rounded-md px-2 py-1 text-left transition-colors",
            !value && "text-muted-foreground"
          )}
          onClick={() =>
            table.options.meta?.editing?.startCellEdit(row, columnId)
          }
          disabled={isPending}
        >
          {getDisplayValue(value)}
        </button>
      )
    }

    return (
      <Input
        autoFocus
        type={editor.kind}
        value={
          typeof value === "string" ? value : value == null ? "" : String(value)
        }
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={handleTextKeyDown}
        placeholder={editor.placeholder ?? "Enter a value"}
        disabled={isPending}
      />
    )
  }

  if (editor.kind === "number") {
    if (!isEditing) {
      return (
        <button
          type="button"
          className={cn(
            "text-foreground hover:bg-muted/60 flex w-full items-center rounded-md px-2 py-1 text-left transition-colors",
            value == null && "text-muted-foreground"
          )}
          onClick={() =>
            table.options.meta?.editing?.startCellEdit(row, columnId)
          }
          disabled={isPending}
        >
          {getDisplayValue(value)}
        </button>
      )
    }

    return (
      <NumberField
        value={typeof value === "number" ? value : undefined}
        onValueChange={(nextValue) => setValue(nextValue)}
        min={editor.min}
        max={editor.max}
        step={editor.step}
      >
        <NumberFieldGroup aria-invalid={Boolean(error)}>
          <NumberFieldDecrement />
          <NumberFieldInput
            autoFocus
            onBlur={() => void commit()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                void commit()
              }

              if (event.key === "Escape") {
                event.preventDefault()
                cancel()
              }
            }}
          />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    )
  }

  if (editor.kind === "select") {
    return (
      <DataGridInlineSelectEditor
        table={table}
        row={row}
        rowId={rowId}
        columnId={columnId}
        editor={editor}
        value={value}
        setValue={setValue}
        commit={commit}
        cancel={cancel}
        isEditing={isEditing}
        isPending={isPending}
        error={error}
      />
    )
  }

  if (editor.kind === "radio") {
    return (
      <RadioGroup
        value={normalizeOptionValue(value) ?? ""}
        onValueChange={(nextValue) => {
          const parsedValue = getOptionValue(editor, nextValue)
          setValue(parsedValue)
          void commit(parsedValue)
        }}
        className="flex flex-wrap gap-3"
      >
        {(editor.options ?? []).map((option) => {
          const optionValue = normalizeOptionValue(option.value) ?? option.label
          const optionId = `${rowId}-${columnId}-${optionValue}`

          return (
            <div key={optionId} className="flex items-center gap-2">
              <RadioGroupItem
                value={optionValue}
                id={optionId}
                disabled={isPending || option.disabled}
              />
              <Label htmlFor={optionId} className="text-xs">
                {option.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    )
  }

  if (editor.kind === "checkbox") {
    return (
      <div className="flex min-h-9 items-center justify-center">
        <Checkbox
          checked={value === true}
          onCheckedChange={(nextChecked) => void commit(nextChecked === true)}
          disabled={isPending}
        />
      </div>
    )
  }

  if (editor.kind === "switch") {
    return (
      <div className="flex min-h-9 items-center">
        <Switch
          checked={value === true}
          onCheckedChange={(nextChecked) => void commit(nextChecked === true)}
          disabled={isPending}
        />
      </div>
    )
  }

  if (editor.kind === "rating") {
    return (
      <div className="flex min-h-9 items-center">
        <Rating
          rating={typeof value === "number" ? value : 0}
          editable
          onRatingChange={(nextRating) => void commit(nextRating)}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cn(
        "text-foreground hover:bg-muted/60 flex w-full items-center rounded-md px-2 py-1 text-left transition-colors",
        !value && "text-muted-foreground"
      )}
      onClick={() => table.options.meta?.editing?.startCellEdit(row, columnId)}
      disabled={isPending}
    >
      {getDisplayValue(value)}
    </button>
  )
}

function renderDialogField<TData extends EditableRow>({
  table,
  row,
  rowId,
  columnId,
  editor,
  value,
  setValue,
  commit,
  cancel,
  isEditing,
  isPending,
  error,
}: DataGridColumnEditorRenderProps<TData, unknown>) {
  if (editor.renderDialog) {
    return editor.renderDialog({
      table,
      row,
      rowId,
      columnId,
      value,
      setValue,
      commit,
      cancel,
      isEditing,
      isPending,
      error,
      editor,
    })
  }

  if (editor.kind === "text" || editor.kind === "email") {
    return (
      <Input
        type={editor.kind}
        value={
          typeof value === "string" ? value : value == null ? "" : String(value)
        }
        onChange={(event) => setValue(event.target.value)}
        placeholder={editor.placeholder ?? "Enter a value"}
        disabled={isPending}
      />
    )
  }

  if (editor.kind === "textarea") {
    return (
      <Textarea
        value={
          typeof value === "string" ? value : value == null ? "" : String(value)
        }
        onChange={(event) => setValue(event.target.value)}
        placeholder={editor.placeholder ?? "Add details"}
        disabled={isPending}
        className="min-h-24"
      />
    )
  }

  if (editor.kind === "number") {
    return (
      <NumberField
        value={typeof value === "number" ? value : undefined}
        onValueChange={(nextValue) => setValue(nextValue)}
        min={editor.min}
        max={editor.max}
        step={editor.step}
      >
        <NumberFieldGroup aria-invalid={Boolean(error)}>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    )
  }

  if (editor.kind === "select") {
    return renderBaseSelectField({ editor, value, setValue, isPending })
  }

  if (editor.kind === "radio") {
    return (
      <RadioGroup
        value={normalizeOptionValue(value) ?? ""}
        onValueChange={(nextValue) =>
          setValue(getOptionValue(editor, nextValue))
        }
        className="grid gap-2"
      >
        {(editor.options ?? []).map((option) => {
          const optionValue = normalizeOptionValue(option.value) ?? option.label
          const optionId = `dialog-${rowId}-${columnId}-${optionValue}`

          return (
            <label
              key={optionId}
              htmlFor={optionId}
              className={cn(
                "border-input hover:bg-muted flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                normalizeOptionValue(value) === optionValue &&
                  "bg-muted border-primary"
              )}
            >
              <RadioGroupItem
                id={optionId}
                disabled={isPending}
                value={optionValue}
                className="mt-0.5"
              />
              <div className="grid gap-0.5">
                <span className="font-medium">{option.label}</span>
                {option.description ? (
                  <span className="text-muted-foreground text-sm">
                    {option.description}
                  </span>
                ) : null}
              </div>
            </label>
          )
        })}
      </RadioGroup>
    )
  }

  if (editor.kind === "checkbox") {
    return (
      <Field
        orientation="horizontal"
        className="items-center justify-between rounded-lg border p-3"
      >
        <FieldContent>
          <FieldLabel>{editor.label ?? "Toggle option"}</FieldLabel>
          {editor.description ? (
            <FieldDescription>{editor.description}</FieldDescription>
          ) : null}
        </FieldContent>
        <Checkbox
          checked={value === true}
          onCheckedChange={(nextChecked) => setValue(nextChecked === true)}
          disabled={isPending}
        />
      </Field>
    )
  }

  if (editor.kind === "switch") {
    return (
      <Field
        orientation="horizontal"
        className="items-center justify-between rounded-lg border p-3"
      >
        <FieldContent>
          <FieldLabel>{editor.label ?? "Toggle option"}</FieldLabel>
          {editor.description ? (
            <FieldDescription>{editor.description}</FieldDescription>
          ) : null}
        </FieldContent>
        <Switch
          checked={value === true}
          onCheckedChange={(nextChecked) => setValue(nextChecked === true)}
          disabled={isPending}
        />
      </Field>
    )
  }

  if (editor.kind === "rating") {
    return (
      <div className="flex items-center gap-3">
        <Rating
          rating={typeof value === "number" ? value : 0}
          editable
          showValue
          onRatingChange={(nextRating) => setValue(nextRating)}
        />
      </div>
    )
  }

  return (
    <Input
      value={
        typeof value === "string" ? value : value == null ? "" : String(value)
      }
      onChange={(event) => setValue(event.target.value)}
      placeholder={editor.placeholder ?? "Enter a value"}
      disabled={isPending}
    />
  )
}

function renderStaticCellValue<TData extends EditableRow, TValue>(
  cell: Cell<TData, TValue>,
  emptyLabel: string
) {
  const renderedValue = cell.getValue()

  if (typeof renderedValue === "string") {
    return renderedValue.trim().length > 0 ? renderedValue : emptyLabel
  }

  if (renderedValue === null || renderedValue === undefined) {
    return emptyLabel
  }

  return String(renderedValue)
}

export function DataGridEditableCell<
  TData extends EditableRow,
  TValue = unknown,
>({
  cell,
  className,
  emptyLabel = "Click to edit",
}: DataGridEditableCellProps<TData, TValue>) {
  const table = cell.getContext().table
  const editing = table.options.meta?.editing
  const editor = getDataGridColumnEditor(cell.column) as
    | DataGridColumnEditor<TData, unknown>
    | undefined

  if (!editing || !editor) {
    return (
      <div className={className}>{renderStaticCellValue(cell, emptyLabel)}</div>
    )
  }

  const row = cell.row.original
  const rowId = cell.row.id
  const columnId = cell.column.id
  const isEditing = editing.isCellEditing(rowId, columnId)
  const isPending = editing.isCellPending(rowId, columnId)
  const error = editing.getCellError(rowId, columnId)
  const value = editing.getCellDraftValue(row, columnId)

  return (
    <div className={cn("space-y-1", className)}>
      {renderInlineEditor({
        table,
        row,
        rowId,
        columnId,
        editor,
        value,
        setValue: (nextValue) =>
          editing.updateCellDraft(rowId, columnId, nextValue),
        commit: (nextValue) => editing.commitCellEdit(row, columnId, nextValue),
        cancel: () => editing.cancelCellEdit(rowId, columnId),
        isEditing,
        isPending,
        error,
      })}
      {isPending ? (
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Spinner className="size-3" />
          Saving
        </div>
      ) : null}
      {error ? <div className="text-destructive text-xs">{error}</div> : null}
    </div>
  )
}

export function DataGridEditDialog<TData extends EditableRow>({
  table,
  title = "Edit record",
  description = "Update the fields below and save your changes.",
  submitLabel = "Save changes",
}: DataGridEditDialogProps<TData>) {
  const editing = table.options.meta?.editing

  const editableColumns = useMemo(
    () =>
      table.getAllLeafColumns().filter((column) => {
        const editor = getDataGridColumnEditor(column)
        return Boolean(editor && !editor.inlineOnly)
      }),
    [table]
  )

  if (!editing) {
    return null
  }

  const dialogRow = editing.dialogRow
  const dialogRowId = editing.dialogRowId

  return (
    <Dialog
      open={editing.dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          editing.closeDialog()
        }
      }}
    >
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-4 py-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] min-h-0">
          <div className="px-4">
            {editing.dialogMessage ? (
              <div className="bg-destructive/10 text-destructive mb-4 rounded-lg border px-3 py-2 text-sm">
                {editing.dialogMessage}
              </div>
            ) : null}

            {dialogRow && dialogRowId ? (
              <FieldGroup className="gap-4">
                {editableColumns.map((column) => {
                  const editor = getDataGridColumnEditor(column) as
                    | DataGridColumnEditor<TData, unknown>
                    | undefined

                  if (!editor) {
                    return null
                  }

                  const columnId = column.id
                  const error = editing.getDialogError(columnId)
                  const value = editing.getDialogValue(columnId)
                  const isPending = editing.isRowPending(dialogRowId)
                  const renderedField = renderDialogField({
                    table,
                    row: dialogRow,
                    rowId: dialogRowId,
                    columnId,
                    editor,
                    value,
                    setValue: (nextValue) =>
                      editing.updateDialogDraft(columnId, nextValue),
                    commit: () => editing.saveDialog(),
                    cancel: editing.closeDialog,
                    isEditing: true,
                    isPending,
                    error,
                  })

                  if (editor.kind === "checkbox" || editor.kind === "switch") {
                    return (
                      <div key={columnId}>
                        {renderedField}
                        {error ? <FieldError>{error}</FieldError> : null}
                      </div>
                    )
                  }

                  return (
                    <Field key={columnId}>
                      <FieldLabel>{editor.label ?? column.id}</FieldLabel>
                      {editor.description ? (
                        <FieldDescription>
                          {editor.description}
                        </FieldDescription>
                      ) : null}
                      {renderedField}
                      {error ? <FieldError>{error}</FieldError> : null}
                    </Field>
                  )
                })}
              </FieldGroup>
            ) : null}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <Button
            variant="outline"
            onClick={editing.closeDialog}
            disabled={Boolean(dialogRowId && editing.isRowPending(dialogRowId))}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void editing.saveDialog()}
            disabled={Boolean(dialogRowId && editing.isRowPending(dialogRowId))}
          >
            {dialogRowId && editing.isRowPending(dialogRowId) ? (
              <>
                <Spinner />
                Saving
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
