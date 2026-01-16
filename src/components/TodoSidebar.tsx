'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { TodoItem as TodoItemType } from '@/types'
import { TodoItem } from './TodoItem'
import { ChevronLeft, ChevronRight, Plus, ListTodo } from 'lucide-react'
import { generateId } from '@/utils/id'

export function TodoSidebar() {
  const [isOpen, setIsOpen] = useLocalStorage<boolean>('sidebar-open', true)
  const [todos, setTodos] = useLocalStorage<TodoItemType[]>('sidebar-todos', [])
  const [newTodoText, setNewTodoText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return

    const newTodo: TodoItemType = {
      id: generateId(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: Date.now(),
    }

    setTodos([newTodo, ...todos])
    setNewTodoText('')
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

            {/* Todo list */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence>
                {todos.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-500 text-center py-8"
                  >
                    No todos yet. Add one above!
                  </motion.p>
                ) : (
                  <div className="space-y-2">
                    {todos.map((todo) => (
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
