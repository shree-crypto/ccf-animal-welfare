'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { animalProfileSchema, type AnimalProfileFormData } from '@/lib/validations/animal';
import { AnimalProfile } from '@/types/animal';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface AnimalFormProps {
  initialData?: Partial<AnimalProfile>;
  onSubmit: (data: AnimalProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AnimalForm({ initialData, onSubmit, onCancel, isLoading }: AnimalFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AnimalProfileFormData>({
    resolver: zodResolver(animalProfileSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'dog',
      age: initialData?.age || 0,
      breed: initialData?.breed || '',
      location: {
        area: initialData?.location?.area || '',
        coordinates: initialData?.location?.coordinates || [29.8543, 77.8880],
      },
      currentFeeder: initialData?.currentFeeder || '',
      medicalHistory: initialData?.medicalHistory || [],
      photos: {
        profile: initialData?.photos?.profile || '',
        gallery: initialData?.photos?.gallery || [],
      },
      packId: initialData?.packId || '',
      status: initialData?.status || 'healthy',
    },
  });

  const handleSubmit = async (data: AnimalProfileFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter animal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select animal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter age"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Breed */}
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="Enter breed (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Area */}
          <FormField
            control={form.control}
            name="location.area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Area *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Main Building, Hostel Area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Status *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="needs_attention">Needs Attention</SelectItem>
                    <SelectItem value="under_treatment">Under Treatment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Current Feeder */}
          <FormField
            control={form.control}
            name="currentFeeder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Feeder</FormLabel>
                <FormControl>
                  <Input placeholder="Volunteer name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pack ID */}
          <FormField
            control={form.control}
            name="packId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pack ID</FormLabel>
                <FormControl>
                  <Input placeholder="Pack identifier (optional)" {...field} />
                </FormControl>
                <FormDescription>
                  Link this animal to a pack/territory
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location.coordinates.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="29.8543"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.coordinates.1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="77.8880"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting || isLoading}>
            {submitting ? 'Saving...' : initialData ? 'Update Animal' : 'Create Animal'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
