# Appwrite Database Indexing Guide

This document outlines the required indexes for optimal query performance in the CCF Animal Welfare application.

## Overview

Proper indexing is crucial for query performance, especially as the database grows. This guide provides specific index configurations for each collection in Appwrite.

**Note**: All indexes described in this guide have been implemented in the codebase. To automatically create these indexes in your Appwrite instance, run:

```bash
npx tsx src/lib/setup/create-indexes.ts
```

For comprehensive query optimization documentation, see: `docs/QUERY_OPTIMIZATION.md`

## How to Create Indexes in Appwrite

1. Navigate to your Appwrite Console
2. Select your database (ccf-database)
3. Select the collection you want to index
4. Go to the "Indexes" tab
5. Click "Create Index"
6. Configure the index according to the specifications below

## Collection: Animals

### Index 1: type_status

- **Type**: Key
- **Attributes**: `type` (ASC), `status` (ASC)
- **Purpose**: Optimize filtering by animal type and status
- **Used by**: `getAnimals()` with type and status filters

### Index 2: packId

- **Type**: Key
- **Attributes**: `packId` (ASC)
- **Purpose**: Optimize queries for animals in a specific pack
- **Used by**: `getAnimals()` with packId filter

### Index 3: status_createdAt

- **Type**: Key
- **Attributes**: `status` (ASC), `$createdAt` (DESC)
- **Purpose**: Optimize queries for animals needing attention, sorted by creation date
- **Used by**: Admin dashboard, medical alerts

### Index 4: name_fulltext

- **Type**: Fulltext
- **Attributes**: `name`
- **Purpose**: Enable fast text search on animal names
- **Used by**: `searchAnimalsByName()`

## Collection: Territories

### Index 1: assignedVolunteers

- **Type**: Key
- **Attributes**: `assignedVolunteers` (ASC)
- **Purpose**: Optimize queries for territories by volunteer
- **Used by**: `getTerritoriesByVolunteer()`

### Index 2: packSize_updatedAt

- **Type**: Key
- **Attributes**: `packSize` (DESC), `$updatedAt` (DESC)
- **Purpose**: Optimize queries for territories by pack size
- **Used by**: Territory heatmap visualization

## Collection: Tasks

### Index 1: assignedTo_completed_scheduledDate

- **Type**: Key
- **Attributes**: `assignedTo` (ASC), `completed` (ASC), `scheduledDate` (ASC)
- **Purpose**: Optimize volunteer task queries with completion status and date range
- **Used by**: `getTasks()`, `getUpcomingTasks()`, volunteer dashboard

### Index 2: type_priority_scheduledDate

- **Type**: Key
- **Attributes**: `type` (ASC), `priority` (DESC), `scheduledDate` (ASC)
- **Purpose**: Optimize task queries by type and priority
- **Used by**: Task management, priority sorting

### Index 3: animalId_completed

- **Type**: Key
- **Attributes**: `animalId` (ASC), `completed` (ASC)
- **Purpose**: Optimize queries for tasks related to specific animals
- **Used by**: Animal detail pages

### Index 4: territoryId_scheduledDate

- **Type**: Key
- **Attributes**: `territoryId` (ASC), `scheduledDate` (ASC)
- **Purpose**: Optimize queries for tasks in specific territories
- **Used by**: Territory management

### Index 5: completed_scheduledDate

- **Type**: Key
- **Attributes**: `completed` (ASC), `scheduledDate` (ASC)
- **Purpose**: Optimize queries for incomplete tasks by date
- **Used by**: Task reminders, overdue task detection

## Collection: Medical Records

### Index 1: animalId_date

- **Type**: Key
- **Attributes**: `animalId` (ASC), `date` (DESC)
- **Purpose**: Optimize medical history queries for specific animals
- **Used by**: `getAnimalMedicalHistory()`, animal detail pages

### Index 2: type_date

