'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicalRecordSchema, MedicalRecordFormData } from '@/lib/validations/medical';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { FileUploadZone } from './FileUploadZone';
import { MedicalRecord } from '@/types/medical';

interface MedicalRecordFormProps {
  animalId: string;
  record?: MedicalRecord;
  onSubmit: (data: MedicalRecordFormData) => Promise<void>;
  trigger?: React.ReactNode;
}

export function MedicalRecordForm({ 
  animalId, 
  record, 
  onSubmit: onSubmitProp,
  trigger 
}: MedicalRecordFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>(record?.documents || []);
  const [medications, setMedications] = useState<string[]>(record?.medications || []);
  const [newMedication, setNewMedication] = useState('');

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: record ? {
      animalId: record.animalId,
      date: record.date,
      type: record.type,
      description: record.description,
      veterinarian: record.veterinarian || '',
      medications: record.medications || [],
      documents: record.documents,
      followUpRequired: record.followUpRequired,
      followUpDate: record.followUpDate || '',
    } : {
      animalId,
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: 'checkup',
      description: '',
      veterinarian: '',
      medications: [],
      documents: [],
      followUpRequired: false,
      followUpDate: '',
    },
  });

  const handleSubmit = async (data: MedicalRecordFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmitProp({
        ...data,
        medications,
        documents: uploadedDocuments,
      });
      form.reset();
      setMedications([]);
      setUploadedDocuments([]);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting medical record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (med: string) => {
    setMedications(medications.filter(m => m !== med));
  };

  const handleFilesUploaded = (urls: string[]) => {
    setUploadedDocuments([...uploadedDocuments, ...urls]);
  };

  const removeDocument = (url: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc !== url));
  };

  const followUpRequired = form.watch('followUpRequired');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {record ? 'Edit Record' : 'Add Medical Record'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? 'Edit Medical Record' : 'Add Medical Record'}
          </DialogTitle>
          <DialogDescription>
            {record 
              ? 'Update the medical record details below' 
              : 'Record medical information for this animal'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="checkup">Checkup</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="veterinarian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veterinarian (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the medical event, symptoms, diagnosis, or treatment..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Medications */}
            <div className="space-y-2">
              <FormLabel>Medications</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add medication name"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMedication();
                    }
                  }}
                />
                <Button type="button" onClick={addMedication} variant="outline">
                  Add
                </Button>
              </div>
              {medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {medications.map((med) => (
                    <div
                      key={med}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {med}
                      <button
                        type="button"
                        onClick={() => removeMedication(med)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <FormLabel>Medical Documents & Photos</FormLabel>
              <FileUploadZone onFilesUploaded={handleFilesUploaded} />
              {uploadedDocuments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {uploadedDocuments.map((url, index) => (
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
                        onClick={() => removeDocument(url)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Follow-up */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="followUpRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Follow-up Required</FormLabel>
                      <FormDescription>
                        Check if this animal needs a follow-up visit
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {followUpRequired && (
                <FormField
                  control={form.control}
                  name="followUpDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : record ? 'Update Record' : 'Create Record'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
