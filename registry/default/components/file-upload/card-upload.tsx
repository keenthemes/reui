'use client';

import { useEffect, useState } from 'react';
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from '@/registry/default/hooks/use-file-upload';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';
import {
  CloudUpload,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  Trash2,
  TriangleAlert,
  Upload,
  VideoIcon,
  XIcon,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';

// Extend FileWithPreview to include upload status and progress
interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface CardUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileUploadItem[]) => void;
  simulateUpload?: boolean;
}

export default function CardUpload({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
}: CardUploadProps) {
  // Create default files using FileMetadata type
  const defaultFiles: FileMetadata[] = [
    {
      id: 'default-card-1',
      name: 'intro.zip',
      size: 252846,
      type: 'application/zip',
      url: toAbsoluteUrl('/media/files/intro.zip'),
    },
    {
      id: 'default-card-2',
      name: 'image-01.jpg',
      size: 1536000,
      type: 'image/jpeg',
      url: 'https://picsum.photos/1000/800?grayscale&random=3',
    },
    {
      id: 'default-card-3',
      name: 'audio.mp3',
      size: 1536000,
      type: 'audio/mpeg',
      url: toAbsoluteUrl('/media/files/audio.mp3'),
    },
  ];

  // Convert default files to FileUploadItem format
  const defaultUploadFiles: FileUploadItem[] = defaultFiles.map((file) => ({
    id: file.id,
    file: {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
    } as unknown as File,
    preview: file.url,
    progress: 100,
    status: 'completed' as const,
  }));

  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>(defaultUploadFiles);

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
        const existingFile = uploadFiles.find((existing) => existing.id === file.id);

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          };
        }
      });

      setUploadFiles(newUploadFiles);
      onFilesChange?.(newUploadFiles);
    },
  });

  // Simulate upload progress for new files
  useEffect(() => {
    if (!simulateUpload) return;

    const uploadingFiles = uploadFiles.filter((file) => file.status === 'uploading');
    if (uploadingFiles.length === 0) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 20 + 5; // Random increment between 5-25%
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress >= 100) {
            // Simulate occasional failures (10% chance)
            const shouldFail = Math.random() < 0.1;
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ('error' as const) : ('completed' as const),
              error: shouldFail ? 'Upload failed. Please try again.' : undefined,
            };
          }

          return { ...file, progress: newProgress };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [uploadFiles, simulateUpload]);

  const removeUploadFile = (fileId: string) => {
    const fileToRemove = uploadFiles.find((f) => f.id === fileId);
    if (fileToRemove) {
      removeFile(fileToRemove.id);
    }
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, progress: 0, status: 'uploading' as const, error: undefined } : file,
      ),
    );
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return <ImageIcon className="size-6" />;
    if (type.startsWith('video/')) return <VideoIcon className="size-6" />;
    if (type.startsWith('audio/')) return <HeadphonesIcon className="size-6" />;
    if (type.includes('pdf')) return <FileTextIcon className="size-6" />;
    if (type.includes('word') || type.includes('doc')) return <FileTextIcon className="size-6" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className="size-6" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className="size-6" />;
    return <FileTextIcon className="size-6" />;
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-6 text-center transition-colors',
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
              'flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors',
              isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
            )}
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drop files here or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="cursor-pointer text-primary underline-offset-4 hover:underline"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatBytes(maxSize)} • Maximum files: {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Files ({uploadFiles.length})</h3>
            <div className="flex gap-2">
              <Button onClick={openFileDialog} variant="outline" size="sm">
                <CloudUpload />
                Add files
              </Button>
              <Button onClick={clearFiles} variant="outline" size="sm">
                <Trash2 />
                Remove all
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {uploadFiles.map((fileItem) => (
              <div key={fileItem.id} className="relative group">
                {/* Remove button */}
                <Button
                  onClick={() => removeUploadFile(fileItem.id)}
                  variant="outline"
                  size="icon"
                  className="absolute -end-2 -top-2 z-10 size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <XIcon className="size-3" />
                </Button>

                {/* Wrapper */}
                <div className="relative overflow-hidden rounded-lg border bg-card transition-colors">
                  {/* Image preview or file icon area */}
                  <div className="relative aspect-square bg-muted border-b border-border">
                    {fileItem.file.type.startsWith('image/') && fileItem.preview ? (
                      <>
                        {/* Image cover */}
                        <img src={fileItem.preview} alt={fileItem.file.name} className="h-full w-full object-cover" />
                        {/* Progress overlay for uploading images */}
                        {fileItem.status === 'uploading' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="relative">
                              <svg className="size-12 -rotate-90" viewBox="0 0 48 48">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  className="text-muted/60"
                                />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeDasharray={`${2 * Math.PI * 20}`}
                                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - fileItem.progress / 100)}`}
                                  className="text-white transition-all duration-300"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* File icon area for non-images */
                      <div className="flex h-full items-center justify-center text-muted-foreground/80">
                        {fileItem.status === 'uploading' ? (
                          <div className="relative">
                            <svg className="size-12 -rotate-90" viewBox="0 0 48 48">
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-muted-foreground/20"
                              />
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - fileItem.progress / 100)}`}
                                className="text-primary transition-all duration-300"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              {getFileIcon(fileItem.file)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-4xl">{getFileIcon(fileItem.file)}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* File info footer */}
                  <div className="p-3">
                    <div className="space-y-1">
                      <p className="truncate text-sm font-medium">{fileItem.file.name}</p>
                      <div className="relative flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">{formatBytes(fileItem.file.size)}</span>

                        {fileItem.status === 'error' && fileItem.error && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => retryUpload(fileItem.id)}
                                variant="ghost"
                                size="icon"
                                className="absolute end-0 -top-1.25 size-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <RefreshCwIcon className="size-3 opacity-100" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Upload failed. Retry</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
