'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CalendarEvent } from '@/types'
import { CalendarGrid } from './CalendarGrid'
import { EventForm } from './EventForm'
import { EventList } from './EventList'
import { getMonthName, formatDisplayDate } from '@/utils/date'

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  events: CalendarEvent[]
  onAddEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => void
}

export function CalendarModal({ isOpen, onClose, events, onAddEvent, onDeleteEvent }: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    setIsAddingEvent(true)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => event.date === selectedDate)
    : []

  const handleAddEvent = (event: CalendarEvent) => {
    onAddEvent(event)
    setIsAddingEvent(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-[160px] text-center">
                  {getMonthName(currentMonth)}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close calendar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              <CalendarGrid
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                events={events}
                onSelectDate={handleSelectDate}
              />
            </div>

            {/* Selected Date Section */}
            {selectedDate && (
              <div className="border-t border-gray-200 p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {formatDisplayDate(selectedDate)}
                  </h3>
                  {!isAddingEvent && (
                    <button
                      onClick={() => setIsAddingEvent(true)}
                      className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Plus size={16} />
                      Add Event
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isAddingEvent ? (
                    <EventForm
                      key="form"
                      selectedDate={selectedDate}
                      onAddEvent={handleAddEvent}
                      onCancel={() => setIsAddingEvent(false)}
                    />
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EventList
                        events={eventsForSelectedDate}
                        onDeleteEvent={onDeleteEvent}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
