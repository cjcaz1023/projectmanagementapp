'use client'

import { motion } from 'framer-motion'
import { CalendarEvent } from '@/types'
import { formatDateString, isToday } from '@/utils/date'

interface CalendarGridProps {
  currentMonth: Date
  selectedDate: string | null
  events: CalendarEvent[]
  onSelectDate: (date: string) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function generateCalendarDays(month: Date): (number | null)[] {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return days
}

export function CalendarGrid({ currentMonth, selectedDate, events, onSelectDate }: CalendarGridProps) {
  const days = generateCalendarDays(currentMonth)
  const year = currentMonth.getFullYear()
  const monthIndex = currentMonth.getMonth()

  const getDateString = (day: number): string => {
    const date = new Date(year, monthIndex, day)
    return formatDateString(date)
  }

  const hasEvents = (day: number): boolean => {
    const dateString = getDateString(day)
    return events.some(event => event.date === dateString)
  }

  const checkIsToday = (day: number): boolean => {
    const date = new Date(year, monthIndex, day)
    return isToday(date)
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square flex items-center justify-center">
            {day !== null ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate(getDateString(day))}
                className={`
                  relative w-9 h-9 rounded-lg text-sm font-medium transition-colors
                  ${checkIsToday(day) && selectedDate !== getDateString(day) ? 'bg-purple-100 text-purple-700' : ''}
                  ${selectedDate === getDateString(day) ? 'bg-purple-600 text-white' : 'hover:bg-gray-100'}
                  ${!checkIsToday(day) && selectedDate !== getDateString(day) ? 'text-gray-700' : ''}
                `}
              >
                {day}
                {hasEvents(day) && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full
                      ${selectedDate === getDateString(day) ? 'bg-white' : 'bg-purple-500'}
                    `}
                  />
                )}
              </motion.button>
            ) : (
              <div className="w-9 h-9" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
