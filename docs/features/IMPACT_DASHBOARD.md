# Impact Dashboard Documentation

## Overview

The Live Impact Dashboard is a real-time transparency feature that displays key metrics about the CampusPaws platform's impact on campus animal welfare. It builds trust through radical transparency and provides visual proof of the organization's effectiveness.

## Features

### 1. Real-Time Metrics Display

Four key metrics are displayed with live updates:

- **Animals Rescued**: Total and monthly count of rescued animals
- **Active Volunteers**: Total and weekly count of active volunteers
- **Meals Provided**: Total and weekly count of meals served
- **Successful Adoptions**: Total and monthly count of successful adoptions

Each metric includes:

- Current period value (this month/week)
- Total cumulative value
- Trend indicator (up/down/stable)
- Percentage change from previous period

### 2. Historical Trend Visualizations

Interactive charts showing:

- Daily, weekly, or monthly trends
- Last 30 days of data
- Visual representation of progress over time
- Smooth animations and transitions

### 3. Recent Activity Ticker

Live-updating feed showing:

- Recent donations (first name only for privacy)
- New adoptions
- Volunteer sign-ups
- Rescue reports

Features:

- Auto-scrolling carousel
- Real-time updates via Appwrite Realtime
- Privacy-respecting display names
- Activity type badges with icons

### 4. Key Insights

Automatically generated insights based on trends:

- Highlights positive trends
- Celebrates milestones
- Provides context for metrics

## Components

### ImpactDashboard

Main dashboard component displaying metrics and activities.

```tsx
import { ImpactDashboard } from '@/components/features/impact';

<ImpactDashboard
  metrics={metrics}
  activities={activities}
  showTrends={false}
  loading={false}
/>;
```

**Props:**

- `metrics`: ImpactMetrics object or null
- `activities`: Array of RecentActivity objects
- `showTrends`: Boolean to show/hide trend charts
- `loading`: Boolean loading state
- `className`: Optional CSS classes

### ImpactDashboardContainer

Container component with data fetching and real-time updates.

```tsx
import { ImpactDashboardContainer } from '@/components/features/impact';

<ImpactDashboardContainer showTrends={false} />;
```

**Props:**

- `showTrends`: Boolean to show/hide trend charts
- `className`: Optional CSS classes

### ImpactDashboardWithTrends

Enhanced dashboard with historical trend visualizations.

```tsx
import { ImpactDashboardWithTrends } from '@/components/features/impact';

<ImpactDashboardWithTrends />;
```

**Props:**

- `className`: Optional CSS classes

### MetricCard

Individual metric display card.

```tsx
import { MetricCard } from '@/components/features/impact';

<MetricCard
  title="Animals Rescued"
  metric={metricValue}
  icon={<Heart />}
  description="This month"
  loading={false}
/>;
```

### TrendChart

Historical trend visualization chart.

```tsx
import { TrendChart } from '@/components/features/impact';

<TrendChart trend={trendData} title="Rescue Trend" loading={false} />;
```

### RecentActivity

Activity ticker component.

```tsx
import { RecentActivity } from '@/components/features/impact';

<RecentActivity activities={activities} loading={false} autoScroll={true} />;
```

## Hooks

### useImpactMetrics

Custom hook for fetching and subscribing to real-time metrics.

```tsx
import { useImpactMetrics } from '@/hooks/useImpactMetrics';

const { metrics, activities, loading, error, refetch } = useImpactMetrics();
```

**Returns:**

- `metrics`: Current impact metrics or null
- `activities`: Array of recent activities
- `loading`: Boolean loading state
- `error`: Error object or null
- `refetch`: Function to manually refetch data

### useMetricTrend

Hook for fetching historical trend data for a specific metric.

```tsx
import { useMetricTrend } from '@/hooks/useImpactMetrics';

const { trend, loading, error } = useMetricTrend('animalsRescued', 'daily', 30);
```

**Parameters:**

- `metricName`: Name of the metric to fetch
- `period`: 'daily' | 'weekly' | 'monthly'
- `days`: Number of days to fetch (default: 30)

## Database Operations

### getCurrentImpactMetrics()

Fetches the most recent impact metrics.

```tsx
import { getCurrentImpactMetrics } from '@/lib/db/impact';

const metrics = await getCurrentImpactMetrics();
```

### createImpactMetrics(data)

