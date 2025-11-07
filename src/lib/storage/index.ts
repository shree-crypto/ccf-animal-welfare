import { ID, UploadProgress } from 'appwrite';
import { storage } from '@/lib/appwrite';
import { STORAGE_BUCKETS } from '@/lib/constants/database';

export interface UploadFileOptions {
  file: File;
  bucketId: string;
  fileId?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
}

// Upload a file to Appwrite storage
export const uploadFile = async ({
  file,
  bucketId,
  fileId = ID.unique(),
  onProgress,
}: UploadFileOptions): Promise<FileInfo> => {
  const uploadedFile = await storage.createFile(
    bucketId,
    fileId,
    file,
    undefined,
    onProgress
  );

  const fileUrl = getFileUrl(bucketId, uploadedFile.$id);

  return {
    id: uploadedFile.$id,
    name: uploadedFile.name,
    size: uploadedFile.sizeOriginal,
    mimeType: uploadedFile.mimeType,
    url: fileUrl,
  };
};

// Get file URL
export const getFileUrl = (bucketId: string, fileId: string): string => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'http://localhost/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'ccf-animal-welfare';
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};

// Get file preview URL (for images)
export const getFilePreviewUrl = (
  bucketId: string,
  fileId: string,
  width?: number,
  height?: number,
  quality?: number
): string => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'http://localhost/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'ccf-animal-welfare';
  
  let url = `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${projectId}`;
  
  if (width) url += `&width=${width}`;
  if (height) url += `&height=${height}`;
  if (quality) url += `&quality=${quality}`;
  
  return url;
};

// Delete a file
export const deleteFile = async (bucketId: string, fileId: string): Promise<void> => {
  await storage.deleteFile(bucketId, fileId);
};

// Upload animal photo
export const uploadAnimalPhoto = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileInfo> => {
  return uploadFile({
    file,
    bucketId: STORAGE_BUCKETS.ANIMAL_PHOTOS,
    onProgress,
  });
};

// Upload medical document
export const uploadMedicalDocument = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<FileInfo> => {
  return uploadFile({
    file,
    bucketId: STORAGE_BUCKETS.MEDICAL_DOCUMENTS,
    onProgress,
  });
};

// Delete animal photo
export const deleteAnimalPhoto = async (fileId: string): Promise<void> => {
  await deleteFile(STORAGE_BUCKETS.ANIMAL_PHOTOS, fileId);
};

// Delete medical document
export const deleteMedicalDocument = async (fileId: string): Promise<void> => {
  await deleteFile(STORAGE_BUCKETS.MEDICAL_DOCUMENTS, fileId);
};

// Validate file type for animal photos
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

// Validate file type for medical documents
export const isValidDocumentFile = (file: File): boolean => {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return validTypes.includes(file.type);
};

// Validate file size (in bytes)
export const isValidFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
