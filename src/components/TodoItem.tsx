'use client'

import { TodoItem as TodoItemType } from '@/types'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

interface TodoItemProps {
  todo: TodoItemType
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -1 }}
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-purple-600 border-purple-600 text-white'
            : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        {todo.completed && <Check size={12} />}
      </button>

      <span
        className={`flex-1 text-sm break-words ${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
        }`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}
