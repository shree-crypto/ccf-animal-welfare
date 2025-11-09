# Admin Components

This directory contains administrative components for managing the CCF Animal Welfare system.

## Components

### AnimalForm

A comprehensive form component for creating and editing animal profiles with validation.

**Features:**

- Full validation using Zod schema
- Support for all animal fields (name, type, age, breed, location, status, etc.)
- Coordinate input for precise location tracking
- Pack ID assignment
- Current feeder assignment

**Usage:**

```tsx
<AnimalForm
  initialData={animal} // Optional, for editing
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={false}
/>
```

### PhotoManager

A drag-and-drop photo management component with upload progress and image preview.

**Features:**

- Drag-and-drop file upload
- Multiple photo upload support
- Profile photo selection
- Gallery management
- Image preview with hover actions
- Upload progress tracking
- File validation (type and size)

**Usage:**

```tsx
<PhotoManager
  profilePhoto={profilePhotoUrl}
  galleryPhotos={galleryPhotoUrls}
  onProfilePhotoChange={setProfilePhoto}
  onGalleryPhotosChange={setGalleryPhotos}
/>
```

### AnimalDataTable

A searchable and filterable data table for managing animal records.

**Features:**

- Real-time search by name or location
- Filter by animal type (dog/cat)
- Filter by health status
- Sortable columns (name, age, created date)
- Inline actions (view, edit, delete)
- Responsive design
- Animal photo thumbnails

**Usage:**

```tsx
<AnimalDataTable
  animals={animalList}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isLoading={loading}
/>
```

### BulkUpload

A CSV bulk upload component for importing multiple animal records at once.

**Features:**

- CSV file drag-and-drop
- CSV parsing and validation
- Progress tracking
- Success/failure reporting
- Error details for failed imports
- Format instructions

**CSV Format:**

```csv
name,type,age,breed,area,latitude,longitude,status,feeder,pack_id
Max,dog,3,Labrador,Main Building,29.8543,77.8880,healthy,John Doe,pack-1
```

**Required Columns:**

- name
- type (dog/cat)
- age
- area
- latitude
- longitude
- status (healthy/needs_attention/under_treatment)

**Optional Columns:**

- breed
- feeder (current feeder name)
- pack_id

**Usage:**

```tsx
<BulkUpload onComplete={handleComplete} onCancel={handleCancel} />
```

## Export Utilities

Located in `src/lib/utils/export.ts`:

### exportAnimalsToCSV

Exports animal data to CSV format for backup or reporting.

```tsx
import { exportAnimalsToCSV } from '@/lib/utils/export';

exportAnimalsToCSV(animals);
```

### exportAnimalsToJSON

Exports animal data to JSON format for backup or data transfer.

```tsx
import { exportAnimalsToJSON } from '@/lib/utils/export';

exportAnimalsToJSON(animals);
```

## Admin Animals Page

The main admin animals management page (`/admin/animals`) combines all components:

**Features:**

- Create new animal profiles
- Edit existing animals
- Delete animals with confirmation
- Bulk upload via CSV
- Export data (CSV/JSON)
- Search and filter animals
- Responsive layout

**Access:**

- Requires admin role
- Protected by ProtectedRoute component
- Accessible from main admin panel

## Integration

The admin components integrate with:

- **Appwrite Database**: Animal CRUD operations via `src/lib/db/animals.ts`
- **Appwrite Storage**: Photo uploads via `src/lib/storage/index.ts`
- **Validation**: Zod schemas in `src/lib/validations/animal.ts`
- **Auth**: Role-based access control via `ProtectedRoute`

## Requirements Fulfilled

This implementation fulfills Requirements 6.1-6.5:

- ✅ 6.1: Administrative interface for creating new Animal_Profiles
- ✅ 6.2: Edit existing Animal_Profile information including photos
- ✅ 6.3: Bulk upload and editing of animal data
- ✅ 6.4: Validate animal data entries for completeness and accuracy
- ✅ 6.5: Search and filter capabilities for managing large animal databases
