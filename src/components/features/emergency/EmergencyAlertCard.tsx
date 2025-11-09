'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  EmergencyAlert,
  EmergencyType,
  EmergencyPriority,
} from '@/types/emergency';
import {
  AlertTriangle,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface EmergencyAlertCardProps {
  alert: EmergencyAlert;
  onRespond?: (alertId: string) => Promise<void>;
  onResolve?: (alertId: string, notes: string) => Promise<void>;
  onDismiss?: (alertId: string) => Promise<void>;
  canManage?: boolean;
}

const priorityConfig = {
  critical: { color: 'bg-red-500', label: 'Critical', icon: AlertTriangle },
  high: { color: 'bg-orange-500', label: 'High', icon: AlertCircle },
  medium: { color: 'bg-yellow-500', label: 'Medium', icon: AlertCircle },
  low: { color: 'bg-blue-500', label: 'Low', icon: AlertCircle },
};

const statusConfig = {
  open: { color: 'bg-red-100 text-red-800', label: 'Open' },
  in_progress: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
  resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' },
  false_alarm: { color: 'bg-gray-100 text-gray-800', label: 'False Alarm' },
};

export function EmergencyAlertCard({
  alert,
  onRespond,
  onResolve,
  onDismiss,
  canManage = false,
}: EmergencyAlertCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const priority = priorityConfig[alert.priority];
  const status = statusConfig[alert.status];
  const PriorityIcon = priority.icon;

  const handleRespond = async () => {
    if (!onRespond) return;
    setIsLoading(true);
    try {
      await onRespond(alert.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!onResolve) return;
    setIsLoading(true);
    try {
      await onResolve(alert.id, resolveNotes);
      setIsResolving(false);
      setResolveNotes('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async () => {
    if (!onDismiss) return;
    setIsLoading(true);
    try {
      await onDismiss(alert.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`p-4 border-l-4 ${priority.color.replace('bg-', 'border-l-')}`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${priority.color} text-white`}>
              <PriorityIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{alert.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={status.color}>{status.label}</Badge>
                <Badge variant="outline">{alert.type.replace(/_/g, ' ')}</Badge>
                <Badge className={priority.color + ' text-white'}>
                  {priority.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300">{alert.description}</p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{alert.location.area}</span>
          {alert.location.coordinates && (
            <span className="text-xs">
              ({alert.location.coordinates[0].toFixed(4)},{' '}
              {alert.location.coordinates[1].toFixed(4)})
            </span>
          )}
        </div>

        {/* Reporter Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>Reported by: {alert.reportedBy}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{new Date(alert.reportedAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Response Info */}
        {alert.respondedBy && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Responded by:</strong> {alert.respondedBy} at{' '}
              {new Date(alert.respondedAt!).toLocaleString()}
            </p>
          </div>
        )}

        {/* Resolution Info */}
        {alert.resolvedBy && (
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Resolved by:</strong> {alert.resolvedBy} at{' '}
              {new Date(alert.resolvedAt!).toLocaleString()}
            </p>
            {alert.notes && <p className="text-sm mt-1">{alert.notes}</p>}
          </div>
        )}

        {/* Photos */}
        {alert.photos && alert.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {alert.photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Alert photo ${idx + 1}`}
                className="h-20 w-20 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        {canManage &&
          alert.status !== 'resolved' &&
          alert.status !== 'false_alarm' && (
            <div className="flex gap-2 pt-2 border-t">
              {alert.status === 'open' && onRespond && (
                <Button size="sm" onClick={handleRespond} disabled={isLoading}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Respond
                </Button>
              )}

              {alert.status === 'in_progress' && onResolve && (
                <Dialog open={isResolving} onOpenChange={setIsResolving}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="default">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Resolve Emergency Alert</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Resolution Notes</Label>
                        <Textarea
                          placeholder="Describe how the emergency was resolved..."
                          value={resolveNotes}
                          onChange={e => setResolveNotes(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleResolve} disabled={isLoading}>
                          Mark as Resolved
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsResolving(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {onDismiss && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  False Alarm
                </Button>
              )}
            </div>
          )}
      </div>
    </Card>
  );
}

// New Emergency Alert Form Component
interface NewEmergencyAlertFormProps {
  onSubmit: (
    alert: Omit<
      EmergencyAlert,
      'id' | 'reportedAt' | 'status' | 'notifiedVolunteers'
    >
  ) => Promise<void>;
  currentUserId: string;
}

export function NewEmergencyAlertForm({
  onSubmit,
  currentUserId,
}: NewEmergencyAlertFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'injured_animal' as EmergencyType,
    priority: 'high' as EmergencyPriority,
    title: '',
    description: '',
    locationArea: '',
    animalId: '',
    territoryId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        type: formData.type,
        priority: formData.priority,
        title: formData.title,
        description: formData.description,
        location: {
          area: formData.locationArea,
        },
        animalId: formData.animalId || undefined,
        territoryId: formData.territoryId || undefined,
        reportedBy: currentUserId,
      });

      // Reset form
      setFormData({
        type: 'injured_animal',
        priority: 'high',
        title: '',
        description: '',
        locationArea: '',
        animalId: '',
        territoryId: '',
      });
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full md:w-auto">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Report Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report Emergency Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Emergency Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: EmergencyType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="injured_animal">Injured Animal</SelectItem>
                  <SelectItem value="aggressive_behavior">
                    Aggressive Behavior
                  </SelectItem>
                  <SelectItem value="lost_animal">Lost Animal</SelectItem>
                  <SelectItem value="medical_emergency">
                    Medical Emergency
                  </SelectItem>
                  <SelectItem value="safety_concern">Safety Concern</SelectItem>
                  <SelectItem value="severe_weather">Severe Weather</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: EmergencyPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              required
              placeholder="Brief title for the emergency"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              required
              placeholder="Detailed description of the emergency..."
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              required
              placeholder="Where is the emergency?"
              value={formData.locationArea}
              onChange={e =>
                setFormData({ ...formData, locationArea: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Emergency Alert'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
