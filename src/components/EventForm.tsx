'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CalendarEvent } from '@/types'
import { generateId } from '@/utils/id'

interface EventFormProps {
  selectedDate: string
  onAddEvent: (event: CalendarEvent) => void
  onCancel: () => void
}

export function EventForm({ selectedDate, onAddEvent, onCancel }: EventFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newEvent: CalendarEvent = {
      id: generateId(),
      title: title.trim(),
      date: selectedDate,
      description: description.trim() || undefined,
      createdAt: Date.now(),
    }

    onAddEvent(newEvent)
    setTitle('')
    setDescription('')
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="space-y-3 overflow-hidden"
    >
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
        className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm py-2 rounded-lg transition-colors font-medium"
        >
          Add Event
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  )
}
