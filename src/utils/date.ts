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

export function isOverdue(dateString: string): boolean {
  const today = formatDateString(new Date())
  return dateString < today
}

export function isDueToday(dateString: string): boolean {
  return dateString === formatDateString(new Date())
}

export function isDueSoon(dateString: string): boolean {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date(today)
  dayAfter.setDate(dayAfter.getDate() + 2)
  return dateString === formatDateString(tomorrow) || dateString === formatDateString(dayAfter)
}

export function formatShortDate(dateString: string): string {
  const today = formatDateString(new Date())
  if (dateString === today) return 'Today'

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (dateString === formatDateString(tomorrow)) return 'Tomorrow'

  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
