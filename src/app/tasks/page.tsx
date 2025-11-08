'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types/task';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from '@/lib/db/tasks';
import { TaskCard } from '@/components/features/tasks/TaskCard';
import { TaskCalendar } from '@/components/features/tasks/TaskCalendar';
import { QuickActions } from '@/components/features/tasks/QuickActions';
import { CreateTaskFormData } from '@/lib/validations/task';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, ListTodo, Calendar as CalendarIcon } from 'lucide-react';
import { client } from '@/lib/appwrite';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Memoize event handlers to prevent unnecessary re-renders
  const handleCreateTask = useCallback(async (data: CreateTaskFormData) => {
    try {
      await createTask(data);
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }, []);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    try {
      await completeTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        await loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.$id) {
      loadTasks();
      const unsubscribe = subscribeToTasks();
      return unsubscribe;
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks({
        assignedTo: user?.$id,
      });
      setTasks(fetchedTasks.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToTasks = () => {
    // Subscribe to real-time updates using Appwrite Realtime
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS;

    if (!databaseId || !collectionId) {
      console.warn(
        'Database or collection ID not configured for real-time updates'
      );
      return () => {};
    }

    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents`,
      response => {
        // Reload tasks when changes occur
        loadTasks();
      }
    );

    return () => {
      unsubscribe();
    };
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  if (loading) {
    return (
      <ProtectedRoute requiredRole="volunteer">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="volunteer">
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Task Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your feeding schedules and volunteer tasks
                </p>
              </div>
              <QuickActions
                onCreateTask={handleCreateTask}
                currentUserId={user?.$id || ''}
              />
            </div>

            <Tabs defaultValue="list" className="space-y-6">
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <ListTodo className="h-4 w-4" />
                  Task List
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-6">
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                    className="gap-2"
                  >
                    All Tasks
                    <Badge variant="secondary">{tasks.length}</Badge>
                  </Button>
                  <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilter('pending')}
                    className="gap-2"
                  >
                    Pending
                    <Badge variant="secondary">{pendingCount}</Badge>
                  </Button>
                  <Button
                    variant={filter === 'completed' ? 'default' : 'outline'}
                    onClick={() => setFilter('completed')}
                    className="gap-2"
                  >
                    Completed
                    <Badge variant="secondary">{completedCount}</Badge>
                  </Button>
                </div>

                {filteredTasks.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tasks found
                    </h3>
                    <p className="text-gray-600">
                      {filter === 'all'
                        ? 'Create your first task to get started'
                        : `No ${filter} tasks at the moment`}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calendar">
                <TaskCalendar tasks={tasks} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
