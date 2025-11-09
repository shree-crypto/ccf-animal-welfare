# Development Credentials

For local development and testing, you can use these mock credentials.

## Quick Start

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000/login
3. Use any of the credentials below
4. You'll be redirected to the dashboard automatically

## Troubleshooting

If mock login isn't working:

1. **Check the browser console** - You should see:
   - `✅ Mock auth successful: admin@ccf.dev` (on successful login)
   - `❌ Mock auth failed: Invalid password for mock user` (on wrong password)
   - `ℹ️ Not a mock user, trying Appwrite auth...` (if email is not a mock user)

2. **Verify NODE_ENV** - Mock auth only works in development mode
   - Check console: `console.log(process.env.NODE_ENV)` should show `'development'`

3. **Check localStorage** - After successful login:
   - Open DevTools → Application → Local Storage
   - Look for key `ccf_mock_session`
   - Should contain user data with role

4. **Clear cache and localStorage**:

   ```javascript
   localStorage.clear();
   location.reload();
   ```

5. **Verify credentials exactly**:
   - Email: `admin@ccf.dev` (not admin@ccf.com or admin@dev)
   - Password: `admin123` (case-sensitive)

---

## Mock Users

### Admin User

- **Email**: `admin@ccf.dev`
- **Password**: `admin123`
- **Role**: Admin
- **Access**: Full access to all features including admin dashboard

### Volunteer User

- **Email**: `volunteer@ccf.dev`
- **Password**: `volunteer123`
- **Role**: Volunteer
- **Access**: Dashboard, tasks, medical records, notifications

### Public User

- **Email**: `user@ccf.dev`
- **Password**: `user123`
- **Role**: Public
- **Access**: Public pages only (animals, territories, events, etc.)

## How to Use

1. Go to `/login` page
2. Enter one of the email/password combinations above
3. The mock authentication will bypass Appwrite and create a local session

## Important Pages

### Territory Map

- **URL**: `/territories`
- **Access**: Public (no login required)
- **Features**: Interactive map with pack territories, heatmap overlay
- **Technology**: React Leaflet with OpenStreetMap
- **Mock Data**: 6 territories with different pack sizes automatically loaded in development

### Dashboard

- **URL**: `/dashboard`
- **Access**: Volunteer and Admin only
- **Features**: Task overview, quick actions, statistics

### Admin Panel

- **URL**: `/admin/animals`
- **Access**: Admin only
- **Features**: Animal management, bulk upload, data table

## Note

These credentials only work in development mode (`NODE_ENV=development`). In production, real Appwrite authentication is required.

## Features by Role

### Admin

- ✅ View all animals
- ✅ Add/Edit/Delete animals
- ✅ Bulk upload animals
- ✅ Manage medical records
- ✅ Manage tasks
- ✅ View territories
- ✅ User management

### Volunteer

- ✅ View all animals
- ✅ View medical records
- ✅ Manage assigned tasks
- ✅ View territories
- ✅ Receive notifications
- ❌ Cannot add/edit/delete animals
- ❌ Cannot access admin features

### Public

- ✅ View animal gallery
- ✅ View territories map
- ✅ View events
- ✅ View success stories
- ✅ Contact page
- ❌ Cannot access dashboard
- ❌ Cannot access admin features
