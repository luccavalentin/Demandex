// Tipos principais do sistema

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Gestão da Saúde
export interface Meal {
  id: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  calories?: number
  date: string
  notes?: string
}

export interface Workout {
  id: string
  name: string
  type: 'cardio' | 'strength' | 'flexibility' | 'other'
  duration: number // em minutos
  date: string
  exercises?: Exercise[]
  notes?: string
}

export interface Exercise {
  id: string
  name: string
  sets?: number
  reps?: number
  weight?: number
  duration?: number
}

export interface Sleep {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  duration: number // em horas
  quality: 1 | 2 | 3 | 4 | 5
  notes?: string
}

export interface HealthGoal {
  id: string
  type: 'nutrition' | 'fitness' | 'sleep'
  title: string
  description?: string
  targetValue: number
  currentValue: number
  unit: string
  deadline?: string
  completed: boolean
}

// Gestão Financeira
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string
  date: string
  tags?: string[]
}

export interface FinancialGoal {
  id: string
  title: string
  description?: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  completed: boolean
}

export interface EmergencyReserve {
  id: string
  targetAmount: number
  currentAmount: number
  monthlyContribution: number
}

export interface Investment {
  id: string
  name: string
  type: 'stocks' | 'bonds' | 'crypto' | 'real-estate' | 'other'
  amount: number
  purchaseDate: string
  currentValue?: number
  notes?: string
}

// Produtividade
export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  projectId?: string
  createdAt: string
  completedAt?: string
}

export interface StudyArea {
  id: string
  name: string
  description?: string
  color: string
  subjects: Subject[]
}

export interface Subject {
  id: string
  areaId: string
  name: string
  description?: string
  classes: Class[]
}

export interface Class {
  id: string
  subjectId: string
  title: string
  description?: string
  links?: string[]
  files?: FileAttachment[]
  pomodoros: Pomodoro[]
  createdAt: string
}

export interface FileAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Pomodoro {
  id: string
  classId: string
  duration: number // em minutos (padrão 25)
  completedAt: string
  notes?: string
}

export interface PersonalProject {
  id: string
  title: string
  description?: string
  status: 'idea' | 'planning' | 'in-progress' | 'completed'
  tasks: string[] // IDs de tarefas
  images?: string[]
  links?: string[]
  createdAt: string
}

export interface ProductivityGoal {
  id: string
  type: 'tasks' | 'study' | 'project'
  title: string
  description?: string
  targetValue: number
  currentValue: number
  deadline?: string
  completed: boolean
}

// Lei da Atração
export interface AttractionGoal {
  id: string
  title: string
  description?: string
  images?: string[]
  links?: string[]
  notes?: string
  createdAt: string
  completed: boolean
}

// Notificações
export interface Notification {
  id: string
  type: 'diet' | 'workout' | 'study' | 'sleep' | 'task' | 'task-overdue' | 'financial'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

