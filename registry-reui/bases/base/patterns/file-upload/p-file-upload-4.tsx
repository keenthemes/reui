// Description: Gallery file upload
// Order: 4
// GridSize: 1

"use client"

import { useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/bases/base/ui/dialog"
import { Spinner } from "@/registry/bases/base/ui/spinner"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface GalleryUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
}

export default function Pattern({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/*",
  multiple = true,
  className,
  onFilesChange,
}: GalleryUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  )
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  // Create default images using FileMetadata type
  const defaultImages: FileMetadata[] = [
    {
      id: "default-1",
      name: "avatar-1.png",
      size: 44608,
      type: "image/png",
      url: "https://picsum.photos/1000/800?random=1",
    },
    {
      id: "default-2",
      name: "avatar-2.png",
      size: 42144,
      type: "image/png",
      url: "https://picsum.photos/1000/800?random=2",
    },
    {
      id: "default-3",
      name: "avatar-2.png",
      size: 42144,
      type: "image/png",
      url: "https://picsum.photos/1000/800?random=3",
    },
  ]

  const [
    { files, isDragging, errors },
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
    initialFiles: defaultImages,
    onFilesChange,
  })

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    return type.startsWith("image/")
  }

  return (
    <div className={cn("w-full max-w-4xl", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg relative border border-dashed p-8 text-center transition-colors",
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
              "flex h-16 w-16 items-center justify-center rounded-full",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <IconPlaceholder
              lucide="ImageIcon"
              tabler="IconPhoto"
              hugeicons="ImageIcon"
              phosphor="ImageIcon"
              remixicon="RiImageLine"
              className={cn(
                "h-5 w-5",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload images to gallery</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop images here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, GIF up to {formatBytes(maxSize)} each (max {maxFiles}{" "}
              files)
            </p>
          </div>

          <Button onClick={openFileDialog}>
            <IconPlaceholder
              lucide="UploadIcon"
              tabler="IconUpload"
              hugeicons="Upload01Icon"
              phosphor="UploadSimple"
              remixicon="RiUpload2Line"
              className="h-4 w-4"
            />
            Select images
          </Button>
        </div>
      </div>

      {/* Gallery Stats */}
      {files.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-medium">
              Gallery ({files.length}/{maxFiles})
            </h4>
            <div className="text-muted-foreground text-xs">
              Total:{" "}
              {formatBytes(
                files.reduce((acc, file) => acc + file.file.size, 0)
              )}
            </div>
          </div>
          <Button onClick={clearFiles} variant="outline" size="sm">
            Clear all
          </Button>
        </div>
      )}

      {/* Image Grid */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className="group/item relative aspect-square"
            >
              {isImage(fileItem.file) && fileItem.preview ? (
                <>
                  {loadingImages[fileItem.id] !== false && (
                    <div className="bg-muted/50 style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg absolute inset-0 flex items-center justify-center border">
                      <Spinner className="text-muted-foreground size-6" />
                    </div>
                  )}
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    onLoad={() =>
                      setLoadingImages((prev) => ({
                        ...prev,
                        [fileItem.id]: false,
                      }))
                    }
                    className={cn(
                      "style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg h-full w-full border object-cover transition-all group-hover/item:scale-105",
                      loadingImages[fileItem.id] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    )}
                  />
                </>
              ) : (
                <div className="bg-muted style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg flex h-full w-full items-center justify-center border">
                  <IconPlaceholder
                    lucide="ImageIcon"
                    tabler="IconPhoto"
                    hugeicons="ImageIcon"
                    phosphor="ImageIcon"
                    remixicon="RiImageLine"
                    className="text-muted-foreground h-8 w-8"
                  />
                </div>
              )}

              {/* Overlay */}
              <div className="style-vega:bg-black/50 style-nova:bg-black/50 style-lyra:bg-black/50 style-maia:bg-black/50 style-mira:bg-black/50 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover/item:opacity-100">
                {/* View Button */}
                {fileItem.preview && (
                  <Button
                    onClick={() => {
                      setSelectedImage(fileItem.preview!)
                      setIsPreviewLoading(true)
                    }}
                    variant="secondary"
                    size="icon"
                    className="size-7"
                  >
                    <IconPlaceholder
                      lucide="ZoomInIcon"
                      tabler="IconZoomIn"
                      hugeicons="SearchAddIcon"
                      phosphor="MagnifyingGlassPlusIcon"
                      remixicon="RiZoomInLine"
                      className="opacity-100/80"
                    />
                  </Button>
                )}

                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  variant="secondary"
                  size="icon"
                  className="size-7"
                >
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="MultiplicationSignIcon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                    className="opacity-100/8"
                  />
                </Button>
              </div>

              {/* File Info */}
              <div className="style-vega:rounded-b-lg style-nova:rounded-b-lg style-lyra:rounded-none style-maia:rounded-b-lg style-mira:rounded-b-lg absolute right-0 bottom-0 left-0 bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs font-medium">
                  {fileItem.file.name}
                </p>
                <p className="text-xs text-gray-300">
                  {formatBytes(fileItem.file.size)}
                </p>
              </div>
            </div>
          ))}
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

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="[&_[data-slot=dialog-close]]:text-muted-foreground [&_[data-slot=dialog-close]]:hover:text-foreground [&_[data-slot=dialog-close]]:bg-background w-full border-none bg-transparent p-0 shadow-none sm:max-w-xl [&_[data-slot=dialog-close]]:-end-7 [&_[data-slot=dialog-close]]:-top-7 [&_[data-slot=dialog-close]]:size-7 [&_[data-slot=dialog-close]]:rounded-full">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            {selectedImage && (
              <>
                {isPreviewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="size-8 text-white" />
                  </div>
                )}
                <img
                  src={selectedImage}
                  alt="Preview"
                  onLoad={() => setIsPreviewLoading(false)}
                  className={cn(
                    "style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg h-full w-auto object-contain transition-opacity duration-300",
                    isPreviewLoading ? "opacity-0" : "opacity-100"
                  )}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
