import { Heart, Users, Target, Award, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
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
              Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Dedicated to the welfare and protection of campus animals at IIT Roorkee through 
              compassionate care, community engagement, and sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                The Committee for Campus Fauna (CCF) is a student-led initiative at IIT Roorkee 
                committed to ensuring the well-being of all animals living on our campus. Founded 
                by passionate students who recognized the need for organized animal care, we have 
                grown into a dedicated community of volunteers working tirelessly to make a difference.
              </p>
              <p>
                Our mission extends beyond basic care. We strive to create a harmonious environment 
                where humans and animals coexist peacefully, where every animal receives the medical 
                attention they need, and where the campus community is educated about responsible 
                animal welfare practices.
              </p>
              <p>
                Through systematic territory management, regular feeding schedules, comprehensive 
                medical care, and community awareness programs, we ensure that no animal on campus 
                goes unnoticed or uncared for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Compassion */}
            <div className="group relative overflow-hidden rounded-2xl bg-background p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Compassion</h3>
                <p className="text-muted-foreground">
                  Every animal deserves love, care, and respect. We approach each situation with 
                  empathy and understanding.
                </p>
              </div>
            </div>

            {/* Community */}
            <div className="group relative overflow-hidden rounded-2xl bg-background p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Building a network of caring individuals who work together to create lasting 
                  positive change for campus animals.
                </p>
              </div>
            </div>

            {/* Responsibility */}
            <div className="group relative overflow-hidden rounded-2xl bg-background p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Responsibility</h3>
                <p className="text-muted-foreground">
                  Taking ownership of animal welfare on campus through consistent care, proper 
                  documentation, and accountability.
                </p>
              </div>
            </div>

            {/* Excellence */}
            <div className="group relative overflow-hidden rounded-2xl bg-background p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  Striving for the highest standards in animal care, from medical treatment to 
                  daily feeding routines.
                </p>
              </div>
            </div>

            {/* Transparency */}
            <div className="group relative overflow-hidden rounded-2xl bg-background p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  Maintaining open communication and clear records of all our activities and 
                  animal care operations.
                </p>
              </div>
            </div>

            {/* Innovation */}
            <div className="group relative overflow-hidden rounded-2xl bg-background p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  Leveraging technology and creative solutions to improve animal welfare and 
                  volunteer coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What We Do
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive care for every animal on campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-background rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-semibold mb-4">Daily Care & Feeding</h3>
              <p className="text-muted-foreground mb-4">
                Our volunteers follow systematic feeding schedules across all campus territories, 
                ensuring every animal receives nutritious meals regularly. We maintain detailed 
                records of feeding patterns and dietary needs.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Twice-daily feeding schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Territory-based food distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Special dietary accommodations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-background rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-semibold mb-4">Medical Care</h3>
              <p className="text-muted-foreground mb-4">
                We coordinate with local veterinarians to provide comprehensive medical care, 
                from routine vaccinations to emergency treatments. Every medical interaction 
                is documented for continuity of care.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Regular health checkups</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Vaccination programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Emergency medical response</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-background rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-semibold mb-4">Territory Management</h3>
              <p className="text-muted-foreground mb-4">
                Using advanced mapping technology, we track animal territories and pack dynamics 
                across campus. This helps us optimize feeding routes and identify areas needing 
                attention.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Interactive territory maps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Pack density monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Location-based task assignment</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-background rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-semibold mb-4">Community Awareness</h3>
              <p className="text-muted-foreground mb-4">
                We conduct awareness campaigns, workshops, and events to educate the campus 
                community about responsible animal interaction and the importance of animal welfare.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Educational workshops</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Awareness campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Volunteer training programs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Join Our Mission
          </h2>
          <p className="text-xl text-muted-foreground">
            Be part of something meaningful. Help us create a better world for campus animals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Become a Volunteer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/donate">Support Our Cause</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
