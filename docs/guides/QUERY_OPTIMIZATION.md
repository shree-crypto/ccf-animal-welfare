# Query Optimization Guide

This document provides comprehensive information about database query optimization in the CCF Animal Welfare application.

## Overview

The application uses Appwrite as the backend database with carefully designed indexes and query patterns to ensure optimal performance as the database grows.

## Key Optimizations Implemented

### 1. Pagination

All list queries now include proper pagination with:

- **Default limit**: 25 items
- **Maximum limit**: 100 items per query
- **Offset-based pagination**: For navigating through large datasets
- **Pagination metadata**: Including total count, current page, and hasMore flag

### 2. Query Limits

Different query types have appropriate limits:

- Search results: 50 items
- Dashboard items: 10 items
- Notification batches: 20 items
- Medical history: 50 items
- Task lists: 25 items
- Animal gallery: 25 items
- Territory lists: 50 items

### 3. Compound Indexes

Indexes are designed to match common query patterns:

- Filters are applied in the order that matches index definitions
- Equality filters come before range filters
- Ordering matches index order for optimal performance

### 4. Query Result Structure

All query functions now return a consistent structure:

```typescript
{
  items: T[],           // The actual data
  total: number,        // Total count of matching items
  pagination: {         // Pagination metadata
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean,
    currentPage: number,
    totalPages: number
  }
}
```

## Index Configuration

### Animals Collection

| Index Name       | Type     | Attributes                      | Purpose                          |
| ---------------- | -------- | ------------------------------- | -------------------------------- |
| type_status      | Key      | type (ASC), status (ASC)        | Filter by animal type and status |
| packId           | Key      | packId (ASC)                    | Filter by pack                   |
| status_createdAt | Key      | status (ASC), $createdAt (DESC) | Medical alerts, sorted by date   |
| name_fulltext    | Fulltext | name                            | Text search on animal names      |

### Tasks Collection

| Index Name                         | Type | Attributes                                             | Purpose                              |
| ---------------------------------- | ---- | ------------------------------------------------------ | ------------------------------------ |
| assignedTo_completed_scheduledDate | Key  | assignedTo (ASC), completed (ASC), scheduledDate (ASC) | Volunteer task queries               |
| type_priority_scheduledDate        | Key  | type (ASC), priority (DESC), scheduledDate (ASC)       | Task management by type and priority |
| animalId_completed                 | Key  | animalId (ASC), completed (ASC)                        | Tasks for specific animals           |
| territoryId_scheduledDate          | Key  | territoryId (ASC), scheduledDate (ASC)                 | Territory task management            |
| completed_scheduledDate            | Key  | completed (ASC), scheduledDate (ASC)                   | Overdue task detection               |

### Medical Records Collection

| Index Name                    | Type | Attributes                                 | Purpose                           |
| ----------------------------- | ---- | ------------------------------------------ | --------------------------------- |
| animalId_date                 | Key  | animalId (ASC), date (DESC)                | Medical history for animals       |
| type_date                     | Key  | type (ASC), date (DESC)                    | Filter by record type             |
| followUpRequired_followUpDate | Key  | followUpRequired (ASC), followUpDate (ASC) | Follow-up reminders               |
| animalId_type_date            | Key  | animalId (ASC), type (ASC), date (DESC)    | Specific record types for animals |

### Notifications Collection

| Index Name                 | Type | Attributes                                       | Purpose                             |
| -------------------------- | ---- | ------------------------------------------------ | ----------------------------------- |
| recipientId_read_createdAt | Key  | recipientId (ASC), read (ASC), $createdAt (DESC) | User notifications with read status |
| recipientId_type_createdAt | Key  | recipientId (ASC), type (ASC), $createdAt (DESC) | Filter notifications by type        |
| recipientId_priority_read  | Key  | recipientId (ASC), priority (DESC), read (ASC)   | High-priority unread notifications  |
| expiresAt                  | Key  | expiresAt (ASC)                                  | Cleanup expired notifications       |

### Territories Collection

| Index Name         | Type | Attributes                         | Purpose                         |
| ------------------ | ---- | ---------------------------------- | ------------------------------- |
| assignedVolunteers | Key  | assignedVolunteers (ASC)           | Territories by volunteer        |
| packSize_updatedAt | Key  | packSize (DESC), $updatedAt (DESC) | Territory heatmap visualization |

### Notification Preferences Collection

| Index Name    | Type   | Attributes   | Purpose                        |
| ------------- | ------ | ------------ | ------------------------------ |
| userId_unique | Unique | userId (ASC) | One preference record per user |

## Setting Up Indexes

### Step 1: View Index Configurations

Run the index configuration script to see all required indexes:

```bash
npx tsx src/lib/setup/create-indexes.ts
```

