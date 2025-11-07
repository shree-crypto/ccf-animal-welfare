# Code Conventions and Best Practices

## File Naming Conventions

### Files and Directories
- **kebab-case**: Use for file and directory names
  - ✅ `animal-card.tsx`
  - ✅ `user-profile.tsx`
  - ❌ `AnimalCard.tsx`
  - ❌ `user_profile.tsx`

### React Components
- **PascalCase**: Use for component names in code
  ```typescript
  export function AnimalCard() { }
  export default function UserProfile() { }
  ```

### Functions and Variables
- **camelCase**: Use for functions, variables, and parameters
  ```typescript
  const userName = 'John';
  function getUserById(id: string) { }
  ```

### Constants
- **UPPER_SNAKE_CASE**: Use for true constants
  ```typescript
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const DATABASE_ID = 'ccf-database';
  ```

### Types and Interfaces
- **PascalCase**: Use for TypeScript types and interfaces
  ```typescript
  interface AnimalProfile { }
  type UserRole = 'admin' | 'volunteer' | 'public';
  ```

## Directory Structure Conventions

### App Router Pages
```
src/app/
├── page.tsx              # Home page
├── layout.tsx            # Root layout
├── [feature]/            # Feature directory
│   ├── page.tsx         # Feature page
│   └── [id]/            # Dynamic route
│       └── page.tsx     # Dynamic page
```

### Components
```
src/components/
├── features/            # Feature-specific components
│   ├── animals/        # Animal-related components
│   ├── tasks/          # Task-related components
│   └── auth/           # Auth-related components
├── layout/             # Layout components
│   ├── header.tsx
│   └── footer.tsx
└── ui/                 # Reusable UI components (Shadcn)
    ├── button.tsx
    └── card.tsx
```

### Library Code
```
src/lib/
├── db/                 # Database operations
│   ├── animals.ts     # Animal CRUD
│   └── tasks.ts       # Task CRUD
├── validations/       # Zod schemas
│   ├── animal.ts
│   └── task.ts
├── constants/         # Constants
│   ├── database.ts
│   └── teams.ts
└── utils.ts           # Utility functions
```

## TypeScript Conventions

### Type Definitions
- Define types in `src/types/` directory
- One file per domain (animal, task, etc.)
- Export all types

```typescript
// src/types/animal.ts
export interface AnimalProfile {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  // ...
}

export interface AnimalDocument extends AnimalProfile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}
```

### Type Imports
```typescript
import type { AnimalProfile } from '@/types/animal';
import { type AnimalProfile } from '@/types/animal'; // Alternative
```

### Strict Mode
- Always use TypeScript strict mode
- No implicit `any`
- Proper null checks

```typescript
// ✅ Good
function getAnimal(id: string): AnimalProfile | null {
  // ...
}

// ❌ Bad
function getAnimal(id) {
  // ...
}
```

### Type Inference
- Let TypeScript infer types when obvious
- Explicitly type function returns
- Explicitly type complex objects

```typescript
// ✅ Good - inference
const name = 'Max';
const animals = await getAnimals();

// ✅ Good - explicit
function getAnimalById(id: string): Promise<AnimalProfile | null> {
  // ...
}

// ❌ Bad - unnecessary
const name: string = 'Max';
```

## React Conventions

### Component Structure
```typescript
'use client'; // Only if client component

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import type { AnimalProfile } from '@/types/animal';

interface AnimalCardProps {
  animal: AnimalProfile;
  onEdit?: (id: string) => void;
}

export function AnimalCard({ animal, onEdit }: AnimalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const handleEdit = () => {
    onEdit?.(animal.id);
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Component Order
1. Imports (React, third-party, local)
2. Type definitions
3. Component function
4. Hooks (useState, useEffect, custom hooks)
5. Event handlers
6. Helper functions
7. Return JSX

### Props
- Use interfaces for props
- Destructure props in function signature
- Use optional chaining for optional callbacks

```typescript
interface Props {
  title: string;
  description?: string;
  onSave?: (data: FormData) => void;
}

