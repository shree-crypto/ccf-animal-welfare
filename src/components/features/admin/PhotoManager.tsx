'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { uploadAnimalPhoto, isValidImageFile, isValidFileSize } from '@/lib/storage';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhotoManagerProps {
  profilePhoto?: string;
  galleryPhotos?: string[];
  onProfilePhotoChange: (url: string) => void;
  onGalleryPhotosChange: (urls: string[]) => void;
}

export function PhotoManager({
  profilePhoto,
  galleryPhotos = [],
  onProfilePhotoChange,
  onGalleryPhotosChange,
}: PhotoManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      
      // Validate files
      for (const file of acceptedFiles) {
        if (!isValidImageFile(file)) {
          setError('Only JPEG, PNG, and WebP images are allowed');
          return;
        }
        if (!isValidFileSize(file, 10)) {
          setError('File size must be less than 10MB');
          return;
        }
      }

      setUploading(true);
      const uploadedUrls: string[] = [];

      try {
        for (const file of acceptedFiles) {
          const fileInfo = await uploadAnimalPhoto(file, (progress) => {
            setUploadProgress((progress.chunksUploaded / progress.chunksTotal) * 100);
          });
          uploadedUrls.push(fileInfo.url);
        }

        // Add to gallery
        onGalleryPhotosChange([...galleryPhotos, ...uploadedUrls]);
        
        // If no profile photo, set the first uploaded photo as profile
        if (!profilePhoto && uploadedUrls.length > 0) {
          onProfilePhotoChange(uploadedUrls[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload photos');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [profilePhoto, galleryPhotos, onProfilePhotoChange, onGalleryPhotosChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
    disabled: uploading,
  });

  const setAsProfile = (url: string) => {
    onProfilePhotoChange(url);
  };

  const removePhoto = (url: string) => {
    const updatedGallery = galleryPhotos.filter((photo) => photo !== url);
    onGalleryPhotosChange(updatedGallery);
    
    // If removed photo was profile, set first gallery photo as profile
    if (profilePhoto === url && updatedGallery.length > 0) {
      onProfilePhotoChange(updatedGallery[0]);
    } else if (profilePhoto === url) {
      onProfilePhotoChange('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop the photos here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">Drag & drop photos here</p>
            <p className="text-sm text-gray-500">or click to select files</p>
            <p className="text-xs text-gray-400 mt-2">
              Supports: JPEG, PNG, WebP (max 10MB each)
            </p>
          </>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Photo Section */}
      {profilePhoto && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Profile Photo</h3>
          <div className="relative inline-block">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
            />
            <div className="absolute top-1 right-1 bg-primary text-white text-xs px-2 py-1 rounded">
              Profile
            </div>
          </div>
        </div>
      )}

      {/* Gallery Photos */}
      {galleryPhotos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Gallery Photos ({galleryPhotos.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPhotos.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {url !== profilePhoto && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setAsProfile(url)}
                      className="text-xs"
                    >
                      Set as Profile
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {galleryPhotos.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p>No photos uploaded yet</p>
        </div>
      )}
    </div>
  );
}