This will display:

- All index configurations for each collection
- Appwrite CLI commands for automated creation
- Instructions for manual creation

### Step 2: Create Indexes

Choose one of these methods:

#### Method A: Appwrite Console (Recommended for beginners)

1. Navigate to Appwrite Console
2. Select your database (ccf-database)
3. For each collection, go to the "Indexes" tab
4. Click "Create Index" and fill in the details from the script output

#### Method B: Appwrite CLI (Recommended for automation)

1. Install Appwrite CLI: `npm install -g appwrite-cli`
2. Login: `appwrite login`
3. Copy and run the CLI commands from the script output

Example:

```bash
appwrite databases createIndex \
  --databaseId "ccf-database" \
  --collectionId "animals" \
  --key "type_status" \
  --type "key" \
  --attributes "type" "status" \
  --orders "ASC" "ASC"
```

## Query Best Practices

### 1. Always Use Pagination

```typescript
// Good
const result = await getAnimals({
  type: 'dog',
  limit: 25,
  offset: 0,
});

// Bad - fetches all records
const result = await getAnimals({ type: 'dog' });
```

### 2. Match Index Order

```typescript
// Good - matches assignedTo_completed_scheduledDate index
const tasks = await getTasks({
  assignedTo: userId,
  completed: false,
  startDate: '2024-01-01',
});

// Less optimal - doesn't match index order
const tasks = await getTasks({
  completed: false,
  type: 'feeding',
  assignedTo: userId,
});
```

### 3. Use Appropriate Limits

```typescript
// Good - uses appropriate limit for use case
const dashboardAnimals = await getAnimalsNeedingAttention({
  limit: QUERY_LIMITS.DASHBOARD_ITEMS, // 10 items
});

// Bad - fetches too many items for dashboard
const dashboardAnimals = await getAnimalsNeedingAttention({
  limit: 100,
});
```

### 4. Leverage Pagination Metadata

```typescript
const result = await getAnimals({ limit: 25, offset: 0 });

console.log(`Showing ${result.animals.length} of ${result.total} animals`);
console.log(
  `Page ${result.pagination.currentPage} of ${result.pagination.totalPages}`
);

if (result.pagination.hasMore) {
  // Load next page
  const nextPage = await getAnimals({ limit: 25, offset: 25 });
}
```

## Performance Monitoring

### Query Performance Targets

- Simple queries (single filter): < 100ms
- Complex queries (multiple filters): < 300ms
- Full-text search: < 500ms

### Monitoring Query Performance

```typescript
const startTime = performance.now();
const result = await getAnimals({ type: 'dog', status: 'needs_attention' });
const endTime = performance.now();

console.log(`Query took ${endTime - startTime}ms`);
```

### Troubleshooting Slow Queries

1. **Check if indexes exist**: Verify in Appwrite Console
2. **Verify filter order**: Ensure filters match index order
3. **Review query complexity**: Consider breaking into multiple queries
4. **Check result size**: Ensure appropriate limits are set

## Migration Guide

If you have existing code using the old query functions, update as follows:

### Animals

```typescript
// Old
const animals = await getAnimals({ type: 'dog' });
animals.forEach(animal => console.log(animal.name));

// New
const result = await getAnimals({ type: 'dog' });
result.animals.forEach(animal => console.log(animal.name));
console.log(`Total: ${result.total}`);
```

### Tasks

```typescript
// Old
const tasks = await getUpcomingTasks(userId, 7, 50);

// New
const result = await getUpcomingTasks(userId, 7, { limit: 50 });
const tasks = result.tasks;
```

### Medical Records

```typescript
// Old
const records = await getAnimalMedicalHistory(animalId);

// New
const result = await getAnimalMedicalHistory(animalId);
const records = result.records;
```

### Notifications

```typescript
// Old
const notifications = await getUserNotifications(userId, { read: false });

// New
const result = await getUserNotifications(userId, { read: false });
const notifications = result.notifications;
```

## Future Optimizations

### Potential Improvements

1. **Cursor-based pagination**: For very large datasets
2. **Query result caching**: Using React Query or similar
3. **Batch operations**: For bulk updates
4. **Read replicas**: For scaling read operations
5. **Materialized views**: For complex aggregations

### When to Add New Indexes

- New query patterns are introduced
- Slow query performance is detected
- New filtering or sorting options are added

### When to Remove Indexes

- Query patterns change and indexes are no longer used
- Write performance is impacted by too many indexes
- Storage costs become a concern

## Additional Resources

- [Appwrite Database Documentation](https://appwrite.io/docs/databases)
- [Appwrite Indexes Guide](https://appwrite.io/docs/databases#indexes)
- [Query Performance Best Practices](https://appwrite.io/docs/databases#performance)