export function MyComponent({ title, description, onSave }: Props) {
  const handleSave = (data: FormData) => {
    onSave?.(data); // Optional chaining
  };
}
```

### Hooks
- Custom hooks start with `use`
- Place hooks at the top of component
- Don't call hooks conditionally

```typescript
// ✅ Good
export function MyComponent() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  
  if (!user) return null;
  
  return <div>{data}</div>;
}

// ❌ Bad
export function MyComponent() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const [data, setData] = useState(null); // Hook called conditionally
  
  return <div>{data}</div>;
}
```

### Event Handlers
- Prefix with `handle`
- Use arrow functions for inline handlers

```typescript
const handleClick = () => {
  // ...
};

const handleSubmit = async (data: FormData) => {
  // ...
};

<button onClick={handleClick}>Click</button>
<button onClick={() => handleDelete(id)}>Delete</button>
```

## Database Conventions

### Function Naming
- CRUD operations: `create`, `get`, `update`, `delete`
- List operations: `getAnimals`, `getTasks`
- Specific queries: `getAnimalsNeedingAttention`, `getUpcomingTasks`

```typescript
// CRUD
export const createAnimal = async (data) => { };
export const getAnimalById = async (id) => { };
export const updateAnimal = async (id, data) => { };
export const deleteAnimal = async (id) => { };

// List
export const getAnimals = async (filters?) => { };

// Specific
export const getAnimalsNeedingAttention = async () => { };
```

### Query Building
- Build queries in order of indexes
- Use query configuration constants
- Always paginate list queries

```typescript
const queries: string[] = [];

// Filters in index order
if (filters?.type) {
  queries.push(Query.equal('type', filters.type));
}
if (filters?.status) {
  queries.push(Query.equal('status', filters.status));
}

// Ordering
queries.push(Query.orderDesc('$createdAt'));

// Pagination
const { limit, offset } = normalizePagination(filters);
queries.push(Query.limit(limit));
queries.push(Query.offset(offset));
```

### Return Types
- Single item: Return type or null
- List: Return object with items, total, pagination

```typescript
// Single
export const getAnimalById = async (id: string): Promise<AnimalProfile | null> => {
  // ...
};

// List
export const getAnimals = async (): Promise<{
  animals: AnimalProfile[];
  total: number;
  pagination: PaginationMeta;
}> => {
  // ...
};
```

### Error Handling
- Try-catch for single items (return null)
- Let errors bubble for create/update/delete
- Log errors for debugging

```typescript
// Get - return null on error
export const getAnimalById = async (id: string): Promise<AnimalProfile | null> => {
  try {
    const document = await databases.getDocument(...);
    return documentToAnimal(document);
  } catch (error) {
    console.error('Error fetching animal:', error);
    return null;
  }
};

// Create - let error bubble
export const createAnimal = async (data: CreateAnimalInput): Promise<AnimalProfile> => {
  const validatedData = createAnimalSchema.parse(data);
  const document = await databases.createDocument(...);
  return documentToAnimal(document);
};
```

## Validation Conventions

### Zod Schemas
- One file per domain
- Export schemas and inferred types
- Provide clear error messages

```typescript
import { z } from 'zod';

export const animalProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(['dog', 'cat'], { message: 'Type must be dog or cat' }),
  age: z.number().min(0, 'Age must be positive').max(30, 'Age too high'),
});

export const createAnimalSchema = animalProfileSchema;
export const updateAnimalSchema = animalProfileSchema.partial();

export type AnimalProfileFormData = z.infer<typeof animalProfileSchema>;
```

### Validation Usage
```typescript
// In database operations
const validatedData = createAnimalSchema.parse(data);

