'use client';

import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from '@/registry/default/hooks/use-file-upload';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import { FileIcon, ImageIcon, TriangleAlert, UploadIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadDropzoneProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
}

export default function FileUploadDropzone({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*,application/pdf,.doc,.docx',
  multiple = true,
  className,
  onFilesChange,
}: FileUploadDropzoneProps) {
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
    onFilesChange,
  });

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith('image/');
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Dropzone */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
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
              'flex h-20 w-20 items-center justify-center rounded-full',
              isDragging ? 'bg-primary/10' : 'bg-muted',
            )}
          >
            <ImageIcon className={cn('h-10 w-10', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Drop your images here</h3>
            <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. {formatBytes(maxSize)})</p>
          </div>

          <Button onClick={openFileDialog} variant="outline" className="gap-2">
            <UploadIcon className="h-4 w-4" />
            Select images
          </Button>
        </div>
      </div>

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

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploaded files ({files.length})</h4>
            <Button onClick={clearFiles} variant="ghost" size="sm" className="text-muted-foreground">
              Remove all files
            </Button>
          </div>

          <div className="grid gap-3">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                {/* File Preview */}
                <div className="flex-shrink-0">
                  {isImage(fileItem.file) && fileItem.preview ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{fileItem.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(fileItem.file.size)}</p>
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
