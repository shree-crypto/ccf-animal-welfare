import { Suspense } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EventCalendar } from '@/components/features/events/EventCalendar';
import { EventCard } from '@/components/features/events/EventCard';
import { EventFilter } from '@/components/features/events/EventFilter';

// Mock data - In production, this would come from the database
const events = [
  {
    id: '1',
    title: 'Monthly Vaccination Drive',
    description: 'Join us for our monthly vaccination campaign. We\'ll be vaccinating animals across all territories. Volunteers needed for animal handling and documentation.',
    date: new Date('2024-11-15T09:00:00'),
    endDate: new Date('2024-11-15T16:00:00'),
    location: 'Main Campus - Multiple Territories',
    type: 'medical' as const,
    volunteersNeeded: 15,
    volunteersRegistered: 8,
    organizer: 'Medical Team',
    status: 'upcoming' as const,
  },
  {
    id: '2',
    title: 'Volunteer Training Workshop',
    description: 'Comprehensive training session for new volunteers covering animal handling, feeding protocols, safety procedures, and our digital management system.',
    date: new Date('2024-11-20T14:00:00'),
    endDate: new Date('2024-11-20T17:00:00'),
    location: 'Student Activity Center, Room 201',
    type: 'training' as const,
    volunteersNeeded: 20,
    volunteersRegistered: 12,
    organizer: 'Training Coordinator',
    status: 'upcoming' as const,
  },
  {
    id: '3',
    title: 'Weekend Feeding Marathon',
    description: 'Special weekend feeding event covering all campus territories. Great opportunity for new volunteers to get hands-on experience with guidance from experienced team members.',
    date: new Date('2024-11-23T07:00:00'),
    endDate: new Date('2024-11-23T12:00:00'),
    location: 'All Campus Territories',
    type: 'feeding' as const,
    volunteersNeeded: 25,
    volunteersRegistered: 18,
    organizer: 'Feeding Coordinator',
    status: 'upcoming' as const,
  },
  {
    id: '4',
    title: 'Animal Welfare Awareness Campaign',
    description: 'Week-long awareness campaign with interactive sessions, poster exhibitions, and educational workshops for the campus community.',
    date: new Date('2024-12-01T10:00:00'),
    endDate: new Date('2024-12-07T18:00:00'),
    location: 'Central Library Lawn',
    type: 'awareness' as const,
    volunteersNeeded: 30,
    volunteersRegistered: 15,
    organizer: 'Outreach Team',
    status: 'upcoming' as const,
  },
  {
    id: '5',
    title: 'Fundraising Dinner',
    description: 'Annual fundraising dinner to support our animal welfare activities. Includes dinner, entertainment, and silent auction. All proceeds go to animal care.',
    date: new Date('2024-12-10T18:00:00'),
    endDate: new Date('2024-12-10T22:00:00'),
    location: 'Campus Auditorium',
    type: 'fundraiser' as const,
    volunteersNeeded: 10,
    volunteersRegistered: 7,
    organizer: 'Fundraising Committee',
    status: 'upcoming' as const,
  },
  {
    id: '6',
    title: 'Territory Mapping Update',
    description: 'Help us update our territory maps and conduct animal census across campus. Bring your smartphones for GPS tracking.',
    date: new Date('2024-12-15T08:00:00'),
    endDate: new Date('2024-12-15T14:00:00'),
    location: 'All Campus Areas',
    type: 'other' as const,
    volunteersNeeded: 20,
    volunteersRegistered: 5,
    organizer: 'Territory Management',
    status: 'upcoming' as const,
  },
];

const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'medical', label: 'Medical' },
  { value: 'training', label: 'Training' },
  { value: 'fundraiser', label: 'Fundraiser' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'other', label: 'Other' },
];

export default function EventsPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const selectedType = searchParams.type || 'all';

  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(event => event.type === selectedType);

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
              <CalendarIcon className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Events & Opportunities
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Join us for volunteer activities, training sessions, and community events.
            </p>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Event Calendar
            </h2>
            <p className="text-lg text-muted-foreground">
              View all upcoming events and volunteer opportunities
            </p>
          </div>

          <EventCalendar events={events} />
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Upcoming Events
            </h2>

            {/* Filter */}
            <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded-lg" />}>
              <EventFilter 
                eventTypes={eventTypes}
                selectedType={selectedType}
              />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map(event => (
              <EventCard 
                key={event.id}
                event={event}
              />
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No upcoming events in this category. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Stay Updated
          </h2>
          <p className="text-xl text-muted-foreground">
            Register as a volunteer to receive notifications about upcoming events and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Become a Volunteer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More About CCF</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
