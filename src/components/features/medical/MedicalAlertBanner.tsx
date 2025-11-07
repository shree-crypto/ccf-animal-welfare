'use client';

import { useState, useEffect } from 'react';
import { MedicalRecord } from '@/types/medical';
import { getFollowUpRecords } from '@/lib/db/medical';
import { getAnimalById } from '@/lib/db/animals';
import { AnimalProfile } from '@/types/animal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, X } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import Link from 'next/link';

interface AlertWithAnimal extends MedicalRecord {
  animal?: AnimalProfile;
}

export function MedicalAlertBanner() {
  const [alerts, setAlerts] = useState<AlertWithAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const records = await getFollowUpRecords();
        
        // Fetch animal details for each record
        const recordsWithAnimals = await Promise.all(
          records.map(async (record) => {
            const animal = await getAnimalById(record.animalId);
            return { ...record, animal: animal || undefined };
          })
        );

        setAlerts(recordsWithAnimals);
      } catch (err) {
        console.error('Error fetching medical alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const dismissAlert = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  const visibleAlerts = alerts.filter(alert => !dismissed.has(alert.id));

  if (loading || visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => {
        const followUpDate = alert.followUpDate ? new Date(alert.followUpDate) : null;
        const isOverdue = followUpDate && isPast(followUpDate);
        const isDueToday = followUpDate && isToday(followUpDate);
        const isDueTomorrow = followUpDate && isTomorrow(followUpDate);

        let urgencyColor = 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
        let urgencyText = 'Follow-up Due';

        if (isOverdue) {
          urgencyColor = 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
          urgencyText = 'Overdue Follow-up';
        } else if (isDueToday) {
          urgencyColor = 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800';
          urgencyText = 'Follow-up Today';
        } else if (isDueTomorrow) {
          urgencyColor = 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
          urgencyText = 'Follow-up Tomorrow';
        }

        return (
          <Alert key={alert.id} className={urgencyColor}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{urgencyText}</span>
                <Badge variant="outline" className="font-normal">
                  {alert.type}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  {alert.animal && (
                    <p className="font-medium">
                      {alert.animal.name} - {alert.animal.location.area}
                    </p>
                  )}
                  <p className="text-sm">{alert.description}</p>
                  {followUpDate && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(followUpDate, 'PPp')}
                      </span>
                    </div>
                  )}
                </div>
                {alert.animal && (
                  <Link href={`/animals/${alert.animal.id}`}>
                    <Button variant="outline" size="sm">
                      View Animal
                    </Button>
                  </Link>
                )}
              </div>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}
