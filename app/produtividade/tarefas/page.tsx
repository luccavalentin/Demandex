'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Task } from '@/types'
import { Plus, Trash2, Edit2, CheckCircle2, CheckSquare, X, Search, Calendar, AlertCircle, Clock, Target, Link2, Filter, ListTodo, PlayCircle, CheckCircle } from 'lucide-react'
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { DateFilter, type DateRange } from '@/components/UI/DateFilter'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function TarefasPage() {
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Task['priority']>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    parentTaskId: '',
  })

  const handleOpenModal = (status?: Task['status'], priority?: Task['priority']) => {
    setFormData({
      title: '',
      description: '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: '',
      parentTaskId: '',
    })
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const task: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      parentTaskId: formData.parentTaskId || undefined,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      completedAt: formData.status === 'done' ? new Date().toISOString() : undefined,
    }

    if (editingTask) {
      updateTask(editingTask.id, task)
    } else {
      addTask(task)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      parentTaskId: '',
    })
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      parentTaskId: task.parentTaskId || '',
    })
    setIsModalOpen(true)
  }

  const statusLabels = {
    todo: 'Pendente',
    'in-progress': 'Em Andamento',
    done: 'Concluída',
  }

  const statusIcons = {
    todo: ListTodo,
    'in-progress': PlayCircle,
    done: CheckCircle,
  }

  const statusColors = {
    todo: {
      bg: 'from-slate-50 to-slate-100/80',
      border: 'border-slate-200/70',
      icon: 'from-slate-500 to-slate-600',
      text: 'text-slate-700',
    },
    'in-progress': {
      bg: 'from-blue-50 to-blue-100/80',
      border: 'border-blue-200/70',
      icon: 'from-blue-500 to-blue-600',
      text: 'text-blue-700',
    },
    done: {
      bg: 'from-success-50 to-success-100/80',
      border: 'border-success-200/70',
      icon: 'from-success-500 to-success-600',
      text: 'text-success-700',
    },
  }

  const priorityColors = {
    low: {
      bg: 'from-primary-50 to-primary-100/80',
      border: 'border-primary-200/70',
      icon: 'from-primary-500 to-primary-600',
      text: 'text-primary-700',
      label: 'Baixa',
    },
    medium: {
      bg: 'from-warning-50 to-warning-100/80',
      border: 'border-warning-200/70',
      icon: 'from-warning-500 to-warning-600',
      text: 'text-warning-700',
      label: 'Média',
    },
    high: {
      bg: 'from-danger-50 to-danger-100/80',
      border: 'border-danger-200/70',
      icon: 'from-danger-500 to-danger-600',
      text: 'text-danger-700',
      label: 'Alta',
    },
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filtro por status
      const statusMatch = filter === 'all' || task.status === filter
      
      // Filtro por prioridade
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter
      
      // Filtro por busca
      const searchMatch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Filtro por data
      const dateMatch = !dateRange.start || !dateRange.end || !task.dueDate || 
        (new Date(task.dueDate) >= dateRange.start && new Date(task.dueDate) <= dateRange.end)
      
      return statusMatch && priorityMatch && searchMatch && dateMatch
    })
  }, [tasks, filter, priorityFilter, searchQuery, dateRange])

  // Estatísticas
  const stats = useMemo(() => {
    const all = tasks.length
    const todo = tasks.filter(t => t.status === 'todo').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const done = tasks.filter(t => t.status === 'done').length
    const overdue = tasks.filter(t => 
      t.dueDate && 
      isPast(new Date(t.dueDate)) && 
      t.status !== 'done'
    ).length
    const today = tasks.filter(t => 
      t.dueDate && 
      isToday(new Date(t.dueDate)) && 
      t.status !== 'done'
    ).length
    const highPriority = tasks.filter(t => 
      t.priority === 'high' && 
      t.status !== 'done'
    ).length

    return { all, todo, inProgress, done, overdue, today, highPriority }
  }, [tasks])

  // Tarefas disponíveis para vincular (excluindo a própria tarefa se estiver editando)
  const availableParentTasks = useMemo(() => {
    return tasks.filter(t => 
      t.id !== editingTask?.id && 
      t.status !== 'done'
    )
  }, [tasks, editingTask])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  const getSubTasks = (taskId: string) => {
    return tasks.filter(t => t.parentTaskId === taskId)
  }

  const getDateLabel = (date: string) => {
    const taskDate = new Date(date)
    if (isToday(taskDate)) return 'Hoje'
    if (isTomorrow(taskDate)) return 'Amanhã'
    if (isPast(taskDate)) return 'Atrasada'
    const days = differenceInDays(taskDate, new Date())
    return `Em ${days} dias`
  }

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckSquare className="text-white" size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Tarefas
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Gerencie suas tarefas e atividades diárias
              </p>
            </div>
          </div>

          {/* Botões Rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button
              onClick={() => handleOpenModal('todo', 'high')}
              className="w-full bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <AlertCircle size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Alta Prioridade</span>
            </Button>
            <Button
              onClick={() => handleOpenModal('todo', 'medium')}
              className="w-full bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <Target size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Média Prioridade</span>
            </Button>
            <Button
              onClick={() => handleOpenModal('in-progress')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <PlayCircle size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Em Andamento</span>
            </Button>
            <Button
              onClick={() => handleOpenModal('todo')}
              className="w-full bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <Plus size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Nova Tarefa</span>
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200/70 dark:border-slate-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200/50 flex-shrink-0">
                <ListTodo className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Total</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white truncate">
                  {stats.all}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200/70 dark:border-slate-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200/50 flex-shrink-0">
                <ListTodo className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Pendentes</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white truncate">
                  {stats.todo}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/70 dark:border-blue-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md ring-2 ring-blue-200/50 flex-shrink-0">
                <PlayCircle className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Andamento</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-700 dark:text-blue-400 truncate">
                  {stats.inProgress}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border-success-200/70 dark:border-success-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md ring-2 ring-success-200/50 flex-shrink-0">
                <CheckCircle className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Concluídas</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-success-700 dark:text-success-400 truncate">
                  {stats.done}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            stats.overdue > 0
              ? 'bg-gradient-to-br from-danger-50 to-danger-100/80 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200/70 dark:border-danger-700/40'
              : 'bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200/70 dark:border-slate-700/40'
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-md ring-2 flex-shrink-0",
                stats.overdue > 0
                  ? 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50'
                  : 'bg-gradient-to-br from-slate-500 to-slate-600 ring-slate-200/50'
              )}>
                <AlertCircle className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Atrasadas</p>
                <p className={cn(
                  "text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate",
                  stats.overdue > 0
                    ? 'text-danger-700 dark:text-danger-400'
                    : 'text-slate-900 dark:text-white'
                )}>
                  {stats.overdue}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-warning-50 to-warning-100/80 dark:from-warning-900/20 dark:to-warning-800/20 border-warning-200/70 dark:border-warning-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-md ring-2 ring-warning-200/50 flex-shrink-0">
                <Calendar className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Hoje</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-warning-700 dark:text-warning-400 truncate">
                  {stats.today}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-danger-50 to-danger-100/80 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200/70 dark:border-danger-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center shadow-md ring-2 ring-danger-200/50 flex-shrink-0">
                <AlertCircle className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Alta</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-danger-700 dark:text-danger-400 truncate">
                  {stats.highPriority}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="p-3 sm:p-4 md:p-5 overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base w-full"
              />
            </div>

            {/* Filtros */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Filter size={14} />
                Filtros
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {/* Filtro de Status */}
                {(['all', 'todo', 'in-progress', 'done'] as const).map((status) => {
                  const Icon = status === 'all' ? Filter : statusIcons[status]
                  const colors = status === 'all' 
                    ? { bg: 'from-slate-500 to-slate-600', text: 'text-white' }
                    : statusColors[status]
                  return (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={cn(
                        "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0",
                        filter === status
                          ? `bg-gradient-to-r ${status === 'all' ? 'from-slate-500 to-slate-600' : colors.icon} text-white shadow-md`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      <Icon size={12} className="flex-shrink-0" />
                      <span className="truncate">{status === 'all' ? 'Todas' : statusLabels[status]}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {/* Filtro de Prioridade */}
                {(['all', 'low', 'medium', 'high'] as const).map((priority) => {
                  const colors = priority === 'all' 
                    ? { icon: 'from-slate-500 to-slate-600' }
                    : priorityColors[priority]
                  return (
                    <button
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className={cn(
                        "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0",
                        priorityFilter === priority
                          ? `bg-gradient-to-r ${priority === 'all' ? 'from-slate-500 to-slate-600' : colors.icon} text-white shadow-md`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      {priority === 'all' ? (
                        <>
                          <Filter size={12} className="flex-shrink-0" />
                          <span className="truncate">Todas</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span className="truncate">{priorityColors[priority].label}</span>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filtro de Data */}
            <DateFilter onFilterChange={setDateRange} />
          </div>
        </Card>

        {/* Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-3 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                resetForm()
              }
            }}
          >
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative animate-scale-in">
              <button
                onClick={resetForm}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
                aria-label="Fechar"
              >
                <X size={18} className="text-slate-600 dark:text-slate-300" />
              </button>
              <div className="mb-4 sm:mb-6">
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4",
                  `bg-gradient-to-br ${statusColors[formData.status].icon}`
                )}>
                  {React.createElement(statusIcons[formData.status], {
                    className: "text-white",
                    size: 20,
                    strokeWidth: 2.5
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Revisar relatório mensal..."
                  required
                  className="text-sm sm:text-base"
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                    rows={3}
                    placeholder="Adicione detalhes sobre esta tarefa..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(statusLabels).map(([key, label]) => {
                        const Icon = statusIcons[key as Task['status']]
                        const colors = statusColors[key as Task['status']]
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, status: key as Task['status'] })}
                            className={cn(
                              "flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs",
                              formData.status === key
                                ? `bg-gradient-to-r ${colors.icon} text-white shadow-md`
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            )}
                          >
                            <Icon size={14} />
                            <span className="hidden sm:inline truncate">{label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Prioridade
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(priorityColors).map(([key, colors]) => {
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: key as Task['priority'] })}
                            className={cn(
                              "flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs",
                              formData.priority === key
                                ? `bg-gradient-to-r ${colors.icon} text-white shadow-md`
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            )}
                          >
                            <AlertCircle size={14} />
                            <span className="hidden sm:inline truncate">{colors.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <Input
                  label="Data de Vencimento"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="text-sm sm:text-base"
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Link2 size={16} />
                    Vincular a Tarefa Pai (opcional)
                  </label>
                  <select
                    value={formData.parentTaskId}
                    onChange={(e) => setFormData({ ...formData, parentTaskId: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                  >
                    <option value="">Nenhuma tarefa pai</option>
                    {availableParentTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title} {task.dueDate ? `(até ${format(new Date(task.dueDate), 'dd/MM', { locale: ptBR })})` : ''}
                      </option>
                    ))}
                  </select>
                  {formData.parentTaskId && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Esta tarefa será uma subtarefa da tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingTask ? 'Salvar' : 'Adicionar'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                    className="flex-1 w-full sm:w-auto"
                    size="md"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                isPast(new Date(task.dueDate)) &&
                task.status !== 'done'
              const statusConfig = statusColors[task.status]
              const priorityConfig = priorityColors[task.priority]
              const subTasks = getSubTasks(task.id)
              const parentTask = task.parentTaskId ? getTaskById(task.parentTaskId) : null

              return (
                <Card key={task.id} id={`task-${task.id}`} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg overflow-hidden",
                  `border-l-4 bg-gradient-to-r ${statusConfig.bg} ${statusConfig.border}`
                )}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              status: task.status === 'done' ? 'todo' : 'done',
                              completedAt:
                                task.status === 'done'
                                  ? undefined
                                  : new Date().toISOString(),
                            })
                          }
                          className={cn(
                            "p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0 active:scale-95",
                            task.status === 'done'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-success-100 dark:hover:bg-success-900/30'
                          )}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                            <h3 className={cn(
                              "text-sm sm:text-base md:text-lg font-bold break-words flex-1 min-w-0",
                              task.status === 'done' 
                                ? 'line-through text-slate-500 dark:text-slate-400' 
                                : 'text-slate-900 dark:text-white'
                            )}>
                              {task.title}
                            </h3>
                            {parentTask && (
                              <Link
                                href="/produtividade/tarefas"
                                className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] sm:text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setTimeout(() => {
                                    const element = document.getElementById(`task-${task.parentTaskId}`)
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                  }, 100)
                                }}
                              >
                                <Link2 size={10} />
                                <span className="truncate max-w-[100px] sm:max-w-none">{parentTask.title}</span>
                              </Link>
                            )}
                          </div>
                          {task.description && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 break-words">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
                        <span className={cn(
                          "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap",
                          `bg-gradient-to-r ${priorityConfig.icon} text-white`
                        )}>
                          {priorityConfig.label}
                        </span>
                        <span className={cn(
                          "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap",
                          `bg-gradient-to-r ${statusConfig.icon} text-white`
                        )}>
                          {statusLabels[task.status]}
                        </span>
                        {task.dueDate && (
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg whitespace-nowrap",
                            isOverdue
                              ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400'
                              : isToday(new Date(task.dueDate))
                              ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          )}>
                            <Calendar size={10} className="flex-shrink-0" />
                            <span className="truncate">{format(new Date(task.dueDate), "dd 'de' MMM", { locale: ptBR })} ({getDateLabel(task.dueDate)})</span>
                          </span>
                        )}
                        {subTasks.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 whitespace-nowrap">
                            <Link2 size={10} className="flex-shrink-0" />
                            {subTasks.length} subtarefa{subTasks.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={12} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                            deleteTask(task.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={12} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center">
              <CheckSquare className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || filter !== 'all' || priorityFilter !== 'all'
                  ? 'Nenhuma tarefa encontrada'
                  : 'Nenhuma tarefa cadastrada ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || filter !== 'all' || priorityFilter !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && filter === 'all' && priorityFilter === 'all' && (
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  size="md"
                >
                  <Plus size={16} className="mr-2" />
                  Nova Tarefa
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
