'use client'

import { Board as BoardType, Column as ColumnType, Task } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import { Column } from './Column'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface BoardProps {
  board: BoardType
  onUpdate: (board: BoardType) => void
}

export function Board({ board, onUpdate }: BoardProps) {
  const [isCreatingColumn, setIsCreatingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result

    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const newBoard = { ...board }
    const newColumns = [...newBoard.columns]

    if (type === 'task') {
      const sourceCol = newColumns.find((c) => c.id === source.droppableId)
      const destCol = newColumns.find((c) => c.id === destination.droppableId)

      if (!sourceCol || !destCol) return

      const [movedTask] = sourceCol.tasks.splice(source.index, 1)
      destCol.tasks.splice(destination.index, 0, movedTask)
    } else if (type === 'column') {
      const [movedCol] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, movedCol)
    }

    newBoard.columns = newColumns
    onUpdate(newBoard)
  }

  const handleAddTask = (columnId: string, task: Task) => {
    const newBoard = { ...board }
    const column = newBoard.columns.find((c) => c.id === columnId)
    if (column) {
      column.tasks.push(task)
      onUpdate(newBoard)
    }
  }

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const newBoard = { ...board }
    const column = newBoard.columns.find((c) => c.id === columnId)
    if (column) {
      column.tasks = column.tasks.filter((t) => t.id !== taskId)
      onUpdate(newBoard)
    }
  }

  const handleUpdateTask = (columnId: string, task: Task) => {
    const newBoard = { ...board }
    const column = newBoard.columns.find((c) => c.id === columnId)
    if (column) {
      const taskIndex = column.tasks.findIndex((t) => t.id === task.id)
      if (taskIndex >= 0) {
        column.tasks[taskIndex] = task
        onUpdate(newBoard)
      }
    }
  }

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newBoard = { ...board }
      const newColumn: ColumnType = {
        id: `col-${Date.now()}`,
        title: newColumnTitle.trim(),
        tasks: [],
      }
      newBoard.columns.push(newColumn)
      onUpdate(newBoard)
      setNewColumnTitle('')
      setIsCreatingColumn(false)
    }
  }

  const handleDeleteColumn = (columnId: string) => {
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((c) => c.id !== columnId)
    onUpdate(newBoard)
  }

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    const newBoard = { ...board }
    const column = newBoard.columns.find((c) => c.id === columnId)
    if (column) {
      column.title = newTitle
      onUpdate(newBoard)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-4 overflow-x-auto pb-4 h-full bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <AnimatePresence>
              {board.columns.map((column, index) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Column
                    column={column}
                    columnIndex={index}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteColumn={handleDeleteColumn}
                    onRenameColumn={handleRenameColumn}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {provided.placeholder}

            {/* Add Column Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 w-80"
            >
              {isCreatingColumn ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg p-4 border border-purple-300 h-full flex flex-col justify-start"
                >
                  <input
                    autoFocus
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Column name"
                    className="w-full px-3 py-2 text-sm font-semibold border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddColumn()
                      if (e.key === 'Escape') {
                        setIsCreatingColumn(false)
                        setNewColumnTitle('')
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded transition-colors font-medium"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingColumn(false)
                        setNewColumnTitle('')
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsCreatingColumn(true)}
                  className="w-full h-full min-h-[200px] flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 text-gray-400 hover:text-purple-600 transition-colors font-medium gap-2 bg-white hover:bg-purple-50"
                >
                  <Plus size={20} /> Add Column
                </button>
              )}
            </motion.div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
