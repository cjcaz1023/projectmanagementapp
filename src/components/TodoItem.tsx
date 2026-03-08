'use client'

import { TodoItem as TodoItemType } from '@/types'
import { motion } from 'framer-motion'
import { X, Check, Calendar } from 'lucide-react'
import { isOverdue, isDueToday, isDueSoon, formatShortDate } from '@/utils/date'

interface TodoItemProps {
  todo: TodoItemType
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const priorityBorderColors = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-blue-400',
}

function DueDateBadge({ dueDate, completed }: { dueDate: string; completed: boolean }) {
  if (completed) {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
        <Calendar size={10} />
        {formatShortDate(dueDate)}
      </span>
    )
  }

  let colorClass = 'text-gray-400'
  if (isOverdue(dueDate)) colorClass = 'bg-red-50 text-red-600 px-1.5 py-0.5 rounded'
  else if (isDueToday(dueDate)) colorClass = 'bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded'
  else if (isDueSoon(dueDate)) colorClass = 'bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded'

  return (
    <span className={`flex items-center gap-0.5 text-[10px] ${colorClass}`}>
      <Calendar size={10} />
      {formatShortDate(dueDate)}
    </span>
  )
}

const categoryLabels: Record<string, string> = {
  work: 'Work',
  personal: 'Personal',
  errand: 'Errand',
  health: 'Health',
  other: 'Other',
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const hasMetadata = todo.dueDate || todo.category

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -1 }}
      className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow border-l-[3px] ${priorityBorderColors[todo.priority || 'medium']}`}
    >
      <div className="flex items-center gap-3">
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
      </div>

      {hasMetadata && (
        <div className="flex items-center justify-between mt-1.5 ml-8">
          {todo.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600">
              {categoryLabels[todo.category] || todo.category}
            </span>
          )}
          {todo.dueDate && (
            <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />
          )}
        </div>
      )}
    </motion.div>
  )
}
