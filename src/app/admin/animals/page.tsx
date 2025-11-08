'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { AnimalProfile } from '@/types/animal';
import {
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
} from '@/lib/db/animals';
import { AnimalForm } from '@/components/features/admin/AnimalForm';
import { PhotoManager } from '@/components/features/admin/PhotoManager';
import { AnimalDataTable } from '@/components/features/admin/AnimalDataTable';
import { BulkUpload } from '@/components/features/admin/BulkUpload';
import { exportAnimalsToCSV, exportAnimalsToJSON } from '@/lib/utils/export';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimalProfileFormData } from '@/lib/validations/animal';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function AdminAnimalsPage() {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalProfile | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Photo management state
  const [profilePhoto, setProfilePhoto] = useState('');
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  const loadAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAnimals();
      setAnimals(data.animals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  const handleCreate = useCallback(
    async (data: AnimalProfileFormData) => {
      try {
        setError(null);

        // Use photos from PhotoManager
        const animalData = {
          ...data,
          photos: {
            profile: profilePhoto,
            gallery: galleryPhotos,
          },
        };

        await createAnimal(animalData);
        setSuccess('Animal created successfully!');
        setShowCreateDialog(false);
        resetPhotoState();
        loadAnimals();

        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create animal'
        );
      }
    },
    [profilePhoto, galleryPhotos, loadAnimals]
  );

  const handleEdit = useCallback((animal: AnimalProfile) => {
    setSelectedAnimal(animal);
    setProfilePhoto(animal.photos.profile);
    setGalleryPhotos(animal.photos.gallery);
    setShowEditDialog(true);
  }, []);

  const handleUpdate = useCallback(
    async (data: AnimalProfileFormData) => {
      if (!selectedAnimal) return;

      try {
        setError(null);

        // Use photos from PhotoManager
        const animalData = {
          ...data,
          photos: {
            profile: profilePhoto,
            gallery: galleryPhotos,
          },
        };

        await updateAnimal(selectedAnimal.id, animalData);
        setSuccess('Animal updated successfully!');
        setShowEditDialog(false);
        setSelectedAnimal(null);
        resetPhotoState();
        loadAnimals();

        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update animal'
        );
      }
    },
    [selectedAnimal, profilePhoto, galleryPhotos, loadAnimals]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await deleteAnimal(id);
        setSuccess('Animal deleted successfully!');
        loadAnimals();

        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete animal'
        );
      }
    },
    [loadAnimals]
  );

  const resetPhotoState = useCallback(() => {
    setProfilePhoto('');
    setGalleryPhotos([]);
  }, []);

  const handleExportCSV = useCallback(() => {
    exportAnimalsToCSV(animals);
  }, [animals]);

  const handleExportJSON = useCallback(() => {
    exportAnimalsToJSON(animals);
  }, [animals]);

  return (
    <ProtectedRoute requiredRole="admin">
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Animal Database Management
              </h1>
              <p className="text-gray-600">
                Manage animal profiles, photos, and information
              </p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Animal
              </Button>
              <Button variant="outline" onClick={() => setShowBulkUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={handleExportJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <AnimalDataTable
              animals={animals}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loading}
            />

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Animal</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new animal profile
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <AnimalForm
                      onSubmit={handleCreate}
                      onCancel={() => {
                        setShowCreateDialog(false);
                        resetPhotoState();
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="photos" className="space-y-4">
                    <PhotoManager
                      profilePhoto={profilePhoto}
                      galleryPhotos={galleryPhotos}
                      onProfilePhotoChange={setProfilePhoto}
                      onGalleryPhotosChange={setGalleryPhotos}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Animal</DialogTitle>
                  <DialogDescription>
                    Update the animal profile information
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <AnimalForm
                      initialData={selectedAnimal || undefined}
                      onSubmit={handleUpdate}
                      onCancel={() => {
                        setShowEditDialog(false);
                        setSelectedAnimal(null);
                        resetPhotoState();
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="photos" className="space-y-4">
                    <PhotoManager
                      profilePhoto={profilePhoto}
                      galleryPhotos={galleryPhotos}
                      onProfilePhotoChange={setProfilePhoto}
                      onGalleryPhotosChange={setGalleryPhotos}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Bulk Upload Dialog */}
            <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
              <DialogContent className="max-w-2xl">
                <BulkUpload
                  onComplete={() => {
                    setShowBulkUpload(false);
                    loadAnimals();
                  }}
                  onCancel={() => setShowBulkUpload(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
