// ... existing code ...

// Lei da Atração
export interface AttractionGoal {
  id: string
  title: string
  description?: string
  images?: string[]
  links?: string[]
  notes?: string
  taskId?: string // ID da tarefa vinculada
  createdAt: string
  completed: boolean
}

// Mural da Lei da Atração
export interface AttractionMural {
  id: string
  title: string
  description?: string
  date: string // Data do mural
  images: string[] // URLs das imagens
  videos: string[] // URLs dos vídeos
  links: string[] // Links externos
  notes?: string // Observações/visualizações
  createdAt: string
}

// ... existing code ...
