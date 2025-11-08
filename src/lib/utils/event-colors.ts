export function getEventTypeColor(type: string): string {
  const colors: Record<string, string> = {
    feeding: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    medical: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    training: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    fundraiser: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    awareness: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  };
  return colors[type] || colors.other;
}
