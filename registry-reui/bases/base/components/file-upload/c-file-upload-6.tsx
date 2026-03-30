// Description: Table file upload
// Order: 6
// GridSize: 1

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "@/registry-reui/bases/base/hooks/use-file-upload"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry-reui/bases/base/reui/alert"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface FileUploadItem extends FileWithPreview {
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface TableUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
  simulateUpload?: boolean
}

export default function Pattern({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = "*",
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
}: TableUploadProps) {
  // Create default files using FileMetadata type
  const defaultFiles: FileMetadata[] = [
    {
      id: "default-doc-1",
      name: "document.pdf",
      size: 529254,
      type: "application/pdf",
      url: "/media/files/document.pdf",
    },
    {
      id: "default-doc-2",
      name: "intro.zip",
      size: 252846,
      type: "application/zip",
      url: "/media/files/intro.zip",
    },
    {
      id: "default-doc-3",
      name: "conclusion.xlsx",
      size: 353126,
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      url: "/media/files/conclusion.xlsx",
    },
    {
      id: "default-doc-4",
      name: "package.json",
      size: 697,
      type: "application/json",
      url: "/media/files/package.json",
    },
  ]

  // Convert default files to FileUploadItem format
  const defaultUploadFiles: FileUploadItem[] = defaultFiles.map((file) => ({
    id: file.id,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    } as File,
    preview: file.url,
    progress: 100,
    status: "completed" as const,
  }))

  const [uploadFiles, setUploadFiles] =
    useState<FileUploadItem[]>(defaultUploadFiles)

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: defaultFiles,
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id
        )

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          }
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: "uploading" as const,
          }
        }
      })
      setUploadFiles(newUploadFiles)
      onFilesChange?.(newFiles)
    },
  })

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== "uploading") return file

          const increment = Math.random() * 15 + 5 // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100)

          if (newProgress >= 100) {
            // Randomly decide if upload succeeds or fails
            const shouldFail = Math.random() < 0.1 // 10% chance to fail
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ("error" as const) : ("completed" as const),
              error: shouldFail
                ? "Upload failed. Please try again."
                : undefined,
            }
          }

          return { ...file, progress: newProgress }
        })
      )
    }, 500)

    return () => clearInterval(interval)
  }, [simulateUpload])

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
    removeFile(fileId)
  }

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: "uploading" as const,
              error: undefined,
            }
          : file
      )
    )
  }

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    if (type.startsWith("image/"))
      return (
        <IconPlaceholder
          lucide="ImageIcon"
          tabler="IconPhoto"
          hugeicons="ImageIcon"
          phosphor="ImageIcon"
          remixicon="RiImageLine"
          className="size-4"
        />
      )
    if (type.startsWith("video/"))
      return (
        <IconPlaceholder
          lucide="VideoIcon"
          tabler="IconVideo"
          hugeicons="Video02Icon"
          phosphor="VideoCameraIcon"
          remixicon="RiVideoOnLine"
          className="size-4"
        />
      )
    if (type.startsWith("audio/"))
      return (
        <IconPlaceholder
          lucide="HeadphonesIcon"
          tabler="IconHeadphones"
          hugeicons="HeadphonesIcon"
          phosphor="Headphones"
          remixicon="RiCustomerServiceLine"
          className="size-4"
        />
      )
    if (type.includes("pdf"))
      return (
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="File02Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
          className="size-4"
        />
      )
    if (type.includes("word") || type.includes("doc"))
      return (
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileText"
          hugeicons="File02Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
          className="size-4"
        />
      )
    if (type.includes("excel") || type.includes("sheet"))
      return (
        <IconPlaceholder
          lucide="FileSpreadsheetIcon"
          tabler="IconFileSpreadsheet"
          hugeicons="GoogleSheetIcon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
          className="size-4"
        />
      )
    if (type.includes("zip") || type.includes("rar"))
      return (
        <IconPlaceholder
          lucide="FileArchiveIcon"
          tabler="IconFileZip"
          hugeicons="ArchiveIcon"
          phosphor="FileArchive"
          remixicon=" RiFileZipLine"
          className="size-4"
        />
      )
    return (
      <IconPlaceholder
        lucide="FileTextIcon"
        tabler="IconFileText"
        hugeicons="File02Icon"
        phosphor="FileTextIcon"
        remixicon="RiFileTextLine"
        className="size-4"
      />
    )
  }

  const getFileTypeLabel = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    if (type.startsWith("image/")) return "Image"
    if (type.startsWith("video/")) return "Video"
    if (type.startsWith("audio/")) return "Audio"
    if (type.includes("pdf")) return "PDF"
    if (type.includes("word") || type.includes("doc")) return "Word"
    if (type.includes("excel") || type.includes("sheet")) return "Excel"
    if (type.includes("zip") || type.includes("rar")) return "Archive"
    if (type.includes("json")) return "JSON"
    if (type.includes("text")) return "Text"
    return "File"
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative rounded-lg border border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "bg-muted flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25"
            )}
          >
            <IconPlaceholder
              lucide="UploadIcon"
              tabler="IconUpload"
              hugeicons="Upload01Icon"
              phosphor="UploadSimple"
              remixicon="RiUpload2Line"
              className="text-muted-foreground h-5 w-5"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drop files here or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-primary cursor-pointer underline-offset-4 hover:underline"
              >
                browse files
              </button>
            </p>
            <p className="text-muted-foreground text-xs">
              Maximum file size: {formatBytes(maxSize)} • Maximum files:{" "}
              {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Files ({uploadFiles.length})
            </h3>
            <div className="flex gap-2">
              <Button onClick={openFileDialog} variant="outline" size="sm">
                <IconPlaceholder
                  lucide="CloudUploadIcon"
                  tabler="IconCloudUpload"
                  hugeicons="CloudUploadIcon"
                  phosphor="CloudArrowUpIcon"
                  remixicon="RiUploadCloud2Line"
                  className="h-4 w-4"
                />
                Add files
              </Button>
              <Button onClick={clearFiles} variant="outline" size="sm">
                <IconPlaceholder
                  lucide="Trash2Icon"
                  tabler="IconTrash"
                  hugeicons="Delete02Icon"
                  phosphor="TrashIcon"
                  remixicon="RiDeleteBinLine "
                  className="h-4 w-4"
                />
                Remove all
              </Button>
            </div>
          </div>

          <div className="style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="h-9 ps-4">Name</TableHead>
                  <TableHead className="h-9">Type</TableHead>
                  <TableHead className="h-9">Size</TableHead>
                  <TableHead className="h-9 w-[100px] ps-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadFiles.map((fileItem) => (
                  <TableRow key={fileItem.id}>
                    <TableCell className="py-2 ps-1.5">
                      <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            "text-muted-foreground/80 relative flex size-8 shrink-0 items-center justify-center"
                          )}
                        >
                          {fileItem.status === "uploading" ? (
                            <div className="relative">
                              {/* Circular progress background */}
                              <svg
                                className="size-8 -rotate-90"
                                viewBox="0 0 32 32"
                              >
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="text-muted-foreground/20"
                                />
                                {/* Progress circle */}
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeDasharray={`${2 * Math.PI * 14}`}
                                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - fileItem.progress / 100)}`}
                                  className="text-primary transition-all duration-300"
                                  strokeLinecap="round"
                                />
                              </svg>
                              {/* File icon in center */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                {getFileIcon(fileItem.file)}
                              </div>
                            </div>
                          ) : (
                            <div className="not-[]:size-8 flex items-center justify-center">
                              {getFileIcon(fileItem.file)}
                            </div>
                          )}
                        </div>
                        <p className="flex items-center gap-1 truncate text-sm font-medium">
                          {fileItem.file.name}
                          {fileItem.status === "error" && (
                            <Badge variant="destructive-light" size="sm">
                              Error
                            </Badge>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(fileItem.file)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2 text-sm">
                      {formatBytes(fileItem.file.size)}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        {fileItem.preview && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                          >
                            <IconPlaceholder
                              lucide="DownloadIcon"
                              tabler="IconDownload"
                              hugeicons="Download01Icon"
                              phosphor="DownloadSimpleIcon"
                              remixicon="RiDownload2Line"
                              className="size-3.5"
                            />
                          </Button>
                        )}
                        {fileItem.status === "error" ? (
                          <Button
                            onClick={() => retryUpload(fileItem.id)}
                            variant="ghost"
                            size="icon"
                            className="text-destructive/80 hover:text-destructive size-8"
                          >
                            <IconPlaceholder
                              lucide="RefreshCwIcon"
                              tabler="IconRefreshDot"
                              hugeicons="Refresh04Icon"
                              phosphor="ArrowsClockwiseIcon"
                              remixicon="RiRestartLine"
                              className="size-3.5"
                            />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => removeUploadFile(fileItem.id)}
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <IconPlaceholder
                              lucide="Trash2Icon"
                              tabler="IconTrash"
                              hugeicons="Delete02Icon"
                              phosphor="TrashIcon"
                              remixicon="RiDeleteBinLine "
                              className="size-3.5"
                            />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <IconPlaceholder
            lucide="CircleAlertIcon"
            tabler="IconAlertCircle"
            hugeicons="AlertCircleIcon"
            phosphor="WarningCircleIcon"
            remixicon="RiErrorWarningLine"
          />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
