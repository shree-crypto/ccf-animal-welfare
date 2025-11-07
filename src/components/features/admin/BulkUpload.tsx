'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAnimal } from '@/lib/db/animals';
import { AnimalProfileFormData } from '@/lib/validations/animal';
import { BulkUploadDropzone } from './BulkUploadDropzone';
import { BulkUploadResults } from './BulkUploadResults';

interface BulkUploadProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface ParsedAnimal {
  name: string;
  type: 'dog' | 'cat';
  age: number;
  breed?: string;
  area: string;
  latitude: number;
  longitude: number;
  currentFeeder?: string;
  status: 'healthy' | 'needs_attention' | 'under_treatment';
  packId?: string;
}

export function BulkUpload({ onComplete, onCancel }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: [],
  });
  const [showResults, setShowResults] = useState(false);

  const parseCSV = (text: string): ParsedAnimal[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const animals: ParsedAnimal[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const animal: any = {};
      
      headers.forEach((header, index) => {
        animal[header] = values[index];
      });
      
      // Map CSV fields to animal structure
      animals.push({
        name: animal.name || animal.animal_name,
        type: (animal.type || 'dog').toLowerCase() as 'dog' | 'cat',
        age: parseFloat(animal.age) || 0,
        breed: animal.breed || undefined,
        area: animal.area || animal.location,
        latitude: parseFloat(animal.latitude || animal.lat) || 29.8543,
        longitude: parseFloat(animal.longitude || animal.lng || animal.lon) || 77.8880,
        currentFeeder: animal.feeder || animal.current_feeder || undefined,
        status: (animal.status || 'healthy') as 'healthy' | 'needs_attention' | 'under_treatment',
        packId: animal.pack_id || animal.packid || undefined,
      });
    }
    
    return animals;
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setShowResults(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    try {
      const text = await file.text();
      const animals = parseCSV(text);
      
      for (let i = 0; i < animals.length; i++) {
        try {
          const animal = animals[i];
          
          // Create animal data
          const animalData: AnimalProfileFormData = {
            name: animal.name,
            type: animal.type,
            age: animal.age,
            breed: animal.breed,
            location: {
              area: animal.area,
              coordinates: [animal.latitude, animal.longitude],
            },
            currentFeeder: animal.currentFeeder,
            medicalHistory: [],
            photos: {
              profile: '',
              gallery: [],
            },
            status: animal.status,
            packId: animal.packId,
          };

          await createAnimal(animalData);
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        setProgress(((i + 1) / animals.length) * 100);
      }

      setResults({ success: successCount, failed: failedCount, errors });
      setShowResults(true);
    } catch (error) {
      errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setResults({ success: 0, failed: 0, errors });
      setShowResults(true);
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = () => {
    setFile(null);
    setShowResults(false);
    setResults({ success: 0, failed: 0, errors: [] });
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Animals</CardTitle>
        <CardDescription>
          Upload a CSV file to add multiple animals at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CSV Format Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">CSV Format Requirements:</p>
              <p className="text-sm">
                Required columns: name, type, age, area, latitude, longitude, status
              </p>
              <p className="text-sm">
                Optional columns: breed, feeder, pack_id
              </p>
              <p className="text-sm">
                Example: name,type,age,breed,area,latitude,longitude,status,feeder
              </p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Upload Zone */}
        {!showResults && (
          <>
            <BulkUploadDropzone
              file={file}
              onFileSelect={handleFileSelect}
              disabled={uploading}
            />

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing animals...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </>
        )}

        {/* Results */}
        {showResults && (
          <BulkUploadResults
            success={results.success}
            failed={results.failed}
            errors={results.errors}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel} disabled={uploading}>
            Cancel
          </Button>
          {!showResults ? (
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Processing...' : 'Upload Animals'}
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              Done
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
