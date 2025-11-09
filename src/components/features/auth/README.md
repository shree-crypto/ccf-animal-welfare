# Authentication System

This directory contains the authentication components for the CCF Animal Welfare Website.

## Components

### LoginForm

Login form component with email/password authentication.

**Props:**

- `onSuccess?: () => void` - Callback after successful login
- `onSwitchToRegister?: () => void` - Callback to switch to registration

### RegisterForm

Registration form component for new users.

**Props:**

- `onSuccess?: () => void` - Callback after successful registration
- `onSwitchToLogin?: () => void` - Callback to switch to login

### ProfileForm

User profile management form for updating account information.

### ProtectedRoute

Wrapper component to protect routes requiring authentication and specific roles.

**Props:**

- `children: React.ReactNode` - Content to render if authorized
- `requiredRole?: UserRole` - Minimum role required (default: 'volunteer')
- `fallbackUrl?: string` - URL to redirect if not authenticated (default: '/login')

## Usage

### Protecting a Page

```tsx
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';

export default function VolunteerPage() {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <div>Volunteer content</div>
    </ProtectedRoute>
  );
}
```

### Using Authentication Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, checkRole } = useAuth();

  const isAdmin = checkRole('admin');

  return <div>{user ? `Welcome ${user.name}` : 'Not logged in'}</div>;
}
```

### Using the Hook

```tsx
import { useRequireAuth } from '@/hooks/useRequireAuth';

function MyPage() {
  const { user, loading } = useRequireAuth('volunteer');

  if (loading) return <div>Loading...</div>;

  return <div>Protected content for {user?.name}</div>;
}
```

## Role Hierarchy

- `public` (0) - Default role for all users
- `volunteer` (1) - Volunteers with access to dashboard and task management
- `admin` (2) - Administrators with full system access

Higher roles inherit permissions from lower roles.

## Setup

1. Ensure Appwrite is running and configured
2. Create teams in Appwrite for 'volunteer' and 'admin'
3. Update `.env.local` with team IDs:
   ```
   NEXT_PUBLIC_APPWRITE_VOLUNTEER_TEAM_ID=your_volunteer_team_id
   NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID=your_admin_team_id
   ```
4. Add users to appropriate teams in Appwrite console
