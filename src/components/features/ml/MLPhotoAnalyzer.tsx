'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Camera,
} from 'lucide-react';
import {
  classifyDogBreedFromFile,
  assessImageQualityFromFile,
  getConfidenceLevel,
  type BreedPrediction,
  type ImageQualityAssessment,
} from '@/lib/ml';

interface MLPhotoAnalysis {
  breeds: BreedPrediction[];
  quality: ImageQualityAssessment;
}

interface MLPhotoAnalyzerProps {
  file: File;
  onAnalysisComplete?: (analysis: MLPhotoAnalysis) => void;
  onBreedSuggestion?: (breed: string) => void;
}

export function MLPhotoAnalyzer({
  file,
  onAnalysisComplete,
  onBreedSuggestion,
}: MLPhotoAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MLPhotoAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Cleanup
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const analyzeImage = useCallback(async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Run both analyses in parallel for efficiency
      const [breeds, quality] = await Promise.all([
        classifyDogBreedFromFile(file),
        assessImageQualityFromFile(file),
      ]);

      const analysisResult = { breeds, quality };
      setAnalysis(analysisResult);

      // Notify parent component
      onAnalysisComplete?.(analysisResult);

      // Suggest breed if confidence is high enough
      if (breeds.length > 0 && breeds[0].confidence >= 0.6) {
        onBreedSuggestion?.(breeds[0].breed);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to analyze image'
      );
    } finally {
      setAnalyzing(false);
    }
  }, [file, onAnalysisComplete, onBreedSuggestion]);

  const getQualityColor = (score: number) => {
    if (score >= 75) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getQualityBadgeVariant = (score: number) => {
    if (score >= 75) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold">AI Photo Analysis</h3>
          </div>
          {!analyzing && !analysis && (
            <Button onClick={analyzeImage} size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Analyze Photo
            </Button>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Analyzing State */}
        {analyzing && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing image with AI...</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {analysis && !analyzing && (
          <div className="space-y-4">
            {/* Breed Detection */}
            {analysis.breeds.length > 0 && analysis.breeds[0].confidence > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">Detected Breed:</h4>
                </div>
                <div className="space-y-2">
                  {analysis.breeds.slice(0, 3).map((breed, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <span className="text-sm font-medium">{breed.breed}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {(breed.confidence * 100).toFixed(0)}%
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getConfidenceLevel(breed.confidence)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Quality */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Photo Quality:</h4>
                <Badge variant={getQualityBadgeVariant(analysis.quality.score)}>
                  {analysis.quality.score}/100
                </Badge>
              </div>
              
              <Progress
                value={analysis.quality.score}
                className={`h-2 ${getQualityColor(analysis.quality.score)}`}
              />

              {/* Quality Status */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                {analysis.quality.isGoodQuality ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  {analysis.quality.suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                      {suggestion}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {!analysis.quality.isGoodQuality && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Tip:</strong> For best results, take photos in good
                  lighting with the animal centered in the frame and taking up
                  30-70% of the image.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Info Text */}
        {!analysis && !analyzing && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Our AI will analyze the photo to detect breed and suggest improvements
          </p>
        )}
      </div>
    </Card>
  );
}
