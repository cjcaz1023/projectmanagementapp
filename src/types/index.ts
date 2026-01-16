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

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
}
