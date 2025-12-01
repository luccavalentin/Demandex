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

// Função para gerar dados mockados
const generateMockData = () => {
  const today = new Date()
  const formatDate = (daysAgo: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split('T')[0]
  }

  const mockMeals: Meal[] = [
    { id: '1', type: 'breakfast', name: 'Café da manhã completo', calories: 450, date: formatDate(0), notes: 'Pão integral, ovos e frutas' },
    { id: '2', type: 'lunch', name: 'Salada com frango grelhado', calories: 520, date: formatDate(0), notes: 'Almoço saudável' },
    { id: '3', type: 'dinner', name: 'Salmão com legumes', calories: 480, date: formatDate(1), notes: 'Jantar nutritivo' },
    { id: '4', type: 'snack', name: 'Iogurte com granola', calories: 200, date: formatDate(1), notes: 'Lanche da tarde' },
    { id: '5', type: 'breakfast', name: 'Aveia com frutas', calories: 350, date: formatDate(2), notes: 'Café da manhã leve' },
  ]

  const mockWorkouts: Workout[] = [
    { id: '1', name: 'Corrida matinal', type: 'cardio', duration: 30, date: formatDate(0), notes: '5km no parque' },
    { id: '2', name: 'Treino de força', type: 'strength', duration: 45, date: formatDate(1), notes: 'Peito e tríceps' },
    { id: '3', name: 'Yoga', type: 'flexibility', duration: 60, date: formatDate(2), notes: 'Sessão de relaxamento' },
    { id: '4', name: 'Ciclismo', type: 'cardio', duration: 60, date: formatDate(3), notes: '20km' },
    { id: '5', name: 'Musculação', type: 'strength', duration: 50, date: formatDate(4), notes: 'Pernas e glúteos' },
  ]

  const mockSleeps: Sleep[] = [
    { id: '1', date: formatDate(0), bedtime: '22:30', wakeTime: '06:30', duration: 8, quality: 5, notes: 'Sono excelente' },
    { id: '2', date: formatDate(1), bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 4, notes: 'Bom descanso' },
    { id: '3', date: formatDate(2), bedtime: '22:00', wakeTime: '06:00', duration: 8, quality: 5, notes: 'Muito repousante' },
    { id: '4', date: formatDate(3), bedtime: '23:30', wakeTime: '07:30', duration: 8, quality: 3, notes: 'Acordei algumas vezes' },
    { id: '5', date: formatDate(4), bedtime: '22:15', wakeTime: '06:15', duration: 8, quality: 4, notes: 'Sono regular' },
  ]

  const mockHealthGoals: HealthGoal[] = [
    { id: '1', type: 'nutrition', title: 'Consumir 2000 calorias diárias', description: 'Meta de calorias', targetValue: 2000, currentValue: 1650, unit: 'calorias', completed: false },
    { id: '2', type: 'fitness', title: 'Treinar 5x por semana', description: 'Frequência de treinos', targetValue: 5, currentValue: 4, unit: 'vezes/semana', completed: false },
    { id: '3', type: 'sleep', title: 'Dormir 8 horas por noite', description: 'Qualidade do sono', targetValue: 8, currentValue: 8, unit: 'horas', completed: true },
    { id: '4', type: 'fitness', title: 'Perder 5kg', description: 'Meta de peso', targetValue: 5, currentValue: 2, unit: 'kg', completed: false },
    { id: '5', type: 'nutrition', title: 'Beber 2L de água', description: 'Hidratação diária', targetValue: 2, currentValue: 1.5, unit: 'litros', completed: false },
  ]

  const mockTransactions: Transaction[] = [
    { id: '1', type: 'income', category: 'Salário', amount: 5000, description: 'Salário mensal', date: formatDate(0), tags: ['trabalho'] },
    { id: '2', type: 'expense', category: 'Alimentação', amount: 350, description: 'Supermercado', date: formatDate(1), tags: ['compras'] },
    { id: '3', type: 'expense', category: 'Transporte', amount: 120, description: 'Combustível', date: formatDate(2), tags: ['carro'] },
    { id: '4', type: 'income', category: 'Freelance', amount: 800, description: 'Projeto web', date: formatDate(3), tags: ['trabalho'] },
    { id: '5', type: 'expense', category: 'Lazer', amount: 150, description: 'Cinema e jantar', date: formatDate(4), tags: ['entretenimento'] },
  ]

  const mockFinancialGoals: FinancialGoal[] = [
    { id: '1', title: 'Reserva de emergência', description: '6 meses de despesas', targetAmount: 30000, currentAmount: 15000, completed: false },
    { id: '2', title: 'Viagem para Europa', description: 'Férias de verão', targetAmount: 15000, currentAmount: 8000, deadline: '2025-07-01', completed: false },
    { id: '3', title: 'Notebook novo', description: 'Para trabalho', targetAmount: 5000, currentAmount: 3200, deadline: '2025-03-01', completed: false },
    { id: '4', title: 'Curso de inglês', description: 'Fluência', targetAmount: 3000, currentAmount: 3000, completed: true },
    { id: '5', title: 'Moto', description: 'Transporte', targetAmount: 20000, currentAmount: 5000, deadline: '2025-12-01', completed: false },
  ]

  const mockInvestments: Investment[] = [
    { id: '1', name: 'Ações PETR4', type: 'stocks', amount: 5000, purchaseDate: formatDate(30), currentValue: 5500, notes: 'Petrobras' },
    { id: '2', name: 'Bitcoin', type: 'crypto', amount: 3000, purchaseDate: formatDate(60), currentValue: 3200, notes: 'Criptomoeda' },
    { id: '3', name: 'Tesouro Direto', type: 'bonds', amount: 10000, purchaseDate: formatDate(90), currentValue: 10200, notes: 'Renda fixa' },
    { id: '4', name: 'Apartamento', type: 'real-estate', amount: 200000, purchaseDate: formatDate(365), currentValue: 220000, notes: 'Investimento imobiliário' },
    { id: '5', name: 'ETF S&P 500', type: 'stocks', amount: 8000, purchaseDate: formatDate(45), currentValue: 8400, notes: 'Índice americano' },
  ]

  const mockTasks: Task[] = [
    { id: '1', title: 'Revisar relatório mensal', description: 'Análise financeira', status: 'todo', priority: 'high', dueDate: formatDate(-2), createdAt: formatDate(5) },
    { id: '2', title: 'Atualizar site pessoal', description: 'Adicionar novos projetos', status: 'in-progress', priority: 'medium', dueDate: formatDate(3), createdAt: formatDate(7) },
    { id: '3', title: 'Estudar React avançado', description: 'Hooks e context', status: 'in-progress', priority: 'high', dueDate: formatDate(5), createdAt: formatDate(10) },
    { id: '4', title: 'Agendar consulta médica', description: 'Check-up anual', status: 'todo', priority: 'medium', dueDate: formatDate(7), createdAt: formatDate(2) },
    { id: '5', title: 'Organizar escritório', description: 'Limpeza e organização', status: 'done', priority: 'low', dueDate: formatDate(-5), createdAt: formatDate(15), completedAt: formatDate(-5) },
  ]

  const mockStudyAreas: StudyArea[] = [
    { id: '1', name: 'Programação', description: 'Desenvolvimento de software', color: '#3b82f6', subjects: [] },
    { id: '2', name: 'Design', description: 'UI/UX e design gráfico', color: '#8b5cf6', subjects: [] },
    { id: '3', name: 'Marketing', description: 'Marketing digital', color: '#ec4899', subjects: [] },
    { id: '4', name: 'Idiomas', description: 'Inglês e espanhol', color: '#10b981', subjects: [] },
    { id: '5', name: 'Negócios', description: 'Empreendedorismo', color: '#f59e0b', subjects: [] },
  ]

  const mockPersonalProjects: PersonalProject[] = [
    { id: '1', title: 'App de gestão pessoal', description: 'Sistema completo', status: 'in-progress', tasks: [], createdAt: formatDate(30) },
    { id: '2', title: 'Portfolio online', description: 'Site profissional', status: 'planning', tasks: [], createdAt: formatDate(20) },
    { id: '3', title: 'Curso online', description: 'Criar curso de React', status: 'idea', tasks: [], createdAt: formatDate(10) },
    { id: '4', title: 'E-book sobre produtividade', description: 'Guia completo', status: 'in-progress', tasks: [], createdAt: formatDate(15) },
    { id: '5', title: 'Blog técnico', description: 'Artigos sobre programação', status: 'completed', tasks: [], createdAt: formatDate(60) },
  ]

  const mockProductivityGoals: ProductivityGoal[] = [
    { id: '1', type: 'tasks', title: 'Completar 50 tarefas', description: 'Este mês', targetValue: 50, currentValue: 32, completed: false },
    { id: '2', type: 'study', title: 'Estudar 100 horas', description: 'Trimestre', targetValue: 100, currentValue: 75, completed: false },
    { id: '3', type: 'project', title: 'Finalizar 3 projetos', description: 'Este ano', targetValue: 3, currentValue: 2, completed: false },
    { id: '4', type: 'tasks', title: 'Zero tarefas atrasadas', description: 'Manter organização', targetValue: 0, currentValue: 0, completed: true },
    { id: '5', type: 'study', title: 'Completar curso de TypeScript', description: 'Formação', targetValue: 1, currentValue: 0.6, completed: false },
  ]

  const mockAttractionGoals: AttractionGoal[] = [
    { id: '1', title: 'Casa própria', description: 'Casa com jardim', images: [], links: [], notes: 'Visualizando todos os dias', createdAt: formatDate(90), completed: false },
    { id: '2', title: 'Carro novo', description: 'SUV confortável', images: [], links: [], notes: 'Manifestando', createdAt: formatDate(60), completed: false },
    { id: '3', title: 'Viagem dos sonhos', description: 'Japão', images: [], links: [], notes: 'Planejando', createdAt: formatDate(30), completed: false },
    { id: '4', title: 'Negócio próprio', description: 'Startup de tecnologia', images: [], links: [], notes: 'Em desenvolvimento', createdAt: formatDate(45), completed: false },
    { id: '5', title: 'Saúde perfeita', description: 'Bem-estar completo', images: [], links: [], notes: 'Focando na saúde', createdAt: formatDate(20), completed: false },
  ]

  return {
    meals: mockMeals,
    workouts: mockWorkouts,
    sleeps: mockSleeps,
    healthGoals: mockHealthGoals,
    transactions: mockTransactions,
    financialGoals: mockFinancialGoals,
    investments: mockInvestments,
    tasks: mockTasks,
    studyAreas: mockStudyAreas,
    personalProjects: mockPersonalProjects,
    productivityGoals: mockProductivityGoals,
    attractionGoals: mockAttractionGoals,
  }
}

