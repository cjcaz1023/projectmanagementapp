export function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function isToday(date: Date): boolean {
  return formatDateString(date) === formatDateString(new Date())
}