// In forms
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<AnimalProfileFormData>({
  resolver: zodResolver(animalProfileSchema),
});
```

## Styling Conventions

### Tailwind CSS
- Use Tailwind utility classes
- Group related utilities
- Use responsive prefixes
- Use dark mode variants

```typescript
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white dark:bg-gray-800
  shadow-md hover:shadow-lg
  md:p-6
">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Title
  </h2>
</div>
```

### Class Name Utility
- Use `cn()` for conditional classes
- Merge Tailwind classes properly

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isPrimary ? 'primary-class' : 'secondary-class',
  className // Allow prop override
)} />
```

### Component Variants
- Use `class-variance-authority` for variants
- Define variants in component file

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        primary: 'primary-classes',
      },
      size: {
        sm: 'small-classes',
        lg: 'large-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);
```

## Import Conventions

### Import Order
1. React imports
2. Third-party imports
3. Internal imports (contexts, hooks, components)
4. Type imports
5. Relative imports

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getAnimals } from '@/lib/db/animals';

import type { AnimalProfile } from '@/types/animal';

import { localHelper } from './helpers';
```

### Path Aliases
- Use `@/` for src directory
- Avoid relative imports for shared code

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { getAnimals } from '@/lib/db/animals';

// ❌ Bad
import { Button } from '../../../components/ui/button';
```

## Comment Conventions

### File Headers
```typescript
/**
 * Animal Database Operations
 * 
 * Provides CRUD operations and queries for animal profiles.
 * Uses indexes for optimal query performance.
 */
```

### Function Comments
```typescript
/**
 * Get animals with optional filters and pagination
 * 
 * @param filters - Optional filters for type, status, packId
 * @returns Object with animals array, total count, and pagination metadata
 * 
 * @example
 * const { animals, total } = await getAnimals({ type: 'dog', limit: 10 });
 */
export const getAnimals = async (filters?) => {
  // ...
};
```

### Inline Comments
- Explain why, not what
- Comment complex logic
- Reference indexes used

```typescript
// Uses index: type_status (type ASC, status ASC)
if (filters?.type) {
  queries.push(Query.equal('type', filters.type));
}

// Calculate pagination to ensure within bounds
const { limit, offset } = normalizePagination(filters);
```

### TODO Comments
```typescript
// TODO: Add caching for frequently accessed animals
// FIXME: Handle edge case when packId is invalid
// NOTE: This query is optimized for the type_status index
```

## Error Handling Conventions

### Try-Catch
```typescript
try {
  const result = await operation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw error; // or return null/default
}
```

### User-Facing Errors
```typescript
try {
  await createAnimal(data);
  toast.success('Animal created successfully');
} catch (error: any) {
  const message = error.message || 'Failed to create animal';
  toast.error(message);
}
```

### Validation Errors
```typescript
try {
  const validatedData = schema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    error.errors.forEach(err => {
      console.error(`${err.path}: ${err.message}`);
    });
  }
}
```

## Testing Conventions

### Test File Naming
- Place tests in `__tests__` directory
- Name: `[filename].test.ts`

```
src/lib/validations/
├── animal.ts
└── __tests__/
    └── animal.test.ts
```

### Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { animalProfileSchema } from '../animal';

describe('Animal Validation', () => {
  describe('animalProfileSchema', () => {
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
});
```

## Git Conventions

### Commit Messages
```
feat: Add animal search functionality
fix: Correct pagination calculation
docs: Update API documentation
style: Format code with Prettier
refactor: Simplify query building logic
test: Add tests for animal validation
chore: Update dependencies
```

### Branch Naming
```
feature/animal-search
fix/pagination-bug
docs/api-documentation
refactor/query-builder
```

## Performance Best Practices

### Memoization
```typescript
import { useMemo, useCallback } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Code Splitting
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false,
});
```

### Image Optimization
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

## Accessibility Best Practices

### Semantic HTML
```typescript
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <h1>Page Title</h1>
  <article>Content</article>
</main>
```

### ARIA Attributes
```typescript
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### Keyboard Navigation
```typescript
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Interactive element
</div>
```
