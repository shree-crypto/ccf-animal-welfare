# CCF Animal Welfare - Developer Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Architecture](#architecture)
6. [Frontend Documentation](#frontend-documentation)
7. [Backend Documentation](#backend-documentation)
8. [Database Schema](#database-schema)
9. [API Integration](#api-integration)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Contributing Guidelines](#contributing-guidelines)

## Project Overview

The CCF Animal Welfare Website is a comprehensive digital platform for the Committee for Campus Fauna (CCF) at IIT Roorkee. It streamlines animal care operations, enhances volunteer coordination, and provides public visibility for campus animals.

### Key Features

- **Public Animal Gallery**: Browse animal profiles with detailed information
- **Interactive Territory Maps**: Visualize pack locations with heatmap overlays
- **Volunteer Dashboard**: Collaborative scheduling and task management
- **Medical Records Management**: Digital health documentation and tracking
- **Real-time Notifications**: Automated reminders and updates
- **Admin Dashboard**: Comprehensive database management with bulk operations
- **Role-based Access Control**: Public, Volunteer, and Admin roles

### User Roles

1. **Public Users**: View animal profiles, territories, stories, and contact information
2. **Volunteers**: Access dashboard, manage tasks, view medical records, receive notifications
3. **Admins**: Full database management, user management, system configuration

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui (Radix UI primitives), Aceternity UI, Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Maps**: React Leaflet with OpenStreetMap
- **Animations**: Framer Motion

### Backend
- **BaaS**: Appwrite (self-hosted on AWS)
- **Database**: Appwrite Database with real-time subscriptions
- **Storage**: AWS S3 via Appwrite Storage
- **Auth**: Appwrite Authentication with team-based roles

### Development Tools
- **Linting**: ESLint with Next.js and TypeScript configs
- **Formatting**: Prettier
- **Type Checking**: TypeScript 5
- **Testing**: Vitest
- **React Compiler**: Enabled for optimization

## Project Structure

```
ccf-animal-welfare/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin dashboard and management
│   │   ├── animals/           # Animal gallery and profiles
│   │   ├── contact/           # Contact page
│   │   ├── dashboard/         # Volunteer dashboard
│   │   ├── donate/            # Donation page
│   │   ├── events/            # Events page
│   │   ├── login/             # Authentication page
│   │   ├── medical/           # Medical records
│   │   ├── notifications/     # Notifications page
│   │   ├── profile/           # User profile
│   │   ├── stories/           # Success stories
│   │   ├── tasks/             # Task management
│   │   ├── territories/       # Territory maps
│   │   ├── unauthorized/      # Unauthorized access page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── features/         # Feature-specific components
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   └── ui/               # Reusable UI components (Shadcn/ui)
│   │
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── NotificationContext.tsx  # Real-time notifications
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useRequireAuth.ts # Authentication guard
│   │   └── useTerritories.ts # Territory data management
│   │
│   ├── lib/                  # Utility libraries and business logic
│   │   ├── constants/        # Application constants
│   │   ├── db/              # Database operations
│   │   ├── notifications/   # Notification utilities
│   │   ├── setup/           # Database setup scripts
│   │   ├── storage/         # File storage utilities
│   │   ├── validations/     # Zod validation schemas
│   │   ├── appwrite.ts      # Appwrite client initialization
│   │   ├── auth.ts          # Authentication utilities
│   │   └── utils.ts         # General utilities
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── animal.ts
│   │   ├── auth.ts
│   │   ├── event.ts
│   │   ├── medical.ts
│   │   ├── notification.ts
│   │   ├── task.ts
│   │   └── territory.ts
│   │
│   ├── test/                # Test files
│   │   ├── e2e/            # End-to-end tests
│   │   └── integration/    # Integration tests
│   │
│   └── middleware.ts        # Next.js middleware for route protection
│
├── docs/                    # Documentation
├── public/                  # Static assets
├── .env.local.example      # Environment variables template
├── docker-compose.yml      # Local Appwrite setup
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local Appwrite)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ccf-animal-welfare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Appwrite configuration.

4. **Start local Appwrite instance**
   ```bash
   docker-compose up -d
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Building
npm run build            # Production build
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting

# Testing
npm test                 # Run tests

# Local Backend
docker-compose up -d     # Start local Appwrite instance
docker-compose down      # Stop Appwrite
```

## Architecture

### Application Flow

```
User Request
    ↓
Next.js Middleware (Route Protection)
    ↓
Page Component (App Router)
    ↓
React Context (Auth, Notifications)
    ↓
Custom Hooks (Data Fetching)
    ↓
Database Operations (lib/db)
    ↓
Appwrite SDK
    ↓
Appwrite Backend (Database, Storage, Auth)
```

### Key Architectural Patterns

1. **Server Components by Default**: Next.js 14 App Router uses server components for better performance
2. **Client Components**: Marked with `'use client'` for interactivity
3. **Context Providers**: Centralized state management for auth and notifications
4. **Custom Hooks**: Reusable logic for data fetching and state management
5. **Database Layer**: Abstracted database operations in `lib/db`
6. **Validation Layer**: Zod schemas for type-safe validation
7. **Type Safety**: Comprehensive TypeScript types in `types/`



## Frontend Documentation

For detailed frontend architecture, see [Frontend Architecture](FRONTEND_ARCHITECTURE.md).

### Key Frontend Concepts

**Server Components (Default)**
- Render on the server
- Can fetch data directly
- Better performance
- No client-side JavaScript

**Client Components**
- Marked with `'use client'`
- Interactive features
- Use React hooks
- Access browser APIs

**Hybrid Approach**
- Use server components by default
- Add client components only when needed
- Compose server and client components

## Backend Documentation

For detailed backend architecture, see [Backend Architecture](BACKEND_ARCHITECTURE.md).

### Key Backend Concepts

**Appwrite as BaaS**
- Database with real-time subscriptions
- Authentication and authorization
- File storage
- Teams and permissions

**Database Layer**
- Abstraction over Appwrite SDK
- Validation with Zod
- Optimized queries with indexes
- Pagination support

**Real-time Features**
- WebSocket subscriptions
- Automatic UI updates
- Event-driven architecture

## Database Schema

For complete database schema, see [Database Schema](DATABASE_SCHEMA.md).

### Collections Overview

1. **Animals**: Animal profiles and information
2. **Territories**: Pack territories and boundaries
3. **Tasks**: Volunteer tasks and schedules
4. **Medical Records**: Health records and history
5. **Notifications**: User notifications
6. **Notification Preferences**: User notification settings

### Storage Buckets

1. **Animal Photos**: Profile and gallery photos
2. **Medical Documents**: Medical records and documents

## API Integration

### Appwrite SDK

The application uses Appwrite SDK for all backend operations:

```typescript
import { databases, storage, account, teams } from '@/lib/appwrite';

// Database operations
await databases.createDocument(...);
await databases.listDocuments(...);

// Storage operations
await storage.createFile(...);
await storage.getFile(...);

// Authentication
await account.create(...);
await account.createEmailPasswordSession(...);

// Teams
await teams.list();
```

### Database Operations Pattern

All database operations follow this pattern:

1. **Validate Input**: Use Zod schemas
2. **Execute Operation**: Call Appwrite SDK
3. **Transform Response**: Convert to application types
4. **Handle Errors**: Try-catch with appropriate error handling

Example:
```typescript
export const createAnimal = async (data: CreateAnimalInput): Promise<AnimalProfile> => {
  // 1. Validate
  const validatedData = createAnimalSchema.parse(data);

  // 2. Execute
  const document = await databases.createDocument<AnimalDocument>(
    DATABASE_ID,
    COLLECTIONS.ANIMALS,
    ID.unique(),
    validatedData
  );

  // 3. Transform
  return documentToAnimal(document);
};
```

## Testing

### Test Structure

```
src/
├── lib/
│   ├── validations/
│   │   ├── animal.ts
│   │   └── __tests__/
│   │       └── animal.test.ts
│   └── __tests__/
│       ├── auth.test.ts
│       └── utils.test.ts
└── test/
    ├── integration/
    │   ├── appwrite.test.ts
    │   └── README.md
    └── e2e/
        ├── user-workflows.test.ts
        └── admin-workflows.test.ts
```

### Test Types

**Unit Tests**
- Test individual functions
- Mock external dependencies
- Fast execution

**Integration Tests**
- Test Appwrite integration
- Require running Appwrite instance
- Test database operations

**End-to-End Tests**
- Test complete user workflows
- Require running application
- Test UI and backend together

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- animal.test.ts

# Run with coverage
npm test -- --coverage
```

### Writing Tests

Example unit test:
```typescript
import { describe, it, expect } from 'vitest';
import { animalProfileSchema } from '../animal';

describe('Animal Validation', () => {
  it('should validate correct animal data', () => {
    const data = {
      name: 'Max',
      type: 'dog',
      age: 3,
      // ...
    };
    
    expect(() => animalProfileSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid type', () => {
    const data = {
      name: 'Max',
      type: 'bird', // Invalid
      age: 3,
    };
    
    expect(() => animalProfileSchema.parse(data)).toThrow();
  });
});
```

## Deployment

For detailed deployment instructions, see [Setup Guide](SETUP_GUIDE.md) → Production Deployment.

### Deployment Options

1. **Vercel** (Recommended for Next.js)
   - Automatic deployments
   - Edge network
   - Easy environment variable management

2. **Docker**
   - Containerized deployment
   - Consistent environments
   - Easy scaling

3. **Traditional Server**
   - VPS or dedicated server
   - PM2 for process management
   - Nginx as reverse proxy

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Build succeeds
- [ ] Environment variables configured
- [ ] Appwrite production instance ready
- [ ] Database indexes created
- [ ] Storage buckets configured
- [ ] Teams and permissions set up
- [ ] SSL certificates configured
- [ ] Domain configured
- [ ] Monitoring set up

## Contributing Guidelines

### Before Contributing

1. Read all documentation
2. Set up local development environment
3. Understand the codebase structure
4. Check existing issues and PRs

### Development Workflow

1. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code conventions
   - Write tests
   - Update documentation

3. **Test Changes**
   ```bash
   npm run lint
   npm run format
   npm test
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add animal search functionality
fix: correct pagination calculation in animal list
docs: update API documentation
refactor: simplify query building logic
```

### Pull Request Guidelines

- Clear title and description
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation
- Request review from maintainers

### Code Review Process

1. Automated checks run (linting, tests, build)
2. Maintainers review code
3. Address feedback
4. Approval and merge

## Maintenance

### Regular Maintenance Tasks

**Daily**
- Monitor error logs
- Check application performance
- Verify backups

**Weekly**
- Review and merge PRs
- Update dependencies (patch versions)
- Check storage usage
- Review analytics

**Monthly**
- Update dependencies (minor versions)
- Review and optimize queries
- Clean up expired data
- Security audit
- Performance optimization

**Quarterly**
- Major dependency updates
- Architecture review
- Documentation update
- Feature planning

### Monitoring

**Application Monitoring**
- Error tracking (Sentry, etc.)
- Performance monitoring
- User analytics
- Uptime monitoring

**Infrastructure Monitoring**
- Server resources
- Database performance
- Storage usage
- Network traffic

**Appwrite Monitoring**
- Database queries
- Storage usage
- API usage
- Real-time connections

### Backup Strategy

**Database Backups**
- Daily automated backups
- Weekly full backups
- Monthly archives
- Test restore procedures

**Storage Backups**
- Backup file storage
- Verify file integrity
- Test restore procedures

**Code Backups**
- Git repository
- Multiple remotes
- Tagged releases

## Troubleshooting

For detailed troubleshooting, see [Setup Guide](SETUP_GUIDE.md) → Troubleshooting.

### Common Issues

1. **Build Fails**: Check TypeScript errors, run `npx tsc --noEmit`
2. **Tests Fail**: Ensure Appwrite is running, check environment variables
3. **Slow Queries**: Verify indexes, check query patterns
4. **Auth Issues**: Check session cookies, verify team memberships
5. **File Upload Fails**: Check file size, verify bucket permissions

### Debug Tools

**Browser DevTools**
- Console for errors
- Network tab for API calls
- React DevTools for component inspection

**Appwrite Console**
- Database queries
- Storage files
- User sessions
- Logs

**Next.js DevTools**
- Server logs
- Build output
- Error messages

## Resources

### Documentation
- [Frontend Architecture](FRONTEND_ARCHITECTURE.md)
- [Backend Architecture](BACKEND_ARCHITECTURE.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Conventions](CONVENTIONS.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Query Optimization](QUERY_OPTIMIZATION.md)
- [Quick Reference](QUICK_REFERENCE.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Appwrite Documentation](https://appwrite.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Zod Documentation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)

### Community
- GitHub Issues
- Development Team
- CCF Community

## Glossary

**App Router**: Next.js 14+ routing system using the `app/` directory
**BaaS**: Backend as a Service
**Client Component**: React component that runs in the browser
**Server Component**: React component that runs on the server
**Appwrite**: Open-source backend platform
**Zod**: TypeScript-first schema validation library
**Shadcn/ui**: Re-usable component library built on Radix UI
**Real-time**: Live updates without page refresh
**SSR**: Server-Side Rendering
**CSR**: Client-Side Rendering

## License

[Add license information]

## Contact

Committee for Campus Fauna (CCF)
IIT Roorkee

[Add contact information]

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Maintained By**: CCF Development Team