- **Type**: Key
- **Attributes**: `type` (ASC), `date` (DESC)
- **Purpose**: Optimize queries by medical record type
- **Used by**: Medical record filtering

### Index 3: followUpRequired_followUpDate

- **Type**: Key
- **Attributes**: `followUpRequired` (ASC), `followUpDate` (ASC)
- **Purpose**: Optimize queries for records requiring follow-up
- **Used by**: `getFollowUpRecords()`, medical alerts

### Index 4: animalId_type_date

- **Type**: Key
- **Attributes**: `animalId` (ASC), `type` (ASC), `date` (DESC)
- **Purpose**: Optimize queries for specific types of medical records for an animal
- **Used by**: Vaccination history, treatment history

## Collection: Notifications

### Index 1: recipientId_read_createdAt

- **Type**: Key
- **Attributes**: `recipientId` (ASC), `read` (ASC), `$createdAt` (DESC)
- **Purpose**: Optimize notification queries for users with read status
- **Used by**: `getUserNotifications()`, notification center

### Index 2: recipientId_type_createdAt

- **Type**: Key
- **Attributes**: `recipientId` (ASC), `type` (ASC), `$createdAt` (DESC)
- **Purpose**: Optimize notification queries by type
- **Used by**: Filtered notification views

### Index 3: recipientId_priority_read

- **Type**: Key
- **Attributes**: `recipientId` (ASC), `priority` (DESC), `read` (ASC)
- **Purpose**: Optimize queries for high-priority unread notifications
- **Used by**: Notification center, urgent alerts

### Index 4: expiresAt

- **Type**: Key
- **Attributes**: `expiresAt` (ASC)
- **Purpose**: Optimize cleanup of expired notifications
- **Used by**: `deleteExpiredNotifications()`

## Collection: Notification Preferences

### Index 1: userId

- **Type**: Unique Key
- **Attributes**: `userId` (ASC)
- **Purpose**: Ensure one preference record per user and optimize lookups
- **Used by**: `getNotificationPreferences()`

## Performance Best Practices

### 1. Query Limits

- Always specify a limit for list queries to prevent fetching excessive data
- Default limit: 25 items for list views
- Maximum limit: 100 items per query

### 2. Pagination

- Use offset-based pagination for small to medium datasets
- Consider cursor-based pagination for large datasets (using document IDs)

### 3. Query Ordering

- Order queries should match index order for optimal performance
- Avoid ordering by non-indexed fields

### 4. Compound Queries

- Design indexes to match your most common query patterns
- Place equality filters before range filters in compound indexes

### 5. Monitoring

- Monitor query performance in Appwrite Console
- Review slow queries and add indexes as needed
- Regularly review and optimize based on actual usage patterns

## Index Maintenance

### When to Add New Indexes

- When introducing new query patterns
- When experiencing slow query performance
- When adding new filtering or sorting options

### When to Remove Indexes

- When query patterns change and indexes are no longer used
- To reduce write overhead if an index provides minimal benefit

### Index Size Considerations

- Each index increases write time and storage
- Balance query performance with write performance
- Prioritize indexes for read-heavy operations

## Testing Index Performance

After creating indexes, test query performance:

```typescript
// Example: Test query performance
const startTime = performance.now();
const results = await getAnimals({ type: 'dog', status: 'needs_attention' });
const endTime = performance.now();
console.log(`Query took ${endTime - startTime}ms`);
```

Target query times:

- Simple queries: < 100ms
- Complex queries: < 300ms
- Full-text search: < 500ms

## Troubleshooting

### Slow Queries

1. Check if appropriate indexes exist
2. Verify index order matches query order
3. Review query complexity and simplify if possible
4. Consider breaking complex queries into multiple simpler queries

### High Write Latency

1. Review number of indexes on collection
2. Remove unused indexes
3. Consider batch operations for bulk writes

### Index Not Being Used

1. Verify index attributes match query attributes exactly
2. Check attribute order in compound indexes
3. Ensure query uses indexed fields in the correct order
