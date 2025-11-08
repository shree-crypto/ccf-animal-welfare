'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkUploadDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function BulkUploadDropzone({
  file,
  onFileSelect,
  disabled,
}: BulkUploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
    disabled,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop the CSV file here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">
              Drag & drop CSV file here
            </p>
            <p className="text-sm text-gray-500">or click to select file</p>
          </>
        )}
      </div>

      {file && !disabled && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onFileSelect(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
