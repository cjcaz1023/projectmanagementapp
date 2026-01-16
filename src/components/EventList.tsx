'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CalendarEvent } from '@/types'

interface EventListProps {
  events: CalendarEvent[]
  onDeleteEvent: (eventId: string) => void
}

export function EventList({ events, onDeleteEvent }: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        No events for this day
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {events.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            layout
            className="bg-gray-50 rounded-lg p-3 flex items-start justify-between gap-2"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate">{event.title}</h4>
              {event.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
              )}
            </div>
            <button
              onClick={() => onDeleteEvent(event.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
              aria-label="Delete event"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
