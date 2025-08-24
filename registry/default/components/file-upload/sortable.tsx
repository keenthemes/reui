'use client';

import { useCallback, useEffect, useState } from 'react';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import { Card, CardContent } from '@/registry/default/ui/card';
import { Progress } from '@/registry/default/ui/progress';
import { Sortable, SortableItem, SortableItemHandle } from '@/registry/default/ui/sortable';
import { CircleX, CloudUpload, GripVertical, ImageIcon, TriangleAlert, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

type SortableImage = {
  id: string;
  src: string;
  alt: string;
  type: 'default' | 'uploaded';
};

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  onImagesChange?: (images: ImageFile[]) => void;
  onUploadComplete?: (images: ImageFile[]) => void;
}

export default function SortableImageUpload({
  maxFiles = 5, // Changed to 5 as per UI reference
  maxSize = 10 * 1024 * 1024, // 10MB as per UI reference
  accept = 'image/*',
  className,
  onImagesChange,
  onUploadComplete,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<SortableImage[]>([
    { id: 'default-1', src: 'https://picsum.photos/400/300?random=1', alt: 'Product view 1', type: 'default' },
    { id: 'default-2', src: 'https://picsum.photos/400/300?random=2', alt: 'Product view 2', type: 'default' },
    { id: 'default-3', src: 'https://picsum.photos/400/300?random=3', alt: 'Product view 3', type: 'default' },
    { id: 'default-4', src: 'https://picsum.photos/400/300?random=4', alt: 'Product view 4', type: 'default' },
    { id: 'default-5', src: 'https://picsum.photos/400/300?random=5', alt: 'Product view 5', type: 'default' },
  ]);

  // Helper function to create SortableImage from ImageFile
  const createSortableImage = useCallback(
    (imageFile: ImageFile): SortableImage => ({
      id: imageFile.id,
      src: imageFile.preview,
      alt: imageFile.file.name,
      type: 'uploaded',
    }),
    [],
  );

  // Ensure arrays never contain undefined items
  useEffect(() => {
    setAllImages((prev) => prev.filter((item) => item && item.id));
    setImages((prev) => prev.filter((item) => item && item.id));
  }, []);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
    }
    if (images.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }
    return null;
  };

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImageFile[] = [];
      const newErrors: string[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
          return;
        }

        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: 'uploading',
        };

        newImages.push(imageFile);
      });

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors]);
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);

        // Add new images to allImages for sorting
        const newSortableImages = newImages.map(createSortableImage);
        setAllImages((prev) => [...prev, ...newSortableImages]);

        // Simulate upload progress
        newImages.forEach((imageFile) => {
          simulateUpload(imageFile);
        });
      }
    },
    [images, maxSize, maxFiles, onImagesChange, createSortableImage],
  );

  const simulateUpload = (imageFile: ImageFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setImages((prev) =>
          prev.map((img) => (img.id === imageFile.id ? { ...img, progress: 100, status: 'completed' as const } : img)),
        );

        // Check if all uploads are complete
        const updatedImages = images.map((img) =>
          img.id === imageFile.id ? { ...img, progress: 100, status: 'completed' as const } : img,
        );

        if (updatedImages.every((img) => img.status === 'completed')) {
          onUploadComplete?.(updatedImages);
        }
      } else {
        setImages((prev) => prev.map((img) => (img.id === imageFile.id ? { ...img, progress } : img)));
      }
    }, 100);
  };

  const removeImage = useCallback(
    (id: string) => {
      // Remove from allImages
      setAllImages((prev) => prev.filter((img) => img.id !== id));

      // If it's an uploaded image, also remove from images array and revoke URL
      const uploadedImage = images.find((img) => img.id === id);
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage.preview);
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    },
    [images],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        addImages(files);
      }
    },
    [addImages],
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = accept;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        addImages(target.files);
      }
    };
    input.click();
  }, [accept, addImages]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full max-w-4xl', className)}>
      {/* Instructions */}
      <div className="mb-4 text-center">
        <p className="text-sm text-muted-foreground">
          Upload up to {maxFiles} images (JPG, PNG, GIF, WebP, max {formatBytes(maxSize)} each). <br />
          Drag and drop images to reorder.
          {images.length > 0 && ` ${images.length}/${maxFiles} uploaded.`}
        </p>
      </div>

      {/* Image Grid with Sortable */}
      <div className="mb-6">
        {/* Combined Images Sortable */}
        <Sortable
          value={allImages.map((item) => item.id)}
          onValueChange={(newItemIds) => {
            // Reconstruct the allImages array based on the new order
            const newAllImages = newItemIds
              .map((itemId) => {
                // First try to find in allImages (default images)
                const existingImage = allImages.find((img) => img.id === itemId);
                if (existingImage) return existingImage;

                // If not found, it's a newly uploaded image
                const uploadedImage = images.find((img) => img.id === itemId);
                if (uploadedImage) {
                  return createSortableImage(uploadedImage);
                }
                return null;
              })
              .filter((item): item is SortableImage => item !== null);

            setAllImages(newAllImages);

            toast.success('Images reordered successfully!', {
              description: `Images rearranged across both sections`,
              duration: 3000,
            });
          }}
          getItemValue={(item) => item}
          strategy="grid"
          className="grid grid-cols-5 gap-2.5 auto-rows-fr"
          onDragStart={(event) => setActiveId(event.active.id as string)}
          onDragEnd={() => setActiveId(null)}
        >
          {allImages.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <div className="flex items-center justify-center rounded-md bg-accent/50 shadow-none shrink-0 relative group border border-border hover:z-10 data-[dragging=true]:z-50 transition-all duration-200 hover:bg-accent/70">
                <img
                  src={item.src}
                  className="h-[120px] w-full object-cover rounded-md pointer-events-none"
                  alt={item.alt}
                />

                {/* Drag Handle */}
                <SortableItemHandle className="absolute top-2 start-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
                  <Button variant="outline" size="icon" className="size-6 rounded-full">
                    <GripVertical className="size-3.5" />
                  </Button>
                </SortableItemHandle>

                {/* Remove Button Overlay */}
                <Button
                  onClick={() => removeImage(item.id)}
                  variant="outline"
                  size="icon"
                  className="shadow-sm absolute top-2 end-2 size-6 opacity-0 group-hover:opacity-100 rounded-full"
                >
                  <XIcon className="size-3.5" />
                </Button>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </div>

      {/* Upload Area */}
      <Card
        className={cn(
          'border-dashed shadow-none rounded-md transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="text-center">
          <div className="flex items-center justify-center size-[32px] rounded-full border border-border mx-auto mb-3">
            <CloudUpload className="size-4" />
          </div>
          <h3 className="text-2sm text-foreground font-semibold mb-0.5">Choose a file or drag & drop here.</h3>
          <span className="text-xs text-secondary-foreground font-normal block mb-3">
            JPEG, PNG, up to {formatBytes(maxSize)}.
          </span>
          <Button size="sm" variant="mono" onClick={openFileDialog}>
            Browse File
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress Cards */}
      {images.length > 0 && (
        <div className="mt-6 space-y-3">
          {images.map((imageFile) => (
            <Card key={imageFile.id} className="shadow-none rounded-md">
              <CardContent className="flex items-center gap-2 p-3">
                <div className="flex items-center justify-center size-[32px] rounded-md border border-border shrink-0">
                  <ImageIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center justify-between gap-2.5 -mt-2 w-full">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-foreground font-medium leading-none">{imageFile.file.name}</span>
                      <span className="text-xs text-muted-foreground font-normal leading-none">
                        {formatBytes(imageFile.file.size)}
                      </span>
                      {imageFile.status === 'uploading' && (
                        <p className="text-xs text-muted-foreground">Uploading... {Math.round(imageFile.progress)}%</p>
                      )}
                    </div>
                    <Button onClick={() => removeImage(imageFile.id)} variant="ghost" size="icon" className="size-6">
                      <CircleX className="size-3.5" />
                    </Button>
                  </div>

                  <Progress
                    value={imageFile.progress}
                    className={cn('h-1 transition-all duration-300', '[&>div]:bg-zinc-950')}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light" className="mt-5">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>File upload error(s)</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}
