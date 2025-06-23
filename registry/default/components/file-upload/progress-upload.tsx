'use client';

import { useEffect, useState } from 'react';
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from '@/registry/default/hooks/use-file-upload';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from '@/registry/default/ui/alert';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Progress } from '@/registry/default/ui/progress';
import {
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  TriangleAlert,
  UploadIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface ProgressUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
}

export default function ProgressUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
}: ProgressUploadProps) {
  // Create default images using FileMetadata type
  const defaultImages: FileMetadata[] = [
    {
      id: 'default-3',
      name: 'avatar-3.png',
      size: 42048,
      type: 'image/png',
      url: toAbsoluteUrl('/media/avatars/3.png'),
    },
    {
      id: 'default-4',
      name: 'avatar-4.png',
      size: 62807,
      type: 'image/png',
      url: toAbsoluteUrl('/media/avatars/4.png'),
    },
  ];

  // Convert default images to FileUploadItem format
  const defaultUploadFiles: FileUploadItem[] = defaultImages.map((image) => ({
    id: image.id,
    file: {
      name: image.name,
      size: image.size,
      type: image.type,
    } as File,
    preview: image.url,
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
    initialFiles: defaultImages,
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
      onFilesChange?.(newFiles);
    },
  });

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5; // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100);

          // Simulate occasional errors (10% chance when progress > 50%)
          if (newProgress > 50 && Math.random() < 0.1) {
            return {
              ...file,
              status: 'error' as const,
              error: 'Upload failed. Please try again.',
            };
          }

          // Complete when progress reaches 100%
          if (newProgress >= 100) {
            return {
              ...file,
              progress: 100,
              status: 'completed' as const,
            };
          }

          return {
            ...file,
            progress: newProgress,
          };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: 'uploading' as const,
              error: undefined,
            }
          : file,
      ),
    );
  };

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return <ImageIcon className="size-4" />;
    if (type.startsWith('video/')) return <VideoIcon className="size-4" />;
    if (type.startsWith('audio/')) return <HeadphonesIcon className="size-4" />;
    if (type.includes('pdf')) return <FileTextIcon className="size-4" />;
    if (type.includes('word') || type.includes('doc')) return <FileTextIcon className="size-4" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className="size-4" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className="size-4" />;
    return <FileTextIcon className="size-4" />;
  };

  const completedCount = uploadFiles.filter((f) => f.status === 'completed').length;
  const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
  const uploadingCount = uploadFiles.filter((f) => f.status === 'uploading').length;

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-8 text-center transition-colors',
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
              'flex h-16 w-16 items-center justify-center rounded-full',
              isDragging ? 'bg-primary/10' : 'bg-muted',
            )}
          >
            <UploadIcon className={cn('h-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload your files</h3>
            <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Support for multiple file types up to {formatBytes(maxSize)} each
            </p>
          </div>

          <Button onClick={openFileDialog}>
            <UploadIcon />
            Select files
          </Button>
        </div>
      </div>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Upload Progress</h4>
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <Badge size="sm" variant="success" appearance="light">
                  Completed: {completedCount}
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge size="sm" variant="destructive" appearance="light">
                  Failed: {errorCount}
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge size="sm" variant="secondary">
                  Uploading: {uploadingCount}
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={clearFiles} variant="outline" size="sm">
            Clear all
          </Button>
        </div>
      )}

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadFiles.map((fileItem) => (
            <div key={fileItem.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-2.5">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {fileItem.preview && fileItem.file.type.startsWith('image/') ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-muted-foreground">
                      {getFileIcon(fileItem.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mt-0.75">
                    <p className="inline-flex flex-col justify-center gap-1 truncate font-medium">
                      <span className="text-sm">{fileItem.file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatBytes(fileItem.file.size)}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Remove Button */}
                      <Button
                        onClick={() => removeUploadFile(fileItem.id)}
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:opacity-100 hover:bg-transparent"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}

                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <Alert variant="destructive" appearance="light" className="items-center gap-1.5 mt-2 px-2 py-1">
                      <AlertIcon>
                        <TriangleAlert className="size-4!" />
                      </AlertIcon>
                      <AlertTitle className="text-xs">{fileItem.error}</AlertTitle>
                      <AlertToolbar>
                        <Button
                          onClick={() => retryUpload(fileItem.id)}
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:opacity-100 hover:bg-transparent"
                        >
                          <RefreshCwIcon className="size-3.5" />
                        </Button>
                      </AlertToolbar>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
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
