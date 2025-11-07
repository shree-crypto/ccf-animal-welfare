# Frontend Architecture

## Overview

The frontend is built with Next.js 14 using the App Router, React 19, TypeScript, and Tailwind CSS. It follows a component-based architecture with clear separation of concerns.

## Page Structure

### Public Pages

#### Home Page (`/`)
- **Location**: `src/app/page.tsx`
- **Purpose**: Landing page with hero section, featured animals, and call-to-action
- **Components Used**: Hero, AnimalCard, Button
- **Access**: Public

#### About Page (`/about`)
- **Location**: `src/app/about/page.tsx`
- **Purpose**: Information about CCF mission and team
- **Access**: Public

#### Animals Gallery (`/animals`)
- **Location**: `src/app/animals/page.tsx`
- **Purpose**: Browse all animals with filtering
- **Features**:
  - Grid layout of animal cards
  - Filter by type (dog/cat)
  - Filter by status
  - Pagination
- **Data Fetching**: Uses `getAnimals()` from `lib/db/animals.ts`
- **Access**: Public

#### Animal Detail Page (`/animals/[id]`)
- **Location**: `src/app/animals/[id]/page.tsx`
- **Purpose**: Detailed view of a single animal
- **Features**:
  - Photo gallery
  - Medical history
  - Location information
  - Pack details
- **Data Fetching**: Uses `getAnimalById()` from `lib/db/animals.ts`
- **Access**: Public

#### Territories Map (`/territories`)
- **Location**: `src/app/territories/page.tsx`
- **Purpose**: Interactive map showing animal territories
- **Features**:
  - Leaflet map integration
  - Heatmap overlay
  - Territory markers
  - Pack information
- **Libraries**: React Leaflet, OpenStreetMap
- **Access**: Public

#### Contact Page (`/contact`)
- **Location**: `src/app/contact/page.tsx`
- **Purpose**: Contact form and information
- **Features**:
  - Contact form with validation
  - Email integration
- **Access**: Public

#### Stories Page (`/stories`)
- **Location**: `src/app/stories/page.tsx`
- **Purpose**: Success stories and testimonials
- **Access**: Public

#### Events Page (`/events`)
- **Location**: `src/app/events/page.tsx`
- **Purpose**: Upcoming and past events
- **Access**: Public

#### Donate Page (`/donate`)
- **Location**: `src/app/donate/page.tsx`
- **Purpose**: Donation information and options
- **Access**: Public

### Protected Pages (Volunteer)

#### Dashboard (`/dashboard`)
- **Location**: `src/app/dashboard/page.tsx`
- **Purpose**: Volunteer dashboard with overview
- **Features**:
  - Upcoming tasks
  - Recent notifications
  - Animals needing attention
  - Quick actions
- **Protection**: Requires volunteer or admin role
- **Hook**: Uses `useRequireAuth('volunteer')`

#### Tasks Page (`/tasks`)
- **Location**: `src/app/tasks/page.tsx`
- **Purpose**: Task management and scheduling
- **Features**:
  - Calendar view
  - Task list with filters
  - Create/edit tasks
  - Mark tasks complete
  - Assign volunteers
- **Data Fetching**: Uses `getTasks()` from `lib/db/tasks.ts`
- **Protection**: Requires volunteer or admin role

#### Medical Records (`/medical`)
- **Location**: `src/app/medical/page.tsx`
- **Purpose**: View and manage medical records
- **Features**:
  - Medical history by animal
  - Filter by type (checkup, vaccination, treatment)
  - Follow-up tracking
  - Document uploads
- **Data Fetching**: Uses `getMedicalRecords()` from `lib/db/medical.ts`
- **Protection**: Requires volunteer or admin role

#### Notifications (`/notifications`)
- **Location**: `src/app/notifications/page.tsx`
- **Purpose**: View and manage notifications
- **Features**:
  - Real-time notification list
  - Filter by type and priority
  - Mark as read
  - Notification preferences
- **Context**: Uses `NotificationContext`
- **Protection**: Requires authentication

#### Profile (`/profile`)
- **Location**: `src/app/profile/page.tsx`
- **Purpose**: User profile and settings
- **Features**:
  - Update profile information
  - Change password
  - Notification preferences
- **Protection**: Requires authentication

