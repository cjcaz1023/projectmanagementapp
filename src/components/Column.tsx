'use client'

import { Column as ColumnType, Task } from '@/types'
import { motion } from 'framer-motion'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

interface ColumnProps {
  column: ColumnType
  columnIndex: number
  onAddTask: (columnId: string, task: Task) => void
  onDeleteTask: (columnId: string, taskId: string) => void
  onUpdateTask: (columnId: string, task: Task) => void
  onDeleteColumn: (columnId: string) => void
  onRenameColumn: (columnId: string, newTitle: string) => void
}

export function Column({
  column,
  columnIndex,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onDeleteColumn,
  onRenameColumn,
}: ColumnProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [isRenamingColumn, setIsRenamingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState(column.title)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random()}`,
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        createdAt: Date.now(),
      }
      onAddTask(column.id, newTask)
      setNewTaskTitle('')
      setNewTaskDesc('')
      setIsCreating(false)
    }
  }

  const handleRenameColumn = () => {
    if (newColumnTitle.trim()) {
      onRenameColumn(column.id, newColumnTitle.trim())
      setIsRenamingColumn(false)
    }
  }

  return (
    <Draggable draggableId={`column-${column.id}`} index={columnIndex} isDragDisabled>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex-shrink-0 w-80 flex flex-col bg-gray-50 rounded-lg border border-gray-200"
        >
          {/* Column Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
            {isRenamingColumn ? (
              <input
                autoFocus
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onBlur={handleRenameColumn}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameColumn()
                  if (e.key === 'Escape') {
                    setIsRenamingColumn(false)
                    setNewColumnTitle(column.title)
                  }
                }}
                className="flex-1 font-semibold text-sm px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <div
                onClick={() => setIsRenamingColumn(true)}
                className="flex-1 cursor-pointer"
              >
                <h2 className="font-semibold text-sm text-gray-900">{column.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{column.tasks.length} tasks</p>
              </div>
            )}
            {column.id !== 'default' && (
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="text-gray-400 hover:text-red-600 transition-colors p-1 flex-shrink-0"
                title="Delete column"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Tasks Container */}
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto p-3 space-y-3 ${
                  snapshot.isDraggingOver ? 'bg-purple-50' : ''
                }`}
              >
                {column.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onDelete={() => onDeleteTask(column.id, task.id)}
                          onUpdate={(updatedTask) => onUpdateTask(column.id, updatedTask)}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Task Section */}
          <div className="p-3 border-t border-gray-200">
            {isCreating ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <input
                  autoFocus
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full px-3 py-2 text-sm border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddTask()
                    }
                  }}
                />
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Add a description (optional)"
                  className="w-full px-3 py-2 text-sm border border-purple-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded transition-colors font-medium"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setNewTaskTitle('')
                      setNewTaskDesc('')
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 text-sm py-2 rounded hover:bg-purple-50 transition-colors font-medium"
              >
                <Plus size={16} /> Add Task
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
