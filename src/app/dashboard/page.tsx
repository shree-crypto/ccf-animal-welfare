'use client';

import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { MedicalAlertBanner } from '@/components/features/medical';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  PawPrint, 
  MapPin, 
  Calendar, 
  Heart, 
  Settings,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTasks } from '@/lib/db/tasks';
import { getAnimals } from '@/lib/db/animals';
import { Task } from '@/types/task';
import { AnimalProfile } from '@/types/animal';
import { format } from 'date-fns';

interface DashboardStats {
  totalAnimals: number;
  pendingTasks: number;
  todayTasks: number;
  animalsNeedingAttention: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { config } = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    pendingTasks: 0,
    todayTasks: 0,
    animalsNeedingAttention: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch animals data with error handling
        let totalAnimals = 0;
        let animalsNeedingAttention = 0;
        
        try {
          const animalsResponse = await getAnimals({ limit: 100 });
          totalAnimals = animalsResponse.total;
          animalsNeedingAttention = animalsResponse.animals.filter(
            (animal) => animal.status === 'needs_attention' || animal.status === 'under_treatment'
          ).length;
        } catch (animalError) {
          console.error('Error fetching animals:', animalError);
        }

        // Fetch tasks for current user with error handling
        let pendingTasks = 0;
        let todayTasks = 0;
        let tasks: Task[] = [];
        
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayStr = today.toISOString();
          
          const tasksResponse = await getTasks({
            assignedTo: user?.$id || '',
            completed: false,
            limit: 50,
          });
          
          pendingTasks = tasksResponse.total;
          todayTasks = tasksResponse.tasks.filter(
            (task) => {
              const taskDate = new Date(task.scheduledDate);
              taskDate.setHours(0, 0, 0, 0);
              return taskDate.toISOString() === todayStr;
            }
          ).length;
          
          tasks = tasksResponse.tasks;
        } catch (taskError) {
          console.error('Error fetching tasks:', taskError);
        }

        setStats({
          totalAnimals,
          pendingTasks,
          todayTasks,
          animalsNeedingAttention,
        });

        // Get recent tasks for display
        setRecentTasks(tasks.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.$id) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user?.$id]);

  return (
    <ProtectedRoute requiredRole="volunteer">
      <div className={cn(
        "min-h-screen",
        config.effects.gradients
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950"
          : "bg-gray-50 dark:bg-gray-900"
      )}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={cn(
              "text-4xl font-bold mb-2",
              config.effects.gradients
                ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                : "text-gray-900 dark:text-white"
            )}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="capitalize font-medium">{user?.role}</span>
              {user?.email && <span className="text-sm">• {user.email}</span>}
            </p>
          </div>

          {/* Medical Alerts */}
          <div className="mb-8">
            <ErrorBoundary
              fallback={
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-950 dark:border-red-800">
                  <p className="text-red-800 text-sm dark:text-red-200">
                    Unable to load medical alerts. Please refresh the page.
                  </p>
                </div>
              }
            >
              <MedicalAlertBanner />
            </ErrorBoundary>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className={cn(
              config.effects.gradients && "border-purple-200 dark:border-purple-800"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Animals
                </CardTitle>
                <PawPrint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.totalAnimals}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Under our care
                </p>
              </CardContent>
            </Card>

            <Card className={cn(
              config.effects.gradients && "border-pink-200 dark:border-pink-800"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Tasks
                </CardTitle>
                <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.pendingTasks}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Assigned to you
                </p>
              </CardContent>
            </Card>

            <Card className={cn(
              config.effects.gradients && "border-blue-200 dark:border-blue-800"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today's Tasks
                </CardTitle>
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.todayTasks}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Due today
                </p>
              </CardContent>
            </Card>

            <Card className={cn(
              config.effects.gradients && "border-orange-200 dark:border-orange-800"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Need Attention
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : stats.animalsNeedingAttention}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Animals requiring care
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Tasks */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Your Upcoming Tasks
                </CardTitle>
                <CardDescription>
                  Tasks assigned to you, sorted by date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</p>
                ) : recentTasks.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No pending tasks. Great job! 🎉
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </h4>
                            <Badge 
                              variant={
                                task.priority === 'urgent' ? 'destructive' :
                                task.priority === 'high' ? 'default' :
                                'secondary'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(task.scheduledDate), 'MMM dd, yyyy')}
                            </span>
                            <span className="capitalize">{task.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/tasks">View All Tasks</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/animals" className="flex items-center">
                      <PawPrint className="h-4 w-4 mr-2" />
                      View Animals
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/territories" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Territory Map
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/medical" className="flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Medical Records
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/profile" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </Button>
                  {user?.role === 'admin' && (
                    <Button asChild className="w-full justify-start" variant="secondary">
                      <Link href="/admin" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Impact Overview */}
              <Card className={cn(
                config.effects.gradients && "border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
              )}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Our Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Together we're making a difference for campus animals.
                  </p>
                  <Button asChild variant="default" className="w-full">
                    <Link href="/">View Full Impact Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
