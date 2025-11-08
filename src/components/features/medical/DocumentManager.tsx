'use client';

import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { FileText } from 'lucide-react';
import { FileUploadZone } from './FileUploadZone';

interface DocumentManagerProps {
  documents: string[];
  onFilesUploaded: (urls: string[]) => void;
  onRemove: (url: string) => void;
}

export function DocumentManager({
  documents,
  onFilesUploaded,
  onRemove,
}: DocumentManagerProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Medical Documents & Photos</FormLabel>
      <FileUploadZone onFilesUploaded={onFilesUploaded} />
      {documents.length > 0 && (
        <div className="space-y-2 mt-2">
          {documents.map((url, index) => (
            <div
              key={url}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Document {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(url)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
