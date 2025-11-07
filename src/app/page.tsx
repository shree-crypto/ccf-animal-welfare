import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Committee for Campus Fauna
            </h1>
            <p className="text-xl text-muted-foreground">
              Caring for the animals of IIT Roorkee with compassion and dedication
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/animals">
                  <Heart className="h-5 w-5" />
                  Meet Our Animals
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">
                  <Users className="h-5 w-5" />
                  Volunteer Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Animal Care</h3>
              <p className="text-muted-foreground">
                Providing daily care, feeding, and medical attention to campus animals
              </p>
            </div>
            <div className="text-center space-y-4 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Volunteer Network</h3>
              <p className="text-muted-foreground">
                Coordinating dedicated volunteers to ensure consistent animal welfare
              </p>
            </div>
            <div className="text-center space-y-4 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Territory Management</h3>
              <p className="text-muted-foreground">
                Tracking animal locations and territories across the campus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Get Involved
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover ways to support our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/about" className="group">
              <div className="p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Our Mission
                </h3>
                <p className="text-muted-foreground text-sm">
                  Learn about our values and what drives us
                </p>
              </div>
            </Link>

            <Link href="/stories" className="group">
              <div className="p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Success Stories
                </h3>
                <p className="text-muted-foreground text-sm">
                  Read inspiring tales of rescue and recovery
                </p>
              </div>
            </Link>

            <Link href="/events" className="group">
              <div className="p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Events
                </h3>
                <p className="text-muted-foreground text-sm">
                  Join our volunteer activities and campaigns
                </p>
              </div>
            </Link>

            <Link href="/donate" className="group">
              <div className="p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Donate
                </h3>
                <p className="text-muted-foreground text-sm">
                  Support our cause with your contribution
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Join Our Mission
          </h2>
          <p className="text-lg text-muted-foreground">
            Help us make a difference in the lives of campus animals. Every contribution counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Become a Volunteer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/animals">Explore Animal Profiles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
