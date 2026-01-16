'use client'

import { useState } from 'react'
import { Board as BoardType } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useNotes } from '@/hooks/useNotes'
import { Board } from '@/components/Board'
import { NotesPanel } from '@/components/NotesPanel'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, StickyNote } from 'lucide-react'

const DEFAULT_BOARD: BoardType = {
  id: 'board-1',
  columns: [
    {
      id: 'todo',
      title: 'TODO',
      tasks: [
        {
          id: 'task-1',
          title: 'Welcome to Vibe Kanban',
          description: 'Drag cards between columns to organize your tasks. Create new tasks by clicking "Add Task".',
          createdAt: Date.now(),
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: 'task-2',
          title: 'Beautiful Animations',
          description: 'Smooth drag and drop with framer-motion animations',
          createdAt: Date.now(),
        },
      ],
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [
        {
          id: 'task-3',
          title: 'Local Storage Support',
          description: 'Your tasks are saved automatically',
          createdAt: Date.now(),
        },
      ],
    },
  ],
}

export default function Page() {
  const [board, setBoard, isLoaded] = useLocalStorage<BoardType>('kanban-board', DEFAULT_BOARD)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const {
    notes,
    activeNoteId,
    activeNote,
    isLoaded: notesLoaded,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  } = useNotes()

  if (!isLoaded || !notesLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="text-purple-600" size={32} />
          </motion.div>
          <p className="text-gray-600">Loading your board...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10"
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="text-purple-600" size={28} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vibe Kanban</h1>
                <p className="text-sm text-gray-500">Your beautiful project management board</p>
              </div>
            </div>
            <button
              onClick={() => setIsNotesOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <StickyNote size={20} />
              <span className="font-medium">Notes</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Board */}
      <div className="flex-1 overflow-hidden px-8 py-6">
        <Board board={board} onUpdate={setBoard} />
      </div>

      {/* Notes Panel */}
      <AnimatePresence>
        {isNotesOpen && (
          <NotesPanel
            isOpen={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            notes={notes}
            activeNoteId={activeNoteId}
            activeNote={activeNote}
            onCreateNote={createNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            onSelectNote={setActiveNote}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
