'use client';

import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Circle, Clock, MapPin, Stethoscope, Utensils } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const taskTypeIcons = {
  feeding: Utensils,
  medical: Stethoscope,
  maintenance: MapPin,
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  medium: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  high: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-200',
};

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const Icon = taskTypeIcons[task.type];
  const isOverdue = !task.completed && new Date(task.scheduledDate) < new Date();

  return (
    <Card className={`${task.completed ? 'opacity-60' : ''} ${isOverdue ? 'border-red-300' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg">{task.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{task.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(task.scheduledDate), 'PPP')}</span>
          {isOverdue && !task.completed && (
            <Badge variant="destructive" className="ml-2">Overdue</Badge>
          )}
        </div>

        {task.completedAt && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Clock className="h-4 w-4" />
            <span>Completed: {format(new Date(task.completedAt), 'PPP')}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!task.completed && onComplete && (
            <Button
              size="sm"
              onClick={() => onComplete(task.id)}
              className="flex-1"
            >
              Mark Complete
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
