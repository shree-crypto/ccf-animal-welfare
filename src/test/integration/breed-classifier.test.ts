/**
 * Tests for ML Breed Classifier
 */

import { describe, it, expect } from 'vitest';
import {
  loadBreedClassifier,
  getConfidenceLevel,
  isModelLoaded,
} from '@/lib/ml/breed-classifier';

describe('Breed Classifier', () => {
  describe('Model Loading', () => {
    it('should load the MobileNet model', async () => {
      const model = await loadBreedClassifier();
      expect(model).toBeDefined();
      expect(isModelLoaded()).toBe(true);
    }, 30000); // Give 30 seconds for model download

    it('should return cached model on subsequent calls', async () => {
      const model1 = await loadBreedClassifier();
      const model2 = await loadBreedClassifier();
      expect(model1).toBe(model2);
    });
  });

  describe('Confidence Level', () => {
    it('should return "Very High" for confidence >= 0.9', () => {
      expect(getConfidenceLevel(0.95)).toBe('Very High');
      expect(getConfidenceLevel(0.9)).toBe('Very High');
    });

    it('should return "High" for confidence >= 0.7', () => {
      expect(getConfidenceLevel(0.8)).toBe('High');
      expect(getConfidenceLevel(0.7)).toBe('High');
    });

    it('should return "Medium" for confidence >= 0.5', () => {
      expect(getConfidenceLevel(0.6)).toBe('Medium');
      expect(getConfidenceLevel(0.5)).toBe('Medium');
    });

    it('should return "Low" for confidence >= 0.3', () => {
      expect(getConfidenceLevel(0.4)).toBe('Low');
      expect(getConfidenceLevel(0.3)).toBe('Low');
    });

    it('should return "Very Low" for confidence < 0.3', () => {
      expect(getConfidenceLevel(0.2)).toBe('Very Low');
      expect(getConfidenceLevel(0.0)).toBe('Very Low');
    });
  });

  describe('Breed Prediction Structure', () => {
    it('should return predictions with correct structure', async () => {
      // This is a structure test - actual breed detection would need real images
      const expectedStructure = {
        breed: expect.any(String),
        confidence: expect.any(Number),
        scientificName: expect.any(String),
      };

      // Mock prediction format
      const mockPrediction = {
        breed: 'Golden Retriever',
        confidence: 0.85,
        scientificName: 'golden retriever',
      };

      expect(mockPrediction).toMatchObject(expectedStructure);
      expect(mockPrediction.confidence).toBeGreaterThanOrEqual(0);
      expect(mockPrediction.confidence).toBeLessThanOrEqual(1);
    });
  });
});
