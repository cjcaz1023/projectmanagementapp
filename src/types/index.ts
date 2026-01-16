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

export interface CalendarEvent {
  id: string
  title: string
  date: string  // 'YYYY-MM-DD'
  description?: string
  createdAt: number
}
