# Complete Mock Data Guide - CampusPaws

## Overview

CampusPaws is fully configured to run with **mock data** for all features, allowing complete development and testing without any backend setup. This guide covers all mock data implementations across the platform.

## 🎯 Quick Start

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Navigate to `http://localhost:3000`
5. Everything works out of the box! ✨

## 📋 Mock Data Status

### ✅ Fully Implemented with Mock Data

| Feature              | Status    | Mock Data Location                 | Notes                                      |
| -------------------- | --------- | ---------------------------------- | ------------------------------------------ |
| **Authentication**   | ✅ Active | `src/lib/mock-auth.ts`             | 3 test accounts (admin, volunteer, public) |
| **Animals**          | ✅ Active | `src/lib/mock-data/animals.ts`     | 12 animal profiles with photos             |
| **Territories/Map**  | ✅ Active | `src/lib/mock-data/territories.ts` | 6 territories with boundaries              |
| **Impact Dashboard** | ✅ Active | `src/lib/mock-data/impact.ts`      | Real-time metrics and activities           |
| **Tasks**            | ✅ Active | Database fallback                  | Mock tasks generated                       |
| **Medical Records**  | ✅ Active | Database fallback                  | Mock medical history                       |
| **Notifications**    | ✅ Active | Database fallback                  | Mock notifications                         |

## 🔐 Authentication (Mock Login)

### Available Test Accounts

The login page displays these credentials prominently in development mode:

#### 👑 Admin Account

- **Email**: `admin@ccf.dev`
- **Password**: `admin123`
- **Access**: Full system access including admin panel
- **Features**: Animal management, user management, all volunteer features

#### 🤝 Volunteer Account

- **Email**: `volunteer@ccf.dev`
- **Password**: `volunteer123`
- **Access**: Dashboard, tasks, medical records
- **Features**: Task management, medical record viewing, notifications

#### 👤 Public Account

- **Email**: `user@ccf.dev`
- **Password**: `user123`
- **Access**: Public pages only
- **Features**: Animal gallery, territories map, events, stories

### How Mock Auth Works

```typescript
// Automatically tries mock auth first in development
if (mockAuthService.isAvailable()) {
  const result = await mockAuthService.login(email, password);
  // Creates local session in localStorage
}
```

**Session Storage**: `localStorage.getItem('ccf_mock_session')`

**Documentation**: See `DEV_CREDENTIALS.md` for detailed troubleshooting

## 🐕 Animals Mock Data

### Features

- **12 animal profiles** with realistic data
- Various breeds (dogs and cats)
- Different statuses (healthy, needs_attention, under_treatment)
- Multiple campus locations
- Profile photos from Unsplash
- Complete medical history

### Usage

```typescript
import { mockAnimals } from '@/lib/mock-data/animals';
// Automatically used when Appwrite is unavailable
```

**Location**: `src/lib/mock-data/animals.ts`

## 🗺️ Territories/Map Mock Data

### Features

- **6 territories** across campus
- Realistic GPS boundaries (IIT Roorkee coordinates)
- Pack sizes ranging from 2-12 animals
- Assigned volunteers
- Interactive map with heatmap overlay

### Territories Included

1. Main Building Area (8 animals)
2. Hostel Complex (12 animals)
3. Library Lawn (5 animals)
4. Sports Complex (6 animals)
5. Academic Block (4 animals)
6. Cafeteria Area (2 animals)

**Location**: `src/lib/mock-data/territories.ts`

**Map Technology**: React Leaflet + OpenStreetMap

## 📊 Impact Dashboard Mock Data

### Features

- **Real-time metrics** with trends
- **Recent activities** that update every 30 seconds
- **Historical trends** for 30 days
- Simulated real-time updates

### Mock Metrics

- Animals Rescued: 247 total, 18 this month (↑12.5%)
- Active Volunteers: 89 total, 12 this week (↑8.3%)
- Meals Provided: 3456 total, 234 this week (stable)
- Successful Adoptions: 156 total, 8 this month (↑14.2%)

### Simulated Real-Time Updates

New activities appear every 30 seconds:

- Random activity types (donation, adoption, volunteer, rescue)
- Random names and messages
- Automatic cleanup (keeps 10 most recent)

**Location**: `src/lib/mock-data/impact.ts`

**Toggle**: `USE_MOCK_DATA` in `src/hooks/useImpactMetrics.ts`

## 🔄 How Mock Data Works

### Automatic Fallback Pattern

Most features use this pattern:

```typescript
export const getAnimals = async () => {
  // Check if we should use mock data
  if (useMockData()) {
    return mockAnimals;
  }

  try {
    // Try Appwrite
    const response = await databases.listDocuments(...);
    return response.documents;
  } catch (error) {
    // Fallback to mock data
    console.warn('Using mock data');
    return mockAnimals;
  }
};
```

### Development Mode Detection

```typescript
const useMockData = () => {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'
  );
};
```

## 🎨 Visual Indicators

### Login Page

- Prominent credentials display with color-coded roles
- Copy-to-clipboard functionality
- Role descriptions and access levels

