import { create } from 'zustand'
import type {
  Meal,
  Workout,
  Sleep,
  HealthGoal,
  Transaction,
  FinancialGoal,
  EmergencyReserve,
  Investment,
  Task,
  StudyArea,
  PersonalProject,
  ProductivityGoal,
  AttractionGoal,
  Notification,
} from '@/types'

interface AppState {
  // Saúde
  meals: Meal[]
  workouts: Workout[]
  sleeps: Sleep[]
  healthGoals: HealthGoal[]
  
  // Financeiro
  transactions: Transaction[]
  financialGoals: FinancialGoal[]
  emergencyReserve: EmergencyReserve | null
  investments: Investment[]
  
  // Produtividade
  tasks: Task[]
  studyAreas: StudyArea[]
  personalProjects: PersonalProject[]
  productivityGoals: ProductivityGoal[]
  
  // Lei da Atração
  attractionGoals: AttractionGoal[]
  
  // Notificações
  notifications: Notification[]
  
  // Actions - Saúde
  addMeal: (meal: Meal) => void
  updateMeal: (id: string, meal: Partial<Meal>) => void
  deleteMeal: (id: string) => void
  
  addWorkout: (workout: Workout) => void
  updateWorkout: (id: string, workout: Partial<Workout>) => void
  deleteWorkout: (id: string) => void
  
  addSleep: (sleep: Sleep) => void
  updateSleep: (id: string, sleep: Partial<Sleep>) => void
  deleteSleep: (id: string) => void
  
  addHealthGoal: (goal: HealthGoal) => void
  updateHealthGoal: (id: string, goal: Partial<HealthGoal>) => void
  deleteHealthGoal: (id: string) => void
  
  // Actions - Financeiro
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  
  addFinancialGoal: (goal: FinancialGoal) => void
  updateFinancialGoal: (id: string, goal: Partial<FinancialGoal>) => void
  deleteFinancialGoal: (id: string) => void
  
  updateEmergencyReserve: (reserve: EmergencyReserve) => void
  
  addInvestment: (investment: Investment) => void
  updateInvestment: (id: string, investment: Partial<Investment>) => void
  deleteInvestment: (id: string) => void
  
  // Actions - Produtividade
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  addStudyArea: (area: StudyArea) => void
  updateStudyArea: (id: string, area: Partial<StudyArea>) => void
  deleteStudyArea: (id: string) => void
  
  addSubject: (areaId: string, subject: Omit<StudyArea['subjects'][0], 'id'>) => void
  updateSubject: (areaId: string, subjectId: string, subject: Partial<StudyArea['subjects'][0]>) => void
  deleteSubject: (areaId: string, subjectId: string) => void
  
  addClass: (subjectId: string, classItem: Omit<StudyArea['subjects'][0]['classes'][0], 'id'>) => void
  updateClass: (subjectId: string, classId: string, classItem: Partial<StudyArea['subjects'][0]['classes'][0]>) => void
  deleteClass: (subjectId: string, classId: string) => void
  
  addPomodoro: (classId: string, pomodoro: Omit<StudyArea['subjects'][0]['classes'][0]['pomodoros'][0], 'id'>) => void
  
  addPersonalProject: (project: PersonalProject) => void
  updatePersonalProject: (id: string, project: Partial<PersonalProject>) => void
  deletePersonalProject: (id: string) => void
  
  addProductivityGoal: (goal: ProductivityGoal) => void
  updateProductivityGoal: (id: string, goal: Partial<ProductivityGoal>) => void
  deleteProductivityGoal: (id: string) => void
  
  // Actions - Lei da Atração
  addAttractionGoal: (goal: AttractionGoal) => void
  updateAttractionGoal: (id: string, goal: Partial<AttractionGoal>) => void
  deleteAttractionGoal: (id: string) => void
  
  // Actions - Notificações
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
}

// Função para salvar no localStorage
const saveToStorage = (state: Partial<AppState>) => {
  if (typeof window !== 'undefined') {
    const dataToSave = {
      meals: state.meals || [],
      workouts: state.workouts || [],
      sleeps: state.sleeps || [],
      healthGoals: state.healthGoals || [],
      transactions: state.transactions || [],
      financialGoals: state.financialGoals || [],
      emergencyReserve: state.emergencyReserve || null,
      investments: state.investments || [],
      tasks: state.tasks || [],
      studyAreas: state.studyAreas || [],
      personalProjects: state.personalProjects || [],
      productivityGoals: state.productivityGoals || [],
      attractionGoals: state.attractionGoals || [],
      notifications: state.notifications || [],
    }
    localStorage.setItem('demandex-storage', JSON.stringify(dataToSave))
  }
}

