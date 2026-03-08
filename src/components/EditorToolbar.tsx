'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link,
  LucideIcon,
} from 'lucide-react'
import { useCallback, useState } from 'react'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButton {
  icon: LucideIcon
  action: () => void
  isActive: () => boolean
  title: string
}

type ToolbarItem = ToolbarButton | 'separator'

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const setLink = useCallback(() => {
    if (!editor) return
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  if (!editor) return null

  const items: ToolbarItem[] = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      title: 'Strikethrough (Ctrl+Shift+S)',
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
      title: 'Inline Code (Ctrl+E)',
    },
    'separator',
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
      title: 'Heading 1',
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
      title: 'Heading 2',
    },
    'separator',
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
      title: 'Bullet List',
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      title: 'Numbered List',
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      title: 'Blockquote',
    },
  ]

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded transition-colors ${
      isActive
        ? 'bg-purple-100 text-purple-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 flex-wrap">
      {items.map((item, index) => {
        if (item === 'separator') {
          return <div key={`sep-${index}`} className="w-px h-6 bg-gray-200 mx-1" />
        }
        const Icon = item.icon
        return (
          <button
            key={item.title}
            type="button"
            onClick={item.action}
            className={buttonClass(item.isActive())}
            title={item.title}
          >
            <Icon size={18} />
          </button>
        )
      })}

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {showLinkInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                setLink()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="px-2 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
            className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href || ''
            setLinkUrl(previousUrl)
            setShowLinkInput(true)
          }}
          className={buttonClass(editor.isActive('link'))}
          title="Add Link"
        >
          <Link size={18} />
        </button>
      )}
    </div>
  )
}
