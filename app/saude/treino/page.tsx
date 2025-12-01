'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Workout, Task } from '@/types'
import { Plus, Trash2, Edit2, Dumbbell, X, Search, Activity, Zap, Heart, Link2, Clock, Wind } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { DateFilter, type DateRange } from '@/components/UI/DateFilter'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function TreinoPage() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, tasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: 'cardio' as Workout['type'],
    duration: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    taskId: '',
  })

  const handleOpenModal = (type?: Workout['type']) => {
    setFormData({
      name: '',
      type: type || 'cardio',
      duration: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      taskId: '',
    })
    setEditingWorkout(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const workout: Workout = {
      id: editingWorkout?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      duration: parseInt(formData.duration),
      date: formData.date,
      notes: formData.notes || undefined,
      taskId: formData.taskId || undefined,
    }

    if (editingWorkout) {
      updateWorkout(editingWorkout.id, workout)
    } else {
      addWorkout(workout)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'cardio',
      duration: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      taskId: '',
    })
    setEditingWorkout(null)
    setIsModalOpen(false)
  }

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout)
    setFormData({
      name: workout.name,
      type: workout.type,
      duration: workout.duration.toString(),
      date: workout.date,
      notes: workout.notes || '',
      taskId: workout.taskId || '',
    })
    setIsModalOpen(true)
  }

  const workoutTypes = {
    cardio: { 
      label: 'Cardio', 
      icon: Heart, 
      color: 'from-red-500 to-pink-500', 
      bgColor: 'from-red-50 to-pink-50',
      description: 'Corrida, ciclismo, natação...'
    },
    strength: { 
      label: 'Força', 
      icon: Dumbbell, 
      color: 'from-blue-500 to-indigo-500', 
      bgColor: 'from-blue-50 to-indigo-50',
      description: 'Musculação, levantamento...'
    },
    flexibility: { 
      label: 'Flexibilidade', 
      icon: Wind, 
      color: 'from-purple-500 to-violet-500', 
      bgColor: 'from-purple-50 to-violet-50',
      description: 'Yoga, pilates, alongamento...'
    },
    other: { 
      label: 'Outro', 
      icon: Activity, 
      color: 'from-gray-500 to-slate-500', 
      bgColor: 'from-gray-50 to-slate-50',
      description: 'Outros tipos de exercício'
    },
  }

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      // Filtro de data
      if (dateRange.start && dateRange.end) {
        const workoutDate = new Date(workout.date)
        if (workoutDate < dateRange.start || workoutDate > dateRange.end) {
          return false
        }
      }

      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          workout.name.toLowerCase().includes(query) ||
          workout.notes?.toLowerCase().includes(query) ||
          workoutTypes[workout.type].label.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [workouts, dateRange, searchQuery])

  const sortedWorkouts = useMemo(() => {
    return [...filteredWorkouts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredWorkouts])

  // Estatísticas
  const todayWorkouts = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return workouts.filter(w => w.date === today)
  }, [workouts])

  const totalMinutesToday = useMemo(() => {
    return todayWorkouts.reduce((sum, w) => sum + w.duration, 0)
  }, [todayWorkouts])

  const totalMinutesWeek = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return workouts
      .filter(w => new Date(w.date) >= weekAgo)
      .reduce((sum, w) => sum + w.duration, 0)
  }, [workouts])

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Dumbbell className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Treino
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Registre seus exercícios e acompanhe seu progresso
              </p>
            </div>
          </div>

          {/* Botões Rápidos por Tipo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {Object.entries(workoutTypes).map(([key, workoutType]) => {
              const Icon = workoutType.icon
              const typeKey = key as Workout['type']
              return (
                <Button
                  key={key}
                  onClick={() => handleOpenModal(typeKey)}
                  className={cn(
                    "w-full bg-gradient-to-r text-white shadow-lg transition-all duration-200",
                    "hover:shadow-xl active:scale-95",
                    workoutType.color
                  )}
                  size="md"
                >
                  <Icon size={18} className="mr-2" />
                  <span className="text-sm sm:text-base">{workoutType.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/70 dark:border-blue-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-200/50 flex-shrink-0">
                <Dumbbell className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Treinos Hoje</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {todayWorkouts.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/70 dark:border-red-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg ring-2 ring-red-200/50 flex-shrink-0">
                <Clock className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Minutos Hoje</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-700 dark:text-red-400">
                  {totalMinutesToday} min
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200/70 dark:border-purple-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-200/50 flex-shrink-0">
                <Zap className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Esta Semana</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {totalMinutesWeek} min
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="p-3 sm:p-4 md:p-5">
          <div className="space-y-3 sm:space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar treinos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>

            {/* Filtro de Data */}
            <div className="w-full">
              <DateFilter onFilterChange={setDateRange} />
            </div>
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
                  `bg-gradient-to-br ${workoutTypes[formData.type].color}`
                )}>
                  {React.createElement(workoutTypes[formData.type].icon, {
                    className: "text-white",
                    size: 20,
                    strokeWidth: 2.5
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingWorkout ? 'Editar Treino' : `Novo Treino - ${workoutTypes[formData.type].label}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {workoutTypes[formData.type].description}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Treino
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(workoutTypes).map(([key, workoutType]) => {
                      const Icon = workoutType.icon
                      const typeKey = key as Workout['type']
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: typeKey })}
                          className={cn(
                            "flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm",
                            formData.type === typeKey
                              ? `bg-gradient-to-r ${workoutType.color} text-white shadow-md`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon size={14} />
                          {workoutType.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <Input
                  label="Nome do Treino"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Corrida matinal, Treino de força..."
                  required
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Duração (minutos)"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  required
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="text-sm sm:text-base"
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field text-sm sm:text-base"
                    rows={3}
                    placeholder="Ex: 5km no parque, 3 séries de 10..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Link2 size={16} />
                    Vincular a Tarefa (opcional)
                  </label>
                  <select
                    value={formData.taskId}
                    onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                    className="input-field text-sm sm:text-base"
                  >
                    <option value="">Nenhuma tarefa</option>
                    {availableTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title} {task.dueDate ? `(até ${format(new Date(task.dueDate), 'dd/MM', { locale: ptBR })})` : ''}
                      </option>
                    ))}
                  </select>
                  {formData.taskId && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Este treino será vinculado à tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingWorkout ? 'Salvar' : 'Adicionar'}
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

        {/* Workouts List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedWorkouts.length > 0 ? (
            sortedWorkouts.map((workout) => {
              const workoutType = workoutTypes[workout.type]
              const linkedTask = workout.taskId ? getTaskById(workout.taskId) : null
              return (
                <Card key={workout.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                  `border-l-4 bg-gradient-to-r ${workoutType.bgColor}`
                )}>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
                          `bg-gradient-to-br ${workoutType.color}`
                        )}>
                          {React.createElement(workoutType.icon, {
                            className: "text-white",
                            size: 16,
                            strokeWidth: 2.5
                          })}
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-semibold",
                          `bg-gradient-to-r ${workoutType.color} text-white`
                        )}>
                          {workoutType.label}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 break-words">
                        {workout.name}
                      </h3>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(workout)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={14} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este treino?')) {
                            deleteWorkout(workout.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={14} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <Clock size={14} />
                      <span>
                        {format(new Date(workout.date), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock size={14} />
                      {workout.duration} minutos
                    </p>
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Link2 size={12} />
                        {linkedTask.title}
                      </Link>
                    )}
                    {workout.notes && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {workout.notes}
                      </p>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <Dumbbell className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || dateRange.start
                  ? 'Nenhum treino encontrado'
                  : 'Nenhum treino registrado ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || dateRange.start
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && !dateRange.start && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  {Object.entries(workoutTypes).slice(0, 2).map(([key, workoutType]) => {
                    const Icon = workoutType.icon
                    return (
                      <Button
                        key={key}
                        onClick={() => handleOpenModal(key as Workout['type'])}
                        className={cn(
                          "w-full sm:w-auto bg-gradient-to-r text-white text-sm sm:text-base",
                          workoutType.color
                        )}
                        size="md"
                      >
                        <Icon size={16} className="mr-2" />
                        {workoutType.label}
                      </Button>
                    )
                  })}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
