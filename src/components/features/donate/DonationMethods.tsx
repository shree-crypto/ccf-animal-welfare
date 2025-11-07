import { DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function DonationMethods() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Financial Donations */}
      <div className="bg-background rounded-2xl p-8 border border-border shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-6">
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-3xl font-bold mb-4">Financial Donations</h3>
        <p className="text-muted-foreground mb-6">
          Direct financial support helps us cover operational costs and respond quickly to 
          emergencies.
        </p>

        <div className="space-y-4 mb-8">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Bank Transfer</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">Account Name:</span> CCF Animal Welfare Fund</p>
              <p><span className="font-medium">Account Number:</span> 1234567890</p>
              <p><span className="font-medium">IFSC Code:</span> SBIN0001234</p>
              <p><span className="font-medium">Bank:</span> State Bank of India</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">UPI Payment</h4>
            <div className="text-sm text-muted-foreground">
              <p><span className="font-medium">UPI ID:</span> ccf@iitr</p>
              <p className="mt-2 text-xs">Scan QR code or use UPI ID for instant transfer</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Online Payment</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Use our secure online payment portal for credit/debit card donations
            </p>
            <Button className="w-full">Donate Online</Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          All donations are tax-deductible under Section 80G. Receipt will be provided.
        </p>
      </div>

      {/* In-Kind Donations */}
      <div className="bg-background rounded-2xl p-8 border border-border shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-6">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-3xl font-bold mb-4">In-Kind Donations</h3>
        <p className="text-muted-foreground mb-6">
          Donate supplies and materials that directly support our daily operations.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-semibold mb-3">Most Needed Items:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Dry dog and cat food (high-quality brands)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Medical supplies (bandages, antiseptics, medicines)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Food and water bowls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Blankets and bedding materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Leashes, collars, and identification tags</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Cleaning supplies and disinfectants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Toys and enrichment items</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Drop-off Location</h4>
            <p className="text-sm text-muted-foreground">
              CCF Office, Student Activity Center<br />
              IIT Roorkee Campus<br />
              Monday - Friday: 9 AM - 6 PM<br />
              Saturday: 10 AM - 4 PM
            </p>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/contact">Contact Us for Donations</Link>
        </Button>
      </div>
    </div>
  );
}
