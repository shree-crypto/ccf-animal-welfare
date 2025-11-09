# ML Integration Guide

## Quick Start

This guide shows how to integrate ML features into existing components of the CCF Animal Welfare platform.

## 1. Add Breed Detection to Animal Form

**File:** `/src/components/features/admin/AnimalForm.tsx`

### Step 1: Import ML Components

```tsx
import { MLPhotoAnalyzer } from '@/components/features/ml';
import { useState } from 'react';
```

### Step 2: Add State for Photo Analysis

```tsx
function AnimalForm() {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [suggestedBreed, setSuggestedBreed] = useState<string>('');
  
  // ... existing state
}
```

### Step 3: Handle Photo Selection

```tsx
const handlePhotoUpload = (file: File) => {
  setSelectedPhoto(file);
  // Also trigger your existing photo upload logic
};
```

### Step 4: Add ML Analyzer to Form

```tsx
{/* After photo upload section */}
{selectedPhoto && (
  <div className="mt-4">
    <MLPhotoAnalyzer
      file={selectedPhoto}
      onBreedSuggestion={(breed) => {
        setSuggestedBreed(breed);
        // Auto-fill the breed field
        form.setValue('breed', breed);
      }}
      onAnalysisComplete={(analysis) => {
        // Optionally show quality feedback
        if (!analysis.quality.isGoodQuality) {
          toast.warning('Photo quality could be improved');
        }
      }}
    />
  </div>
)}

{/* Show suggested breed */}
{suggestedBreed && (
  <Alert>
    <Sparkles className="h-4 w-4" />
    <AlertDescription>
      AI detected breed: <strong>{suggestedBreed}</strong>
      <Button
        size="sm"
        variant="link"
        onClick={() => form.setValue('breed', suggestedBreed)}
      >
        Use this
      </Button>
    </AlertDescription>
  </Alert>
)}
```

## 2. Add Photo Quality Check to Community Reports

**File:** `/src/components/features/community/CommunityReportForm.tsx`

### Step 1: Import and Setup

```tsx
import { assessImageQualityFromFile } from '@/lib/ml';
import { useState } from 'react';
import { toast } from 'sonner';
```

### Step 2: Add Quality Check on Photo Upload

```tsx
const handlePhotoUpload = async (file: File) => {
  setUploading(true);
  
  try {
    // Check photo quality
    const quality = await assessImageQualityFromFile(file);
    
    if (quality.score < 50) {
      toast.warning('Photo quality is low', {
        description: quality.suggestions.join('. '),
      });
    } else if (quality.score >= 75) {
      toast.success('Great photo quality!');
    }
    
    // Continue with normal upload
    await uploadPhoto(file);
  } catch (error) {
    console.error('Quality check failed:', error);
    // Still allow upload even if quality check fails
    await uploadPhoto(file);
  } finally {
    setUploading(false);
  }
};
```

### Step 3: Show Quality Feedback in UI

```tsx
{uploadedPhoto && (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Uploaded Photo</span>
      <Badge variant={qualityScore >= 60 ? 'default' : 'secondary'}>
        Quality: {qualityScore}/100
      </Badge>
    </div>
    
    {qualitySuggestions.length > 0 && (
      <div className="mt-2 space-y-1">
        {qualitySuggestions.map((suggestion, idx) => (
          <p key={idx} className="text-xs text-gray-600">
            • {suggestion}
          </p>
        ))}
      </div>
    )}
  </Card>
)}
```

## 3. Add Breed Detection to Animal Detail Page

**File:** `/src/app/animals/[id]/page.tsx`

### Step 1: Add Re-classify Feature

```tsx
import { classifyDogBreedFromFile } from '@/lib/ml';
import { Button } from '@/components/ui/button';

function AnimalDetailPage({ params }) {
  const [animal, setAnimal] = useState<AnimalProfile | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  
  const reclassifyBreed = async () => {
    if (!animal?.photos.profile) return;
    
    setIsClassifying(true);
    try {
      // Fetch the profile photo as blob
      const response = await fetch(animal.photos.profile);
      const blob = await response.blob();
      
      // Classify breed
      const breeds = await classifyDogBreedFromFile(blob);
      
      if (breeds.length > 0 && breeds[0].confidence >= 0.6) {
        toast.success(`Detected breed: ${breeds[0].breed}`, {
          description: `Confidence: ${(breeds[0].confidence * 100).toFixed(0)}%`,
        });
      } else {
        toast.info('Could not confidently determine breed');
      }
    } catch (error) {
      toast.error('Failed to classify breed');
    } finally {
      setIsClassifying(false);
    }
  };
  
  return (
    <div>
      {/* Existing animal details */}
      
      <Button
        onClick={reclassifyBreed}
        disabled={isClassifying}
        variant="outline"
        size="sm"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        {isClassifying ? 'Analyzing...' : 'AI Breed Check'}
      </Button>
    </div>
  );
}
```

## 4. Batch Photo Quality Analysis

**File:** `/src/components/features/admin/PhotoManager.tsx`

### Step 1: Add Batch Analysis

```tsx
import { assessImageQualityFromFile } from '@/lib/ml';

const analyzeBatch = async (files: File[]) => {
  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const quality = await assessImageQualityFromFile(file);
        return { file, quality, error: null };
      } catch (error) {
        return { file, quality: null, error };
      }
    })
  );
  
  // Filter good quality photos
  const goodPhotos = results.filter(r => r.quality && r.quality.score >= 60);
  const poorPhotos = results.filter(r => r.quality && r.quality.score < 60);
  
  if (poorPhotos.length > 0) {
    toast.warning(`${poorPhotos.length} photos have quality issues`);
  }
  
  toast.success(`${goodPhotos.length} photos passed quality check`);
  
  return results;
};
```

