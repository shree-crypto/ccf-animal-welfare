# Quick Start Guide: New Features

This guide shows you how to quickly integrate and use the new innovative features added to the CCF Animal Welfare platform.

## 1. Animal Behavior Tracking

### Integration
Add the BehaviorTracker component to your animal detail page:

```tsx
import { BehaviorTracker } from '@/components/features/animals/BehaviorTracker';

export default function AnimalDetailPage({ animal }) {
  return (
    <div>
      {/* Other animal info */}
      
      <BehaviorTracker
        animalId={animal.id}
        initialBehavior={animal.behavior}
        onSave={async (behavior) => {
          // Update the animal's behavior in the database
          await updateAnimal(animal.id, { behavior });
        }}
      />
    </div>
  );
}
```

### Usage Tips
- Volunteers can view behavior information in read-only mode
- Admins/coordinators can edit and update behavior profiles
- The component displays warning badges for special needs
- Updates are timestamped for tracking changes over time

## 2. Volunteer Impact Dashboard

### Integration
Add to the volunteer profile/dashboard page:

```tsx
import { VolunteerImpactDashboard } from '@/components/features/volunteers/VolunteerImpactDashboard';

export default function VolunteerDashboard({ volunteerId, stats }) {
  return (
    <div>
      <h1>My Impact</h1>
      
      <VolunteerImpactDashboard
        volunteerId={volunteerId}
        stats={stats}
      />
    </div>
  );
}
```

### Tracking Hours
When a volunteer completes a task, log their hours:

```tsx
// After task completion
const hoursWorked = calculateHours(task.scheduledTime, completionTime);

await createVolunteerHoursRecord({
  volunteerId: user.id,
  taskId: task.id,
  animalId: task.animalId,
  hours: hoursWorked,
  date: new Date().toISOString(),
  taskType: task.type,
  notes: 'Task completed successfully'
});

// Update volunteer stats
await updateVolunteerStats(user.id, {
  totalHours: stats.totalHours + hoursWorked,
  tasksCompleted: stats.tasksCompleted + 1,
  animalsHelped: stats.animalsHelped + (task.animalId ? 1 : 0)
});
```

### Badge Award System
Automatically check and award badges:

```tsx
function checkAndAwardBadges(stats) {
  const newBadges = [];
  
  if (stats.totalHours >= 10 && !stats.badges.includes('10_hours')) {
    newBadges.push('10_hours');
  }
  
  if (stats.totalHours >= 50 && !stats.badges.includes('50_hours')) {
    newBadges.push('50_hours');
  }
  
  if (stats.animalsHelped >= 20 && !stats.badges.includes('animal_champion')) {
    newBadges.push('animal_champion');
  }
  
  // Award new badges
  if (newBadges.length > 0) {
    await updateVolunteerStats(stats.volunteerId, {
      badges: [...stats.badges, ...newBadges]
    });
    
    // Send notification
    await createNotification({
      recipientId: stats.volunteerId,
      type: 'badge_earned',
      title: 'New Badge Earned!',
      message: `Congratulations! You've earned: ${newBadges.join(', ')}`
    });
  }
}
```

## 3. Emergency Alert System

### Create Emergency Alert Page
Create a new page at `src/app/emergency/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { EmergencyAlertCard, NewEmergencyAlertForm } from '@/components/features/emergency/EmergencyAlertCard';
import { useAuth } from '@/contexts/AuthContext';

export default function EmergencyPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const data = await fetchEmergencyAlerts();
    setAlerts(data);
  };

  const handleCreateAlert = async (alert) => {
    await createEmergencyAlert({
      ...alert,
      reportedAt: new Date().toISOString(),
      status: 'open',
      notifiedVolunteers: []
    });
    
    // Send notifications to nearby volunteers
    await notifyVolunteers(alert);
    
    loadAlerts();
  };

  const handleRespond = async (alertId) => {
    await updateEmergencyAlert(alertId, {
      status: 'in_progress',
      respondedBy: user.id,
      respondedAt: new Date().toISOString()
    });
    loadAlerts();
  };

  const handleResolve = async (alertId, notes) => {
    await updateEmergencyAlert(alertId, {
      status: 'resolved',
      resolvedBy: user.id,
      resolvedAt: new Date().toISOString(),
      notes
    });
    loadAlerts();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Emergency Alerts</h1>
      
      <div className="mb-8">
        <NewEmergencyAlertForm
          currentUserId={user.id}
          onSubmit={handleCreateAlert}
        />
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <EmergencyAlertCard
            key={alert.id}
            alert={alert}
            onRespond={handleRespond}
            onResolve={handleResolve}
            canManage={user.role === 'volunteer' || user.role === 'admin'}
          />
        ))}
      </div>
    </div>
  );
}
```

### Real-time Notifications
Set up real-time subscriptions for emergency alerts:

```tsx
// In a context or hook
useEffect(() => {
  const unsubscribe = subscribeToEmergencyAlerts((alert) => {
    // Show toast notification
    toast.error(`Emergency Alert: ${alert.title}`, {
      description: alert.description,
      action: {
        label: 'View',
        onClick: () => router.push('/emergency')
      }
    });
  });
  
  return () => unsubscribe();
}, []);
```

## 4. QR Code Generation

### Add to Animal Profile
In the animal detail page:

```tsx
import { AnimalQRCode } from '@/components/features/animals/AnimalQRCode';

