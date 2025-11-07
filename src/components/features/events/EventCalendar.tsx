'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  endDate: Date;
  type: string;
}

interface EventCalendarProps {
  events: Event[];
  getTypeColor: (type: string) => string;
}

export function EventCalendar({ events, getTypeColor }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
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
  );
}
