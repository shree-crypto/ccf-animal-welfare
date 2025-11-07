'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { format, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

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

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(event => event.type === selectedType);

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming');

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      feeding: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      medical: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      training: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      fundraiser: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      awareness: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
      other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    };
    return colors[type] || colors.other;
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Calendar days */}
                  {daysInMonth.map(day => {
                    const dayEvents = getEventsForDate(day);
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          aspect-square p-2 rounded-lg border transition-all
                          ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'}
                          ${isTodayDate && !isSelected ? 'bg-primary/10 border-primary/30' : ''}
                          ${hasEvents ? 'font-semibold' : ''}
                        `}
                      >
                        <div className="text-sm">{format(day, 'd')}</div>
                        {hasEvents && (
                          <div className="flex justify-center gap-1 mt-1">
                            {dayEvents.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-1 h-1 rounded-full bg-current" />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Selected Date Events */}
            <div>
              <Card className="p-6 sticky top-20">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
                {selectedDate ? (
                  <div className="space-y-4">
                    {getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map(event => (
                        <div key={event.id} className="border-l-4 border-primary pl-4 py-2">
                          <Badge className={getTypeColor(event.type)} variant="outline">
                            {event.type}
                          </Badge>
                          <h4 className="font-semibold mt-2">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(event.date), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No events scheduled for this date.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Click on a date to see events scheduled for that day.
                  </p>
                )}
              </Card>
            </div>
          </div>
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
            <div className="flex flex-wrap gap-2">
              <Filter className="h-5 w-5 text-muted-foreground mt-2" />
              {eventTypes.map(type => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map(event => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getTypeColor(event.type)} variant="outline">
                    {event.type}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  {event.title}
                </h3>

                <p className="text-muted-foreground mb-4">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(event.date), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.volunteersRegistered} / {event.volunteersNeeded} volunteers
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2 ml-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(event.volunteersRegistered / event.volunteersNeeded) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/login">Register</Link>
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </Card>
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
