# Appwrite Database and Storage Setup Guide

This guide will help you set up the required database collections and storage buckets in Appwrite.

## Prerequisites

- Appwrite instance running (via Docker or cloud)
- Appwrite Console access
- Project created in Appwrite

## Database Setup

### 1. Create Database

1. Go to Appwrite Console → Databases
2. Click "Create Database"
3. Name: `ccf-database`
4. Database ID: `ccf-database`

### 2. Create Collections

#### Animals Collection

- **Collection ID**: `animals`
- **Name**: Animals

**Attributes:**

- `name` (String, 100 chars, required)
- `type` (Enum: ['dog', 'cat'], required)
- `age` (Integer, required)
- `breed` (String, 100 chars, optional)
- `location` (JSON, required) - Structure: `{ area: string, coordinates: [number, number] }`
- `currentFeeder` (String, optional)
- `medicalHistory` (String[], required, array)
- `photos` (JSON, required) - Structure: `{ profile: string, gallery: string[] }`
- `packId` (String, optional)
- `status` (Enum: ['healthy', 'needs_attention', 'under_treatment'], required)

**Indexes:**

- `name_idx` on `name` (fulltext)
- `type_idx` on `type` (key)
- `status_idx` on `status` (key)
- `packId_idx` on `packId` (key)

**Permissions:**

- Read: Any
- Create: Team:volunteers, Team:admins
- Update: Team:volunteers, Team:admins
- Delete: Team:admins

#### Territories Collection

- **Collection ID**: `territories`
- **Name**: Territories

**Attributes:**

- `name` (String, 100 chars, required)
- `boundaries` (JSON, required) - Array of coordinate pairs
- `packSize` (Integer, required)
- `animals` (String[], required, array)
- `assignedVolunteers` (String[], required, array)

**Indexes:**

- `name_idx` on `name` (key)

**Permissions:**

- Read: Team:volunteers, Team:admins
- Create: Team:admins
- Update: Team:volunteers, Team:admins
- Delete: Team:admins

#### Tasks Collection

- **Collection ID**: `tasks`
- **Name**: Tasks

**Attributes:**

- `type` (Enum: ['feeding', 'medical', 'maintenance'], required)
- `title` (String, 200 chars, required)
- `description` (String, 1000 chars, required)
- `assignedTo` (String, required)
- `animalId` (String, optional)
- `territoryId` (String, optional)
- `scheduledDate` (DateTime, required)
- `completed` (Boolean, required, default: false)
- `completedAt` (DateTime, optional)
- `priority` (Enum: ['low', 'medium', 'high', 'urgent'], required)

**Indexes:**

- `assignedTo_idx` on `assignedTo` (key)
- `scheduledDate_idx` on `scheduledDate` (key)
- `completed_idx` on `completed` (key)
- `priority_idx` on `priority` (key)
- `animalId_idx` on `animalId` (key)
- `territoryId_idx` on `territoryId` (key)

**Permissions:**

- Read: Team:volunteers, Team:admins
- Create: Team:volunteers, Team:admins
- Update: Team:volunteers, Team:admins
- Delete: Team:volunteers, Team:admins

#### Medical Records Collection

- **Collection ID**: `medical-records`
- **Name**: Medical Records

**Attributes:**

- `animalId` (String, required)
- `date` (DateTime, required)
- `type` (Enum: ['checkup', 'vaccination', 'treatment', 'emergency'], required)
- `description` (String, 2000 chars, required)
- `veterinarian` (String, 200 chars, optional)
- `medications` (String[], optional, array)
- `documents` (String[], required, array)
- `followUpRequired` (Boolean, required)
- `followUpDate` (DateTime, optional)

**Indexes:**

- `animalId_idx` on `animalId` (key)
- `date_idx` on `date` (key)
- `type_idx` on `type` (key)
- `followUpRequired_idx` on `followUpRequired` (key)

**Permissions:**

- Read: Team:volunteers, Team:admins
- Create: Team:volunteers, Team:admins
- Update: Team:volunteers, Team:admins
- Delete: Team:admins

## Storage Setup

### 1. Create Storage Buckets

#### Animal Photos Bucket

- **Bucket ID**: `animal-photos`
- **Name**: Animal Photos
- **Permissions**:
  - Read: Any
  - Create: Team:volunteers, Team:admins
  - Update: Team:volunteers, Team:admins
  - Delete: Team:admins
- **File Security**: Enabled
- **Maximum File Size**: 10 MB
- **Allowed File Extensions**: jpg, jpeg, png, webp
- **Compression**: Enabled (for images)
- **Encryption**: Enabled

#### Medical Documents Bucket

- **Bucket ID**: `medical-documents`
- **Name**: Medical Documents
- **Permissions**:
  - Read: Team:volunteers, Team:admins
  - Create: Team:volunteers, Team:admins
  - Update: Team:volunteers, Team:admins
  - Delete: Team:admins
- **File Security**: Enabled
- **Maximum File Size**: 10 MB
- **Allowed File Extensions**: jpg, jpeg, png, webp, pdf, doc, docx
- **Encryption**: Enabled

## Teams Setup

Make sure you have created the following teams in Appwrite:

1. **Volunteers Team**
   - Team ID: `volunteers`
   - Members: All volunteer users

2. **Admins Team**
   - Team ID: `admins`
   - Members: Administrator users

## Environment Variables

After creating the database and collections, update your `.env.local` file with the correct IDs:

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=ccf-database
NEXT_PUBLIC_APPWRITE_COLLECTION_ANIMALS=animals
NEXT_PUBLIC_APPWRITE_COLLECTION_TERRITORIES=territories
NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS=tasks
NEXT_PUBLIC_APPWRITE_COLLECTION_MEDICAL_RECORDS=medical-records
NEXT_PUBLIC_APPWRITE_BUCKET_ANIMAL_PHOTOS=animal-photos
NEXT_PUBLIC_APPWRITE_BUCKET_MEDICAL_DOCUMENTS=medical-documents
```

## Verification

To verify your setup:

1. Check that all collections are created with the correct attributes
2. Verify that indexes are created for better query performance
3. Confirm that permissions are set correctly for each collection and bucket
4. Test creating a document in each collection through the Appwrite Console
5. Test uploading a file to each storage bucket

## Notes

- JSON attributes in Appwrite store complex data structures
- DateTime attributes store ISO 8601 formatted date strings
- Array attributes can store multiple values of the same type
- Permissions use the format: `read("any")`, `write("team:volunteers")`, etc.
