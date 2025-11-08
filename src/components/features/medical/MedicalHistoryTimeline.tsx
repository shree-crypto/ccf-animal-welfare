'use client';

import { useState, useEffect } from 'react';
import { MedicalRecord } from '@/types/medical';
import { getAnimalMedicalHistory } from '@/lib/db/medical';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Syringe,
  Stethoscope,
  AlertTriangle,
  Calendar,
  User,
  Pill,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

interface MedicalHistoryTimelineProps {
  animalId: string;
}

const typeIcons = {
  checkup: Stethoscope,
  vaccination: Syringe,
  treatment: Activity,
  emergency: AlertTriangle,
};

const typeColors = {
  checkup: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  vaccination:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  treatment:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  emergency: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const typeLabels = {
  checkup: 'Checkup',
  vaccination: 'Vaccination',
  treatment: 'Treatment',
  emergency: 'Emergency',
};

export function MedicalHistoryTimeline({
  animalId,
}: MedicalHistoryTimelineProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnimalMedicalHistory(animalId);
        setRecords(data.records);
      } catch (err) {
        console.error('Error fetching medical history:', err);
        setError('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [animalId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No medical records yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
        <p className="text-sm text-muted-foreground">
          {records.length} {records.length === 1 ? 'record' : 'records'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

          {records.map((record, index) => {
            const Icon = typeIcons[record.type];
            const isLast = index === records.length - 1;

            return (
              <div key={record.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${typeColors[record.type]}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Record content */}
                <div className={`space-y-3 ${!isLast ? 'pb-6' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={typeColors[record.type]}
                        >
                          {typeLabels[record.type]}
                        </Badge>
                        {record.followUpRequired && (
                          <Badge
                            variant="outline"
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          >
                            Follow-up Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(record.date), 'PPp')}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{record.description}</p>

                  {record.veterinarian && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{record.veterinarian}</span>
                    </div>
                  )}

                  {record.medications && record.medications.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Pill className="h-3 w-3" />
                        <span>Medications:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 ml-5">
                        {record.medications.map((med, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.documents && record.documents.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-3 w-3" />
                        <span>Documents:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-5">
                        {record.documents.map((doc, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            asChild
                          >
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Document {idx + 1}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.followUpRequired && record.followUpDate && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Follow-up:{' '}
                        {format(new Date(record.followUpDate), 'PPp')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