// Função para carregar do localStorage
const loadFromStorage = (): Partial<AppState> => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('demandex-storage')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return {}
      }
    }
  }
  return {}
}

export const useStore = create<AppState>((set, get) => {
  const stored = loadFromStorage()
  
  return {
    // Estado inicial
    meals: stored.meals || [],
    workouts: stored.workouts || [],
    sleeps: stored.sleeps || [],
    healthGoals: stored.healthGoals || [],
    transactions: stored.transactions || [],
    financialGoals: stored.financialGoals || [],
    emergencyReserve: stored.emergencyReserve || null,
    investments: stored.investments || [],
    tasks: stored.tasks || [],
    studyAreas: stored.studyAreas || [],
    personalProjects: stored.personalProjects || [],
    productivityGoals: stored.productivityGoals || [],
    attractionGoals: stored.attractionGoals || [],
    notifications: stored.notifications || [],
    
    // Saúde - Meals
    addMeal: (meal) => {
      set((state) => {
        const newState = { meals: [...state.meals, meal] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateMeal: (id, meal) => {
      set((state) => {
        const newState = {
          meals: state.meals.map((m) => (m.id === id ? { ...m, ...meal } : m)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteMeal: (id) => {
      set((state) => {
        const newState = { meals: state.meals.filter((m) => m.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Saúde - Workouts
    addWorkout: (workout) => {
      set((state) => {
        const newState = { workouts: [...state.workouts, workout] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateWorkout: (id, workout) => {
      set((state) => {
        const newState = {
          workouts: state.workouts.map((w) => (w.id === id ? { ...w, ...workout } : w)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteWorkout: (id) => {
      set((state) => {
        const newState = { workouts: state.workouts.filter((w) => w.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Saúde - Sleep
    addSleep: (sleep) => {
      set((state) => {
        const newState = { sleeps: [...state.sleeps, sleep] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateSleep: (id, sleep) => {
      set((state) => {
        const newState = {
          sleeps: state.sleeps.map((s) => (s.id === id ? { ...s, ...sleep } : s)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteSleep: (id) => {
      set((state) => {
        const newState = { sleeps: state.sleeps.filter((s) => s.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Saúde - Goals
    addHealthGoal: (goal) => {
      set((state) => {
        const newState = { healthGoals: [...state.healthGoals, goal] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateHealthGoal: (id, goal) => {
      set((state) => {
        const newState = {
          healthGoals: state.healthGoals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteHealthGoal: (id) => {
      set((state) => {
        const newState = { healthGoals: state.healthGoals.filter((g) => g.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Financeiro - Transactions
    addTransaction: (transaction) => {
      set((state) => {
        const newState = { transactions: [...state.transactions, transaction] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateTransaction: (id, transaction) => {
      set((state) => {
        const newState = {
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...transaction } : t)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteTransaction: (id) => {
      set((state) => {
        const newState = { transactions: state.transactions.filter((t) => t.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Financeiro - Goals
    addFinancialGoal: (goal) => {
      set((state) => {
        const newState = { financialGoals: [...state.financialGoals, goal] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateFinancialGoal: (id, goal) => {
      set((state) => {
        const newState = {
          financialGoals: state.financialGoals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteFinancialGoal: (id) => {
      set((state) => {
        const newState = { financialGoals: state.financialGoals.filter((g) => g.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Financeiro - Emergency Reserve
    updateEmergencyReserve: (reserve) => {
      set((state) => {
        const newState = { emergencyReserve: reserve }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Financeiro - Investments
    addInvestment: (investment) => {
      set((state) => {
        const newState = { investments: [...state.investments, investment] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateInvestment: (id, investment) => {
      set((state) => {
        const newState = {
          investments: state.investments.map((i) => (i.id === id ? { ...i, ...investment } : i)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteInvestment: (id) => {
      set((state) => {
        const newState = { investments: state.investments.filter((i) => i.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Tasks
    addTask: (task) => {
      set((state) => {
        const newState = { tasks: [...state.tasks, task] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateTask: (id, task) => {
      set((state) => {
        const newState = {
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteTask: (id) => {
      set((state) => {
        const newState = { tasks: state.tasks.filter((t) => t.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Study Areas
    addStudyArea: (area) => {
      set((state) => {
        const newState = { studyAreas: [...state.studyAreas, area] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateStudyArea: (id, area) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((a) => (a.id === id ? { ...a, ...area } : a)),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteStudyArea: (id) => {
      set((state) => {
        const newState = { studyAreas: state.studyAreas.filter((a) => a.id !== id) }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Subjects
    addSubject: (areaId, subject) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) =>
            area.id === areaId
              ? { ...area, subjects: [...area.subjects, { ...subject, id: Date.now().toString() }] }
              : area
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateSubject: (areaId, subjectId, subject) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) =>
            area.id === areaId
              ? {
                  ...area,
                  subjects: area.subjects.map((s) =>
                    s.id === subjectId ? { ...s, ...subject } : s
                  ),
                }
              : area
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteSubject: (areaId, subjectId) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) =>
            area.id === areaId
              ? { ...area, subjects: area.subjects.filter((s) => s.id !== subjectId) }
              : area
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Classes
    addClass: (subjectId, classItem) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) => ({
            ...area,
            subjects: area.subjects.map((subject) =>
              subject.id === subjectId
                ? {
                    ...subject,
                    classes: [
                      ...subject.classes,
                      { ...classItem, id: Date.now().toString() },
                    ],
                  }
                : subject
            ),
          })),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateClass: (subjectId, classId, classItem) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) => ({
            ...area,
            subjects: area.subjects.map((subject) =>
              subject.id === subjectId
                ? {
                    ...subject,
                    classes: subject.classes.map((c) =>
                      c.id === classId ? { ...c, ...classItem } : c
                    ),
                  }
                : subject
            ),
          })),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteClass: (subjectId, classId) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) => ({
            ...area,
            subjects: area.subjects.map((subject) =>
              subject.id === subjectId
                ? { ...subject, classes: subject.classes.filter((c) => c.id !== classId) }
                : subject
            ),
          })),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Pomodoros
    addPomodoro: (classId, pomodoro) => {
      set((state) => {
        const newState = {
          studyAreas: state.studyAreas.map((area) => ({
            ...area,
            subjects: area.subjects.map((subject) => ({
              ...subject,
              classes: subject.classes.map((c) =>
                c.id === classId
                  ? {
                      ...c,
                      pomodoros: [
                        ...c.pomodoros,
                        { ...pomodoro, id: Date.now().toString() },
                      ],
                    }
                  : c
              ),
            })),
          })),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Projects
    addPersonalProject: (project) => {
      set((state) => {
        const newState = { personalProjects: [...state.personalProjects, project] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updatePersonalProject: (id, project) => {
      set((state) => {
        const newState = {
          personalProjects: state.personalProjects.map((p) =>
            p.id === id ? { ...p, ...project } : p
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deletePersonalProject: (id) => {
      set((state) => {
        const newState = {
          personalProjects: state.personalProjects.filter((p) => p.id !== id),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Produtividade - Goals
    addProductivityGoal: (goal) => {
      set((state) => {
        const newState = { productivityGoals: [...state.productivityGoals, goal] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateProductivityGoal: (id, goal) => {
      set((state) => {
        const newState = {
          productivityGoals: state.productivityGoals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteProductivityGoal: (id) => {
      set((state) => {
        const newState = {
          productivityGoals: state.productivityGoals.filter((g) => g.id !== id),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Lei da Atração
    addAttractionGoal: (goal) => {
      set((state) => {
        const newState = { attractionGoals: [...state.attractionGoals, goal] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    updateAttractionGoal: (id, goal) => {
      set((state) => {
        const newState = {
          attractionGoals: state.attractionGoals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteAttractionGoal: (id) => {
      set((state) => {
        const newState = {
          attractionGoals: state.attractionGoals.filter((g) => g.id !== id),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    
    // Notificações
    addNotification: (notification) => {
      set((state) => {
        const newState = { notifications: [notification, ...state.notifications] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    markNotificationAsRead: (id) => {
      set((state) => {
        const newState = {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    deleteNotification: (id) => {
      set((state) => {
        const newState = {
          notifications: state.notifications.filter((n) => n.id !== id),
        }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
    clearAllNotifications: () => {
      set((state) => {
        const newState = { notifications: [] }
        saveToStorage({ ...state, ...newState })
        return newState
      })
    },
  }
})
