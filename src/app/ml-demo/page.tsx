'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, Brain, Camera } from 'lucide-react';
import { MLPhotoAnalyzer } from '@/components/features/ml';

export default function MLDemoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setShowAnalyzer(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  const resetDemo = () => {
    setSelectedFile(null);
    setShowAnalyzer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI-Powered Animal Insights
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload a photo of a dog to see our AI in action
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Breed Detection
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Camera className="h-3 w-3" />
              Photo Quality
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Brain className="h-3 w-3" />
              TensorFlow.js
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 space-y-2">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold">Breed Classification</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatically identify dog breeds using MobileNet AI model
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold">Photo Quality Check</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get instant feedback on photo quality and composition
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold">Client-Side Processing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All AI runs in your browser - fast, private, and secure
            </p>
          </Card>
        </div>

        {/* Upload Area or Analyzer */}
        {!showAnalyzer ? (
          <Card className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg font-medium text-purple-600 dark:text-purple-400">
                  Drop the photo here...
                </p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    Drag and drop a dog photo here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Photo
                  </Button>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {selectedFile && (
              <MLPhotoAnalyzer
                file={selectedFile}
                onAnalysisComplete={analysis => {
                  console.log('Analysis complete:', analysis);
                }}
                onBreedSuggestion={breed => {
                  console.log('Suggested breed:', breed);
                }}
              />
            )}
            <div className="flex justify-center">
              <Button onClick={resetDemo} variant="outline">
                Try Another Photo
              </Button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="text-purple-600 dark:text-purple-400">→</span>
              <span>
                <strong>MobileNet V2</strong> - Pre-trained on ImageNet with 120+ dog breeds
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600 dark:text-purple-400">→</span>
              <span>
                <strong>COCO-SSD</strong> - Object detection for quality assessment
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600 dark:text-purple-400">→</span>
              <span>
                <strong>TensorFlow.js</strong> - Runs entirely in your browser for privacy
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600 dark:text-purple-400">→</span>
              <span>
                <strong>Lightweight & Fast</strong> - Optimized for quick inference
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
