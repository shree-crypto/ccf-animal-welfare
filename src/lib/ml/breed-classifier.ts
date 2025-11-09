/**
 * Dog Breed Classification using TensorFlow.js and MobileNet
 * 
 * This module provides lightweight ML-based breed classification for dog images.
 * Uses MobileNet pre-trained model for general image classification which includes
 * many dog breeds in its training data.
 */

import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;
let isLoading = false;

/**
 * Load the MobileNet model (lazy loading)
 */
export async function loadBreedClassifier(): Promise<mobilenet.MobileNet> {
  if (model) {
    return model;
  }

  if (isLoading) {
    // Wait for the model to finish loading
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (model) {
      return model;
    }
  }

  try {
    isLoading = true;
    console.log('Loading MobileNet model for breed classification...');
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0, // Use full model for better accuracy
    });
    console.log('MobileNet model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load breed classifier model:', error);
    throw new Error('Failed to load breed classification model');
  } finally {
    isLoading = false;
  }
}

/**
 * Dog breed information
 */
export interface BreedPrediction {
  breed: string;
  confidence: number;
  scientificName?: string;
}

/**
 * Extract dog breed from MobileNet classification
 * MobileNet includes many dog breeds in its ImageNet training
 */
function extractDogBreeds(
  predictions: Array<{ className: string; probability: number }>
): BreedPrediction[] {
  // Filter for dog-related classifications
  const dogPredictions = predictions.filter(pred => {
    const className = pred.className.toLowerCase();
    // Check if it's a dog breed (ImageNet has dog breeds with specific patterns)
    return (
      className.includes('dog') ||
      className.includes('hound') ||
      className.includes('terrier') ||
      className.includes('retriever') ||
      className.includes('shepherd') ||
      className.includes('spaniel') ||
      className.includes('bulldog') ||
      className.includes('poodle') ||
      className.includes('chihuahua') ||
      className.includes('pug') ||
      className.includes('mastiff') ||
      className.includes('collie')
    );
  });

  // Convert to BreedPrediction format
  return dogPredictions.map(pred => {
    // Clean up breed name (remove commas and extra info)
    const breedName = pred.className.split(',')[0].trim();
    
    return {
      breed: breedName,
      confidence: pred.probability,
      scientificName: pred.className,
    };
  });
}

/**
 * Classify dog breed from an image element
 */
export async function classifyDogBreed(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<BreedPrediction[]> {
  try {
    const classifier = await loadBreedClassifier();
    
    // Get predictions (top 5 most likely classes)
    const predictions = await classifier.classify(imageElement, 5);
    
    // Extract dog breeds from predictions
    const dogBreeds = extractDogBreeds(predictions);
    
    if (dogBreeds.length === 0) {
      console.log('No dog breeds detected in image. Top predictions:', 
        predictions.map(p => p.className));
      return [{
        breed: 'Unknown',
        confidence: 0,
        scientificName: 'Not detected as a dog',
      }];
    }
    
    return dogBreeds;
  } catch (error) {
    console.error('Error classifying breed:', error);
    throw error;
  }
}

/**
 * Classify dog breed from a File or Blob
 */
export async function classifyDogBreedFromFile(
  file: File | Blob
): Promise<BreedPrediction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          try {
            const breeds = await classifyDogBreed(img);
            resolve(breeds);
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
 * Get confidence level description
 */
export function getConfidenceLevel(confidence: number): string {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.5) return 'Medium';
  if (confidence >= 0.3) return 'Low';
  return 'Very Low';
}

/**
 * Check if model is loaded
 */
export function isModelLoaded(): boolean {
  return model !== null;
}

/**
 * Unload the model to free memory
 */
export function unloadModel(): void {
  if (model) {
    // MobileNet models don't have a dispose method
    // The model will be garbage collected when no longer referenced
    model = null;
    console.log('Breed classifier model unloaded');
  }
}
