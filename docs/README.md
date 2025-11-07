# CCF Animal Welfare Website Documentation

This directory contains all documentation for the CCF Animal Welfare Website project.

## Quick Start Guides

- [Authentication Setup](./QUICK_START_AUTH.md) - Get started with user authentication
- [Admin Animals Management](./QUICK_START_ADMIN_ANIMALS.md) - Managing the animal database
- [Medical Records](./QUICK_START_MEDICAL.md) - Working with medical records
- [Task Management](./QUICK_START_TASKS.md) - Volunteer task coordination
- [Territory Mapping](./QUICK_START_TERRITORIES.md) - Interactive territory maps
- [Notifications](./QUICK_START_NOTIFICATIONS.md) - Notification system setup
- [Public Pages](./QUICK_START_PUBLIC_PAGES.md) - Public-facing pages

## Setup Guides

- [Authentication Setup](./AUTHENTICATION_SETUP.md) - Detailed authentication configuration
- [Notification Setup](./NOTIFICATION_SETUP.md) - Configure notification system
- [Task Management Setup](./TASK_MANAGEMENT_SETUP.md) - Task system configuration

## Architecture & Flow Diagrams

- [Authentication Flow](./AUTH_FLOW_DIAGRAM.md) - Authentication flow visualization
- [Authentication Integration](./AUTH_INTEGRATION_GUIDE.md) - Integration guide for auth
- [Notification Flow](./NOTIFICATION_FLOW_DIAGRAM.md) - Notification system flow
- [Territory Map Guide](./TERRITORY_MAP_GUIDE.md) - Territory mapping implementation

## Implementation History

Task implementation summaries and checklists are available for reference:

- Task 2: Authentication System
- Task 3: Data Models & Database
- Task 4: Animal Gallery
- Task 5: Territory Mapping
- Task 6: Task Management
- Task 7: Medical Records
- Task 8: Notifications
- Task 9: Admin Dashboard
- Task 10: Public Pages

## Additional Resources

- [Main README](../README.md) - Project overview and getting started
- [Auth README](./README_AUTH.md) - Authentication system details

## Project Structure

```
ccf-animal-welfare/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── features/     # Feature-specific components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── constants/    # Constants and configuration
│   │   ├── db/           # Database operations
│   │   ├── notifications/# Notification utilities
│   │   ├── storage/      # File storage utilities
│   │   ├── utils/        # General utilities
│   │   └── validations/  # Zod validation schemas
│   └── types/            # TypeScript type definitions
└── docs/                 # Documentation (this folder)
```

## Contributing

When adding new features or making changes:

1. Update relevant documentation in this folder
2. Add quick start guides for new features
3. Update architecture diagrams if needed
4. Keep implementation summaries for reference
