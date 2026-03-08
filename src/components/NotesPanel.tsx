'use client'

import { motion } from 'framer-motion'
import { X, StickyNote } from 'lucide-react'
import { useNotes } from '@/hooks/useNotes'
import { NotesList } from './NotesList'
import { NoteEditor } from './NoteEditor'

interface NotesPanelProps {
  onClose: () => void
  notesState: ReturnType<typeof useNotes>
}

export function NotesPanel({ onClose, notesState }: NotesPanelProps) {
  const {
    notes,
    activeNoteId,
    activeNote,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = notesState

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-3">
            <StickyNote className="text-purple-600" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              <p className="text-sm text-gray-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <NotesList
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={setActiveNote}
            onDeleteNote={deleteNote}
            onCreateNote={createNote}
          />
          <NoteEditor note={activeNote} onUpdateNote={updateNote} />
        </div>
      </motion.div>
    </>
  )
}
