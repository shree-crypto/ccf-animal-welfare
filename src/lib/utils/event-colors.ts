export function getEventTypeColor(type: string): string {
  const colors: Record<string, string> = {
    feeding:
      'bg-green-200/60 text-green-800 dark:text-green-300 border-green-300/40',
    medical: 'bg-red-200/60 text-red-800 dark:text-red-300 border-red-300/40',
    training:
      'bg-blue-200/60 text-blue-800 dark:text-blue-300 border-blue-300/40',
    fundraiser:
      'bg-purple-200/60 text-purple-800 dark:text-purple-300 border-purple-300/40',
    awareness:
      'bg-orange-200/60 text-orange-800 dark:text-orange-300 border-orange-300/40',
    other: 'bg-gray-200/60 text-gray-800 dark:text-gray-300 border-gray-300/40',
  };
  return colors[type] || colors.other;
}
