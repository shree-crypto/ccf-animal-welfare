import { Heart, DollarSign, Package, Stethoscope, Utensils, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Support Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Your generosity helps us provide food, medical care, and shelter to campus animals in need.
            </p>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Your Support Matters
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every contribution, no matter the size, makes a real difference in the lives of campus animals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-border">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <Utensils className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Daily Feeding</h3>
              <p className="text-muted-foreground mb-4">
                We provide nutritious meals to over 150 animals twice daily. Your donation helps us 
                maintain consistent feeding schedules across all territories.
              </p>
              <p className="text-sm font-medium text-primary">
                ₹500 feeds 10 animals for a day
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-border">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <Stethoscope className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Medical Care</h3>
              <p className="text-muted-foreground mb-4">
                From routine vaccinations to emergency treatments, we ensure every animal receives 
                proper medical attention when needed.
              </p>
              <p className="text-sm font-medium text-primary">
                ₹2,000 covers a full vaccination
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-border">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <Home className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Shelter & Safety</h3>
              <p className="text-muted-foreground mb-4">
                We provide temporary shelter for injured or recovering animals and work to create 
                safe spaces across campus.
              </p>
              <p className="text-sm font-medium text-primary">
                ₹5,000 supports shelter maintenance
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ways to Contribute
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the method that works best for you
            </p>
          </div>

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
        </div>
      </section>

      {/* Donation Impact */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your Impact
            </h2>
            <p className="text-xl text-muted-foreground">
              See how your contribution makes a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">₹500</div>
              <div className="text-muted-foreground">
                Feeds 10 animals for one day
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">₹1,000</div>
              <div className="text-muted-foreground">
                Provides basic medical care for one animal
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">₹2,500</div>
              <div className="text-muted-foreground">
                Covers emergency veterinary treatment
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-border text-center">
              <div className="text-4xl font-bold text-primary mb-2">₹5,000</div>
              <div className="text-muted-foreground">
                Supports one month of territory operations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-background rounded-2xl p-8 md:p-12 border border-border shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              Transparency & Accountability
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We believe in complete transparency with our donors. Every rupee donated is carefully 
                tracked and used exclusively for animal welfare purposes.
              </p>
              <p>
                Our financial records are maintained meticulously, and we provide regular updates on 
                how donations are utilized. Quarterly reports are shared with all donors detailing 
                expenses, animals helped, and ongoing projects.
              </p>
              <p>
                As a student-led initiative, we operate with minimal overhead costs, ensuring that 
                the maximum amount of your donation directly benefits the animals.
              </p>
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/about">Learn More About Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Other Ways to Help
            </h2>
            <p className="text-xl text-muted-foreground">
              Can't donate right now? There are still many ways to support our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-xl font-semibold mb-3">Volunteer Your Time</h3>
              <p className="text-muted-foreground mb-4">
                Join our team and contribute your time and skills to animal care activities.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Become a Volunteer</Link>
              </Button>
            </div>

            <div className="text-center p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-xl font-semibold mb-3">Spread Awareness</h3>
              <p className="text-muted-foreground mb-4">
                Share our mission on social media and help educate others about animal welfare.
              </p>
              <Button asChild variant="outline">
                <Link href="/stories">Share Success Stories</Link>
              </Button>
            </div>

            <div className="text-center p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-xl font-semibold mb-3">Attend Events</h3>
              <p className="text-muted-foreground mb-4">
                Participate in our fundraisers, awareness campaigns, and community events.
              </p>
              <Button asChild variant="outline">
                <Link href="/events">View Upcoming Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Make a Difference Today
          </h2>
          <p className="text-xl text-muted-foreground">
            Your support can save lives and create a better future for campus animals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Donate Now
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
