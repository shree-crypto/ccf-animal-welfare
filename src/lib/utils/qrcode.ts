/**
 * Utility functions for generating QR codes for animal profiles
 */

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Generate a URL for an animal's QR code profile page
 */
export function getAnimalQRUrl(animalId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/animals/${animalId}?source=qr`;
}

/**
 * Generate a QR code data URL using a simple data URI approach
 * For production, consider using a library like qrcode or integrating with a QR API
 */
export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  // This is a placeholder implementation
  // In production, you would use a QR code generation library
  // For now, we'll use the Google Charts API as a simple solution
  
  const {
    size = 300,
    margin = 4,
    errorCorrectionLevel = 'M',
  } = options;

  // Using Google Charts API for QR code generation
  const encodedText = encodeURIComponent(text);
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodedText}&choe=UTF-8&chld=${errorCorrectionLevel}|${margin}`;
  
  return qrUrl;
}

/**
 * Generate a QR code for an animal profile
 */
export async function generateAnimalQRCode(
  animalId: string,
  animalName: string,
  options: QRCodeOptions = {}
): Promise<{ url: string; dataUrl: string }> {
  const url = getAnimalQRUrl(animalId);
  const dataUrl = await generateQRCodeDataUrl(url, options);
  
  return { url, dataUrl };
}

/**
 * Generate a printable QR code card for an animal
 */
export function generatePrintableQRCard(animalId: string, animalName: string): string {
  const qrUrl = getAnimalQRUrl(animalId);
  const qrImageUrl = generateQRCodeDataUrl(qrUrl, { size: 300 });
  
  // Return HTML that can be used for printing
  return `
    <div style="
      width: 4in;
      height: 4in;
      padding: 0.5in;
      border: 2px solid #333;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      page-break-after: always;
    ">
      <h2 style="margin: 0 0 10px 0; text-align: center;">${animalName}</h2>
      <img src="${qrImageUrl}" alt="QR Code for ${animalName}" style="width: 3in; height: 3in;" />
      <p style="margin: 10px 0 0 0; text-align: center; font-size: 12px;">
        Scan to view profile
      </p>
    </div>
  `;
}

/**
 * Download a QR code as an image file
 */
export async function downloadQRCode(
  animalId: string,
  animalName: string,
  options: QRCodeOptions = {}
): Promise<void> {
  const { dataUrl } = await generateAnimalQRCode(animalId, animalName, options);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${animalName.replace(/\s+/g, '_')}_QR_Code.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print QR codes for multiple animals
 */
export function printMultipleQRCodes(animals: Array<{ id: string; name: string }>): void {
  const cards = animals.map((animal) => generatePrintableQRCard(animal.id, animal.name)).join('');
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Animal QR Codes</title>
        <style>
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${cards}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
