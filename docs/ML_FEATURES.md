# Machine Learning Features Documentation

## Overview

The CCF Animal Welfare platform now includes AI-powered features to enhance animal care and photo management. All ML features run client-side using TensorFlow.js for privacy and speed.

## Features

### 1. Dog Breed Classification

Automatically identify dog breeds from uploaded photos using a pre-trained MobileNet model.

#### Key Benefits
- **Automatic Breed Identification**: Reduces manual data entry
- **Multiple Predictions**: Shows top 3 most likely breeds with confidence scores
- **120+ Dog Breeds**: Trained on ImageNet dataset with extensive dog breed coverage
- **Fast Processing**: Client-side inference takes 1-3 seconds

#### How to Use

```typescript
import { classifyDogBreedFromFile } from '@/lib/ml';

// From a file input
const breeds = await classifyDogBreedFromFile(file);

console.log(breeds);
// [{
//   breed: "Golden Retriever",
//   confidence: 0.89,
//   scientificName: "golden retriever"
// }]
```

#### Technical Details
- **Model**: MobileNet V2 (α=1.0)
- **Input**: Images resized to 224x224
- **Output**: Top 5 predictions filtered for dog breeds
- **Model Size**: ~14MB (cached after first load)
- **Inference Time**: 1-3 seconds on modern hardware

### 2. Photo Quality Assessment

Provides instant feedback on photo quality to help volunteers take better pictures.

#### Quality Checks
- ✅ **Animal Detection**: Verifies dog/cat is present in image
- ✅ **Single Subject**: Recommends photos with single animal
- ✅ **Detection Confidence**: Checks image clarity
- ✅ **Subject Size**: Ensures animal takes 30-70% of frame
- ✅ **Centering**: Evaluates subject positioning
- ✅ **Background Clutter**: Detects distracting elements

#### Scoring System
- **75-100**: Excellent photo quality
- **50-74**: Good quality, minor improvements possible
- **0-49**: Needs improvement, suggestions provided

#### How to Use

```typescript
import { assessImageQualityFromFile } from '@/lib/ml';

const assessment = await assessImageQualityFromFile(file);

console.log(assessment);
// {
//   isGoodQuality: true,
//   score: 85,
//   suggestions: ["Great photo! This will work well for the animal profile."],
//   detections: [{ class: "dog", score: 0.92, bbox: [...] }]
// }
```

#### Technical Details
- **Model**: COCO-SSD (Single Shot Detector)
- **Detection Classes**: 80+ objects including dogs, cats
- **Model Size**: ~5MB (cached after first load)
- **Inference Time**: 500ms-1.5 seconds

### 3. ML Photo Analyzer Component

A React component that combines breed detection and quality assessment in a user-friendly interface.

#### Features
- Drag-and-drop photo upload
- Live image preview
- Real-time AI analysis
- Visual quality scoring with progress bars
- Breed suggestions with confidence levels
- Actionable improvement tips

#### How to Use

```tsx
import { MLPhotoAnalyzer } from '@/components/features/ml';

<MLPhotoAnalyzer
  file={selectedFile}
  onAnalysisComplete={(analysis) => {
    console.log('Breeds:', analysis.breeds);
    console.log('Quality:', analysis.quality);
  }}
  onBreedSuggestion={(breed) => {
    // Auto-fill breed field
    setFormBreed(breed);
  }}
/>
```

## Integration Examples

### Admin Animal Form

Add ML analysis to the animal creation/edit form:

```tsx
// In AnimalForm component
const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
const [suggestedBreed, setSuggestedBreed] = useState<string>('');

// When user uploads a photo
const handlePhotoUpload = (file: File) => {
  setSelectedPhoto(file);
};

// In the form JSX
{selectedPhoto && (
  <MLPhotoAnalyzer
    file={selectedPhoto}
    onBreedSuggestion={breed => setSuggestedBreed(breed)}
  />
)}
```

### Community Report Form

Help community members submit better reports:

```tsx
// In CommunityReportForm
const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);

{uploadedPhoto && (
  <div className="mt-4">
    <MLPhotoAnalyzer file={uploadedPhoto} />
  </div>
)}
```

## ML Demo Page

Visit `/ml-demo` to see the ML features in action:
- Interactive breed detection
- Real-time quality assessment
- Visual feedback and suggestions
- Educational information about the AI models

## Technical Architecture

### Model Loading Strategy

Models are lazy-loaded only when needed:

```typescript
// First call loads the model (takes 2-5 seconds)
const breeds = await classifyDogBreedFromFile(file);

// Subsequent calls use cached model (instant)
const moreBreeds = await classifyDogBreedFromFile(anotherFile);
```

### Memory Management

Models can be unloaded to free memory:

```typescript
import { unloadModel, unloadDetector } from '@/lib/ml';

// When user leaves the page
useEffect(() => {
  return () => {
    unloadModel();
    unloadDetector();
  };
}, []);
```

### Performance Optimization

- **Lazy Loading**: Models load only when first used
- **Caching**: Models cached in memory for subsequent use
- **WebGL Acceleration**: Uses GPU when available
- **Efficient Models**: MobileNet and COCO-SSD are optimized for speed
- **Parallel Processing**: Breed and quality checks run simultaneously

## Browser Compatibility

### Requirements
- Modern browser with JavaScript enabled
- WebGL support (for GPU acceleration)
- Minimum 2GB RAM recommended

### Tested Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance Notes
- **Desktop**: 1-3 second inference
- **Mobile**: 3-5 second inference
- **GPU Acceleration**: Significantly faster on devices with WebGL

## Privacy & Security

### Data Privacy
- ✅ **No Server Upload**: All processing happens in the browser
- ✅ **No External APIs**: Models run entirely client-side
- ✅ **No Data Collection**: Images never leave the user's device
- ✅ **GDPR Compliant**: No personal data transmitted

### Security Benefits
- No network latency or dependency
- Works offline after models are cached
- No server costs for inference
- User data remains private

## Future Enhancements

### Planned Features
1. **Health Detection**: Identify visible injuries or health issues
2. **Emotion Recognition**: Detect dog emotions (happy, scared, aggressive)
3. **Individual Recognition**: Face recognition for tracking individual dogs
4. **Behavior Analysis**: Pattern detection in behavior tracking data
5. **Smart Matching**: ML-based volunteer-task assignment

### Model Improvements
- Fine-tuning on local dog breeds
- Custom model for Indian street dogs
- Lightweight pose estimation for health checks
- Sentiment analysis for behavior notes

## Troubleshooting

### Model Loading Fails
```typescript
// Check if running in supported browser
if (!navigator.gpu && !WebGL2RenderingContext) {
  console.warn('Limited ML support in this browser');
}
```

### Slow Performance
- Ensure WebGL is enabled
- Close other tabs to free memory
- Use smaller images (< 5MB)
- Wait for model caching on first load

### Breed Not Detected
- Ensure photo clearly shows the dog
- Use well-lit, focused images
- Try different angle or closer shot
- Check if breed is in ImageNet dataset

## API Reference

See inline JSDoc comments in:
- `/src/lib/ml/breed-classifier.ts`
- `/src/lib/ml/image-quality.ts`
- `/src/components/features/ml/MLPhotoAnalyzer.tsx`

## Contributing

To add new ML features:
1. Add model loading function in `/src/lib/ml/`
2. Create React component in `/src/components/features/ml/`
3. Export from `/src/lib/ml/index.ts`
4. Update this documentation
5. Add tests in `/src/test/integration/`

## Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [MobileNet Model](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [ImageNet Classes](https://gist.github.com/yrevar/942d3a0ac09ec9e5eb3a)