### Admin Pages

#### Admin Dashboard (`/admin`)
- **Location**: `src/app/admin/page.tsx`
- **Purpose**: Admin overview and quick actions
- **Features**:
  - System statistics
  - Recent activity
  - User management
  - Quick links
- **Protection**: Requires admin role

#### Animal Management (`/admin/animals`)
- **Location**: `src/app/admin/animals/page.tsx`
- **Purpose**: Comprehensive animal database management
- **Features**:
  - Create new animals
  - Edit existing animals
  - Bulk operations (status update, location update)
  - Delete animals
  - Photo management
  - Advanced search and filters
- **Data Operations**: Uses all functions from `lib/db/animals.ts`
- **Protection**: Requires admin role

### Authentication Pages

#### Login/Register (`/login`)
- **Location**: `src/app/login/page.tsx`
- **Purpose**: User authentication
- **Features**:
  - Login form
  - Registration form
  - Toggle between login/register
  - Redirect after login
- **Components**: LoginForm, RegisterForm
- **Context**: Uses `AuthContext`
- **Access**: Public (redirects if authenticated)

#### Unauthorized (`/unauthorized`)
- **Location**: `src/app/unauthorized/page.tsx`
- **Purpose**: Access denied page
- **Access**: Public

## Component Architecture

### Component Categories

1. **Layout Components** (`src/components/layout/`)
   - Header: Navigation bar with auth state
   - Footer: Site footer with links
   - Navigation: Mobile and desktop navigation

2. **Feature Components** (`src/components/features/`)
   - Organized by feature domain
   - Examples: AnimalCard, TaskList, MedicalRecordForm

3. **UI Components** (`src/components/ui/`)
   - Reusable Shadcn/ui components
   - Examples: Button, Input, Dialog, Card, Form

### Component Patterns

#### Server Components (Default)
```typescript
// No 'use client' directive
export default async function AnimalsPage() {
  // Can fetch data directly
  const animals = await getAnimals();
  
  return (
    <div>
      {animals.map(animal => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}
```

#### Client Components
```typescript
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  
  return <div onClick={() => setState(...)}>...</div>;
}
```


## State Management

### React Context

#### AuthContext (`src/contexts/AuthContext.tsx`)
Manages authentication state and user information.

**Provided Values:**
```typescript
{
  user: User | null;           // Current user
  loading: boolean;            // Loading state
  login: (email, password) => Promise<void>;
  register: (email, password, name) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name) => Promise<void>;
  checkRole: (requiredRole) => boolean;
}
```

**Usage:**
```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <button onClick={() => login(...)}>Login</button>;
  }
  
  return <button onClick={logout}>Logout</button>;
}
```

#### NotificationContext (`src/contexts/NotificationContext.tsx`)
Manages real-time notifications with Appwrite subscriptions.

**Provided Values:**
```typescript
{
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markNotificationAsRead: (id) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}
```

**Real-time Features:**
- Subscribes to Appwrite database changes
- Automatically updates on new notifications
- Updates unread count in real-time
- Handles notification CRUD events

**Usage:**
```typescript
'use client';

import { useNotifications } from '@/contexts/NotificationContext';

export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();
  
  return (
    <div>
      <Badge>{unreadCount}</Badge>
      {notifications.map(notif => (
        <NotificationItem key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
```

### Custom Hooks

#### useRequireAuth (`src/hooks/useRequireAuth.ts`)
Protects routes by requiring authentication and optionally a specific role.

**Usage:**
```typescript
'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProtectedPage() {
  const { user, loading } = useRequireAuth('volunteer');
  
  if (loading) return <Loading />;
  
  return <div>Protected content for {user.name}</div>;
}
```

**Behavior:**
- Redirects to `/login` if not authenticated
- Redirects to `/unauthorized` if insufficient role
- Shows loading state during check

#### useTerritories (`src/hooks/useTerritories.ts`)
Manages territory data fetching and state.

**Usage:**
```typescript
'use client';

import { useTerritories } from '@/hooks/useTerritories';

export function TerritoryMap() {
  const { territories, loading, error } = useTerritories();
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return <Map territories={territories} />;
}
```

## Form Handling

### React Hook Form + Zod

All forms use React Hook Form with Zod validation for type-safe form handling.

