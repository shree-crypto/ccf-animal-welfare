# End-to-End (E2E) User Workflow Tests

This directory contains comprehensive end-to-end tests that validate complete user journeys through the CCF Animal Welfare Website.

## Test Coverage

### User Workflows (`user-workflows.test.ts`)

Tests complete user journeys from animal browsing to task management:

#### 1. Public User Animal Browsing Journey
- **Requirement 1.1**: Display all animals in responsive card grid layout
- **Requirement 1.2**: Navigate to detailed profile page
- **Requirement 1.3**: Display animal information on cards (name, age, location, feeder, photo)
- **Requirement 1.4**: Support filtering by animal type (dogs/cats)
- **Requirement 1.5**: Load additional photos in gallery view

#### 2. Volunteer Task Management Journey
- **Requirement 3.1**: Display Volunteer Dashboard after authentication
- **Requirement 3.2**: Create and modify feeding schedule entries
- **Requirement 3.3**: Display tasks in shared calendar interface
- **Requirement 3.4**: Track task completion status
- **Requirement 3.5**: Track volunteer assignments

### Admin Workflows (`admin-workflows.test.ts`)

Tests complete admin workflows for animal database management:

#### 1. Admin Medical Records Management
- **Requirement 4.1**: Create and update medical records
- **Requirement 4.2**: Associate medical records with animal profiles
- **Requirement 4.3**: Display medical history chronologically
- **Requirement 4.4**: Support uploading medical documents and photos
- **Requirement 4.5**: Highlight animals needing care

#### 2. Admin Animal Database Management
- **Requirement 6.1**: Create new animal profiles
- **Requirement 6.2**: Edit existing animal profile information including photos
- **Requirement 6.3**: Bulk upload and editing of animal data
- **Requirement 6.4**: Validate animal data entries for completeness and accuracy
- **Requirement 6.5**: Search and filter capabilities for managing large databases

## Running E2E Tests

### Prerequisites

1. **Appwrite Instance Running**: Ensure your local Appwrite instance is running:
   ```bash
   docker-compose up -d
   ```

2. **Environment Variables**: Ensure `.env.local` is configured with:
   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   ```

3. **Database Setup**: Run the database setup script to create collections and indexes:
   ```bash
   npm run setup:db
   ```

### Run All E2E Tests

```bash
npm run test
```

### Run Specific Test Suite

```bash
# Run only user workflow tests
npx vitest run src/test/e2e/user-workflows.test.ts

# Run only admin workflow tests
npx vitest run src/test/e2e/admin-workflows.test.ts
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run with Coverage

```bash
npm run test:coverage
```

## Test Structure

Each test suite follows this pattern:

1. **Setup (`beforeAll`)**: Create test data (animals, tasks, medical records)
2. **Test Cases**: Execute workflow steps and verify expected behavior
3. **Cleanup (`afterAll`)**: Remove all test data to maintain clean state

## Test Data Management

- All test data is prefixed with identifiers like "E2E Test", "Bulk", "Admin Created"
- Test IDs are stored in `testData` objects for cleanup
- Cleanup runs in `afterAll` hooks to ensure no test data persists

## Best Practices

1. **Isolation**: Each test suite is independent and doesn't rely on other tests
2. **Cleanup**: All created data is cleaned up after tests complete
3. **Real Data**: Tests use real Appwrite operations, not mocks
4. **Comprehensive**: Tests cover complete user journeys, not just individual operations
5. **Requirements Mapping**: Each test explicitly references the requirements it validates

## Troubleshooting

### Tests Failing Due to Missing Collections

If tests fail with "Collection not found" errors:
```bash
# Run database setup
npm run setup:db
```

### Tests Failing Due to Permissions

Ensure your Appwrite project has the correct team configurations:
- `volunteers` team for volunteer access
- `admins` team for admin access

### Connection Errors

Verify Appwrite is running:
```bash
docker-compose ps
```

Check environment variables in `.env.local` match your Appwrite configuration.

## Future Enhancements

- Add tests for notification workflows (Requirement 5.1-5.5)
- Add tests for territory mapping interactions (Requirement 2.1-2.5)
- Add tests for authentication and authorization flows (Requirement 7.1-7.5)
- Add performance benchmarks for bulk operations
- Add tests for offline functionality (Requirement 9.5)
