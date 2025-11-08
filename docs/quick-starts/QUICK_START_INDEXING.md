# Quick Start: Database Indexing

This is a quick reference guide for setting up database indexes in the CCF Animal Welfare application.

## TL;DR

```bash
# 1. View required indexes
npx tsx src/lib/setup/create-indexes.ts

# 2. Create indexes in Appwrite Console or using CLI commands from output

# 3. Done! Your queries are now optimized.
```

## Why Do I Need Indexes?

Without indexes, queries slow down as your database grows. With proper indexes:
- Queries run 10-100x faster
- Consistent performance regardless of data size
- Better user experience

## What Indexes Are Needed?

20 indexes across 6 collections:
- **Animals**: 4 indexes (type/status filtering, pack queries, name search)
- **Tasks**: 5 indexes (volunteer queries, priority sorting, date ranges)
- **Medical Records**: 4 indexes (animal history, follow-ups, type filtering)
- **Notifications**: 4 indexes (user notifications, read status, cleanup)
- **Territories**: 2 indexes (volunteer assignments, heatmap data)
- **Notification Preferences**: 1 index (user lookup)

## How to Create Indexes

### Option 1: Appwrite Console (5 minutes per collection)

1. Open Appwrite Console → Database → Select Collection
2. Click "Indexes" tab → "Create Index"
3. Run: `npx tsx src/lib/setup/create-indexes.ts`
4. Copy index details from output
5. Fill in the form and save
6. Repeat for all indexes

### Option 2: Appwrite CLI (Automated)

```bash
# Install CLI
npm install -g appwrite-cli

# Login
appwrite login

# Run script to get commands
npx tsx src/lib/setup/create-indexes.ts

# Copy and run the CLI commands from output
```

## Verify Indexes Are Working

After creating indexes, check query performance:

```typescript
const startTime = performance.now();
const result = await getAnimals({ type: 'dog', status: 'needs_attention' });
const endTime = performance.now();

console.log(`Query took ${endTime - startTime}ms`);
// Should be < 100ms for simple queries
```

## Common Issues

### "Query is slow even with indexes"
- Check filter order matches index order
- Verify index was created successfully in Console
- Ensure you're using the optimized query functions

### "Index creation failed"
- Verify collection exists
- Check attribute names match exactly
- Ensure you have admin permissions

### "Breaking changes in my code"
Query functions now return `{ items, total, pagination }` instead of just an array.

**Fix:**
```typescript
// Old
const animals = await getAnimals({ type: 'dog' });

// New
const { animals } = await getAnimals({ type: 'dog' });
```

## Need More Details?

- **Full documentation**: `docs/QUERY_OPTIMIZATION.md`
- **Setup guide**: `src/lib/setup/README.md`
- **Index reference**: `src/lib/db/INDEXING_GUIDE.md`

## Performance Targets

| Query Type | Target Time |
|------------|-------------|
| Simple (1-2 filters) | < 100ms |
| Complex (3+ filters) | < 300ms |
| Full-text search | < 500ms |

If queries exceed these targets, check your indexes!
