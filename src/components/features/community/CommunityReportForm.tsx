'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, MapPin, Camera, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CommunityReportFormProps {
  onSubmit: (report: {
    reportType: string;
    animalDescription?: string;
    location: string;
    description: string;
    reporterName?: string;
    reporterContact?: string;
    photos?: File[];
  }) => Promise<void>;
}

export function CommunityReportForm({ onSubmit }: CommunityReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    reportType: 'sighting',
    animalDescription: '',
    location: '',
    description: '',
    reporterName: '',
    reporterContact: '',
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // Max 3 photos
      setPhotos(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        photos: photos.length > 0 ? photos : undefined,
      });

      // Reset form
      setFormData({
        reportType: 'sighting',
        animalDescription: '',
        location: '',
        description: '',
        reporterName: '',
        reporterContact: '',
      });
      setPhotos([]);
      toast.success('Report submitted successfully. Thank you for helping!');
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Community Report</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Help us care for campus animals by reporting sightings or concerns
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="reportType">Report Type *</Label>
          <Select
            value={formData.reportType}
            onValueChange={value =>
              setFormData({ ...formData, reportType: value })
            }
          >
            <SelectTrigger id="reportType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sighting">Animal Sighting</SelectItem>
              <SelectItem value="concern">General Concern</SelectItem>
              <SelectItem value="injured">Injured Animal</SelectItem>
              <SelectItem value="lost">Lost Animal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(formData.reportType === 'sighting' ||
          formData.reportType === 'injured' ||
          formData.reportType === 'lost') && (
          <div>
            <Label htmlFor="animalDescription">Animal Description</Label>
            <Textarea
              id="animalDescription"
              placeholder="Describe the animal (type, color, size, distinguishing features)..."
              value={formData.animalDescription}
              onChange={e =>
                setFormData({ ...formData, animalDescription: e.target.value })
              }
              rows={2}
            />
          </div>
        )}

        <div>
          <Label htmlFor="location">Location *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="location"
              required
              placeholder="Where did you see the animal or notice the issue?"
              value={formData.location}
              onChange={e =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Be as specific as possible (e.g., &quot;Near LHC, beside the
            fountain&quot;)
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            required
            placeholder="Provide detailed information about your observation or concern..."
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="photos">Photos (Optional, max 3)</Label>
          <div className="relative">
            <Camera className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="pl-10"
            />
          </div>
          {photos.length > 0 && (
            <div className="mt-2 flex gap-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="text-xs text-gray-600">
                  📷 {photo.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Your Information (Optional)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Providing your contact information helps us follow up if needed
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reporterName">Name</Label>
              <Input
                id="reporterName"
                placeholder="Your name"
                value={formData.reporterName}
                onChange={e =>
                  setFormData({ ...formData, reporterName: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="reporterContact">Contact (Email or Phone)</Label>
              <Input
                id="reporterContact"
                placeholder="Your email or phone number"
                value={formData.reporterContact}
                onChange={e =>
                  setFormData({ ...formData, reporterContact: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          For emergencies, please contact CCF directly or use the Emergency
          Alert feature
        </p>
      </form>
    </Card>
  );
}
