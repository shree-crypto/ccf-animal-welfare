'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BehaviorProfile, TemperamentLevel, EnergyLevel } from '@/types/animal';
import { Heart, Zap, Dog, Cat, Users, Baby, AlertCircle } from 'lucide-react';

interface BehaviorTrackerProps {
  animalId: string;
  initialBehavior?: BehaviorProfile;
  onSave: (behavior: BehaviorProfile) => Promise<void>;
  readOnly?: boolean;
}

const temperamentOptions: { value: TemperamentLevel; label: string; color: string }[] = [
  { value: 'very_friendly', label: 'Very Friendly', color: 'bg-green-500' },
  { value: 'friendly', label: 'Friendly', color: 'bg-green-400' },
  { value: 'neutral', label: 'Neutral', color: 'bg-yellow-500' },
  { value: 'shy', label: 'Shy', color: 'bg-orange-400' },
  { value: 'fearful', label: 'Fearful', color: 'bg-orange-500' },
  { value: 'aggressive', label: 'Aggressive', color: 'bg-red-500' },
];

const energyOptions: { value: EnergyLevel; label: string }[] = [
  { value: 'very_high', label: 'Very High' },
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low' },
  { value: 'very_low', label: 'Very Low' },
];

export function BehaviorTracker({ animalId, initialBehavior, onSave, readOnly = false }: BehaviorTrackerProps) {
  const [behavior, setBehavior] = useState<BehaviorProfile>(
    initialBehavior || {
      temperament: 'neutral',
      energyLevel: 'moderate',
      goodWithDogs: true,
      goodWithCats: true,
      goodWithPeople: true,
      goodWithChildren: true,
      lastUpdated: new Date().toISOString(),
    }
  );
  const [isEditing, setIsEditing] = useState(!initialBehavior);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedBehavior = {
        ...behavior,
        lastUpdated: new Date().toISOString(),
      };
      await onSave(updatedBehavior);
      setBehavior(updatedBehavior);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save behavior:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTemperament = temperamentOptions.find((t) => t.value === behavior.temperament);

  if (readOnly && !initialBehavior) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-semibold">Behavior & Temperament</h3>
        </div>
        {!readOnly && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label>Temperament</Label>
            <Select
              value={behavior.temperament}
              onValueChange={(value: TemperamentLevel) =>
                setBehavior({ ...behavior, temperament: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {temperamentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Energy Level</Label>
            <Select
              value={behavior.energyLevel}
              onValueChange={(value: EnergyLevel) =>
                setBehavior({ ...behavior, energyLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {energyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Good With</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="goodWithDogs"
                checked={behavior.goodWithDogs}
                onCheckedChange={(checked) =>
                  setBehavior({ ...behavior, goodWithDogs: checked as boolean })
                }
              />
              <label htmlFor="goodWithDogs" className="flex items-center gap-1 cursor-pointer">
                <Dog className="h-4 w-4" />
                Dogs
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="goodWithCats"
                checked={behavior.goodWithCats}
                onCheckedChange={(checked) =>
                  setBehavior({ ...behavior, goodWithCats: checked as boolean })
                }
              />
              <label htmlFor="goodWithCats" className="flex items-center gap-1 cursor-pointer">
                <Cat className="h-4 w-4" />
                Cats
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="goodWithPeople"
                checked={behavior.goodWithPeople}
                onCheckedChange={(checked) =>
                  setBehavior({ ...behavior, goodWithPeople: checked as boolean })
                }
              />
              <label htmlFor="goodWithPeople" className="flex items-center gap-1 cursor-pointer">
                <Users className="h-4 w-4" />
                People
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="goodWithChildren"
                checked={behavior.goodWithChildren}
                onCheckedChange={(checked) =>
                  setBehavior({ ...behavior, goodWithChildren: checked as boolean })
                }
              />
              <label htmlFor="goodWithChildren" className="flex items-center gap-1 cursor-pointer">
                <Baby className="h-4 w-4" />
                Children
              </label>
            </div>
          </div>

          <div>
            <Label>Special Needs (Optional)</Label>
            <Textarea
              placeholder="Any special needs or requirements..."
              value={behavior.specialNeeds || ''}
              onChange={(e) => setBehavior({ ...behavior, specialNeeds: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label>Behavioral Notes (Optional)</Label>
            <Textarea
              placeholder="Additional behavioral observations..."
              value={behavior.behavioralNotes || ''}
              onChange={(e) => setBehavior({ ...behavior, behavioralNotes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            {initialBehavior && (
              <Button
                variant="outline"
                onClick={() => {
                  setBehavior(initialBehavior);
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${currentTemperament?.color}`} />
            <span className="font-medium">{currentTemperament?.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Energy: {energyOptions.find((e) => e.value === behavior.energyLevel)?.label}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {behavior.goodWithDogs && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Dog className="h-3 w-3" />
                Good with Dogs
              </Badge>
            )}
            {behavior.goodWithCats && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Cat className="h-3 w-3" />
                Good with Cats
              </Badge>
            )}
            {behavior.goodWithPeople && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Good with People
              </Badge>
            )}
            {behavior.goodWithChildren && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Baby className="h-3 w-3" />
                Good with Children
              </Badge>
            )}
          </div>

          {behavior.specialNeeds && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-yellow-800 dark:text-yellow-200">Special Needs</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{behavior.specialNeeds}</p>
                </div>
              </div>
            </div>
          )}

          {behavior.behavioralNotes && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">{behavior.behavioralNotes}</p>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Last updated: {new Date(behavior.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      )}
    </Card>
  );
}
