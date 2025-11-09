'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateAnimalQRCode, downloadQRCode, generatePrintableQRCard } from '@/lib/utils/qrcode';
import { QrCode, Download, Printer, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface AnimalQRCodeProps {
  animalId: string;
  animalName: string;
  showInline?: boolean;
}

export function AnimalQRCode({ animalId, animalName, showInline = false }: AnimalQRCodeProps) {
  const [qrData, setQrData] = useState<{ url: string; dataUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (showInline || isDialogOpen) {
      loadQRCode();
    }
  }, [animalId, showInline, isDialogOpen]);

  const loadQRCode = async () => {
    setIsLoading(true);
    try {
      const data = await generateAnimalQRCode(animalId, animalName);
      setQrData(data);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadQRCode(animalId, animalName);
      toast.success('QR code downloaded successfully');
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handlePrint = () => {
    const card = generatePrintableQRCard(animalId, animalName);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups to print QR code');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${animalName}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${card}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleShare = async () => {
    if (navigator.share && qrData) {
      try {
        await navigator.share({
          title: `${animalName} - CCF Animal Profile`,
          text: `View ${animalName}'s profile at CCF Animal Welfare`,
          url: qrData.url,
        });
        toast.success('Shared successfully');
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      if (qrData) {
        try {
          await navigator.clipboard.writeText(qrData.url);
          toast.success('Link copied to clipboard');
        } catch (error) {
          toast.error('Failed to copy link');
        }
      }
    }
  };

  const QRCodeDisplay = () => (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : qrData ? (
        <>
          <div className="flex justify-center">
            <img
              src={qrData.dataUrl}
              alt={`QR Code for ${animalName}`}
              className="w-64 h-64 border-4 border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan this QR code to view {animalName}&apos;s profile
            </p>
            <p className="text-xs text-gray-500 break-all">{qrData.url}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );

  if (showInline) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="h-5 w-5" />
          <h3 className="font-semibold">QR Code</h3>
        </div>
        <QRCodeDisplay />
      </Card>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-1" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {animalName}</DialogTitle>
        </DialogHeader>
        <QRCodeDisplay />
      </DialogContent>
    </Dialog>
  );
}
