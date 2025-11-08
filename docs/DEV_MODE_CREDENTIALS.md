# Development Mode Credentials

## Overview

The login page includes a development mode banner and test credentials section that helps developers quickly test different user roles without manually entering credentials.

## Features

### 1. Development Mode Banner

A prominent banner at the top of the login page that:
- Clearly indicates "Development Mode"
- Warns that mock authentication is being used
- Provides a toggle to show/hide the credentials section
- Can be dismissed (minimized to a small button)

### 2. Test Credentials Section

When visible, displays three credential cards:
- **Admin Account**: Full access to all features
- **Volunteer Account**: Access to tasks, medical records, dashboard
- **Public Account**: Limited access to public features only

Each card includes:
- Role icon and title
- Email and password with copy-to-clipboard functionality
- Auto-fill button to populate the login form
- Quick login button for instant access

## Environment Detection

### Default Behavior

By default, the development mode banner and credentials are:
- **Shown** when `NODE_ENV === 'development'`
- **Hidden** when `NODE_ENV === 'production'`

### Environment Variable Override

You can override the default behavior using the `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS` environment variable:

```bash
# Hide credentials even in development mode
NEXT_PUBLIC_SHOW_DEV_CREDENTIALS=false

# Show credentials in staging/testing (NOT recommended for production)
NEXT_PUBLIC_SHOW_DEV_CREDENTIALS=true
```

### Production Safety

The credentials section is **automatically hidden** in production builds to ensure security. The environment detection logic:

1. Checks if `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS === 'false'` → Hide credentials
2. Checks if `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS === 'true'` → Show credentials
3. Falls back to `NODE_ENV === 'development'` → Show only in dev mode

This ensures that credentials are **never accidentally exposed in production** unless explicitly enabled via environment variable.

## Usage

### For Developers

1. **Auto-Fill**: Click any credential card to automatically fill the login form
2. **Quick Login**: Click the "Login" button on a card for instant access
3. **Copy Credentials**: Use the copy buttons to copy individual fields
4. **Toggle Visibility**: Use the banner toggle to show/hide credentials
5. **Dismiss Banner**: Click the X button to minimize the banner

### For Testing

To test different roles:

1. **Admin Testing**:
   - Email: `admin@ccf.dev`
   - Password: `admin123`
   - Access: All features including admin panel

2. **Volunteer Testing**:
   - Email: `volunteer@ccf.dev`
   - Password: `volunteer123`
   - Access: Dashboard, tasks, medical records, notifications

3. **Public Testing**:
   - Email: `user@ccf.dev`
   - Password: `user123`
   - Access: Public pages only (animals, territories, stories, events)

## Implementation Details

### Files

- **Component**: `src/components/features/auth/DevModeBanner.tsx`
- **Utility**: `src/lib/utils/env.ts`
- **Integration**: `src/app/login/page.tsx`

### Environment Detection Function

```typescript
import { isDevelopmentMode } from '@/lib/utils/env';

const isDev = isDevelopmentMode();
```

### Banner Component

```typescript
<DevModeBanner
  onToggleCredentials={setShowCredentials}
  showCredentials={showCredentials}
/>
```

## Security Considerations

1. **Never commit credentials to production**: The environment detection ensures credentials are hidden by default in production builds.

2. **Environment variable override**: Use `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS` only for staging/testing environments, never for production.

3. **Mock authentication**: The credentials use mock authentication which should be replaced with real authentication in production.

4. **Build verification**: Always verify that credentials are hidden in production builds before deploying.

## Testing the Build

To verify that credentials are properly hidden in production:

```bash
# Build for production
npm run build

# Start production server
npm start

# Visit http://localhost:3000/login
# Verify that the dev banner and credentials are NOT visible
```

## Troubleshooting

### Credentials not showing in development

1. Check that `NODE_ENV === 'development'`
2. Check if `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS` is set to `'false'`
3. Clear browser cache and reload

### Credentials showing in production

1. Check `NODE_ENV` is set to `'production'`
2. Verify `NEXT_PUBLIC_SHOW_DEV_CREDENTIALS` is not set to `'true'`
3. Rebuild the application with `npm run build`

### Banner dismissed and can't find it

Click the small "Dev Mode" button in the top-right corner to restore the banner.