Creates new impact metrics (admin only).

```tsx
import { createImpactMetrics } from '@/lib/db/impact';

const metrics = await createImpactMetrics({
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

### getRecentActivities(limit)

Fetches recent activities for the ticker.

```tsx
import { getRecentActivities } from '@/lib/db/impact';

const activities = await getRecentActivities(10);
```

### createRecentActivity(data)

Creates a new activity entry.

```tsx
import { createRecentActivity } from '@/lib/db/impact';

const activity = await createRecentActivity({
  type: 'donation',
  displayName: 'Sarah M.',
  message: 'donated ₹500',
});
```

### calculateMetricTrend(metricName, period, days)

Calculates historical trend data for a metric.

```tsx
import { calculateMetricTrend } from '@/lib/db/impact';

const trend = await calculateMetricTrend('animalsRescued', 'daily', 30);
```

## Real-Time Updates

The dashboard uses Appwrite Realtime to automatically update when:

1. **New metrics are created**: Dashboard updates immediately
2. **Metrics are updated**: Changes reflect in real-time
3. **New activities are added**: Ticker updates without refresh

### Subscription Channels

- Metrics: `databases.${DATABASE_ID}.collections.${COLLECTIONS.IMPACT_METRICS}.documents`
- Activities: `databases.${DATABASE_ID}.collections.${COLLECTIONS.RECENT_ACTIVITIES}.documents`

## Integration

### Homepage Integration

The dashboard is integrated into the homepage between the Features and Quick Links sections:

```tsx
// src/app/page.tsx
import { ImpactDashboardContainer } from '@/components/features/impact';

<section className="py-20 px-4 relative z-10">
  <div className="max-w-7xl mx-auto">
    <ImpactDashboardContainer />
  </div>
</section>;
```

### Dedicated Impact Page

A full-featured impact page with trends is available at `/impact`:

```tsx
// src/app/impact/page.tsx
import { ImpactDashboardWithTrends } from '@/components/features/impact';

<ImpactDashboardWithTrends />;
```

## Mobile Responsiveness

The dashboard is fully responsive:

- **Mobile (< 768px)**: Single column layout, stacked metrics
- **Tablet (768px - 1023px)**: 2-column grid for metrics
- **Desktop (≥ 1024px)**: 4-column grid for metrics

All components adapt to screen size with appropriate touch targets (44x44px minimum).

## Accessibility

The dashboard follows WCAG 2.1 Level AA standards:

- Semantic HTML structure
- ARIA labels for icons and interactive elements
- Keyboard navigation support
- Screen reader announcements for live updates
- High contrast ratios (4.5:1 minimum)
- Focus indicators on all interactive elements

## Performance

Optimizations implemented:

- Lazy loading of trend charts
- Efficient real-time subscriptions
- Optimistic UI updates
- Skeleton loading states
- Debounced updates for rapid changes

## Mock Data

For development and testing, mock data is available:

```tsx
import {
  mockCurrentMetrics,
  mockRecentActivities,
  mockTrendData,
} from '@/lib/mock-data/impact';
```

## Styling

The dashboard uses:

- Tailwind CSS for styling
- Framer Motion for animations
- Custom gradients for visual appeal
- Dark mode support throughout

## Future Enhancements

Potential improvements:

1. **Chart Library Integration**: Install Recharts for enhanced visualizations
2. **Export Functionality**: Allow users to export metrics as PDF/CSV
3. **Comparison Views**: Compare metrics across different time periods
4. **Goal Tracking**: Set and track progress toward goals
5. **Social Sharing**: Share impact metrics on social media
6. **Email Reports**: Automated weekly/monthly impact reports

## Troubleshooting

### Metrics not updating

1. Check Appwrite Realtime is enabled
2. Verify collection permissions
3. Check browser console for errors
4. Ensure collections exist in Appwrite

### Activities not showing

1. Verify recent-activities collection exists
2. Check permissions allow public read
3. Ensure activities have proper timestamps
4. Check query limits in code

### Performance issues

1. Ensure indexes are created
2. Check query limits
3. Consider implementing caching
4. Monitor Appwrite API usage

## Support

For issues or questions:

1. Check the setup guide: `docs/IMPACT_DASHBOARD_SETUP.md`
2. Review the code comments in components
3. Check Appwrite documentation
4. Contact the development team
