'use client'

import { ArrowUpDown } from 'lucide-react'

interface TodoFilterBarProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void
  sortBy: 'newest' | 'dueDate' | 'priority'
  onSortChange: (sort: 'newest' | 'dueDate' | 'priority') => void
}

const filters = [
  { value: 'all' as const, label: 'All' },
  { value: 'active' as const, label: 'Active' },
  { value: 'completed' as const, label: 'Done' },
]

export function TodoFilterBar({ filter, onFilterChange, sortBy, onSortChange }: TodoFilterBarProps) {
  return (
    <div className="px-4 py-2 border-b border-gray-200 space-y-2">
      <div className="flex gap-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`flex-1 text-xs py-1 rounded transition-colors font-medium ${
              filter === f.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-purple-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <ArrowUpDown size={12} className="text-gray-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'newest' | 'dueDate' | 'priority')}
          className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-gray-700"
        >
          <option value="newest">Newest</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  )
}
