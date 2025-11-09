'use client';

import { useState } from 'react';
import { CommunityReportForm } from '@/components/features/community/CommunityReportForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ReportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (report: {
    reportType: string;
    animalDescription?: string;
    location: string;
    description: string;
    reporterName?: string;
    reporterContact?: string;
    photos?: File[];
  }) => {
    try {
      // TODO: Replace with actual API call to create community report
      console.log('Submitting report:', report);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Upload photos to storage if provided
      // TODO: Create community report document in Appwrite
      // TODO: Notify admins about new report

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to submit report:', error);
      throw error;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Your report has been submitted successfully. Our team will review it
            and take appropriate action.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              We appreciate your help in caring for campus animals. If you
              provided contact information, we&apos;ll reach out if we need more
              details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Submit Another Report
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Report an Animal Concern</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help us care for campus animals by reporting sightings, concerns, or
            issues. Your reports help us ensure the wellbeing of all animals on
            campus.
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                  Emergency Situations
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                  If you&apos;re witnessing an emergency (severely injured
                  animal, immediate danger, etc.), please use our Emergency
                  Alert system for faster response.
                </p>
                <Button asChild variant="destructive" size="sm">
                  <Link href="/emergency">
                    Go to Emergency Alerts
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Form */}
        <CommunityReportForm onSubmit={handleSubmit} />

        {/* Additional Information */}
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">
              What happens after you report?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Your report is immediately sent to our team for review
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  A volunteer may be assigned to investigate the situation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  If you provided contact info, we&apos;ll update you on the
                  outcome
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Your contribution helps us maintain better care for all campus
                  animals
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Questions about animal welfare on campus?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us directly
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
