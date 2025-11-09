/**
 * Image Quality Assessment for Animal Photos
 * 
 * This module provides ML-based image quality assessment to help users
 * upload better photos for animal profiles.
 */

import * as cocoSsd from '@tensorflow-models/coco-ssd';

let detector: cocoSsd.ObjectDetection | null = null;
let isLoading = false;

/**
 * Load the COCO-SSD object detection model
 */
export async function loadImageDetector(): Promise<cocoSsd.ObjectDetection> {
  if (detector) {
    return detector;
  }

  if (isLoading) {
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (detector) {
      return detector;
    }
  }

  try {
    isLoading = true;
    console.log('Loading COCO-SSD model for image detection...');
    detector = await cocoSsd.load();
    console.log('COCO-SSD model loaded successfully');
    return detector;
  } catch (error) {
    console.error('Failed to load image detector:', error);
    throw new Error('Failed to load image detection model');
  } finally {
    isLoading = false;
  }
}

/**
 * Image quality assessment result
 */
export interface ImageQualityAssessment {
  isGoodQuality: boolean;
  score: number; // 0-100
  suggestions: string[];
  detections: Array<{
    class: string;
    score: number;
    bbox: number[];
  }>;
}

/**
 * Assess image quality for animal photos
 */
export async function assessImageQuality(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<ImageQualityAssessment> {
  try {
    const model = await loadImageDetector();
    const predictions = await model.detect(imageElement);

    const suggestions: string[] = [];
    let qualityScore = 50; // Start with base score

    // Check if any dog or cat is detected
    const animalDetections = predictions.filter(
      p => p.class === 'dog' || p.class === 'cat'
    );

    if (animalDetections.length === 0) {
      suggestions.push('No dog or cat detected in image. Please upload a photo of the animal.');
      qualityScore -= 30;
    } else if (animalDetections.length > 1) {
      suggestions.push('Multiple animals detected. For best results, use photos with a single animal.');
      qualityScore -= 10;
    } else {
      // Single animal detected - analyze quality
      const detection = animalDetections[0];
      
      // Check detection confidence
      if (detection.score >= 0.8) {
        qualityScore += 20;
      } else if (detection.score < 0.5) {
        suggestions.push('Animal detection confidence is low. Try a clearer, better-lit photo.');
        qualityScore -= 15;
      }

      // Check if animal takes up good portion of image
      const [x, y, width, height] = detection.bbox;
      const imageArea = imageElement.width * imageElement.height;
      const animalArea = width * height;
      const coveragePercent = (animalArea / imageArea) * 100;

      if (coveragePercent < 15) {
        suggestions.push('Animal is too small in the frame. Try getting closer for a better shot.');
        qualityScore -= 10;
      } else if (coveragePercent > 80) {
        suggestions.push('Animal is too close. Try backing up slightly for a better full-body shot.');
        qualityScore -= 5;
      } else if (coveragePercent >= 30 && coveragePercent <= 70) {
        qualityScore += 15;
      }

      // Check if animal is reasonably centered
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const imageCenterX = imageElement.width / 2;
      const imageCenterY = imageElement.height / 2;
      
      const distanceFromCenter = Math.sqrt(
        Math.pow(centerX - imageCenterX, 2) + Math.pow(centerY - imageCenterY, 2)
      );
      const maxDistance = Math.sqrt(
        Math.pow(imageElement.width / 2, 2) + Math.pow(imageElement.height / 2, 2)
      );
      const centeringScore = 1 - distanceFromCenter / maxDistance;
      
      if (centeringScore > 0.7) {
        qualityScore += 10;
      } else if (centeringScore < 0.3) {
        suggestions.push('Animal is off-center. Try centering the animal in the frame.');
      }
    }

    // Check for multiple distracting objects
    const otherObjects = predictions.filter(
      p => p.class !== 'dog' && p.class !== 'cat'
    );
    if (otherObjects.length > 3) {
      suggestions.push('Image has many distracting elements. A simpler background would be better.');
      qualityScore -= 5;
    }

    // Clamp score to 0-100
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    // Add positive feedback if quality is good
    if (qualityScore >= 75 && suggestions.length === 0) {
      suggestions.push('Great photo! This will work well for the animal profile.');
    }

    return {
      isGoodQuality: qualityScore >= 60,
      score: qualityScore,
      suggestions,
      detections: predictions.map(p => ({
        class: p.class,
        score: p.score,
        bbox: p.bbox,
      })),
    };
  } catch (error) {
    console.error('Error assessing image quality:', error);
    throw error;
  }
}

/**
 * Assess image quality from a File or Blob
 */
export async function assessImageQualityFromFile(
  file: File | Blob
): Promise<ImageQualityAssessment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          try {
            const assessment = await assessImageQuality(img);
            resolve(assessment);
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Unload the detector model to free memory
 */
export function unloadDetector(): void {
  if (detector) {
    // COCO-SSD models don't have a dispose method
    // The model will be garbage collected when no longer referenced
    detector = null;
    console.log('Image detector model unloaded');
  }
}
