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
