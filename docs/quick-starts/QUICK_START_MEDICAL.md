# Quick Start: Medical Records Management

This guide will help you get started with the medical records management system.

## Overview

The medical records system provides:

- Digital health documentation for animals
- Medical history timeline
- File attachments (X-rays, reports, prescriptions)
- Medical alerts and reminders
- Follow-up tracking
- Veterinarian information

## Prerequisites

- Volunteer or Admin role
- Logged in to the application
- Animals already created in the database

## Accessing Medical Records

1. Navigate to `/medical` from the dashboard
2. Or click "Medical Records" in the navigation menu
3. You'll see the medical records management interface

## Creating a Medical Record

### Step 1: Open Create Form

Click the "Add Medical Record" button

### Step 2: Select Animal

Choose the animal from the dropdown list

### Step 3: Fill in Record Details

**Required Fields:**

- **Animal**: Select from dropdown
- **Type**: Checkup, Vaccination, Treatment, Surgery, Emergency, or Other
- **Date**: Date of medical event
- **Veterinarian**: Name of attending vet
- **Diagnosis**: Medical diagnosis or reason for visit

**Optional Fields:**

- **Treatment**: Treatment provided
- **Medications**: Prescribed medications with dosage
- **Notes**: Additional observations or instructions
- **Follow-up Date**: When to schedule next visit
- **Cost**: Medical expenses

### Step 4: Upload Files

1. Drag and drop files or click to browse
2. Supported formats: PDF, images (JPG, PNG)
3. Upload multiple files (X-rays, reports, prescriptions)
4. Files are stored securely in Appwrite Storage

### Step 5: Set Priority

Choose priority level:

- **Low**: Routine checkups
- **Medium**: Standard treatments
- **High**: Serious conditions
- **Urgent**: Emergencies requiring immediate attention

### Step 6: Save

Click "Create Record" to save the medical record

## Viewing Medical Records

### Medical History Timeline

- Records displayed in chronological order
- Most recent records at the top
- Visual timeline with date markers
- Color-coded by record type

### Record Details

Each record shows:

- Date and time
- Record type badge
- Animal name and photo
- Veterinarian name
- Diagnosis and treatment
- Medications prescribed
- Attached files
- Follow-up information
- Cost (if recorded)

### Filtering Records

**By Animal:**

- Select animal from dropdown
- View all records for that animal
- See complete medical history

**By Type:**

- Filter by record type
- Focus on specific medical events
- Track vaccination schedules

**By Date Range:**

- Select start and end dates
- View records within timeframe
- Generate reports for specific periods

## Medical Alerts

### Alert Banner

- Displays at top of page
- Shows animals needing attention
- Color-coded by urgency
- Click to view details

### Alert Types

**Urgent Medical Attention**

- Animals with urgent priority records
- Requires immediate action
- Red alert banner

**Follow-up Required**

- Animals with upcoming follow-up dates
- Within next 7 days
- Yellow alert banner

**Overdue Follow-ups**

- Missed follow-up appointments
- Requires rescheduling
- Orange alert banner

## File Management

### Uploading Files

- Drag and drop into upload zone
- Or click to browse files
- Multiple files supported
- Progress indicator during upload

### Viewing Files

- Click file name to download
- Preview images inline
- PDFs open in new tab
- Organized by record

### File Types

**Supported Formats:**

- PDF documents
- JPEG/JPG images
- PNG images
- Maximum 10MB per file

**Common File Types:**

- X-ray images
- Lab reports
- Prescriptions
- Vaccination certificates
- Surgery reports

## Editing Medical Records

1. Find the record in the timeline
2. Click the "Edit" button
3. Update information in the form
4. Add or remove files
5. Click "Update Record" to save

## Deleting Medical Records

1. Find the record in the timeline
2. Click the "Delete" button
3. Confirm deletion in the dialog
4. Record and associated files are permanently removed

## Medical Record Types

### Checkup

- Routine health examinations
- Wellness visits
- Regular monitoring

### Vaccination

- Immunization records
- Vaccine schedules
- Booster shots

### Treatment

- Medical treatments
- Ongoing care
- Medication administration

### Surgery

- Surgical procedures
- Pre/post-operative care
- Recovery tracking

### Emergency

- Urgent medical situations
- Accidents or injuries
- Critical care

### Other

- Miscellaneous medical events
- Special procedures
- Unique situations

## Follow-up Management

### Setting Follow-ups

1. When creating/editing a record
2. Set "Follow-up Date" field
3. System creates automatic reminder
4. Notification sent before due date

### Tracking Follow-ups

- View upcoming follow-ups in alert banner
- Filter records by follow-up status
- Mark as completed when done
- Reschedule if needed

### Follow-up Notifications

- Sent 3 days before due date
- Email and in-app notification
- Includes animal name and details
- Click to view medical record

## Cost Tracking

### Recording Costs

- Enter cost when creating record
- Include all medical expenses
- Track spending per animal
- Generate cost reports

### Cost Analysis

- View total costs per animal
- Track expenses over time
- Budget planning
- Donor reporting

## Best Practices

### Data Entry

- Record medical events promptly
- Include detailed diagnoses
- Document all medications with dosages
- Upload supporting documents
- Set appropriate priority levels

### File Organization

- Name files descriptively
- Upload all relevant documents
- Keep files under 10MB
- Use PDFs for text documents
- Use images for X-rays/photos

### Follow-up Management

- Always set follow-up dates
- Review alerts daily
- Update records after follow-ups
- Reschedule if appointments change

### Communication

- Share records with veterinarians
- Coordinate with other volunteers
- Update team on urgent situations
- Document all communications

## Troubleshooting

### "Failed to create record"

- Check all required fields are filled
- Verify animal is selected
- Ensure date is valid
- Check network connection

### File Upload Fails

- Check file size (< 10MB)
- Verify file format
- Check storage permissions
- Try uploading one file at a time

### Can't Find Animal

- Ensure animal exists in database
- Check spelling
- Verify you have permissions
- Contact admin if needed

### Notifications Not Received

- Check notification preferences
- Verify follow-up date is set
- Ensure email is configured
- Review notification settings

## Keyboard Shortcuts

- `Ctrl/Cmd + N`: New medical record
- `Ctrl/Cmd + F`: Focus search
- `Esc`: Close dialogs
- `Enter`: Submit forms

## Mobile Usage

- Responsive design for tablets and phones
- Touch-friendly interface
- Optimized file upload
- Quick access to alerts

## Next Steps

- [Task Management](./QUICK_START_TASKS.md)
- [Notification System](./QUICK_START_NOTIFICATIONS.md)
- [Admin Dashboard](./QUICK_START_ADMIN_ANIMALS.md)

## Additional Resources

- [Medical Component Documentation](../src/components/features/medical/README.md)
- [Medical Data Models](../src/types/medical.ts)
- [Database Operations](../src/lib/db/medical.ts)
- [Validation Schemas](../src/lib/validations/medical.ts)
