# Context Optimization Guide

## Overview

This document explains the optimization patterns used in our React Context implementations to prevent unnecessary re-renders and improve application performance.

## Context Architecture

### Context Hierarchy

```
ErrorBoundary
└── AuthProvider
    └── NotificationProvider
        └── Application Components
```

**Rationale**: NotificationProvider depends on AuthContext (needs user data), so it must be nested inside AuthProvider.

## Optimization Patterns

### 1. Memoized Context Values

Both `AuthContext` and `NotificationContext` use `useMemo` to memoize their context values:

```typescript
const value = useMemo(
  () => ({
    // context data and functions
  }),
  [dependencies]
);
```

**Why**: Without memoization, the context value object is recreated on every render, causing all consumers to re-render even when the actual data hasn't changed.

### 2. Stable Function References

All context functions use `useCallback` to maintain stable references:

```typescript
const login = useCallback(
  async (email: string, password: string) => {
    // implementation
  },
  [dependencies]
);
```

**Why**: Functions passed through context should have stable references to prevent unnecessary re-renders of components that use them.

### 3. Minimal Dependencies

Context values only include dependencies that actually change:

- **AuthContext**: `[user, loading, login, register, logout, updateProfile, checkRole]`
- **NotificationContext**: `[notifications, unreadCount, loading, markNotificationAsRead, markAllNotificationsAsRead, fetchNotifications]`

**Why**: Fewer dependencies mean fewer re-renders. Only include what consumers actually need.

## Performance Characteristics

### AuthContext

- **Re-renders when**: User logs in/out, loading state changes
- **Stable functions**: login, register, logout, updateProfile, checkRole
- **Consumers**: ~15 components (Header, forms, protected routes, pages)

### NotificationContext

- **Re-renders when**: New notifications arrive, notifications are read, unread count changes
- **Stable functions**: markNotificationAsRead, markAllNotificationsAsRead, refreshNotifications
- **Consumers**: NotificationCenter component
- **Real-time updates**: Subscribes to Appwrite real-time events

## Best Practices for Context Consumers

### 1. Destructure Only What You Need

```typescript
// ✅ Good - only subscribes to user changes
const { user } = useAuth();

// ❌ Bad - subscribes to all auth context changes
const auth = useAuth();
```

### 2. Consider Splitting Large Contexts

If a context has multiple independent pieces of state that change at different rates, consider splitting it:

```typescript
// Instead of one large context:
const AppContext = { userProfile, notifications, settings, theme };

// Split into focused contexts:
const UserContext = { userProfile };
const NotificationContext = { notifications };
const SettingsContext = { settings };
const ThemeContext = { theme };
```

### 3. Use Context Selectors for Complex State

For very large contexts, consider using a selector pattern:

```typescript
// Custom hook with selector
function useAuthSelector<T>(selector: (auth: AuthContextType) => T): T {
  const auth = useAuth();
  return useMemo(() => selector(auth), [auth, selector]);
}

// Usage
const userName = useAuthSelector(auth => auth.user?.name);
```

## Monitoring Context Performance

### React DevTools Profiler

1. Open React DevTools
2. Go to Profiler tab
3. Start recording
4. Perform actions that trigger context updates
5. Look for unnecessary re-renders in the flame graph

### Key Metrics to Watch

- **Render count**: How many times components re-render
- **Render duration**: How long renders take
- **Why did this render**: Check if context changes are the cause

## Common Anti-Patterns to Avoid

### ❌ Creating New Objects/Arrays in Context Value

```typescript
// Bad - creates new array on every render
const value = {
  items: items.filter(item => item.active),
};
```

```typescript
// Good - memoize computed values
const activeItems = useMemo(() => items.filter(item => item.active), [items]);

const value = useMemo(
  () => ({
    items: activeItems,
  }),
  [activeItems]
);
```

### ❌ Not Memoizing Context Value

```typescript
// Bad - new object on every render
return <Context.Provider value={{ user, login }}>{children}</Context.Provider>;
```

```typescript
// Good - memoized value
const value = useMemo(() => ({ user, login }), [user, login]);
return <Context.Provider value={value}>{children}</Context.Provider>;
```

### ❌ Inline Function Definitions

```typescript
// Bad - new function on every render
const value = {
  onUpdate: (id: string) => updateItem(id),
};
```

```typescript
// Good - stable function reference
const onUpdate = useCallback(
  (id: string) => {
    updateItem(id);
  },
  [updateItem]
);

const value = useMemo(() => ({ onUpdate }), [onUpdate]);
```

## Testing Context Performance

### Manual Testing Checklist

- [ ] Login/logout doesn't cause unnecessary re-renders in unrelated components
- [ ] Notification updates only re-render NotificationCenter
- [ ] Form submissions don't cause full page re-renders
- [ ] Navigation doesn't trigger context re-renders

### Automated Performance Tests

Consider adding performance tests using React Testing Library and performance APIs:

```typescript
import { renderHook } from '@testing-library/react';
import { performance } from 'perf_hooks';

test('context updates are performant', () => {
  const start = performance.now();
  const { result } = renderHook(() => useAuth());
  const end = performance.now();

  expect(end - start).toBeLessThan(100); // Should render in < 100ms
});
```

## Future Optimization Opportunities

### 1. Context Splitting

If NotificationContext grows to include more features (preferences, history, filters), consider splitting it:

- `NotificationDataContext` - notifications and unread count
- `NotificationActionsContext` - mark as read, delete, etc.

### 2. Virtualization

For large notification lists, implement virtualization to render only visible items.

### 3. Selective Subscriptions

Allow components to subscribe to specific notification types only:

```typescript
const urgentNotifications = useNotifications({
  filter: { priority: 'urgent' },
});
```

## References

- [React Context Performance](https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions)
- [useMemo Hook](https://react.dev/reference/react/useMemo)
- [useCallback Hook](https://react.dev/reference/react/useCallback)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
