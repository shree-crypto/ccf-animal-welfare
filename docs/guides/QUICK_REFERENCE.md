# Quick Reference Guide

This guide provides quick code snippets and examples for common operations in the CCF Animal Welfare project.

## Table of Contents

1. [Database Operations](#database-operations)
2. [Authentication](#authentication)
3. [File Upload](#file-upload)
4. [Forms and Validation](#forms-and-validation)
5. [Components](#components)
6. [Routing](#routing)
7. [State Management](#state-management)
8. [Styling](#styling)

## Database Operations

### Create a Document

```typescript
import { createAnimal } from '@/lib/db/animals';

const newAnimal = await createAnimal({
  name: 'Max',
  type: 'dog',
  age: 3,
  breed: 'Golden Retriever',
  location: {
    area: 'Main Campus',
    coordinates: [29.8543, 77.888],
  },
  currentFeeder: 'John Doe',
  medicalHistory: [],
  photos: {
    profile: 'https://...',
    gallery: [],
  },
  status: 'healthy',
});
```

### Get Documents with Filters

```typescript
import { getAnimals } from '@/lib/db/animals';

const { animals, total, pagination } = await getAnimals({
  type: 'dog',
  status: 'needs_attention',
  limit: 25,
  offset: 0,
});

console.log(`Found ${total} animals`);
console.log(`Page ${pagination.currentPage} of ${pagination.totalPages}`);
```

### Update a Document

```typescript
import { updateAnimal } from '@/lib/db/animals';

const updated = await updateAnimal('animal_id', {
  status: 'under_treatment',
  currentFeeder: 'Jane Smith',
});
```

### Delete a Document

```typescript
import { deleteAnimal } from '@/lib/db/animals';

await deleteAnimal('animal_id');
```

### Search Documents

```typescript
import { searchAnimalsByName } from '@/lib/db/animals';

const { animals, total } = await searchAnimalsByName('Max', {
  limit: 50,
  offset: 0,
});
```

## Authentication

### Check if User is Authenticated

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Protect a Page

```typescript
'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProtectedPage() {
  // Redirects to login if not authenticated
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;

  return <div>Protected content for {user.name}</div>;
}
```

### Protect a Page with Role

```typescript
'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function AdminPage() {
  // Redirects to unauthorized if not admin
  const { user, loading } = useRequireAuth('admin');

  if (loading) return <div>Loading...</div>;

  return <div>Admin content</div>;
}
```

### Login

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function LoginButton() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Redirect or show success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### Logout

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function LogoutButton() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

### Check User Role

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function RoleBasedContent() {
  const { user, checkRole } = useAuth();

  return (
    <div>
      {checkRole('volunteer') && <div>Volunteer content</div>}
      {checkRole('admin') && <div>Admin content</div>}
    </div>
  );
}
```

## File Upload

### Upload Animal Photo

```typescript
import { uploadAnimalPhoto } from '@/lib/storage';

const handleUpload = async (file: File) => {
  try {
    const fileInfo = await uploadAnimalPhoto(file, progress => {
      console.log(`Upload progress: ${progress.progress}%`);
    });

    console.log('File uploaded:', fileInfo.url);
    return fileInfo;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Upload Medical Document

```typescript
import { uploadMedicalDocument } from '@/lib/storage';

const handleUpload = async (file: File) => {
  const fileInfo = await uploadMedicalDocument(file);
  return fileInfo;
};
```

### Validate File Before Upload

```typescript
import { isValidImageFile, isValidFileSize } from '@/lib/storage';

const handleFileSelect = (file: File) => {
  if (!isValidImageFile(file)) {
    alert('Invalid file type. Please upload an image.');
    return;
  }

  if (!isValidFileSize(file, 10)) {
    alert('File too large. Maximum size is 10 MB.');
    return;
  }

  // Proceed with upload
  uploadFile(file);
};
```

### Delete File

```typescript
import { deleteAnimalPhoto } from '@/lib/storage';

await deleteAnimalPhoto('file_id');
```

## Forms and Validation

### Create a Form with Validation

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { animalProfileSchema, type AnimalProfileFormData } from '@/lib/validations/animal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AnimalForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnimalProfileFormData>({
    resolver: zodResolver(animalProfileSchema),
  });

  const onSubmit = async (data: AnimalProfileFormData) => {
    try {
      await createAnimal(data);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          disabled={isSubmitting}
        />
        {errors.age && (
          <p className="text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

### Validate Data Manually

```typescript
import { animalProfileSchema } from '@/lib/validations/animal';

try {
  const validatedData = animalProfileSchema.parse(data);
  // Data is valid
} catch (error) {
  if (error instanceof z.ZodError) {
    error.errors.forEach(err => {
      console.error(`${err.path}: ${err.message}`);
    });
  }
}
```

## Components

### Create a Server Component

```typescript
// No 'use client' directive
import { getAnimals } from '@/lib/db/animals';
import { AnimalCard } from '@/components/features/animals/animal-card';

export default async function AnimalsPage() {
  const { animals } = await getAnimals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}
```

### Create a Client Component

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  );
}
```

### Create a Component with Props

```typescript
'use client';

import type { AnimalProfile } from '@/types/animal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimalCardProps {
  animal: AnimalProfile;
  onEdit?: (id: string) => void;
  className?: string;
}

export function AnimalCard({ animal, onEdit, className }: AnimalCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{animal.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Type: {animal.type}</p>
        <p>Age: {animal.age}</p>
        {onEdit && (
          <Button onClick={() => onEdit(animal.id)}>Edit</Button>
        )}
      </CardContent>
    </Card>
  );
}
```

## Routing

### Navigate Programmatically

```typescript
'use client';

import { useRouter } from 'next/navigation';

export function NavigateButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/animals');
  };

  return <button onClick={handleClick}>View Animals</button>;
}
```

### Link to Another Page

```typescript
import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/animals">Animals</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

### Dynamic Route

```typescript
// File: src/app/animals/[id]/page.tsx
import { getAnimalById } from '@/lib/db/animals';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AnimalDetailPage({ params }: PageProps) {
  const animal = await getAnimalById(params.id);

  if (!animal) {
    return <div>Animal not found</div>;
  }

  return (
    <div>
      <h1>{animal.name}</h1>
      <p>Type: {animal.type}</p>
    </div>
  );
}
```

### Redirect

```typescript
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Protected content</div>;
}
```

## State Management

### Use Context

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Use Notifications

```typescript
'use client';

import { useNotifications } from '@/contexts/NotificationContext';

export function NotificationBell() {
  const { notifications, unreadCount, markNotificationAsRead } = useNotifications();

  return (
    <div>
      <span>Notifications ({unreadCount})</span>
      {notifications.map((notif) => (
        <div key={notif.id} onClick={() => markNotificationAsRead(notif.id)}>
          <h3>{notif.title}</h3>
          <p>{notif.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### Use State

```typescript
'use client';

import { useState } from 'react';

export function Example() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### Use Effect

```typescript
'use client';

import { useEffect, useState } from 'react';

export function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []); // Empty deps = run once on mount

  return <div>{data}</div>;
}
```

## Styling

### Basic Tailwind Classes

```typescript
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

### Responsive Design

```typescript
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
  p-4
  md:p-6
  lg:p-8
">
  {/* Content */}
</div>
```

### Dark Mode

```typescript
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

### Conditional Classes

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isPrimary ? 'primary-class' : 'secondary-class',
  className
)} />
```

### Component Variants

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })}>
      {children}
    </button>
  );
}
```

## Common Patterns

### Loading State

```typescript
'use client';

import { useState } from 'react';

export function DataComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getData();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return <div>{data}</div>;
}
```

### Error Handling

```typescript
'use client';

import { useState } from 'react';

export function FormComponent() {
  const [error, setError] = useState<string>('');

  const handleSubmit = async (data: FormData) => {
    setError('');
    try {
      await submitData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Pagination

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAnimals } from '@/lib/db/animals';

export function PaginatedList() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const limit = 25;

  useEffect(() => {
    const offset = (page - 1) * limit;
    getAnimals({ limit, offset }).then(setData);
  }, [page]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {/* Display data */}

      <div className="flex gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {data.pagination.totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!data.pagination.hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format with Prettier
npm run format:check       # Check formatting
npx tsc --noEmit          # Type check

# Testing
npm test                   # Run tests
npm test -- --watch        # Run tests in watch mode

# Database
npx tsx src/lib/setup/create-indexes.ts  # Show index configs

# Docker
docker-compose up -d       # Start Appwrite
docker-compose down        # Stop Appwrite
docker-compose logs -f     # View logs
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=ccf-animal-welfare
NEXT_PUBLIC_APPWRITE_DATABASE_ID=ccf-database

# Collections
NEXT_PUBLIC_APPWRITE_COLLECTION_ANIMALS=animals
NEXT_PUBLIC_APPWRITE_COLLECTION_TERRITORIES=territories
NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS=tasks
NEXT_PUBLIC_APPWRITE_COLLECTION_MEDICAL_RECORDS=medical-records
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATIONS=notifications
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATION_PREFERENCES=notification-preferences

# Storage
NEXT_PUBLIC_APPWRITE_BUCKET_ANIMAL_PHOTOS=animal-photos
NEXT_PUBLIC_APPWRITE_BUCKET_MEDICAL_DOCUMENTS=medical-documents

# Teams
NEXT_PUBLIC_APPWRITE_VOLUNTEER_TEAM_ID=volunteer-team
NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID=admin-team
```

---

For more detailed information, see the full documentation in the [docs](./README.md) folder.
