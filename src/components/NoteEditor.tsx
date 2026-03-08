'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import { useEffect, useRef, useCallback } from 'react'
import { Note } from '@/types'
import { EditorToolbar } from './EditorToolbar'
import { FileText } from 'lucide-react'

interface NoteEditorProps {
  note: Note | null
  onUpdateNote: (noteId: string, changes: Partial<Pick<Note, 'title' | 'content'>>) => void
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const pendingChangesRef = useRef<{ noteId: string; changes: Partial<Pick<Note, 'title' | 'content'>> } | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (pendingChangesRef.current) {
      const { noteId, changes } = pendingChangesRef.current
      pendingChangesRef.current = null
      onUpdateNote(noteId, changes)
    }
  }, [onUpdateNote])

  const debouncedSave = useCallback(
    (noteId: string, changes: Partial<Pick<Note, 'title' | 'content'>>) => {
      if (pendingChangesRef.current && pendingChangesRef.current.noteId === noteId) {
        pendingChangesRef.current = {
          noteId,
          changes: { ...pendingChangesRef.current.changes, ...changes },
        }
      } else {
        if (pendingChangesRef.current) {
          flush()
        }
        pendingChangesRef.current = { noteId, changes }
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(flush, 400)
    },
    [flush]
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-purple-600 underline hover:text-purple-700',
        },
      }),
    ],
    content: note?.content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (note) {
        debouncedSave(note.id, { content: editor.getHTML() })
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  // Sync editor content when switching notes
  useEffect(() => {
    if (editor && note) {
      const currentContent = editor.getHTML()
      if (currentContent !== note.content) {
        editor.commands.setContent(note.content || '')
      }
    }
  }, [note?.id, editor])

  // Flush pending saves on note switch or unmount
  useEffect(() => {
    return () => {
      flush()
    }
  }, [note?.id, flush])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return
    debouncedSave(note.id, { title: e.target.value })
  }

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
        <FileText size={48} className="mb-4" />
        <p className="text-lg">Select a note or create a new one</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          ref={titleRef}
          type="text"
          defaultValue={note.title}
          key={note.id}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="w-full text-xl font-semibold text-gray-900 focus:outline-none placeholder-gray-400"
        />
        <p className="text-xs text-gray-400 mt-1">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </p>
      </div>

      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
