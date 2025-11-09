'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  VolunteerStats,
  Badge as BadgeType,
  BadgeType as BadgeTypeEnum,
} from '@/types/volunteer';
import { Clock, Award, CheckCircle, Heart, Star, Trophy } from 'lucide-react';
import { ReactElement } from 'react';

interface VolunteerImpactDashboardProps {
  volunteerId: string;
  stats: VolunteerStats;
}

const badgeConfig: Record<
  BadgeTypeEnum,
  { name: string; description: string; icon: ReactElement; color: string }
> = {
  first_task: {
    name: 'First Task',
    description: 'Completed your first task',
    icon: <Star className="h-4 w-4" />,
    color: 'bg-blue-500',
  },
  week_streak: {
    name: 'Week Streak',
    description: '7 days of continuous volunteering',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'bg-green-500',
  },
  month_streak: {
    name: 'Month Streak',
    description: '30 days of continuous volunteering',
    icon: <Trophy className="h-4 w-4" />,
    color: 'bg-purple-500',
  },
  emergency_responder: {
    name: 'Emergency Responder',
    description: 'Responded to 5 emergency alerts',
    icon: <Award className="h-4 w-4" />,
    color: 'bg-red-500',
  },
  '10_hours': {
    name: '10 Hours',
    description: 'Volunteered for 10 hours',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-indigo-500',
  },
  '50_hours': {
    name: '50 Hours',
    description: 'Volunteered for 50 hours',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-indigo-600',
  },
  '100_hours': {
    name: '100 Hours',
    description: 'Volunteered for 100 hours',
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-indigo-700',
  },
  animal_champion: {
    name: 'Animal Champion',
    description: 'Helped 20+ animals',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-pink-500',
  },
  medical_hero: {
    name: 'Medical Hero',
    description: 'Assisted with 10+ medical tasks',
    icon: <Award className="h-4 w-4" />,
    color: 'bg-emerald-500',
  },
  super_volunteer: {
    name: 'Super Volunteer',
    description: 'Completed 100+ tasks',
    icon: <Trophy className="h-4 w-4" />,
    color: 'bg-yellow-500',
  },
};

const milestones = [
  { hours: 10, label: '10 Hours' },
  { hours: 25, label: '25 Hours' },
  { hours: 50, label: '50 Hours' },
  { hours: 100, label: '100 Hours' },
  { hours: 200, label: '200 Hours' },
];

export function VolunteerImpactDashboard({
  volunteerId,
  stats,
}: VolunteerImpactDashboardProps) {
  const [nextMilestone, setNextMilestone] = useState<{
    hours: number;
    label: string;
  } | null>(null);
  const [progressToNext, setProgressToNext] = useState(0);

  useEffect(() => {
    const next = milestones.find(m => m.hours > stats.totalHours);
    if (next) {
      setNextMilestone(next);
      const previousMilestone = milestones[milestones.indexOf(next) - 1];
      const previousHours = previousMilestone ? previousMilestone.hours : 0;
      const range = next.hours - previousHours;
      const progress = ((stats.totalHours - previousHours) / range) * 100;
      setProgressToNext(Math.min(progress, 100));
    } else {
      setNextMilestone(null);
      setProgressToNext(100);
    }
  }, [stats.totalHours]);

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalHours}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Hours
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tasks Completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.animalsHelped}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Animals Helped
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress to Next Milestone */}
      {nextMilestone && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Next Milestone</h4>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.totalHours} / {nextMilestone.hours} hours
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {nextMilestone.hours - stats.totalHours} hours to{' '}
              {nextMilestone.label}
            </p>
          </div>
        </Card>
      )}

      {/* Badges */}
      {stats.badges.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Earned Badges
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.badges.map(badgeType => {
              const config = badgeConfig[badgeType];
              return (
                <div
                  key={badgeType}
                  className="p-3 border rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className={`inline-flex p-2 rounded-full ${config.color} text-white mb-2`}
                  >
                    {config.icon}
                  </div>
                  <p className="font-medium text-sm">{config.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {config.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Skills */}
      {stats.skills.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Skills & Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {stats.skills.map(skill => (
              <Badge key={skill} variant="secondary">
                {skill
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Member Since */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Member Since
            </p>
            <p className="font-semibold">
              {new Date(stats.joinDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Active
            </p>
            <p className="font-semibold">
              {new Date(stats.lastActiveDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
