import { Suspense } from 'react';
import { Heart, Calendar, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CategoryFilter } from '@/components/features/stories/CategoryFilter';

// Mock data - In production, this would come from the database
const successStories = [
  {
    id: '1',
    title: 'Rocky\'s Recovery Journey',
    description: 'Rocky was found injured near the main gate with a severe leg wound. Thanks to immediate medical intervention and weeks of dedicated care from our volunteers, Rocky made a full recovery. Today, he\'s healthy, playful, and has become a beloved member of the campus community.',
    animalName: 'Rocky',
    date: new Date('2024-10-15'),
    category: 'recovery',
    featured: true,
    imageUrl: '/placeholder-dog.jpg',
  },
  {
    id: '2',
    title: 'Bella Finds Her Forever Home',
    description: 'Bella, a gentle cat who lived near the library, captured the heart of a faculty member. After proper vaccination and health checks coordinated by CCF, Bella was adopted into a loving home. She now enjoys a comfortable life with her new family.',
    animalName: 'Bella',
    date: new Date('2024-09-22'),
    category: 'adoption',
    featured: true,
    imageUrl: '/placeholder-cat.jpg',
  },
  {
    id: '3',
    title: 'Successful Vaccination Drive',
    description: 'Our team successfully vaccinated over 50 campus animals in a single month, protecting them from rabies and other diseases. This milestone was achieved through careful planning, volunteer coordination, and support from local veterinarians.',
    animalName: null,
    date: new Date('2024-08-10'),
    category: 'milestone',
    featured: false,
    imageUrl: '/placeholder-vaccination.jpg',
  },
  {
    id: '4',
    title: 'Max\'s Rescue from Construction Site',
    description: 'Max, a young puppy, was trapped in a construction site for two days. Our rapid response team coordinated with campus security to safely rescue him. After medical evaluation and care, Max is now thriving in his territory near the hostel area.',
    animalName: 'Max',
    date: new Date('2024-11-01'),
    category: 'rescue',
    featured: true,
    imageUrl: '/placeholder-puppy.jpg',
  },
  {
    id: '5',
    title: 'Community Awareness Week Success',
    description: 'Our week-long awareness campaign reached over 1,000 students and staff members. Through workshops, interactive sessions, and demonstrations, we educated the community about responsible animal interaction and the importance of animal welfare.',
    animalName: null,
    date: new Date('2024-07-20'),
    category: 'community',
    featured: false,
    imageUrl: '/placeholder-event.jpg',
  },
  {
    id: '6',
    title: 'Luna\'s Transformation',
    description: 'Luna arrived on campus malnourished and fearful. Through consistent feeding, gentle interaction, and medical care, she transformed into a confident, healthy dog. Her story inspired many students to join our volunteer program.',
    animalName: 'Luna',
    date: new Date('2024-06-15'),
    category: 'recovery',
    featured: false,
    imageUrl: '/placeholder-dog2.jpg',
  },
];

const categories = [
  { value: 'all', label: 'All Stories' },
  { value: 'rescue', label: 'Rescues' },
  { value: 'recovery', label: 'Recoveries' },
  { value: 'adoption', label: 'Adoptions' },
  { value: 'milestone', label: 'Milestones' },
  { value: 'community', label: 'Community' },
];

export default function StoriesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category || 'all';

  const filteredStories = selectedCategory === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === selectedCategory);

  const featuredStories = successStories.filter(story => story.featured);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      rescue: 'bg-red-500/10 text-red-700 dark:text-red-400',
      recovery: 'bg-green-500/10 text-green-700 dark:text-green-400',
      adoption: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      milestone: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      community: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Success Stories
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Celebrating the lives we've touched and the difference we've made together.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              Heartwarming tales of rescue, recovery, and hope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <div
                key={story.id}
                className="group relative overflow-hidden rounded-2xl bg-muted/50 border border-border hover:shadow-xl transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="h-16 w-16 text-primary/30" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={getCategoryColor(story.category)}>
                      {story.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{story.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>

                  {story.animalName && (
                    <p className="text-sm font-medium text-primary">
                      Featuring: {story.animalName}
                    </p>
                  )}

                  <p className="text-muted-foreground line-clamp-3">
                    {story.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Stories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              All Success Stories
            </h2>

            {/* Category Filter */}
            <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded-lg" />}>
              <CategoryFilter categories={categories} selectedCategory={selectedCategory} />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getCategoryColor(story.category)}>
                    {story.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{story.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {story.title}
                </h3>

                {story.animalName && (
                  <p className="text-sm font-medium text-primary mb-3">
                    Featuring: {story.animalName}
                  </p>
                )}

                <p className="text-muted-foreground">
                  {story.description}
                </p>
              </div>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No stories found in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Numbers that tell our story of dedication and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
              <div className="text-5xl font-bold text-primary mb-2">150+</div>
              <div className="text-lg text-muted-foreground">Animals Cared For</div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
              <div className="text-5xl font-bold text-primary mb-2">50+</div>
              <div className="text-lg text-muted-foreground">Successful Rescues</div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
              <div className="text-5xl font-bold text-primary mb-2">200+</div>
              <div className="text-lg text-muted-foreground">Medical Treatments</div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border">
              <div className="text-5xl font-bold text-primary mb-2">25+</div>
              <div className="text-lg text-muted-foreground">Happy Adoptions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Be Part of the Next Success Story
          </h2>
          <p className="text-xl text-muted-foreground">
            Your support and involvement can help us create more happy endings for campus animals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Volunteer With Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/animals">Meet Our Animals</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
