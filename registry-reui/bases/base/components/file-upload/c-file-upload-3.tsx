// Description: Basic drag and drop file upload
// Order: 3
// GridSize: 1

"use client"

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

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface FileUploadCompactProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
}

export default function Pattern({
  maxFiles = 3,
  maxSize = 2 * 1024 * 1024, // 2MB
  accept = "image/*",
  multiple = true,
  className,
  onFilesChange,
}: FileUploadCompactProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
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
    onFilesChange,
  })

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    return type.startsWith("image/")
  }

  return (
    <div className={cn("w-full max-w-lg", className)}>
      {/* Compact Upload Area */}
      <div
        className={cn(
          "border-border style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg flex items-center gap-3 border border-dashed p-4 transition-colors",
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

        {/* Upload Button */}
        <Button
          onClick={openFileDialog}
          size="sm"
          className={cn(isDragging && "animate-bounce")}
        >
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            className="h-4 w-4"
          />
          Add files
        </Button>

        {/* File Previews */}
        <div className="flex flex-1 items-center gap-2">
          {files.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Drop files here or click to browse (max {maxFiles} files)
            </p>
          ) : (
            files.map((fileItem) => (
              <div key={fileItem.id} className="group/item relative shrink-0">
                {isImage(fileItem.file) && fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="h-12 w-12 rounded-lg border object-cover"
                    title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}
                  />
                ) : (
                  <div
                    className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg border"
                    title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}
                  >
                    <IconPlaceholder
                      lucide="FileIcon"
                      tabler="IconFile"
                      hugeicons="FileEmpty02Icon"
                      phosphor="FileIcon"
                      remixicon="RiFileLine"
                      className="text-muted-foreground h-5 w-5"
                    />
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  variant="outline"
                  size="icon"
                  className="absolute -end-2 -top-2 size-5 rounded-full opacity-0 shadow-md transition-opacity group-hover/item:opacity-100"
                >
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="MultiplicationSignIcon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                    className="size-3"
                  />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* File Count */}
        {files.length > 0 && (
          <div className="text-muted-foreground shrink-0 text-xs">
            {files.length}/{maxFiles}
          </div>
        )}
      </div>

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
