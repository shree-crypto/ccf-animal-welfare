/**
 * ML Library Index
 * 
 * Central export point for all ML-powered features
 */

// Breed Classification
export {
  loadBreedClassifier,
  classifyDogBreed,
  classifyDogBreedFromFile,
  getConfidenceLevel,
  isModelLoaded,
  unloadModel,
  type BreedPrediction,
} from './breed-classifier';

// Image Quality Assessment
export {
  loadImageDetector,
  assessImageQuality,
  assessImageQualityFromFile,
  unloadDetector,
  type ImageQualityAssessment,
} from './image-quality';