export const useStore = create<AppState>((set, get) => {
  const stored = loadFromStorage()
  const mockData = generateMockData()
  
  // Usa dados salvos se existirem, senão usa dados mockados
  const hasStoredData = stored.meals?.length || stored.workouts?.length || stored.tasks?.length
  
  const initialState = {
    // Estado inicial - usa dados salvos ou mockados
    meals: stored.meals?.length ? stored.meals : mockData.meals,
    workouts: stored.workouts?.length ? stored.workouts : mockData.workouts,
    sleeps: stored.sleeps?.length ? stored.sleeps : mockData.sleeps,
    healthGoals: stored.healthGoals?.length ? stored.healthGoals : mockData.healthGoals,
    transactions: stored.transactions?.length ? stored.transactions : mockData.transactions,
    financialGoals: stored.financialGoals?.length ? stored.financialGoals : mockData.financialGoals,
    emergencyReserve: stored.emergencyReserve || null,
    investments: stored.investments?.length ? stored.investments : mockData.investments,
    tasks: stored.tasks?.length ? stored.tasks : mockData.tasks,
    studyAreas: stored.studyAreas?.length ? stored.studyAreas : mockData.studyAreas,
    personalProjects: stored.personalProjects?.length ? stored.personalProjects : mockData.personalProjects,
    productivityGoals: stored.productivityGoals?.length ? stored.productivityGoals : mockData.productivityGoals,
    attractionGoals: stored.attractionGoals?.length ? stored.attractionGoals : mockData.attractionGoals,
    notifications: stored.notifications || [],
  }
  
  // Salva dados mockados no localStorage se não houver dados salvos
  if (!hasStoredData && typeof window !== 'undefined') {
    saveToStorage(initialState)
  }
  
  return {
    ...initialState,
    
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
