'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { TodoItem as TodoItemType, Priority, TodoCategory } from '@/types'
import { TodoItem } from './TodoItem'
import { TodoFilterBar } from './TodoFilterBar'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, ListTodo } from 'lucide-react'
import { generateId } from '@/utils/id'

export function TodoSidebar() {
  const [isOpen, setIsOpen] = useLocalStorage<boolean>('sidebar-open', true)
  const [todos, setTodos] = useLocalStorage<TodoItemType[]>('sidebar-todos', [])
  const [filter, setFilter] = useLocalStorage<'all' | 'active' | 'completed'>('todo-filter', 'all')
  const [sortBy, setSortBy] = useLocalStorage<'newest' | 'dueDate' | 'priority'>('todo-sort', 'newest')

  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>('medium')
  const [newTodoDueDate, setNewTodoDueDate] = useState('')
  const [newTodoCategory, setNewTodoCategory] = useState<TodoCategory | ''>('')
  const [isAdding, setIsAdding] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Migrate existing todos that lack priority
  useEffect(() => {
    const needsMigration = todos.some((t) => !t.priority)
    if (needsMigration) {
      setTodos(todos.map((t) => ({ ...t, priority: t.priority || 'medium' })))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return

    const newTodo: TodoItemType = {
      id: generateId(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: newTodoPriority,
      dueDate: newTodoDueDate || undefined,
      category: newTodoCategory || undefined,
    }

    setTodos([newTodo, ...todos])
    setNewTodoText('')
    setNewTodoPriority('medium')
    setNewTodoDueDate('')
    setNewTodoCategory('')
    setShowDetails(false)
    setIsAdding(false)
  }

  const handleToggle = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    } else if (e.key === 'Escape') {
      setNewTodoText('')
      setIsAdding(false)
    }
  }

  const displayTodos = useMemo(() => {
    let filtered = todos
    if (filter === 'active') filtered = todos.filter((t) => !t.completed)
    if (filter === 'completed') filtered = todos.filter((t) => t.completed)

    const active = filtered.filter((t) => !t.completed)
    const completed = filtered.filter((t) => t.completed)

    const priorityOrder = { high: 0, medium: 1, low: 2 }

    active.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate)
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
    })

    completed.sort((a, b) => b.createdAt - a.createdAt)

    return { active, completed }
  }, [todos, filter, sortBy])

  const priorityButtons: { value: Priority; label: string; color: string; activeColor: string }[] = [
    { value: 'high', label: 'High', color: 'text-red-500', activeColor: 'bg-red-500 text-white' },
    { value: 'medium', label: 'Med', color: 'text-amber-500', activeColor: 'bg-amber-500 text-white' },
    { value: 'low', label: 'Low', color: 'text-blue-400', activeColor: 'bg-blue-400 text-white' },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 320 : 48 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-full z-10 bg-white border border-gray-200 rounded-l-lg p-1 shadow-sm hover:bg-gray-50 transition-colors"
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <ChevronLeft size={16} className="text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo size={20} className="text-purple-600" />
                <h2 className="font-semibold text-sm text-gray-900">Quick Todos</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Add todo section */}
            <div className="p-4 border-b border-gray-200">
              <AnimatePresence>
                {isAdding ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="What needs to be done?"
                      className="w-full px-3 py-2 text-sm border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    {/* Details toggle */}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {showDetails ? 'Hide details' : 'Add details'}
                    </button>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {/* Priority */}
                          <div className="flex gap-1">
                            {priorityButtons.map((p) => (
                              <button
                                key={p.value}
                                onClick={() => setNewTodoPriority(p.value)}
                                className={`flex-1 text-xs py-1 rounded transition-colors font-medium ${
                                  newTodoPriority === p.value
                                    ? p.activeColor
                                    : `bg-gray-100 ${p.color} hover:bg-gray-200`
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>

                          {/* Due date */}
                          <input
                            type="date"
                            value={newTodoDueDate}
                            onChange={(e) => setNewTodoDueDate(e.target.value)}
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />

                          {/* Category */}
                          <select
                            value={newTodoCategory}
                            onChange={(e) => setNewTodoCategory(e.target.value as TodoCategory | '')}
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white text-gray-700"
                          >
                            <option value="">No category</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="errand">Errand</option>
                            <option value="health">Health</option>
                            <option value="other">Other</option>
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddTodo}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded transition-colors font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setNewTodoText('')
                          setNewTodoPriority('medium')
                          setNewTodoDueDate('')
                          setNewTodoCategory('')
                          setShowDetails(false)
                          setIsAdding(false)
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAdding(true)}
                    className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-2 rounded transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Todo
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Filter bar */}
            {todos.length > 0 && (
              <TodoFilterBar
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            )}

            {/* Todo list */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence>
                {displayTodos.active.length === 0 && displayTodos.completed.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-500 text-center py-8"
                  >
                    {todos.length === 0
                      ? 'No todos yet. Add one above!'
                      : 'No matching todos.'}
                  </motion.p>
                ) : (
                  <div className="space-y-2">
                    {displayTodos.active.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}

                    {displayTodos.active.length > 0 && displayTodos.completed.length > 0 && (
                      <div className="flex items-center gap-2 py-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Completed
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )}

                    {displayTodos.completed.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state - show icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center h-full w-full hover:bg-gray-100 transition-colors"
        >
          <ListTodo size={20} className="text-purple-600" />
        </button>
      )}
    </motion.aside>
  )
}
