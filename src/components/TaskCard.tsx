'use client'

import { Task } from '@/types'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { X, Edit2, Check, Sparkles, Loader } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onDelete: () => void
  onUpdate: (task: Task) => void
  isDragging?: boolean
  columnName?: string
}

export function TaskCard({ task, onDelete, onUpdate, isDragging, columnName = 'Task' }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    onUpdate({
      ...task,
      title: editTitle,
      description: editDescription,
    })
    setIsEditing(false)
  }

  const handleGeneratePrompt = async () => {
    setIsGenerating(true)
    setError('')
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          columnName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate prompt')
      }

      const { prompt } = await response.json()

      // Append prompt to description
      const newDescription = task.description
        ? `${task.description}\n\n[AI Generated Prompt]:\n${prompt}`
        : `[AI Generated Prompt]:\n${prompt}`

      onUpdate({
        ...task,
        description: newDescription,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      console.error('Error generating prompt:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isEditing) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-4 shadow-md border border-purple-200"
      >
        <input
          autoFocus
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full font-semibold text-sm mb-2 px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full text-xs text-gray-600 mb-3 px-2 py-1 border border-purple-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
          placeholder="Task description (optional)"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 rounded transition-colors flex items-center justify-center gap-1"
          >
            <Check size={14} /> Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs py-1 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm text-gray-900 flex-1 break-words">{task.title}</h3>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className="text-gray-400 hover:text-amber-500 transition-colors p-1 disabled:opacity-50"
            title="Generate AI prompt"
          >
            {isGenerating ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
            title="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Delete task"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      {task.description && (
        <p className="text-xs text-gray-600 break-words whitespace-pre-wrap">{task.description}</p>
      )}
    </motion.div>
  )
}
