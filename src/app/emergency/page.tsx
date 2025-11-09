'use client';

import { useState, useEffect } from 'react';
import { EmergencyAlertCard, NewEmergencyAlertForm } from '@/components/features/emergency/EmergencyAlertCard';
import { EmergencyAlert, EmergencyStatus, EmergencyPriority } from '@/types/emergency';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstration - replace with actual API calls
const mockAlerts: EmergencyAlert[] = [
  {
    id: 'alert_001',
    type: 'injured_animal',
    priority: 'critical',
    status: 'open',
    title: 'Injured Dog Near Main Campus',
    description: 'Found a dog with a visible leg injury near the main academic building. The animal seems to be in pain and unable to walk properly.',
    location: {
      area: 'Main Academic Building',
      coordinates: [29.8543, 77.8880],
    },
    reportedBy: 'John Doe',
    reportedAt: new Date(Date.now() - 3600000).toISOString(),
    notifiedVolunteers: [],
  },
  {
    id: 'alert_002',
    type: 'aggressive_behavior',
    priority: 'high',
    status: 'in_progress',
    title: 'Aggressive Pack Behavior',
    description: 'A pack of dogs showing aggressive behavior towards students near the hostel area.',
    location: {
      area: 'Hostel Area',
    },
    reportedBy: 'Jane Smith',
    reportedAt: new Date(Date.now() - 7200000).toISOString(),
    respondedBy: 'Mike Johnson',
    respondedAt: new Date(Date.now() - 3600000).toISOString(),
    notifiedVolunteers: ['user_001', 'user_002'],
  },
];

export default function EmergencyPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<EmergencyAlert[]>(mockAlerts);
  const [statusFilter, setStatusFilter] = useState<EmergencyStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<EmergencyPriority | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    filterAlerts();
  }, [statusFilter, priorityFilter, alerts]);

  const filterAlerts = () => {
    let filtered = [...alerts];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((alert) => alert.priority === priorityFilter);
    }
    
    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder: Record<EmergencyPriority, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });
    
    setFilteredAlerts(filtered);
  };

  const handleCreateAlert = async (alert: Omit<EmergencyAlert, 'id' | 'reportedAt' | 'status' | 'notifiedVolunteers'>) => {
    try {
      // TODO: Replace with actual API call
      const newAlert: EmergencyAlert = {
        ...alert,
        id: `alert_${Date.now()}`,
        reportedAt: new Date().toISOString(),
        status: 'open',
        notifiedVolunteers: [],
      };
      
      setAlerts([newAlert, ...alerts]);
      toast.success('Emergency alert created successfully');
      
      // TODO: Send notifications to nearby volunteers
      console.log('Notifying volunteers about new alert:', newAlert);
    } catch (error) {
      console.error('Failed to create alert:', error);
      toast.error('Failed to create emergency alert');
      throw error;
    }
  };

  const handleRespond = async (alertId: string) => {
    try {
      // TODO: Replace with actual API call
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status: 'in_progress' as EmergencyStatus,
                respondedBy: user?.name || user?.id,
                respondedAt: new Date().toISOString(),
              }
            : alert
        )
      );
      toast.success('You are now responding to this alert');
    } catch (error) {
      console.error('Failed to respond to alert:', error);
      toast.error('Failed to respond to alert');
    }
  };

  const handleResolve = async (alertId: string, notes: string) => {
    try {
      // TODO: Replace with actual API call
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status: 'resolved' as EmergencyStatus,
                resolvedBy: user?.name || user?.id,
                resolvedAt: new Date().toISOString(),
                notes,
              }
            : alert
        )
      );
      toast.success('Alert marked as resolved');
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      toast.error('Failed to resolve alert');
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      // TODO: Replace with actual API call
      setAlerts(
        alerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status: 'false_alarm' as EmergencyStatus,
                resolvedBy: user?.name || user?.id,
                resolvedAt: new Date().toISOString(),
              }
            : alert
        )
      );
      toast.info('Alert marked as false alarm');
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
      toast.error('Failed to dismiss alert');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Replace with actual API call to fetch latest alerts
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Alerts refreshed');
    } catch (error) {
      toast.error('Failed to refresh alerts');
    } finally {
      setIsRefreshing(false);
    }
  };

  const openAlertCount = alerts.filter((a) => a.status === 'open').length;
  const criticalAlertCount = alerts.filter(
    (a) => a.status === 'open' && a.priority === 'critical'
  ).length;

  return (
    <ProtectedRoute requiredRole="volunteer">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Emergency Alerts
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and respond to urgent situations
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{openAlertCount}</Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Open Alerts
                  </span>
                </div>
              </Card>
              {criticalAlertCount > 0 && (
                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600">{criticalAlertCount}</Badge>
                    <span className="text-sm text-red-800 dark:text-red-200">
                      Critical Alerts
                    </span>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Create Alert Button */}
          <div className="mb-6">
            <NewEmergencyAlertForm
              currentUserId={user?.id || ''}
              onSubmit={handleCreateAlert}
            />
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Filters</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Status:
                  </label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as EmergencyStatus | 'all')}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_alarm">False Alarm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Priority:
                  </label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) => setPriorityFilter(value as EmergencyPriority | 'all')}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No alerts match the selected filters
                </p>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <EmergencyAlertCard
                  key={alert.id}
                  alert={alert}
                  onRespond={handleRespond}
                  onResolve={handleResolve}
                  onDismiss={handleDismiss}
                  canManage={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
