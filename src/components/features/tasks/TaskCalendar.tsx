'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TaskCalendarProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
}

export function TaskCalendar({ tasks, onDateSelect }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  // Get tasks for selected date
  const tasksForSelectedDate = selectedDate
    ? tasks.filter(task => isSameDay(new Date(task.scheduledDate), selectedDate))
    : [];

  // Get dates with tasks for highlighting
  const datesWithTasks = tasks.map(task => new Date(task.scheduledDate));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Task Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              hasTask: datesWithTasks,
            }}
            modifiersStyles={{
              hasTask: {
                fontWeight: 'bold',
                textDecoration: 'underline',
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {tasksForSelectedDate.map(task => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {task.type}
                      </Badge>
                      <Badge className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  {task.completed && (
                    <Badge variant="default" className="bg-green-600">
                      Completed
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No tasks scheduled for this date
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
