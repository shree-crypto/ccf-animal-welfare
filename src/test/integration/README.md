# Appwrite Integration Tests

This directory contains integration tests for Appwrite operations including database CRUD, permissions, and file storage.

## Prerequisites

Before running integration tests, ensure you have:

1. **Local Appwrite Instance Running**
   ```bash
   docker-compose up -d
   ```

2. **Environment Variables Configured**
   - Copy `.env.local.example` to `.env.local`
   - Ensure Appwrite endpoint and project ID are set correctly

3. **Database and Collections Set Up**
   - Run the database setup script to create collections and indexes:
   ```bash
   npm run dev
   # Navigate to http://localhost:3000 and follow setup instructions
   ```
   - Or manually create collections using the Appwrite console

## Running Tests

### Run All Integration Tests
```bash
npm test -- src/test/integration
```

### Run Specific Test File
```bash
npx vitest run src/test/integration/appwrite.test.ts
```

### Run Tests in Watch Mode
```bash
npx vitest src/test/integration/appwrite.test.ts
```

## Test Coverage

### Database CRUD Operations
- **Animal Documents**: Create, read, update, delete, and list operations
- **Task Documents**: Create, update completion status, and delete
- **Medical Record Documents**: Create, update with follow-up, and delete

### Storage Operations
- **Animal Photos**: Upload images, retrieve metadata, list files, and delete
- **Medical Documents**: Upload PDFs and other documents, and delete

### Permission Tests
- **Public Read Permissions**: Documents accessible to any user
- **Team-Based Permissions**: Role-based access control for volunteers and admins
- **Permission Updates**: Modifying document permissions

### Query and Filter Tests
- **Pagination**: Limiting and offsetting results
- **Empty Results**: Handling queries with no matches

## Test Structure

Tests are organized into describe blocks by feature:
- `Appwrite Database Integration Tests`
  - `Animal CRUD Operations`
  - `Task CRUD Operations`
  - `Medical Record CRUD Operations`
- `Appwrite Storage Integration Tests`
  - `File Upload Operations`
  - `Medical Document Upload Operations`
- `Appwrite Permission Tests`
- `Appwrite Query and Filter Tests`

## Important Notes

1. **Test Dependencies**: Some tests depend on previous tests in the same describe block (e.g., update and delete tests depend on create tests setting the document ID)

2. **Cleanup**: Tests include cleanup logic in `afterAll` hooks to remove test data

3. **Real Operations**: These are true integration tests that perform real operations against Appwrite - they do not use mocks

4. **Connection Required**: Tests will fail with `ECONNREFUSED` errors if Appwrite is not running

## Troubleshooting

### Connection Refused Errors
```
Error: connect ECONNREFUSED 127.0.0.1:80
```
**Solution**: Start the local Appwrite instance with `docker-compose up -d`

### Missing Collection Errors
```
AppwriteException: Collection not found
```
**Solution**: Run the database setup script or create collections manually in Appwrite console

### Permission Errors
```
AppwriteException: Unauthorized
```
**Solution**: Ensure proper permissions are set on collections and storage buckets

### Missing Document ID Errors
```
AppwriteException: Missing required parameter: "documentId"
```
**Solution**: This indicates a previous test failed to create the document. Check that create operations are successful first.

## Best Practices

1. **Run tests against a local Appwrite instance**, not production
2. **Ensure Appwrite is running** before executing tests
3. **Review test output** for specific error messages
4. **Clean up test data** after test runs (handled automatically by afterAll hooks)
5. **Use unique IDs** for test documents to avoid conflicts
