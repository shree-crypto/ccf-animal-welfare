'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';

interface MedicationManagerProps {
  medications: string[];
  onAdd: (medication: string) => void;
  onRemove: (medication: string) => void;
}

export function MedicationManager({
  medications,
  onAdd,
  onRemove,
}: MedicationManagerProps) {
  const [newMedication, setNewMedication] = useState('');

  const handleAdd = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      onAdd(newMedication.trim());
      setNewMedication('');
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Medications</FormLabel>
      <div className="flex gap-2">
        <Input
          placeholder="Add medication name"
          value={newMedication}
          onChange={e => setNewMedication(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" onClick={handleAdd} variant="outline">
          Add
        </Button>
      </div>
      {medications.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {medications.map(med => (
            <div
              key={med}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {med}
              <button
                type="button"
                onClick={() => onRemove(med)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
