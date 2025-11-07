'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadMedicalDocument, isValidDocumentFile, isValidFileSize } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadZoneProps {
  onFilesUploaded: (urls: string[]) => void;
  maxFiles?: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

export function FileUploadZone({ onFilesUploaded, maxFiles = 5 }: FileUploadZoneProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (!isValidDocumentFile(file)) {
        alert(`${file.name} is not a valid file type. Please upload images or PDF documents.`);
        return false;
      }
      if (!isValidFileSize(file, 10)) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Initialize uploading state
    const initialUploading = validFiles.map(file => ({
      file,
      progress: 0,
    }));
    setUploadingFiles(prev => [...prev, ...initialUploading]);

    // Upload files
    const uploadPromises = validFiles.map(async (file, index) => {
      try {
        const fileInfo = await uploadMedicalDocument(file, (progress) => {
          setUploadingFiles(prev => {
            const newState = [...prev];
            const fileIndex = newState.findIndex(f => f.file === file);
            if (fileIndex !== -1) {
              newState[fileIndex].progress = Math.round((progress.$id ? 100 : 0));
            }
            return newState;
          });
        });
        return fileInfo.url;
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => {
          const newState = [...prev];
          const fileIndex = newState.findIndex(f => f.file === file);
          if (fileIndex !== -1) {
            newState[fileIndex].error = 'Upload failed';
          }
          return newState;
        });
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    const successfulUrls = urls.filter((url): url is string => url !== null);

    if (successfulUrls.length > 0) {
      onFilesUploaded(successfulUrls);
    }

    // Clear uploading state after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => !validFiles.includes(f.file)));
    }, 1000);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(f => f.file !== file));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: Images (PNG, JPG, WEBP), PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={`${uploadingFile.file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-secondary rounded-md"
            >
              {uploadingFile.file.type.startsWith('image/') ? (
                <ImageIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {uploadingFile.file.name}
                </p>
                {uploadingFile.error ? (
                  <p className="text-xs text-destructive">{uploadingFile.error}</p>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={uploadingFile.progress} className="h-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {uploadingFile.progress}%
                    </span>
                  </div>
                )}
              </div>
              {uploadingFile.progress < 100 && !uploadingFile.error && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {uploadingFile.error && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadingFile(uploadingFile.file)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