### Console Logs

- `✅ Mock auth successful` - Login worked
- `🔧 Using mock data` - Feature using mock data
- `ℹ️ Not a mock user` - Trying real Appwrite

### Development Notices

- Blue banners on pages using mock data
- Console warnings when falling back to mock data

## 📁 Mock Data File Structure

```
src/lib/mock-data/
├── README.md              # Mock data overview
├── animals.ts             # 12 animal profiles
├── territories.ts         # 6 territories with boundaries
└── impact.ts              # Impact metrics and activities

src/lib/
├── mock-auth.ts           # Mock authentication service
└── auth.ts                # Auth service (tries mock first)
```

## 🔧 Configuration

### Enable/Disable Mock Data

#### Global Toggle (Future)

Add to `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK_DATA=false  # Disable all mock data
```

#### Per-Feature Toggle

Each feature has its own toggle:

**Impact Dashboard**:

```typescript
// src/hooks/useImpactMetrics.ts
const USE_MOCK_DATA = true; // Change to false
```

**Authentication**:

```typescript
// src/lib/mock-auth.ts
isAvailable() {
  return process.env.NODE_ENV === 'development';
}
```

## 🚀 Switching to Real Backend

### Step-by-Step Guide

#### 1. Set Up Appwrite

- Install Appwrite (see `docs/SETUP_GUIDE.md`)
- Create database and collections
- Set up authentication
- Configure storage buckets

#### 2. Add Environment Variables

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=ccf-database
# ... other variables
```

#### 3. Disable Mock Data

- Set `NEXT_PUBLIC_USE_MOCK_DATA=false`
- Or change individual feature toggles

#### 4. Test

- Verify all features work with real backend
- Check authentication flows
- Test data persistence

## 🧪 Testing with Mock Data

### Advantages

- ✅ No backend setup required
- ✅ Consistent test data
- ✅ Fast development iteration
- ✅ Offline development
- ✅ Predictable behavior
- ✅ Easy to demo

### Limitations

- ❌ No data persistence
- ❌ No real-time sync across tabs
- ❌ Can't test backend validation
- ❌ Can't test performance at scale
- ❌ Can't test error scenarios

### Best Practices

1. **Develop with mock data** - Fast iteration
2. **Test with real backend** - Before production
3. **Keep mock data realistic** - Match production scenarios
4. **Update regularly** - Keep in sync with types
5. **Document changes** - Update this guide

## 📖 Related Documentation

- `DEV_CREDENTIALS.md` - Login credentials and troubleshooting
- `docs/IMPACT_DASHBOARD_MOCK_DATA.md` - Impact dashboard specifics
- `src/lib/mock-data/README.md` - Mock data directory overview
- `docs/SETUP_GUIDE.md` - Real backend setup
- `MOCK_SETUP_COMPLETE.md` - Original mock setup notes

## 🎯 Feature-Specific Guides

### Animals & Gallery

- **Page**: `/animals`
- **Mock Data**: 12 profiles
- **Features**: Filtering, search, pagination
- **Photos**: Unsplash images

### Territories Map

- **Page**: `/territories`
- **Mock Data**: 6 territories
- **Features**: Interactive map, heatmap, boundaries
- **Technology**: Leaflet + OpenStreetMap

### Dashboard

- **Page**: `/dashboard`
- **Access**: Volunteer/Admin only
- **Mock Data**: Tasks, notifications, quick stats
- **Features**: Task overview, quick actions

### Impact Dashboard

- **Page**: `/` (homepage) and `/impact`
- **Mock Data**: Metrics, activities, trends
- **Features**: Real-time updates, historical charts
- **Update Frequency**: Every 30 seconds

## 🐛 Troubleshooting

### Login Not Working

1. Check credentials exactly match (case-sensitive)
2. Verify `NODE_ENV=development`
3. Clear localStorage: `localStorage.clear()`
4. Check console for error messages

### Mock Data Not Loading

1. Check console for warnings
2. Verify mock data files exist
3. Check import paths
4. Restart development server

### Map Not Showing

1. Check browser console for errors
2. Verify Leaflet CSS is loaded
3. Check mock territories data
4. Try refreshing the page

### Dashboard Shows Empty

1. Login with correct credentials
2. Check role permissions
3. Verify mock data is enabled
4. Check console logs

## 💡 Tips & Tricks

### Quick Copy Credentials

The login page shows credentials - click to copy (future enhancement)

### Console Debugging

Open DevTools and filter by:

- `Mock` - See all mock data operations
- `✅` - See successful operations
- `❌` - See errors

### Testing Different Roles

1. Logout
2. Login with different account
3. See different features/permissions

### Simulating Real-Time Updates

Impact dashboard activities update every 30 seconds automatically

## 🎉 Summary

CampusPaws is **100% functional with mock data**:

- ✅ No backend setup required
- ✅ All features work out of the box
- ✅ Complete development environment
- ✅ Ready for demos and testing
- ✅ Easy to switch to real backend later

**Just run `npm run dev` and start developing!** 🚀
