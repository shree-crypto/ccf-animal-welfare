'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { MedicalAlertBanner } from '@/components/features/medical';
import { MedicalRecord } from '@/types/medical';
import { AnimalProfile } from '@/types/animal';
import { getMedicalRecords } from '@/lib/db/medical';
import { getAnimalById } from '@/lib/db/animals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  Syringe,
  Stethoscope,
  AlertTriangle,
  Calendar,
  User,
  Search,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface RecordWithAnimal extends MedicalRecord {
  animal?: AnimalProfile;
}

const typeIcons = {
  checkup: Stethoscope,
  vaccination: Syringe,
  treatment: Activity,
  emergency: AlertTriangle,
};

const typeColors = {
  checkup: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  vaccination: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  treatment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  emergency: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const typeLabels = {
  checkup: 'Checkup',
  vaccination: 'Vaccination',
  treatment: 'Treatment',
  emergency: 'Emergency',
};

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<RecordWithAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [followUpFilter, setFollowUpFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await getMedicalRecords({ limit: 100 });
        
        // Fetch animal details for each record
        const recordsWithAnimals = await Promise.all(
          data.records.map(async (record) => {
            const animal = await getAnimalById(record.animalId);
            return { ...record, animal: animal || undefined };
          })
        );

        setRecords(recordsWithAnimals);
      } catch (err) {
        console.error('Error fetching medical records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Memoize event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
  }, []);

  const handleFollowUpFilterChange = useCallback((value: string) => {
    setFollowUpFilter(value);
  }, []);

  // Memoize filtered records computation
  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesSearch = 
      !searchTerm ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animal?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.veterinarian?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || record.type === typeFilter;

    const matchesFollowUp =
      followUpFilter === 'all' ||
      (followUpFilter === 'required' && record.followUpRequired) ||
      (followUpFilter === 'not-required' && !record.followUpRequired);

    return matchesSearch && matchesType && matchesFollowUp;
  }), [records, searchTerm, typeFilter, followUpFilter]);

  return (
    <ProtectedRoute requiredRole="volunteer">
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
            <p className="text-muted-foreground">
              View and manage medical records for all animals
            </p>
          </div>

          {/* Medical Alerts */}
          <div className="mb-6">
            <ErrorBoundary
              fallback={
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    Unable to load medical alerts. Please refresh the page.
                  </p>
                </div>
              }
            >
              <MedicalAlertBanner />
            </ErrorBoundary>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={followUpFilter} onValueChange={handleFollowUpFilterChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by follow-up" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="required">Follow-up Required</SelectItem>
                    <SelectItem value="not-required">No Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== 'all' || followUpFilter !== 'all'
                    ? 'No records match your filters'
                    : 'No medical records yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.map((record) => {
                const Icon = typeIcons[record.type];

                return (
                  <Card key={record.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${typeColors[record.type]}`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={typeColors[record.type]}>
                                  {typeLabels[record.type]}
                                </Badge>
                                {record.followUpRequired && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                    Follow-up Required
                                  </Badge>
                                )}
                              </div>
                              {record.animal && (
                                <Link
                                  href={`/animals/${record.animal.id}`}
                                  className="text-lg font-semibold hover:underline"
                                >
                                  {record.animal.name}
                                </Link>
                              )}
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(record.date), 'PPp')}</span>
                                </div>
                                {record.veterinarian && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{record.veterinarian}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {record.animal && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/animals/${record.animal.id}`} className="flex items-center">
                                  View Animal
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Link>
                              </Button>
                            )}
                          </div>

                          <p className="text-sm">{record.description}</p>

                          {record.medications && record.medications.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {record.medications.map((med, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {record.followUpRequired && record.followUpDate && (
                            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Follow-up: {format(new Date(record.followUpDate), 'PPp')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
