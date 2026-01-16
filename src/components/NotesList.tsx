'use client'

import { Note } from '@/types'
import { Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NotesListProps {
  notes: Note[]
  activeNoteId: string | null
  onSelectNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
  onCreateNote: () => void
}

export function NotesList({
  notes,
  activeNoteId,
  onSelectNote,
  onDeleteNote,
  onCreateNote,
}: NotesListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onCreateNote}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No notes yet. Create one to get started.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`group relative border-b border-gray-200 cursor-pointer transition-colors ${
                  activeNoteId === note.id
                    ? 'bg-purple-50 border-l-2 border-l-purple-600'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelectNote(note.id)}
              >
                <div className="p-3 pr-10">
                  <h3
                    className={`font-medium truncate ${
                      activeNoteId === note.id ? 'text-purple-900' : 'text-gray-900'
                    }`}
                  >
                    {note.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(note.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNote(note.id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
