# Quick Start: Admin Animal Database Management

This guide will help you get started with the administrative animal database management interface.

## Overview

The admin animal management system provides:

- Create, read, update, and delete animal profiles
- Photo management (profile and gallery photos)
- Bulk upload via CSV
- Search and filter capabilities
- Data export (CSV/JSON)

## Prerequisites

- Admin role assigned in Appwrite
- Logged in to the application
- Appwrite Storage bucket configured

## Accessing the Admin Panel

1. Log in with an admin account
2. Navigate to `/admin/animals` or click "Admin Panel" from the dashboard
3. You'll see the animal management interface

## Creating a New Animal

### Step 1: Open Create Dialog

Click the "Add New Animal" button in the top right

### Step 2: Fill in Basic Information

**Required Fields:**

- **Name**: Animal's name
- **Type**: Dog or Cat
- **Age**: Age in years
- **Location Area**: Campus area (e.g., "Main Gate", "Library")
- **Latitude**: GPS latitude coordinate
- **Longitude**: GPS longitude coordinate

**Optional Fields:**

- **Breed**: Animal breed
- **Status**: Health status (Healthy, Needs Attention, Under Treatment)
- **Current Feeder**: Name of primary caretaker
- **Pack ID**: Associated pack identifier

### Step 3: Upload Photos

1. Switch to the "Photos" tab
2. Drag and drop photos or click to browse
3. Upload multiple photos at once
4. Click "Set as Profile" on the main photo
5. Other photos will be added to the gallery

### Step 4: Save

Click "Create Animal" to save the profile

## Editing an Existing Animal

1. Find the animal in the table
2. Click the "Edit" button (pencil icon)
3. Update the information in the dialog
4. Manage photos in the Photos tab
5. Click "Update Animal" to save changes

## Deleting an Animal

1. Find the animal in the table
2. Click the "Delete" button (trash icon)
3. Confirm the deletion in the dialog
4. The animal will be permanently removed

## Bulk Upload via CSV

### Step 1: Prepare CSV File

Create a CSV file with the following format:

```csv
name,type,age,breed,area,latitude,longitude,status,feeder,pack_id
Max,dog,3,Labrador,Main Gate,29.8543,77.8880,healthy,John Doe,pack_001
Bella,cat,2,Persian,Library,29.8550,77.8890,healthy,Jane Smith,
```

**Required Columns:**

- name
- type (dog or cat)
- age
- area
- latitude
- longitude

**Optional Columns:**

- breed
- status (healthy, needs_attention, under_treatment)
- feeder
- pack_id

### Step 2: Upload CSV

1. Click "Bulk Upload" button
2. Drag and drop your CSV file or click to browse
3. Review the preview
4. Click "Upload Animals"
5. Wait for processing to complete
6. Review success/failure report

### Tips for Bulk Upload

- Ensure all required fields are present
- Use consistent formatting
- Check coordinates are valid
- Keep file size reasonable (< 1000 rows recommended)
- Review error messages for failed imports

## Searching and Filtering

### Search

Use the search box to find animals by:

- Name
- Location area

The search updates in real-time as you type.

### Filter by Type

Click the type filter dropdown to show:

- All animals
- Dogs only
- Cats only

### Filter by Status

Click the status filter dropdown to show:

- All statuses
- Healthy
- Needs Attention
- Under Treatment

### Sorting

Click column headers to sort by:

- Name (alphabetical)
- Age (numerical)
- Created Date (chronological)

## Exporting Data

### Export to CSV

1. Click "Export" button
2. Select "Export as CSV"
3. File will download automatically
4. Filename format: `animals_export_YYYY-MM-DD.csv`

### Export to JSON

1. Click "Export" button
2. Select "Export as JSON"
3. File will download automatically
4. Filename format: `animals_export_YYYY-MM-DD.json`

## Photo Management

### Uploading Photos

- Supported formats: JPG, PNG, GIF
- Maximum file size: 10MB per photo
- Multiple photos can be uploaded at once
- Photos are automatically optimized

### Setting Profile Photo

1. Hover over a photo in the gallery
2. Click "Set as Profile"
3. The photo becomes the main profile image

### Removing Photos

1. Hover over a photo
2. Click the "Remove" button (X icon)
3. Photo is deleted from storage

## Data Table Features

### Animal Cards

Each row shows:

- Profile photo thumbnail
- Name and type
- Age
- Location
- Status badge (color-coded)
- Action buttons

### Status Colors

- **Green**: Healthy
- **Yellow**: Needs Attention
- **Red**: Under Treatment

### Pagination

- Results are paginated automatically
- Shows total count
- Navigate between pages if needed

## Best Practices

### Data Entry

- Use consistent naming conventions
- Always include location coordinates
- Update status regularly
- Add detailed breed information when known
- Assign feeders for accountability

### Photo Management

- Upload clear, well-lit photos
- Choose a good profile photo
- Include multiple angles in gallery
- Remove blurry or duplicate photos
- Update photos regularly

### Bulk Operations

- Test with small CSV first
- Backup data before bulk operations
- Review error reports carefully
- Fix issues and re-upload failed rows

## Troubleshooting

### "Failed to create animal"

- Check all required fields are filled
- Verify coordinates are valid numbers
- Ensure type is either "dog" or "cat"
- Check network connection

### Photo Upload Fails

- Check file size (must be < 10MB)
- Verify file format (JPG, PNG, GIF only)
- Check storage bucket permissions
- Try uploading one photo at a time

### CSV Upload Errors

- Verify CSV format matches template
- Check for special characters in data
- Ensure coordinates are numbers
- Review error messages for specific issues

### Search Not Working

- Clear search box and try again
- Check spelling
- Try filtering instead
- Refresh the page

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Focus search box
- `Esc`: Close dialogs
- `Enter`: Submit forms

## Next Steps

- [Medical Records Management](./QUICK_START_MEDICAL.md)
- [Task Management](./QUICK_START_TASKS.md)
- [Territory Mapping](./QUICK_START_TERRITORIES.md)

## Additional Resources

- [Admin Component Documentation](../src/components/features/admin/README.md)
- [Animal Data Models](../src/types/animal.ts)
- [Database Operations](../src/lib/db/animals.ts)
