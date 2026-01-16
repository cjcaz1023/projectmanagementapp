'use client'

import { useLocalStorage } from './useLocalStorage'
import { Note } from '@/types'
import { generateId } from '@/utils/id'

interface NotesState {
  notes: Note[]
  activeNoteId: string | null
}

const DEFAULT_NOTES_STATE: NotesState = {
  notes: [],
  activeNoteId: null,
}

export function useNotes() {
  const [state, setState, isLoaded] = useLocalStorage<NotesState>(
    'kanban-notes',
    DEFAULT_NOTES_STATE
  )

  const createNote = () => {
    const now = Date.now()
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled Note',
      content: '',
      createdAt: now,
      updatedAt: now,
    }
    setState((prev) => ({
      notes: [newNote, ...prev.notes],
      activeNoteId: newNote.id,
    }))
    return newNote
  }

  const updateNote = (updatedNote: Note) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) =>
        note.id === updatedNote.id
          ? { ...updatedNote, updatedAt: Date.now() }
          : note
      ),
    }))
  }

  const deleteNote = (noteId: string) => {
    setState((prev) => ({
      notes: prev.notes.filter((note) => note.id !== noteId),
      activeNoteId: prev.activeNoteId === noteId ? null : prev.activeNoteId,
    }))
  }

  const setActiveNote = (noteId: string | null) => {
    setState((prev) => ({
      ...prev,
      activeNoteId: noteId,
    }))
  }

  const activeNote = state.notes.find((note) => note.id === state.activeNoteId) || null

  return {
    notes: state.notes,
    activeNoteId: state.activeNoteId,
    activeNote,
    isLoaded,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
  }
}