**Example: Login Form**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    // Form data is validated and type-safe
    await login(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <Input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}
      
      <Button type="submit">Login</Button>
    </form>
  );
}
```

### Form Validation Schemas

Located in `src/lib/validations/`, each domain has its own validation schema:

- `animal.ts`: Animal profile validation
- `auth.ts`: Login/register validation
- `medical.ts`: Medical record validation
- `task.ts`: Task validation
- `notification.ts`: Notification validation
- `territory.ts`: Territory validation

**Example Schema:**
```typescript
import { z } from 'zod';

export const animalProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['dog', 'cat']),
  age: z.number().min(0).max(30),
  breed: z.string().optional(),
  status: z.enum(['healthy', 'needs_attention', 'under_treatment']),
});

export type AnimalProfileFormData = z.infer<typeof animalProfileSchema>;
```

## Styling

### Tailwind CSS

The project uses Tailwind CSS 4 with custom configuration.

**Configuration** (`tailwind.config.ts`):
- Custom color palette
- Dark mode support
- Custom spacing and sizing
- Typography plugin
- Animation utilities

**Usage:**
```typescript
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h2>
  <Button className="bg-blue-600 hover:bg-blue-700">
    Action
  </Button>
</div>
```

### Global Styles

**Location**: `src/app/globals.css`

Features:
- CSS custom properties for theming
- Dark mode variables
- Base styles
- OKLCH color space for better color management

### Component Styling

Uses Shadcn/ui components which are:
- Fully customizable
- Built on Radix UI primitives
- Accessible by default
- Styled with Tailwind CSS

## Routing and Navigation

### App Router

Next.js 14 App Router provides:
- File-based routing
- Nested layouts
- Server components by default
- Streaming and suspense
- Route groups

### Route Protection

**Middleware** (`src/middleware.ts`):
```typescript
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Check for session cookie
  const sessionCookie = request.cookies.get('a_session_...');
  
  if (!sessionCookie) {
    // Redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}
```

**Protected Routes:**
- `/dashboard/*`
- `/volunteer/*`
- `/admin/*`

### Navigation Components

**Header Navigation:**
- Responsive design (mobile/desktop)
- Auth state aware
- Role-based menu items
- Notification bell with unread count

**Example:**
```typescript
export function Header() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/animals">Animals</Link>
        
        {user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <NotificationBell count={unreadCount} />
          </>
        )}
        
        {user?.role === 'admin' && (
          <Link href="/admin">Admin</Link>
        )}
      </nav>
    </header>
  );
}
```

## Performance Optimization

### React Compiler

Enabled in `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

Benefits:
- Automatic memoization
- Reduced re-renders
- Better performance

### Image Optimization

Use Next.js Image component for automatic optimization:
```typescript
import Image from 'next/image';

<Image
  src={animal.photos.profile}
  alt={animal.name}
  width={400}
  height={300}
  loading="lazy"
/>
```

### Code Splitting

Next.js automatically code-splits by route. For additional splitting:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false, // Disable SSR if needed
});
```

### Data Fetching Patterns

**Server Components (Preferred):**
```typescript
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Client Components:**
```typescript
'use client';

export function ClientComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return <div>{data}</div>;
}
```

## Accessibility

### Built-in Features

1. **Semantic HTML**: Proper use of headings, landmarks, lists
2. **Keyboard Navigation**: All interactive elements are keyboard accessible
3. **Focus Management**: Visible focus indicators
4. **ARIA Attributes**: Provided by Shadcn/ui components
5. **Color Contrast**: WCAG AA compliant
6. **Screen Reader Support**: Proper labels and descriptions

### Best Practices

```typescript
// Good: Semantic HTML with proper labels
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// Good: Form labels
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// Good: Loading states
{loading && <span role="status">Loading...</span>}
```

## Error Handling

### Error Boundaries

Create error boundaries for graceful error handling:
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Form Errors

Display validation errors inline:
```typescript
{errors.email && (
  <p className="text-sm text-red-600">{errors.email.message}</p>
)}
```

### API Errors

Handle API errors with user-friendly messages:
```typescript
try {
  await createAnimal(data);
} catch (error: any) {
  setError(error.message || 'Failed to create animal');
}
```
