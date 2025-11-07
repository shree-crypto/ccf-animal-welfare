import { Utensils, Stethoscope, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function WhyDonate() {
  const reasons = [
    {
      icon: Utensils,
      title: 'Daily Feeding',
      description: 'We provide nutritious meals to over 150 animals twice daily. Your donation helps us maintain consistent feeding schedules across all territories.',
      impact: '₹500 feeds 10 animals for a day',
    },
    {
      icon: Stethoscope,
      title: 'Medical Care',
      description: 'From routine vaccinations to emergency treatments, we ensure every animal receives proper medical attention when needed.',
      impact: '₹2,000 covers a full vaccination',
    },
    {
      icon: Home,
      title: 'Shelter & Safety',
      description: 'We provide temporary shelter for injured or recovering animals and work to create safe spaces across campus.',
      impact: '₹5,000 supports shelter maintenance',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reasons.map((reason, index) => (
        <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
            <reason.icon className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">{reason.title}</h3>
          <p className="text-muted-foreground mb-4">{reason.description}</p>
          <p className="text-sm font-medium text-primary">{reason.impact}</p>
        </Card>
      ))}
    </div>
  );
}
