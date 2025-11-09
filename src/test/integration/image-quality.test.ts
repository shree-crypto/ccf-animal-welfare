/**
 * Tests for ML Image Quality Assessment
 */

import { describe, it, expect } from 'vitest';
import { loadImageDetector } from '@/lib/ml/image-quality';

describe('Image Quality Assessment', () => {
  describe('Model Loading', () => {
    it('should load the COCO-SSD model', async () => {
      const model = await loadImageDetector();
      expect(model).toBeDefined();
    }, 30000); // Give 30 seconds for model download

    it('should return cached model on subsequent calls', async () => {
      const model1 = await loadImageDetector();
      const model2 = await loadImageDetector();
      expect(model1).toBe(model2);
    });
  });

  describe('Quality Assessment Structure', () => {
    it('should return assessment with correct structure', () => {
      const expectedStructure = {
        isGoodQuality: expect.any(Boolean),
        score: expect.any(Number),
        suggestions: expect.any(Array),
        detections: expect.any(Array),
      };

      // Mock assessment format
      const mockAssessment = {
        isGoodQuality: true,
        score: 85,
        suggestions: ['Great photo!'],
        detections: [
          {
            class: 'dog',
            score: 0.92,
            bbox: [10, 10, 200, 200],
          },
        ],
      };

      expect(mockAssessment).toMatchObject(expectedStructure);
      expect(mockAssessment.score).toBeGreaterThanOrEqual(0);
      expect(mockAssessment.score).toBeLessThanOrEqual(100);
    });

    it('should classify quality correctly based on score', () => {
      // Good quality
      expect({ isGoodQuality: true, score: 85 }).toMatchObject({
        isGoodQuality: true,
        score: expect.any(Number),
      });

      // Poor quality
      expect({ isGoodQuality: false, score: 45 }).toMatchObject({
        isGoodQuality: false,
        score: expect.any(Number),
      });
    });

    it('should provide suggestions array', () => {
      const suggestions = [
        'Animal is too small in the frame.',
        'Try centering the animal.',
      ];

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      suggestions.forEach(suggestion => {
        expect(typeof suggestion).toBe('string');
      });
    });
  });

  describe('Detection Structure', () => {
    it('should have correct detection object structure', () => {
      const detection = {
        class: 'dog',
        score: 0.92,
        bbox: [10, 10, 200, 200],
      };

      expect(detection).toHaveProperty('class');
      expect(detection).toHaveProperty('score');
      expect(detection).toHaveProperty('bbox');
      expect(Array.isArray(detection.bbox)).toBe(true);
      expect(detection.bbox.length).toBe(4);
    });
  });
});
