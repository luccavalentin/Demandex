'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Meal, Task } from '@/types'
import { Plus, Trash2, Edit2, UtensilsCrossed, X, Coffee, Sun, Moon, Cookie, Search, Link2 } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { DateFilter, type DateRange } from '@/components/UI/DateFilter'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function AlimentacaoPage() {
  const { meals, addMeal, updateMeal, deleteMeal, tasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    type: 'breakfast' as Meal['type'],
    name: '',
    calories: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    taskId: '',
  })

  const handleOpenModal = (type?: Meal['type']) => {
    setFormData({
      type: type || 'breakfast',
      name: '',
      calories: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      taskId: '',
    })
    setEditingMeal(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const meal: Meal = {
      id: editingMeal?.id || Date.now().toString(),
      type: formData.type,
      name: formData.name,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      date: formData.date,
      notes: formData.notes || undefined,
      taskId: formData.taskId || undefined,
    }

    if (editingMeal) {
      updateMeal(editingMeal.id, meal)
    } else {
      addMeal(meal)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      type: 'breakfast',
      name: '',
      calories: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      taskId: '',
    })
    setEditingMeal(null)
    setIsModalOpen(false)
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
    setFormData({
      type: meal.type,
      name: meal.name,
      calories: meal.calories?.toString() || '',
      date: meal.date,
      notes: meal.notes || '',
      taskId: meal.taskId || '',
    })
    setIsModalOpen(true)
  }

  const mealTypes = {
    breakfast: { label: 'Café da Manhã', icon: Coffee, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50' },
    lunch: { label: 'Almoço', icon: Sun, color: 'from-yellow-500 to-amber-500', bgColor: 'from-yellow-50 to-amber-50' },
    dinner: { label: 'Jantar', icon: Moon, color: 'from-indigo-500 to-purple-500', bgColor: 'from-indigo-50 to-purple-50' },
    snack: { label: 'Lanche', icon: Cookie, color: 'from-pink-500 to-rose-500', bgColor: 'from-pink-50 to-rose-50' },
  }

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Filtro de data
      if (dateRange.start && dateRange.end) {
        const mealDate = new Date(meal.date)
        if (mealDate < dateRange.start || mealDate > dateRange.end) {
          return false
        }
      }

      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          meal.name.toLowerCase().includes(query) ||
          meal.notes?.toLowerCase().includes(query) ||
          mealTypes[meal.type].label.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [meals, dateRange, searchQuery])

  const sortedMeals = useMemo(() => {
    return [...filteredMeals].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredMeals])

  // Estatísticas
  const todayMeals = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return meals.filter(m => m.date === today)
  }, [meals])

  const totalCaloriesToday = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0)
  }, [todayMeals])

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
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Alimentação
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Registre suas refeições e acompanhe sua nutrição
              </p>
            </div>
          </div>

          {/* Botões Rápidos por Tipo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {Object.entries(mealTypes).map(([key, mealType]) => {
              const Icon = mealType.icon
              const typeKey = key as Meal['type']
              return (
                <Button
                  key={key}
                  onClick={() => handleOpenModal(typeKey)}
                  className={cn(
                    "w-full bg-gradient-to-r text-white shadow-lg transition-all duration-200",
                    "hover:shadow-xl active:scale-95",
                    mealType.color
                  )}
                  size="md"
                >
                  <Icon size={18} className="mr-2" />
                  <span className="text-sm sm:text-base">{mealType.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/70 dark:border-orange-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-orange-200/50 flex-shrink-0">
                <UtensilsCrossed className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Refeições Hoje</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {todayMeals.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200/70 dark:border-amber-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg ring-2 ring-amber-200/50 flex-shrink-0">
                <Cookie className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Calorias Hoje</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {totalCaloriesToday || 0} kcal
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
                placeholder="Buscar refeições..."
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
                  `bg-gradient-to-br ${mealTypes[formData.type].color}`
                )}>
                  {React.createElement(mealTypes[formData.type].icon, {
                    className: "text-white",
                    size: 20,
                    strokeWidth: 2.5
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingMeal ? 'Editar Refeição' : `Nova ${mealTypes[formData.type].label}`}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Refeição
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(mealTypes).map(([key, mealType]) => {
                      const Icon = mealType.icon
                      const typeKey = key as Meal['type']
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: typeKey })}
                          className={cn(
                            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base",
                            formData.type === typeKey
                              ? `bg-gradient-to-r ${mealType.color} text-white shadow-md`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon size={16} />
                          {mealType.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <Input
                  label="Nome da Refeição"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Salada com frango grelhado..."
                  required
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Calorias (opcional)"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="0"
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
                    placeholder="Ex: Refeição leve, sem glúten..."
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
                      Esta refeição será vinculada à tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingMeal ? 'Salvar' : 'Adicionar'}
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

        {/* Meals List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedMeals.length > 0 ? (
            sortedMeals.map((meal) => {
              const mealType = mealTypes[meal.type]
              const linkedTask = meal.taskId ? getTaskById(meal.taskId) : null
              return (
                <Card key={meal.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                  `border-l-4 bg-gradient-to-r ${mealType.bgColor}`
                )}>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
                          `bg-gradient-to-br ${mealType.color}`
                        )}>
                          {React.createElement(mealType.icon, {
                            className: "text-white",
                            size: 16,
                            strokeWidth: 2.5
                          })}
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-semibold",
                          `bg-gradient-to-r ${mealType.color} text-white`
                        )}>
                          {mealType.label}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 break-words">
                        {meal.name}
                      </h3>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(meal)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={14} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta refeição?')) {
                            deleteMeal(meal.id)
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
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {format(new Date(meal.date), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    {meal.calories && (
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        🔥 {meal.calories} calorias
                      </p>
                    )}
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Link2 size={12} />
                        {linkedTask.title}
                      </Link>
                    )}
                    {meal.notes && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {meal.notes}
                      </p>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <UtensilsCrossed className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || dateRange.start
                  ? 'Nenhuma refeição encontrada'
                  : 'Nenhuma refeição cadastrada ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || dateRange.start
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && !dateRange.start && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  {Object.entries(mealTypes).slice(0, 2).map(([key, mealType]) => {
                    const Icon = mealType.icon
                    return (
                      <Button
                        key={key}
                        onClick={() => handleOpenModal(key as Meal['type'])}
                        className={cn(
                          "w-full sm:w-auto bg-gradient-to-r text-white text-sm sm:text-base",
                          mealType.color
                        )}
                        size="md"
                      >
                        <Icon size={16} className="mr-2" />
                        {mealType.label}
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
