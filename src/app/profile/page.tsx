'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { ProfileForm } from '@/components/features/auth/ProfileForm';
import { VolunteerImpactDashboard } from '@/components/features/volunteers/VolunteerImpactDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { VolunteerStats } from '@/types/volunteer';

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerStats = async () => {
      if (!user) return;
      
      try {
        // TODO: Replace with actual API call
        // Mock data for demonstration
        const mockStats: VolunteerStats = {
          volunteerId: user.$id,
          totalHours: 45.5,
          tasksCompleted: 23,
          animalsHelped: 12,
          badges: ['first_task', 'week_streak', '10_hours'],
          joinDate: '2024-01-15',
          lastActiveDate: new Date().toISOString(),
          skills: ['animal_handling', 'medical_assistance'],
          preferredTaskTypes: ['feeding', 'medical'],
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching volunteer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerStats();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <ProtectedRoute requiredRole="volunteer">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                <TabsTrigger value="impact">My Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <ProfileForm />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  Logout
                </Button>
              </TabsContent>

              <TabsContent value="impact">
                {loading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Loading your impact data...</p>
                    </CardContent>
                  </Card>
                ) : stats ? (
                  <VolunteerImpactDashboard
                    volunteerId={user?.$id || ''}
                    stats={stats}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No volunteer data available yet. Complete some tasks to start tracking your impact!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
