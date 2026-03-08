export interface Task {
  id: string
  title: string
  description: string
  createdAt: number
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

export interface Board {
  id: string
  columns: Column[]
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: string  // 'YYYY-MM-DD'
  description?: string
  createdAt: number
}

export type Priority = 'high' | 'medium' | 'low'

export type TodoCategory = 'work' | 'personal' | 'errand' | 'health' | 'other'

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
  dueDate?: string        // 'YYYY-MM-DD' format
  priority: Priority
  category?: TodoCategory
}
