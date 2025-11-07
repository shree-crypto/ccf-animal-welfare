# Medical Records Components

This directory contains components for managing medical records for animals in the CCF Animal Welfare system.

## Components

### MedicalRecordForm
A comprehensive form component for creating and editing medical records.

**Features:**
- Record type selection (checkup, vaccination, treatment, emergency)
- Date and time picker
- Veterinarian information
- Detailed description field
- Medication management (add/remove multiple medications)
- File upload for medical documents and photos
- Follow-up scheduling
- Form validation with Zod

**Usage:**
```tsx
import { MedicalRecordForm } from '@/components/features/medical';

<MedicalRecordForm
  animalId="animal-id"
  onSubmit={async (data) => {
    await createMedicalRecord(data);
  }}
/>
```

### MedicalHistoryTimeline
Displays a chronological timeline of all medical records for an animal.

**Features:**
- Visual timeline with type-specific icons and colors
- Displays all record details (date, description, veterinarian, medications)
- Document links with external access
- Follow-up indicators
- Responsive design

**Usage:**
```tsx
import { MedicalHistoryTimeline } from '@/components/features/medical';

<MedicalHistoryTimeline animalId="animal-id" />
```

### MedicalAlertBanner
Shows alerts for animals requiring follow-up medical attention.

**Features:**
- Fetches records with pending follow-ups
- Color-coded urgency (overdue, today, tomorrow, upcoming)
- Dismissible alerts
- Quick links to animal profiles
- Auto-refresh capability

**Usage:**
```tsx
import { MedicalAlertBanner } from '@/components/features/medical';

<MedicalAlertBanner />
```

### FileUploadZone
Drag-and-drop file upload component for medical documents.

**Features:**
- Drag-and-drop interface
- Multiple file upload
- File type validation (images, PDF, DOC, DOCX)
- File size validation (max 10MB)
- Upload progress tracking
- Error handling

**Usage:**
```tsx
import { FileUploadZone } from '@/components/features/medical';

<FileUploadZone
  onFilesUploaded={(urls) => {
    console.log('Uploaded files:', urls);
  }}
  maxFiles={5}
/>
```

## Integration

### In Animal Detail Page
```tsx
import { MedicalHistoryTimeline, MedicalRecordForm } from '@/components/features/medical';
import { createMedicalRecord } from '@/lib/db/medical';

// In your component
<div className="space-y-6">
  <MedicalRecordForm
    animalId={animal.id}
    onSubmit={async (data) => {
      await createMedicalRecord(data);
      // Refresh the timeline
    }}
  />
  <MedicalHistoryTimeline animalId={animal.id} />
</div>
```

### In Dashboard
```tsx
import { MedicalAlertBanner } from '@/components/features/medical';

// At the top of your dashboard
<MedicalAlertBanner />
```

## Data Flow

1. **Creating Records**: Form → Validation → File Upload → Database → Timeline Update
2. **Viewing History**: Database Query → Timeline Rendering → Document Links
3. **Alerts**: Scheduled Query → Filter Overdue → Display Banner → Dismiss/Navigate

## Dependencies

- `react-hook-form` - Form state management
- `zod` - Schema validation
- `react-dropzone` - File upload
- `date-fns` - Date formatting and manipulation
- `lucide-react` - Icons
- Shadcn/ui components (Dialog, Form, Card, Alert, etc.)

## File Upload

Medical documents are uploaded to Appwrite Storage in the `medical-documents` bucket. Supported file types:
- Images: PNG, JPG, JPEG, WEBP
- Documents: PDF, DOC, DOCX

Maximum file size: 10MB per file
