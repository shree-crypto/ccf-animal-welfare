# Development Credentials

For local development and testing, you can use these mock credentials.

## Quick Start

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000/login
3. Use any of the credentials below
4. You'll be redirected to the dashboard automatically

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
- **Note**: Uses React Leaflet with OpenStreetMap

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
