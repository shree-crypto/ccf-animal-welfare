'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getEventTypeColor } from '@/lib/utils/event-colors';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  location: string;
  type: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <Badge className={getEventTypeColor(event.type)} variant="outline">
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
  );
}
