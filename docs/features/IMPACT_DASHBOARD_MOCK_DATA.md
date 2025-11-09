# Impact Dashboard - Mock Data Implementation

## Overview

The Impact Dashboard is currently configured to use **mock data** for development and demonstration purposes. This allows the dashboard to function fully without requiring Appwrite backend setup.

## Why Mock Data?

Using mock data provides several benefits:

1. **Immediate Development**: Start working on the dashboard without backend setup
2. **Consistent Testing**: Predictable data for testing UI components
3. **Demo Ready**: Show the dashboard to stakeholders without backend dependencies
4. **Offline Development**: Work without internet connection or backend access
5. **Rapid Iteration**: Quickly test different scenarios and edge cases

## Current Implementation

### Configuration

The mock data mode is controlled by a single constant in `src/hooks/useImpactMetrics.ts`:

```typescript
const USE_MOCK_DATA = true; // Set to false to use Appwrite backend
```

### Mock Data Features

#### 1. Current Metrics

Realistic impact metrics with trends:

- **Animals Rescued**: 247 total, 18 this month (↑12.5%)
- **Active Volunteers**: 89 total, 12 this week (↑8.3%)
- **Meals Provided**: 3456 total, 234 this week (stable, ↑0.5%)
- **Successful Adoptions**: 156 total, 8 this month (↑14.2%)

#### 2. Recent Activities

8 sample activities showing:

- Donations (e.g., "Sarah M. donated ₹500")
- Adoptions (e.g., "Raj K. adopted Max")
- Volunteer sign-ups (e.g., "Priya S. joined as volunteer")
- Rescue reports (e.g., "Anonymous reported rescue case")

#### 3. Historical Trends

- 30 days of trend data for each metric
- Realistic variation (±15%)
- Smooth progression over time
- Configurable period (daily/weekly/monthly)

#### 4. Simulated Real-Time Updates

- New activities appear every 30 seconds
- Random activity types and names
- Mimics Appwrite Realtime behavior
- Activities automatically limited to 10 most recent

## How It Works

### Data Flow

```
Component Request
    ↓
useImpactMetrics Hook
    ↓
Check USE_MOCK_DATA flag
    ↓
If true: Load from mock-data/impact.ts
If false: Fetch from Appwrite
    ↓
Return data to component
```

### Simulated Network Delay

To make the mock data feel more realistic, we simulate network delays:

- Initial load: 500ms delay
- Trend data: 300ms delay

This ensures loading states are properly tested.

### Simulated Real-Time Updates

The mock implementation includes a timer that:

1. Runs every 30 seconds
2. Generates a random activity
3. Adds it to the activity list
4. Removes oldest activities (keeps 10)

This simulates the behavior of Appwrite Realtime subscriptions.

## Using Mock Data

### In Components

Simply use the hooks as normal:

```tsx
import { useImpactMetrics } from '@/hooks/useImpactMetrics';

function MyComponent() {
  const { metrics, activities, loading, error } = useImpactMetrics();

  // Data is automatically mocked
  return <ImpactDashboard metrics={metrics} activities={activities} />;
}
```

### Direct Import

You can also import mock data directly:

```tsx
import {
  mockCurrentMetrics,
  mockRecentActivities,
  mockTrendData,
} from '@/lib/mock-data/impact';

<ImpactDashboard
  metrics={mockCurrentMetrics}
  activities={mockRecentActivities}
  loading={false}
/>;
```

## Switching to Real Backend

When you're ready to use the Appwrite backend:

### Step 1: Set Up Appwrite

Follow the setup guide in `docs/IMPACT_DASHBOARD_SETUP.md`:

1. Create `impact-metrics` collection
2. Create `recent-activities` collection
3. Set up indexes and permissions
4. Add environment variables

### Step 2: Enable Real Backend

Open `src/hooks/useImpactMetrics.ts` and make these changes:

```typescript
// Change this line
const USE_MOCK_DATA = false; // Changed from true

// Uncomment the Appwrite implementation code
// Look for comments like:
// /* Real Appwrite implementation (uncomment when backend is ready) */
```

