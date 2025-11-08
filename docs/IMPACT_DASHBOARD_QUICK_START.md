# Impact Dashboard Quick Start Guide

## For Developers

### 1. Setup Appwrite Collections

Follow the detailed setup guide in `docs/IMPACT_DASHBOARD_SETUP.md` to create the required collections in Appwrite.

**Quick CLI Setup:**
```bash
# See IMPACT_DASHBOARD_SETUP.md for complete CLI commands
```

### 2. Add Environment Variables

Add to your `.env.local`:
```env
NEXT_PUBLIC_APPWRITE_COLLECTION_IMPACT_METRICS=impact-metrics
NEXT_PUBLIC_APPWRITE_COLLECTION_RECENT_ACTIVITIES=recent-activities
```

### 3. Use the Dashboard

#### On Homepage (Simple)
```tsx
import { ImpactDashboardContainer } from '@/components/features/impact';

<ImpactDashboardContainer />
```

#### Full Dashboard with Trends
```tsx
import { ImpactDashboardWithTrends } from '@/components/features/impact';

<ImpactDashboardWithTrends />
```

#### Custom Implementation
```tsx
import { useImpactMetrics } from '@/hooks/useImpactMetrics';
import { ImpactDashboard } from '@/components/features/impact';

function MyComponent() {
  const { metrics, activities, loading, error } = useImpactMetrics();
  
  return (
    <ImpactDashboard
      metrics={metrics}
      activities={activities}
      loading={loading}
    />
  );
}
```

### 4. Update Metrics (Admin)

```tsx
import { createImpactMetrics } from '@/lib/db/impact';

// Create new metrics snapshot
await createImpactMetrics({
  animalsRescued: {
    total: 247,
    current: 18,
    trend: 'up',
    percentageChange: 12.5,
  },
  volunteersActive: {
    total: 89,
    current: 12,
    trend: 'up',
    percentageChange: 8.3,
  },
  mealsProvided: {
    total: 3456,
    current: 234,
    trend: 'stable',
    percentageChange: 0.5,
  },
  successfulAdoptions: {
    total: 156,
    current: 8,
    trend: 'up',
    percentageChange: 14.2,
  },
});
```

### 5. Add Activities

```tsx
import { createRecentActivity } from '@/lib/db/impact';

// Add a donation activity
await createRecentActivity({
  type: 'donation',
  displayName: 'Sarah M.',
  message: 'donated ₹500',
});

// Add an adoption activity
await createRecentActivity({
  type: 'adoption',
  displayName: 'Raj K.',
  message: 'adopted Max',
});
```

## For Administrators

### Updating Metrics

Metrics should be updated regularly (daily or weekly) to keep the dashboard current:

1. **Calculate Current Values**: Count animals rescued, volunteers active, meals provided, and adoptions for the current period
2. **Calculate Trends**: Compare with previous period to determine trend direction
3. **Update Dashboard**: Use the admin interface or API to create new metrics

### Managing Activities

Activities are automatically created when:
- A donation is processed
- An adoption is completed
- A volunteer signs up
- A rescue is reported

You can also manually add activities for special events or milestones.

### Best Practices

1. **Update Frequency**: Update metrics at least weekly
2. **Accuracy**: Ensure all counts are accurate and verifiable
3. **Privacy**: Use first names only for activities (e.g., "Sarah M.")
4. **Cleanup**: Old activities are automatically cleaned up (keeps last 100)

## For Content Managers

### What to Monitor

1. **Metric Trends**: Ensure trends are accurate and reflect reality
2. **Activity Feed**: Monitor for inappropriate content
3. **User Engagement**: Track which metrics users interact with most

### Troubleshooting

**Dashboard not showing:**
- Check if collections exist in Appwrite
- Verify environment variables are set
- Check browser console for errors

**Metrics not updating:**
- Ensure Appwrite Realtime is enabled
- Check collection permissions
- Verify metrics are being created correctly

**Activities not appearing:**
- Check recent-activities collection exists
- Verify activities have proper timestamps
- Ensure public read permissions are set

## Testing with Mock Data

For development and testing, use the provided mock data:

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
/>
```

## Common Use Cases

### 1. Homepage Integration
Show simplified dashboard on homepage to build trust.

### 2. Dedicated Impact Page
Full dashboard with trends at `/impact` for detailed view.

### 3. Donation Page
Show impact metrics to encourage donations.

### 4. Annual Reports
Export metrics for annual impact reports.

### 5. Social Media
Share milestone achievements from the dashboard.

## Support

For detailed documentation, see:
- `docs/IMPACT_DASHBOARD.md` - Complete feature documentation
- `docs/IMPACT_DASHBOARD_SETUP.md` - Appwrite setup guide
- `docs/TASK_2_COMPLETION_SUMMARY.md` - Implementation details

For issues or questions, contact the development team.
