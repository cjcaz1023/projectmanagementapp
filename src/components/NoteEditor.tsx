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
  onUpdateNote: (note: Note) => void
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedUpdate = useCallback(
    (content: string) => {
      if (!note) return
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        onUpdateNote({ ...note, content })
      }, 300)
    },
    [note, onUpdateNote]
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
      debouncedUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  useEffect(() => {
    if (editor && note) {
      const currentContent = editor.getHTML()
      if (currentContent !== note.content) {
        editor.commands.setContent(note.content || '')
      }
    }
  }, [note?.id, editor])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return
    onUpdateNote({ ...note, title: e.target.value })
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
          value={note.title}
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
