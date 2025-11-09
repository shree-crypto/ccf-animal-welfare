# Database Setup Scripts

This directory contains scripts for setting up and configuring the Appwrite database.

## Index Creation Script

### Purpose

The `create-indexes.ts` script automatically creates all required database indexes for optimal query performance.

### Prerequisites

1. Appwrite instance must be running
2. Database and collections must be created
3. Admin API key must be available

### Usage

#### Run the Script

```bash
npx tsx src/lib/setup/create-indexes.ts
```

### What It Does

The script will:

1. Display all required index configurations
2. Show detailed information for each collection
3. Generate Appwrite CLI commands for automated creation
4. Provide instructions for manual creation in Appwrite Console

**Note**: The script does not automatically create indexes. You must create them manually using one of these methods:

- Appwrite Console (Web UI)
- Appwrite CLI (Command line)
- Appwrite REST API

### Expected Output

```
================================================================================
APPWRITE DATABASE INDEX CONFIGURATIONS
================================================================================

These indexes must be created manually in the Appwrite Console.
Navigate to: Database > [Collection] > Indexes > Create Index

────────────────────────────────────────────────────────────────────────────────
Collection: animals
────────────────────────────────────────────────────────────────────────────────

1. Index: type_status
   Type: key
   Attributes: type, status
   Orders: ASC, ASC

2. Index: packId
   Type: key
   Attributes: packId
   Orders: ASC
...

================================================================================
TOTAL INDEXES TO CREATE
================================================================================

Total: 20 indexes across 6 collections
```

### Creating Indexes

#### Method 1: Appwrite Console (Recommended for beginners)

1. Navigate to your Appwrite Console
2. Select your database (ccf-database)
3. Select a collection
4. Go to the "Indexes" tab
5. Click "Create Index"
6. Fill in the details from the script output
7. Repeat for all indexes

#### Method 2: Appwrite CLI (Recommended for automation)

1. Install Appwrite CLI: `npm install -g appwrite-cli`
2. Login: `appwrite login`
3. Run the generated commands from the script output

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

### Troubleshooting

#### Index Creation Fails

**Solution**:

- Verify the collection exists
- Check attribute names match your schema
- Ensure you have admin permissions

#### Index Already Exists

**Note**: If an index already exists, you can skip it or delete and recreate it.

### Index Configuration

All index configurations are defined in the script. To modify indexes:

1. Edit the `indexConfigs` object in `create-indexes.ts`
2. Run the script to apply changes
3. Update the documentation in `src/lib/db/INDEXING_GUIDE.md`

### Verifying Indexes

After running the script, verify indexes in Appwrite Console:

1. Navigate to your Appwrite Console
2. Select your database (ccf-database)
3. Select a collection
4. Go to the "Indexes" tab
5. Verify all indexes are listed

### Performance Impact

Creating indexes:

- **During creation**: May cause temporary performance impact
- **After creation**: Significantly improves query performance
- **Write operations**: Slight overhead due to index maintenance
- **Read operations**: Dramatic performance improvement

### Best Practices

1. **Run during low traffic**: Create indexes during maintenance windows
2. **Monitor performance**: Check query performance before and after
3. **Regular maintenance**: Review and update indexes as query patterns change
4. **Document changes**: Update INDEXING_GUIDE.md when modifying indexes

## Other Setup Scripts

### Database Initialization

(To be implemented)

### Seed Data

See `seed-territories.ts` for territory data seeding.

## Related Documentation

- [Indexing Guide](../db/INDEXING_GUIDE.md) - Detailed index documentation
- [Query Optimization](../../../docs/QUERY_OPTIMIZATION.md) - Query best practices
- [Appwrite Indexes](https://appwrite.io/docs/databases#indexes) - Official documentation
