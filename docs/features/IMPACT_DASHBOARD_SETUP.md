# Impact Dashboard Setup Guide

This guide explains how to set up the Appwrite collections required for the Live Impact Dashboard feature.

## Collections Required

### 1. Impact Metrics Collection

**Collection ID**: `impact-metrics`

**Attributes**:

| Attribute           | Type     | Size | Required | Array | Default |
| ------------------- | -------- | ---- | -------- | ----- | ------- |
| animalsRescued      | JSON     | -    | Yes      | No    | -       |
| volunteersActive    | JSON     | -    | Yes      | No    | -       |
| mealsProvided       | JSON     | -    | Yes      | No    | -       |
| successfulAdoptions | JSON     | -    | Yes      | No    | -       |
| lastUpdated         | DateTime | -    | Yes      | No    | now()   |

**Indexes**:

| Key            | Type | Attributes | Orders |
| -------------- | ---- | ---------- | ------ |
| createdAt_desc | key  | $createdAt | DESC   |

**Permissions**:

- Read: Any (public can view metrics)
- Create: Team:admins
- Update: Team:admins
- Delete: Team:admins

### 2. Recent Activities Collection

**Collection ID**: `recent-activities`

**Attributes**:

| Attribute   | Type          | Size | Required | Array | Default |
| ----------- | ------------- | ---- | -------- | ----- | ------- |
| type        | String (enum) | 20   | Yes      | No    | -       |
| displayName | String        | 50   | Yes      | No    | -       |
| timestamp   | DateTime      | -    | Yes      | No    | now()   |
| message     | String        | 200  | No       | No    | -       |

**Enum values for `type`**: donation, adoption, volunteer, rescue

**Indexes**:

| Key            | Type | Attributes      | Orders    |
| -------------- | ---- | --------------- | --------- |
| timestamp_desc | key  | timestamp       | DESC      |
| type_timestamp | key  | type, timestamp | ASC, DESC |

**Permissions**:

- Read: Any (public can view activities)
- Create: Team:volunteers, Team:admins
- Update: Team:admins
- Delete: Team:admins

## Setup Instructions

### Using Appwrite Console

1. **Navigate to your Appwrite Console**
   - Go to your Appwrite instance
   - Select your project
   - Navigate to Databases → ccf-database

2. **Create Impact Metrics Collection**
   - Click "Add Collection"
   - Collection ID: `impact-metrics`
   - Add attributes as specified above
   - Create the index
   - Set permissions

3. **Create Recent Activities Collection**
   - Click "Add Collection"
   - Collection ID: `recent-activities`
   - Add attributes as specified above
   - Create indexes
   - Set permissions

### Using Appwrite CLI

```bash
# Create Impact Metrics Collection
appwrite databases createCollection \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --name "Impact Metrics" \
  --permissions 'read("any")' 'create("team:admins")' 'update("team:admins")' 'delete("team:admins")'

# Add attributes to Impact Metrics
appwrite databases createJsonAttribute \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --key animalsRescued \
  --required true

appwrite databases createJsonAttribute \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --key volunteersActive \
  --required true

appwrite databases createJsonAttribute \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --key mealsProvided \
  --required true

appwrite databases createJsonAttribute \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --key successfulAdoptions \
  --required true

appwrite databases createDatetimeAttribute \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --key lastUpdated \
  --required true

# Create index
appwrite databases createIndex \
  --databaseId ccf-database \
  --collectionId impact-metrics \
  --key createdAt_desc \
  --type key \
  --attributes '$createdAt' \
  --orders DESC

# Create Recent Activities Collection
appwrite databases createCollection \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --name "Recent Activities" \
  --permissions 'read("any")' 'create("team:volunteers")' 'create("team:admins")' 'update("team:admins")' 'delete("team:admins")'

# Add attributes to Recent Activities
appwrite databases createEnumAttribute \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --key type \
  --elements 'donation,adoption,volunteer,rescue' \
  --required true

appwrite databases createStringAttribute \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --key displayName \
  --size 50 \
  --required true

appwrite databases createDatetimeAttribute \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --key timestamp \
  --required true

appwrite databases createStringAttribute \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --key message \
  --size 200 \
  --required false

# Create indexes
appwrite databases createIndex \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --key timestamp_desc \
  --type key \
  --attributes 'timestamp' \
  --orders DESC

appwrite databases createIndex \
  --databaseId ccf-database \
  --collectionId recent-activities \
  --key type_timestamp \
  --type key \
  --attributes 'type,timestamp' \
  --orders 'ASC,DESC'
```

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_APPWRITE_COLLECTION_IMPACT_METRICS=impact-metrics
NEXT_PUBLIC_APPWRITE_COLLECTION_RECENT_ACTIVITIES=recent-activities
```

## Initial Data Seeding

After creating the collections, you can seed initial data:

```typescript
import { createImpactMetrics, createRecentActivity } from '@/lib/db/impact';

// Create initial metrics
await createImpactMetrics({
  animalsRescued: {
    total: 0,
    current: 0,
    trend: 'stable',
  },
  volunteersActive: {
    total: 0,
    current: 0,
    trend: 'stable',
  },
  mealsProvided: {
    total: 0,
    current: 0,
    trend: 'stable',
  },
  successfulAdoptions: {
    total: 0,
    current: 0,
    trend: 'stable',
  },
});
```

## Real-time Subscriptions

The dashboard uses Appwrite Realtime to automatically update metrics. The subscription channel is:

```typescript
`databases.${DATABASE_ID}.collections.${COLLECTIONS.IMPACT_METRICS}.documents`;
```

Ensure your Appwrite instance has Realtime enabled and properly configured.

## Testing

Use the mock data provided in `src/lib/mock-data/impact.ts` for development and testing before connecting to the actual Appwrite backend.

## Troubleshooting

### Metrics not updating

- Check Appwrite Realtime is enabled
- Verify collection permissions
- Check browser console for errors

### Activities not showing

- Verify recent-activities collection exists
- Check permissions allow public read
- Ensure activities are being created with proper timestamps

### Performance issues

- Ensure indexes are created
- Check query limits in `query-config.ts`
- Consider implementing caching for frequently accessed metrics
