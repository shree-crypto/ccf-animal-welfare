# Quick Start: Authentication System

This guide will help you get started with the authentication system in the CCF Animal Welfare Website.

## Overview

The authentication system provides:
- User registration and login
- Role-based access control (Public, Volunteer, Admin)
- Protected routes and pages
- User profile management
- Session management

## Prerequisites

- Appwrite instance running (local or cloud)
- Environment variables configured
- Teams created in Appwrite dashboard

## Setup Steps

### 1. Configure Environment Variables

Ensure your `.env.local` file has the following:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_VOLUNTEER_TEAM_ID=your-volunteer-team-id
NEXT_PUBLIC_ADMIN_TEAM_ID=your-admin-team-id
```

### 2. Create Teams in Appwrite

1. Open Appwrite Console
2. Navigate to your project
3. Go to "Auth" → "Teams"
4. Create two teams:
   - **Volunteers** - For volunteer users
   - **Admins** - For administrator users
5. Copy the team IDs and update your `.env.local`

### 3. Test Authentication

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/login`

3. Register a new account:
   - Enter name, email, and password
   - Click "Register"

4. You'll be redirected to the dashboard

### 4. Assign Roles

To assign roles to users:

1. Open Appwrite Console
2. Go to "Auth" → "Teams"
3. Select the appropriate team (Volunteers or Admins)
4. Click "Add Member"
5. Enter the user's email
6. Send invitation

## User Roles

### Public (Default)
- Can view public pages
- Can register and login
- No access to protected features

### Volunteer
- All public permissions
- Access to dashboard
- Can view and manage tasks
- Can view animal profiles
- Can view territories

### Admin
- All volunteer permissions
- Access to admin panel
- Can manage animal database
- Can manage users
- Full system access

## Protected Routes

The following routes require authentication:

- `/dashboard` - Volunteer role required
- `/profile` - Any authenticated user
- `/admin` - Admin role required
- `/admin/animals` - Admin role required
- `/tasks` - Volunteer role required
- `/medical` - Volunteer role required
- `/territories` - Volunteer role required

## Using Authentication in Components

### Check if User is Logged In

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Check User Role

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, role } = useAuth();

  return (
    <div>
      <p>Your role: {role}</p>
      {role === 'admin' && <AdminPanel />}
      {role === 'volunteer' && <VolunteerPanel />}
    </div>
  );
}
```

### Protect a Component

```tsx
import { ProtectedRoute } from '@/components/features/auth';

function MyPage() {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <div>This content is only visible to volunteers</div>
    </ProtectedRoute>
  );
}
```

### Use the Auth Hook

```tsx
import { useRequireAuth } from '@/hooks/useRequireAuth';

function MyPage() {
  const { user, role } = useRequireAuth('volunteer');

  // Component will automatically redirect if not authenticated
  // or if user doesn't have required role

  return <div>Protected content</div>;
}
```

## API Reference

### AuthContext Methods

```tsx
const {
  user,           // Current user object or null
  role,           // User role: 'public' | 'volunteer' | 'admin'
  isLoading,      // Loading state
  login,          // (email, password) => Promise<void>
  register,       // (name, email, password) => Promise<void>
  logout,         // () => Promise<void>
  updateProfile,  // (name) => Promise<void>
} = useAuth();
```

## Common Issues

### "Unauthorized" Error
- Check if user is assigned to correct team in Appwrite
- Verify team IDs in environment variables
- Clear browser cache and cookies

### Redirect Loop
- Check middleware configuration
- Verify protected route patterns
- Ensure session is being set correctly

### Role Not Updating
- User needs to log out and log back in after role change
- Check team membership in Appwrite Console

## Next Steps

- [Profile Management](./QUICK_START_PROFILE.md)
- [Admin Dashboard](./QUICK_START_ADMIN_ANIMALS.md)
- [Task Management](./QUICK_START_TASKS.md)

## Additional Resources

- [Authentication Setup Guide](./AUTHENTICATION_SETUP.md)
- [Auth Flow Diagram](./AUTH_FLOW_DIAGRAM.md)
- [Auth Integration Guide](./AUTH_INTEGRATION_GUIDE.md)
