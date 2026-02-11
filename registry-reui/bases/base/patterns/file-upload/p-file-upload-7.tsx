// Description: Image upload
// Order: 7
// GridSize: 1

"use client"

import { useCallback, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry-reui/bases/base/reui/alert"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { Progress } from "@/registry/bases/base/ui/progress"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface ImageFile {
  id: string
  file: File
  preview: string
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface ImageUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  className?: string
  onImagesChange?: (images: ImageFile[]) => void
  onUploadComplete?: (images: ImageFile[]) => void
}

export default function Pattern({
  maxFiles = 10,
  maxSize = 2 * 1024 * 1024, // 2MB
  accept = "image/*",
  className,
  onImagesChange,
  onUploadComplete,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [visibleDefaultImages, setVisibleDefaultImages] = useState([
    {
      id: "default-1",
      src: "https://picsum.photos/1000/800?grayscale&random=4",
      alt: "Product view 1",
    },
    {
      id: "default-2",
      src: "https://picsum.photos/1000/800?grayscale&random=5",
      alt: "Product view 2",
    },
    {
      id: "default-3",
      src: "https://picsum.photos/1000/800?grayscale&random=6",
      alt: "Product view 3",
    },
    {
      id: "default-4",
      src: "https://picsum.photos/1000/800?grayscale&random=7",
      alt: "Product view 4",
    },
  ])

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "File must be an image"
    }
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    }
    if (images.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }
    return null
  }

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImageFile[] = []
      const newErrors: string[] = []

      Array.from(files).forEach((file) => {
        const error = validateFile(file)
        if (error) {
          newErrors.push(`${file.name}: ${error}`)
          return
        }

        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "uploading",
        }

        newImages.push(imageFile)
      })

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors])
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages]
        setImages(updatedImages)
        onImagesChange?.(updatedImages)

        // Simulate upload progress
        newImages.forEach((imageFile) => {
          simulateUpload(imageFile)
        })
      }
    },
    [images, maxSize, maxFiles, onImagesChange]
  )

  const simulateUpload = (imageFile: ImageFile) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageFile.id
              ? { ...img, progress: 100, status: "completed" as const }
              : img
          )
        )

        // Check if all uploads are complete
        const updatedImages = images.map((img) =>
          img.id === imageFile.id
            ? { ...img, progress: 100, status: "completed" as const }
            : img
        )

        if (updatedImages.every((img) => img.status === "completed")) {
          onUploadComplete?.(updatedImages)
        }
      } else {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageFile.id ? { ...img, progress } : img
          )
        )
      }
    }, 100)
  }

  const removeImage = useCallback((id: string) => {
    // If it's a default image, remove it from visible defaults
    if (id.startsWith("default-")) {
      setVisibleDefaultImages((prev) => prev.filter((img) => img.id !== id))
      return
    }

    // Remove uploaded image
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        addImages(files)
      }
    },
    [addImages]
  )

  const openFileDialog = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = accept
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        addImages(target.files)
      }
    }
    input.click()
  }, [accept, addImages])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <div className={cn("w-full max-w-4xl", className)}>
      {/* Image Grid - Moved to top */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2.5">
          {/* Always show all visible default images first */}
          {visibleDefaultImages.map((defaultImg) => (
            <Card
              key={defaultImg.id}
              className="bg-accent/50 group/item style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-md style-mira:rounded-md relative flex shrink-0 items-center justify-center p-0 shadow-none"
            >
              <img
                src={defaultImg.src}
                className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-md style-mira:rounded-md h-[120px] w-full object-cover"
                alt={defaultImg.alt}
              />

              {/* Remove Button Overlay for default images too */}
              <Button
                onClick={() => removeImage(defaultImg.id)}
                variant="outline"
                size="icon"
                className="absolute end-1 top-1 size-6 rounded-full opacity-0 shadow-sm group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700"
              >
                <IconPlaceholder
                  lucide="XIcon"
                  tabler="IconX"
                  hugeicons="MultiplicationSignIcon"
                  phosphor="XIcon"
                  remixicon="RiCloseLine"
                  className="size-3.5"
                />
              </Button>
            </Card>
          ))}
        </div>

        {/* Show uploaded images in a separate grid below */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2.5">
            {images.map((imageFile, index) => (
              <Card
                key={imageFile.id}
                className="bg-accent/50 group/item relative flex shrink-0 items-center justify-center rounded-md p-0 shadow-none"
              >
                <img
                  src={imageFile.preview}
                  className="h-[120px] w-full rounded-md object-cover"
                  alt={`Product view ${index + 1}`}
                />

                {/* Remove Button Overlay */}
                <Button
                  onClick={() => removeImage(imageFile.id)}
                  variant="outline"
                  size="icon"
                  className="absolute end-2 top-2 size-6 rounded-full opacity-0 shadow-sm group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700"
                >
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="MultiplicationSignIcon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                    className="size-3.5"
                  />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          "style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-md style-mira:rounded-md border-dashed shadow-none transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="text-center">
          <div className="border-border mx-auto mb-3 flex size-[32px] items-center justify-center rounded-full border">
            <IconPlaceholder
              lucide="CloudUploadIcon"
              tabler="IconCloudUpload"
              hugeicons="CloudUploadIcon"
              phosphor="CloudArrowUpIcon"
              remixicon="RiUploadCloud2Line"
              className="size-4"
            />
          </div>
          <h3 className="text-2sm text-foreground mb-0.5 font-semibold">
            Choose a file or drag & drop here.
          </h3>
          <span className="text-secondary-foreground mb-3 block text-xs font-normal">
            JPEG, PNG, up to {formatBytes(maxSize)}.
          </span>
          <Button size="sm" onClick={openFileDialog}>
            Browse File
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress Cards */}
      {images.length > 0 && (
        <div className="mt-6 space-y-3">
          {images.map((imageFile) => (
            <Card
              key={imageFile.id}
              className="style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-md style-mira:rounded-md p-0 shadow-none"
            >
              <CardContent className="flex items-center gap-2 p-3">
                <div className="border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-md style-mira:rounded-md flex size-[32px] shrink-0 items-center justify-center border">
                  <IconPlaceholder
                    lucide="ImageIcon"
                    tabler="IconPhoto"
                    hugeicons="ImageIcon"
                    phosphor="ImageIcon"
                    remixicon="RiImageLine"
                    className="text-muted-foreground size-4"
                  />
                </div>
                <div className="flex w-full flex-col gap-1.5">
                  <div className="-mt-2 flex w-full items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-foreground text-xs leading-none font-medium">
                        {imageFile.file.name}
                      </span>
                      <span className="text-muted-foreground text-xs leading-none font-normal">
                        {formatBytes(imageFile.file.size)}
                      </span>
                      {imageFile.status === "uploading" && (
                        <p className="text-muted-foreground text-xs">
                          Uploading... {Math.round(imageFile.progress)}%
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => removeImage(imageFile.id)}
                      variant="ghost"
                      size="icon"
                      className="size-6"
                    >
                      <IconPlaceholder
                        lucide="CircleXIcon"
                        tabler="IconCircleX"
                        hugeicons="CancelCircleIcon"
                        phosphor="XCircleIcon"
                        remixicon="RiCloseCircleLine"
                        className="size-3.5"
                      />
                    </Button>
                  </div>

                  <Progress
                    value={imageFile.progress}
                    className={cn(
                      "h-1 transition-all duration-300",
                      "[&>div]:bg-zinc-950 dark:[&>div]:bg-zinc-50"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
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
    </div>
  )
}