## 5. Add ML Features Toggle

**File:** `/src/contexts/SettingsContext.tsx` (create if doesn't exist)

### Create Settings Context

```tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface MLSettings {
  enableBreedDetection: boolean;
  enableQualityCheck: boolean;
  autoSuggestBreed: boolean;
}

const defaultSettings: MLSettings = {
  enableBreedDetection: true,
  enableQualityCheck: true,
  autoSuggestBreed: true,
};

const SettingsContext = createContext<{
  mlSettings: MLSettings;
  updateMLSettings: (settings: Partial<MLSettings>) => void;
}>({
  mlSettings: defaultSettings,
  updateMLSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [mlSettings, setMLSettings] = useState<MLSettings>(() => {
    const saved = localStorage.getItem('ml-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  const updateMLSettings = (updates: Partial<MLSettings>) => {
    setMLSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('ml-settings', JSON.stringify(updated));
      return updated;
    });
  };
  
  return (
    <SettingsContext.Provider value={{ mlSettings, updateMLSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
```

### Use in Components

```tsx
import { useSettings } from '@/contexts/SettingsContext';

function MyComponent() {
  const { mlSettings } = useSettings();
  
  return (
    <>
      {mlSettings.enableBreedDetection && (
        <MLPhotoAnalyzer ... />
      )}
    </>
  );
}
```

## 6. Performance Optimization Tips

### Lazy Load ML Models

```tsx
import dynamic from 'next/dynamic';

// Dynamically import ML component
const MLPhotoAnalyzer = dynamic(
  () => import('@/components/features/ml').then(mod => mod.MLPhotoAnalyzer),
  {
    loading: () => <p>Loading AI features...</p>,
    ssr: false, // Disable server-side rendering for ML components
  }
);
```

### Preload Models on User Interaction

```tsx
import { loadBreedClassifier, loadImageDetector } from '@/lib/ml';

function PhotoUploadButton() {
  const handleMouseEnter = () => {
    // Preload models when user hovers over button
    loadBreedClassifier().catch(console.error);
    loadImageDetector().catch(console.error);
  };
  
  return (
    <Button onMouseEnter={handleMouseEnter}>
      Upload Photo
    </Button>
  );
}
```

### Cache Results

```tsx
const [breedCache, setBreedCache] = useState<Map<string, BreedPrediction[]>>(
  new Map()
);

const classifyWithCache = async (fileHash: string, file: File) => {
  // Check cache first
  if (breedCache.has(fileHash)) {
    return breedCache.get(fileHash)!;
  }
  
  // Classify and cache
  const breeds = await classifyDogBreedFromFile(file);
  setBreedCache(prev => new Map(prev).set(fileHash, breeds));
  
  return breeds;
};
```

## 7. Error Handling Best Practices

### Graceful Degradation

```tsx
function PhotoUploadForm() {
  const [mlAvailable, setMLAvailable] = useState(true);
  
  const handlePhotoUpload = async (file: File) => {
    if (mlAvailable) {
      try {
        const quality = await assessImageQualityFromFile(file);
        // Use quality feedback
      } catch (error) {
        console.error('ML feature unavailable:', error);
        setMLAvailable(false);
        // Continue without ML features
      }
    }
    
    // Normal upload flow continues
    await uploadPhoto(file);
  };
  
  return (
    <>
      {!mlAvailable && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            AI features are temporarily unavailable. You can still upload photos.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
```

## 8. Testing ML Features

### Mock ML Functions in Tests

```tsx
// In test file
import * as ml from '@/lib/ml';

vi.mock('@/lib/ml', () => ({
  classifyDogBreedFromFile: vi.fn().mockResolvedValue([
    { breed: 'Golden Retriever', confidence: 0.85 }
  ]),
  assessImageQualityFromFile: vi.fn().mockResolvedValue({
    isGoodQuality: true,
    score: 85,
    suggestions: ['Great photo!'],
    detections: [],
  }),
}));
```

## Common Patterns

### Pattern 1: Progressive Enhancement

```tsx
// Always provide base functionality, enhance with ML when available
function BreedInput({ onChange }) {
  return (
    <>
      <Input onChange={onChange} placeholder="Enter breed" />
      
      {/* ML enhancement - optional */}
      <MLBreedSuggestion onSelect={onChange} />
    </>
  );
}
```

### Pattern 2: User Consent

```tsx
// Ask before using ML features
function MLFeaturePrompt() {
  const [consent, setConsent] = useState(false);
  
  if (!consent) {
    return (
      <Alert>
        <AlertDescription>
          Enable AI features for automatic breed detection?
          <Button onClick={() => setConsent(true)}>Enable</Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return <MLPhotoAnalyzer ... />;
}
```

### Pattern 3: Background Processing

```tsx
// Don't block UI while ML runs
function AsyncMLAnalysis({ file }) {
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    let cancelled = false;
    
    const analyze = async () => {
      setIsAnalyzing(true);
      try {
        const breeds = await classifyDogBreedFromFile(file);
        if (!cancelled) setResult(breeds);
      } finally {
        if (!cancelled) setIsAnalyzing(false);
      }
    };
    
    analyze();
    
    return () => { cancelled = true; };
  }, [file]);
  
  return result || <Spinner />;
}
```

## Next Steps

1. Choose integration points based on user needs
2. Add feature flags for gradual rollout
3. Monitor performance and user feedback
4. Iterate based on real-world usage

For more details, see the [ML Features Documentation](./ML_FEATURES.md).