export default function AnimalProfile({ animal }) {
  return (
    <div>
      {/* Animal info */}
      
      <div className="flex gap-2">
        <Button>Edit</Button>
        <AnimalQRCode
          animalId={animal.id}
          animalName={animal.name}
        />
      </div>
    </div>
  );
}
```

### Admin Bulk QR Generation
Create an admin page for bulk QR code generation:

```tsx
import { printMultipleQRCodes } from '@/lib/utils/qrcode';

export default function AdminQRPage() {
  const [selectedAnimals, setSelectedAnimals] = useState([]);

  const handlePrintAll = () => {
    printMultipleQRCodes(
      selectedAnimals.map(a => ({ id: a.id, name: a.name }))
    );
  };

  return (
    <div>
      {/* Animal selection UI */}
      
      <Button onClick={handlePrintAll}>
        Print {selectedAnimals.length} QR Codes
      </Button>
    </div>
  );
}
```

### QR Code Landing Page
When someone scans a QR code, they'll land on the animal's profile page with `?source=qr` parameter. You can customize the view:

```tsx
export default function AnimalPage({ params, searchParams }) {
  const isFromQR = searchParams.source === 'qr';
  
  return (
    <div>
      {isFromQR && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p>Thanks for scanning! Here's {animal.name}'s profile.</p>
        </div>
      )}
      
      {/* Rest of profile */}
    </div>
  );
}
```

## 5. Community Reporting

### Create Public Report Page
Create `src/app/report/page.tsx` for public access:

```tsx
'use client';

import { CommunityReportForm } from '@/components/features/community/CommunityReportForm';

export default function ReportPage() {
  const handleSubmit = async (report) => {
    // Create community report
    await createCommunityReport({
      ...report,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Notify admins
    await notifyAdmins({
      type: 'community_report',
      title: 'New Community Report',
      message: `${report.reportType}: ${report.location}`
    });
  };

  return (
    <div className="container mx-auto py-12">
      <CommunityReportForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### Admin Report Management
Create an admin interface to review reports:

```tsx
export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  
  const handleAssign = async (reportId, volunteerId) => {
    await updateCommunityReport(reportId, {
      status: 'investigating',
      assignedTo: volunteerId
    });
    loadReports();
  };

  const handleResolve = async (reportId, notes) => {
    await updateCommunityReport(reportId, {
      status: 'resolved',
      notes,
      updatedAt: new Date().toISOString()
    });
    loadReports();
  };

  return (
    <div>
      <h1>Community Reports</h1>
      
      {reports.map((report) => (
        <Card key={report.id}>
          <h3>{report.reportType}</h3>
          <p>{report.description}</p>
          <p>Location: {report.location}</p>
          <Badge>{report.status}</Badge>
          
          {report.status === 'new' && (
            <Button onClick={() => handleAssign(report.id, currentUserId)}>
              Investigate
            </Button>
          )}
          
          {report.status === 'investigating' && (
            <Button onClick={() => handleResolve(report.id, 'Resolved successfully')}>
              Mark Resolved
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
```

## Database Setup

### Create New Collections in Appwrite

1. **volunteer-hours**
   - Fields: volunteerId, taskId, animalId, territoryId, hours, date, taskType, notes
   - Indexes: volunteerId, date, taskId

2. **volunteer-stats** 
   - Fields: volunteerId (unique), totalHours, tasksCompleted, animalsHelped, badges, joinDate, lastActiveDate, skills, preferredTaskTypes
   - Index: volunteerId (unique)

3. **emergency-alerts**
   - Fields: type, priority, status, title, description, animalId, territoryId, location, reportedBy, reportedAt, respondedBy, respondedAt, resolvedBy, resolvedAt, notes, photos, notifiedVolunteers
   - Indexes: status, priority, reportedAt

4. **community-reports**
   - Fields: reportType, animalDescription, location, coordinates, description, reporterName, reporterContact, photos, status, assignedTo, notes
   - Indexes: status, reportType, createdAt

### Update Animals Collection
Add these optional fields:
- `behavior` (JSON object matching BehaviorProfile type)
- `qrCode` (string URL to QR code image)

## Navigation Updates

Add links to new pages in your navigation:

```tsx
// In Header.tsx or navigation component
<nav>
  <Link href="/animals">Animals</Link>
  <Link href="/emergency">Emergency Alerts</Link>
  <Link href="/report">Report</Link>
  {/* Other links */}
</nav>
```

## Testing

Test each feature:

1. **Behavior Tracking**: Create/update behavior profiles for animals
2. **Volunteer Impact**: Complete tasks and verify hours/badges update
3. **Emergency Alerts**: Create alert, respond, and resolve
4. **QR Codes**: Generate, download, and scan QR codes
5. **Community Reports**: Submit report as public user, manage as admin

## Support

For detailed documentation, see:
- [NEW_FEATURES.md](./NEW_FEATURES.md) - Complete feature documentation
- Component source code for implementation details
- Type definitions in `src/types/` for data structures
