import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WhyDonate } from '@/components/features/donate/WhyDonate';
import { DonationMethods } from '@/components/features/donate/DonationMethods';
import { DonationImpact } from '@/components/features/donate/DonationImpact';

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
              Your generosity helps us provide food, medical care, and shelter
              to campus animals in need.
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
              Every contribution, no matter the size, makes a real difference in
              the lives of campus animals.
            </p>
          </div>

          <WhyDonate />
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

          <DonationMethods />
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

          <DonationImpact />
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
                We believe in complete transparency with our donors. Every rupee
                donated is carefully tracked and used exclusively for animal
                welfare purposes.
              </p>
              <p>
                Our financial records are maintained meticulously, and we
                provide regular updates on how donations are utilized. Quarterly
                reports are shared with all donors detailing expenses, animals
                helped, and ongoing projects.
              </p>
              <p>
                As a student-led initiative, we operate with minimal overhead
                costs, ensuring that the maximum amount of your donation
                directly benefits the animals.
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
              Can't donate right now? There are still many ways to support our
              mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Volunteer Your Time
              </h3>
              <p className="text-muted-foreground mb-4">
                Join our team and contribute your time and skills to animal care
                activities.
              </p>
              <Button asChild variant="outline">
                <Link href="/contact">Become a Volunteer</Link>
              </Button>
            </div>

            <div className="text-center p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-xl font-semibold mb-3">Spread Awareness</h3>
              <p className="text-muted-foreground mb-4">
                Share our mission on social media and help educate others about
                animal welfare.
              </p>
              <Button asChild variant="outline">
                <Link href="/stories">Share Success Stories</Link>
              </Button>
            </div>

            <div className="text-center p-8 rounded-xl bg-muted/50 border border-border">
              <h3 className="text-xl font-semibold mb-3">Attend Events</h3>
              <p className="text-muted-foreground mb-4">
                Participate in our fundraisers, awareness campaigns, and
                community events.
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
            Your support can save lives and create a better future for campus
            animals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Donate Now</Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