### Step 3: Test

1. Verify Appwrite collections exist
2. Check environment variables are set
3. Test the dashboard loads correctly
4. Verify real-time updates work

## Mock Data Maintenance

### Updating Mock Data

To update the mock data, edit `src/lib/mock-data/impact.ts`:

```typescript
export const mockCurrentMetrics: ImpactMetrics = {
  id: 'mock-metrics-1',
  animalsRescued: {
    total: 300, // Update this
    current: 25, // Update this
    trend: 'up',
    percentageChange: 15.0,
  },
  // ... update other metrics
};
```

### Adding New Activities

Add to the `mockRecentActivities` array:

```typescript
{
  id: 'activity-new',
  type: 'donation',
  displayName: 'New User',
  timestamp: new Date(),
  message: 'donated ₹1000',
  $createdAt: new Date().toISOString(),
}
```

### Generating Custom Trends

Use the `generateMockTrendData` function:

```typescript
const customTrend = generateMockTrendData(
  'customMetric',
  50, // base value
  60 // number of days
);
```

## Testing Scenarios

### Test Loading States

```typescript
// In your component
const [loading, setLoading] = useState(true);

useEffect(() => {
  setTimeout(() => setLoading(false), 2000);
}, []);
```

### Test Error States

```typescript
// Temporarily modify the hook to return an error
const error = new Error('Test error');
```

### Test Empty States

```typescript
// Use empty arrays/null values
<ImpactDashboard
  metrics={null}
  activities={[]}
  loading={false}
/>
```

## Advantages of Current Implementation

1. **Zero Configuration**: Works immediately after cloning the repo
2. **Consistent Data**: Same data across all developers
3. **Fast Development**: No backend delays or issues
4. **Easy Testing**: Predictable data for testing
5. **Demo Ready**: Can show to stakeholders anytime
6. **Offline Work**: No internet required
7. **Easy Switching**: Single flag to enable real backend

## Limitations

1. **No Persistence**: Data resets on page refresh
2. **No Real Updates**: Simulated updates only
3. **Fixed Data**: Can't test with dynamic data
4. **No Validation**: Doesn't test backend validation
5. **No Errors**: Doesn't test backend error scenarios

## Best Practices

1. **Keep Mock Data Realistic**: Use realistic values and trends
2. **Update Regularly**: Keep mock data in sync with types
3. **Test Both Modes**: Test with mock and real data
4. **Document Changes**: Update this file when changing mock data
5. **Use for Development**: Switch to real backend for production testing

## Troubleshooting

### Dashboard Shows Loading Forever

Check that `USE_MOCK_DATA` is set to `true` in the hook.

### Activities Not Updating

The simulated updates run every 30 seconds. Wait or reduce the interval in the code.

### Trends Not Showing

Ensure you're using `useMetricTrend` hook which handles mock data automatically.

### TypeScript Errors

Ensure mock data matches the TypeScript interfaces in `src/types/impact.ts`.

## Future Enhancements

Potential improvements to the mock data system:

1. **Mock Data Generator**: Tool to generate custom mock data
2. **Scenario Presets**: Different data scenarios (high growth, stable, declining)
3. **Time Travel**: Simulate different time periods
4. **User Controls**: UI to modify mock data in real-time
5. **Persistence**: Save mock data to localStorage
6. **Import/Export**: Share mock data configurations

## Related Documentation

- `docs/IMPACT_DASHBOARD.md` - Complete feature documentation
- `docs/IMPACT_DASHBOARD_SETUP.md` - Appwrite setup guide
- `docs/IMPACT_DASHBOARD_QUICK_START.md` - Quick start guide
- `src/lib/mock-data/README.md` - Mock data directory overview
- `docs/TASK_2_COMPLETION_SUMMARY.md` - Implementation summary

## Support

For questions about mock data:

1. Check this documentation
2. Review the mock data file: `src/lib/mock-data/impact.ts`
3. Check the hook implementation: `src/hooks/useImpactMetrics.ts`
4. Contact the development team
