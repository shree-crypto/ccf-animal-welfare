export function DonationImpact() {
  const impacts = [
    { amount: '₹500', description: 'Feeds 10 animals for one day' },
    {
      amount: '₹1,000',
      description: 'Provides basic medical care for one animal',
    },
    { amount: '₹2,500', description: 'Covers emergency veterinary treatment' },
    {
      amount: '₹5,000',
      description: 'Supports one month of territory operations',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {impacts.map((impact, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-border text-center"
        >
          <div className="text-4xl font-bold text-primary mb-2">
            {impact.amount}
          </div>
          <div className="text-muted-foreground">{impact.description}</div>
        </div>
      ))}
    </div>
  );
}
