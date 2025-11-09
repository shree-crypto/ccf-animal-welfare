import { Mail, Phone, MapPin, Clock, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Get Involved
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Join our community of dedicated volunteers making a real
              difference in the lives of campus animals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Contact Us
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Have questions or want to learn more about our work? We'd love
                  to hear from you!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <a
                      href="mailto:ccf@iitr.ac.in"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      ccf@iitr.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <a
                      href="tel:+911332285311"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +91 133 228 5311
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      IIT Roorkee Campus
                      <br />
                      Roorkee, Uttarakhand 247667
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 border border-border">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Volunteer Recruitment */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Become a Volunteer
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Join our team of passionate volunteers and make a tangible
                  impact on animal welfare at IIT Roorkee.
                </p>

                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold">What You'll Do:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">✓</span>
                      <span>
                        Participate in daily feeding schedules across campus
                        territories
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">✓</span>
                      <span>
                        Assist with medical care coordination and veterinary
                        visits
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">✓</span>
                      <span>
                        Help maintain animal profiles and medical records
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">✓</span>
                      <span>
                        Organize awareness campaigns and community events
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">✓</span>
                      <span>
                        Monitor animal territories and report concerns
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold">Requirements:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span>
                        Current student or staff member at IIT Roorkee
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span>Genuine passion for animal welfare</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span>Commitment of at least 3-4 hours per week</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span>Reliable and responsible attitude</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span>Willingness to learn and follow protocols</span>
                    </li>
                  </ul>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href="/login">Register as Volunteer</Link>
                </Button>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3">
                  Training & Support
                </h3>
                <p className="text-muted-foreground">
                  All new volunteers receive comprehensive training on animal
                  handling, feeding protocols, safety procedures, and our
                  digital management system. You'll be paired with experienced
                  volunteers for your first few assignments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Other Ways to Help
            </h2>
            <p className="text-xl text-muted-foreground">
              Can't volunteer regularly? There are still many ways to support
              our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-8 shadow-lg border border-border text-center">
              <h3 className="text-2xl font-semibold mb-4">Donate</h3>
              <p className="text-muted-foreground mb-6">
                Financial contributions help us provide food, medical care, and
                supplies for campus animals.
              </p>
              <Button asChild variant="outline">
                <Link href="/donate">Learn More</Link>
              </Button>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-lg border border-border text-center">
              <h3 className="text-2xl font-semibold mb-4">Spread Awareness</h3>
              <p className="text-muted-foreground mb-6">
                Share our mission on social media and help educate others about
                animal welfare.
              </p>
              <Button asChild variant="outline">
                <Link href="/about">Our Mission</Link>
              </Button>
            </div>

            <div className="bg-background rounded-xl p-8 shadow-lg border border-border text-center">
              <h3 className="text-2xl font-semibold mb-4">Attend Events</h3>
              <p className="text-muted-foreground mb-6">
                Join our awareness campaigns, fundraisers, and community events
                throughout the year.
              </p>
              <Button asChild variant="outline">
                <Link href="/events">View Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Do I need prior experience with animals?
              </h3>
              <p className="text-muted-foreground">
                No prior experience is necessary! We provide comprehensive
                training for all new volunteers. What matters most is your
                genuine care for animals and willingness to learn.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-3">
                How much time do I need to commit?
              </h3>
              <p className="text-muted-foreground">
                We ask for a minimum commitment of 3-4 hours per week, but you
                can choose shifts that fit your schedule. Flexibility is
                important to us, and we understand academic priorities.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Is volunteering safe?
              </h3>
              <p className="text-muted-foreground">
                Yes! We prioritize volunteer safety through proper training,
                safety protocols, and supervision. You'll learn how to interact
                with animals safely and when to seek help.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Can I volunteer for specific activities only?
              </h3>
              <p className="text-muted-foreground">
                Absolutely! Some volunteers prefer feeding duties, others enjoy
                medical coordination, and some focus on awareness campaigns.
                We'll work with your interests and strengths.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
