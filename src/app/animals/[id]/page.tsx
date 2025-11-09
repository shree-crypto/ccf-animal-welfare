'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimalProfile } from '@/types/animal';
import { getAnimalById } from '@/lib/db/animals';
import { createMedicalRecord } from '@/lib/db/medical';
import { PhotoCarousel } from '@/components/features/animals/PhotoCarousel';
import { MedicalHistoryTimeline, MedicalRecordForm } from '@/components/features/medical';
import { BehaviorTracker } from '@/components/features/animals/BehaviorTracker';
import { AnimalQRCode } from '@/components/features/animals/AnimalQRCode';
import { MedicalRecordFormData } from '@/lib/validations/medical';
import { BehaviorProfile } from '@/types/animal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Heart,
  AlertCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function AnimalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<AnimalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = params.id as string;
        const data = await getAnimalById(id);

        if (!data) {
          setError('Animal not found');
        } else {
          setAnimal(data);
        }
      } catch (err) {
        console.error('Error fetching animal:', err);
        setError('Failed to load animal details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnimal();
    }
  }, [params.id, refreshKey]);

  const handleCreateMedicalRecord = async (data: MedicalRecordFormData) => {
    try {
      await createMedicalRecord(data);
      // Refresh the page to show new record
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  };

  const handleSaveBehavior = async (behavior: BehaviorProfile) => {
    try {
      // TODO: Replace with actual API call to update animal behavior
      console.log('Saving behavior:', behavior);
      toast.success('Behavior profile updated successfully');
      
      // Update local state
      if (animal) {
        setAnimal({ ...animal, behavior });
      }
    } catch (error) {
      console.error('Error saving behavior:', error);
      toast.error('Failed to update behavior profile');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">
              {error || 'Animal not found'}
            </h2>
            <Button onClick={() => router.push('/animals')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Animals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    healthy:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    needs_attention:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    under_treatment:
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const statusLabels = {
    healthy: 'Healthy',
    needs_attention: 'Needs Attention',
    under_treatment: 'Under Treatment',
  };

  const allPhotos = [animal.photos.profile, ...animal.photos.gallery].filter(
    Boolean
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push('/animals')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Animals
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photos */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PhotoCarousel photos={allPhotos} animalName={animal.name} />
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl">{animal.name}</CardTitle>
                      <p className="text-muted-foreground capitalize mt-1">
                        {animal.breed || animal.type}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[animal.status]}`}
                    >
                      {statusLabels[animal.status]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Age</p>
                      <p className="text-sm">
                        {animal.age} {animal.age === 1 ? 'year' : 'years'} old
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Location
                      </p>
                      <p className="text-sm">{animal.location.area}</p>
                    </div>
                  </div>

                  {animal.currentFeeder && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Current Feeder
                        </p>
                        <p className="text-sm">{animal.currentFeeder}</p>
                      </div>
                    </div>
                  )}

                  {animal.packId && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Heart className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Pack
                        </p>
                        <p className="text-sm">
                          Member of pack {animal.packId}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Add Medical Record Button - Only for authenticated users */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MedicalRecordForm
                  animalId={animal.id}
                  onSubmit={handleCreateMedicalRecord}
                  trigger={
                    <Button className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Medical Record
                    </Button>
                  }
                />
              </motion.div>
            )}

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    {animal.name} is a {animal.age}-year-old{' '}
                    {animal.breed || animal.type} currently residing in{' '}
                    {animal.location.area}.
                  </p>
                  {animal.status === 'needs_attention' && (
                    <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                      This animal needs attention from our volunteers.
                    </p>
                  )}
                  {animal.status === 'under_treatment' && (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      This animal is currently under medical treatment.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Medical History Timeline - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <MedicalHistoryTimeline key={refreshKey} animalId={animal.id} />
        </motion.div>

        {/* Behavior Tracking Section */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <BehaviorTracker
              animalId={animal.id}
              initialBehavior={animal.behavior}
              onSave={handleSaveBehavior}
              readOnly={user.role === 'public'}
            />
          </motion.div>
        )}

        {/* QR Code Section */}
        {user && user.role !== 'public' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <AnimalQRCode animalId={animal.id} animalName={animal.name} />
                  <p className="text-sm text-muted-foreground flex-1">
                    Generate a QR code for {animal.name}&apos;s profile that can be printed and attached to physical tags or feeding stations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
