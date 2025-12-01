'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { HealthGoal, Task } from '@/types'
import { Plus, Trash2, Edit2, Target, CheckCircle2, X, Search, Link2, TrendingUp, Calendar, Apple, Dumbbell, Moon } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ObjetivosSaudePage() {
  const { healthGoals, addHealthGoal, updateHealthGoal, deleteHealthGoal, tasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'nutrition' | 'fitness' | 'sleep'>('all')
  const [formData, setFormData] = useState({
    type: 'nutrition' as HealthGoal['type'],
    title: '',
    description: '',
    targetValue: '',
    currentValue: '0',
    unit: '',
    deadline: '',
    taskId: '',
  })

  const handleOpenModal = (type?: HealthGoal['type']) => {
    setFormData({
      type: type || 'nutrition',
      title: '',
      description: '',
      targetValue: '',
      currentValue: '0',
      unit: '',
      deadline: '',
      taskId: '',
    })
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: HealthGoal = {
      id: editingGoal?.id || Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      unit: formData.unit,
      deadline: formData.deadline || undefined,
      completed: false,
      taskId: formData.taskId || undefined,
    }

    if (editingGoal) {
      updateHealthGoal(editingGoal.id, goal)
    } else {
      addHealthGoal(goal)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      type: 'nutrition',
      title: '',
      description: '',
      targetValue: '',
      currentValue: '0',
      unit: '',
      deadline: '',
      taskId: '',
    })
    setEditingGoal(null)
    setIsModalOpen(false)
  }

  const handleEdit = (goal: HealthGoal) => {
    setEditingGoal(goal)
    setFormData({
      type: goal.type,
      title: goal.title,
      description: goal.description || '',
      targetValue: goal.targetValue.toString(),
      currentValue: goal.currentValue.toString(),
      unit: goal.unit,
      deadline: goal.deadline || '',
      taskId: goal.taskId || '',
    })
    setIsModalOpen(true)
  }

  const goalTypes = {
    nutrition: { 
      label: 'Nutrição', 
      icon: Apple, 
      color: 'from-success-500 to-success-600',
      bgColor: 'from-success-50 to-success-100/80',
      description: 'Metas relacionadas à alimentação'
    },
    fitness: { 
      label: 'Fitness', 
      icon: Dumbbell, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100/80',
      description: 'Metas relacionadas a exercícios'
    },
    sleep: { 
      label: 'Sono', 
      icon: Moon, 
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100/80',
      description: 'Metas relacionadas ao sono'
    },
  }

  const filteredGoals = useMemo(() => {
    return healthGoals.filter((goal) => {
      // Filtro de tipo
      if (filterType !== 'all' && goal.type !== filterType) {
        return false
      }

      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          goal.title.toLowerCase().includes(query) ||
          goal.description?.toLowerCase().includes(query) ||
          goalTypes[goal.type].label.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [healthGoals, filterType, searchQuery])

  const getProgress = (goal: HealthGoal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  // Estatísticas
  const totalGoals = useMemo(() => healthGoals.length, [healthGoals])
  const completedGoals = useMemo(() => healthGoals.filter(g => g.completed).length, [healthGoals])
  const inProgressGoals = useMemo(() => healthGoals.filter(g => !g.completed).length, [healthGoals])
  const averageProgress = useMemo(() => {
    if (healthGoals.length === 0) return 0
    const total = healthGoals.reduce((sum, g) => sum + getProgress(g), 0)
    return Math.round(total / healthGoals.length)
  }, [healthGoals])

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
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-success-500 via-success-600 to-success-700 flex items-center justify-center shadow-lg shadow-success-500/30">
              <Target className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Objetivos de Saúde
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Defina e acompanhe suas metas de saúde
              </p>
            </div>
          </div>

          {/* Botões Rápidos por Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {Object.entries(goalTypes).map(([key, goalType]) => {
              const Icon = goalType.icon
              const typeKey = key as HealthGoal['type']
              return (
                <Button
                  key={key}
                  onClick={() => handleOpenModal(typeKey)}
                  className={cn(
                    "w-full bg-gradient-to-r text-white shadow-lg transition-all duration-200",
                    "hover:shadow-xl active:scale-95",
                    goalType.color
                  )}
                  size="md"
                >
                  <Icon size={18} className="mr-2" />
                  <span className="text-sm sm:text-base">{goalType.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200/70 dark:border-primary-700/40 shadow-lg">
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700 dark:text-primary-400">
                {totalGoals}
              </p>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border border-success-200/70 dark:border-success-700/40 shadow-lg">
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Concluídos</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-success-700 dark:text-success-400">
                {completedGoals}
              </p>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-warning-50 to-warning-100/80 dark:from-warning-900/20 dark:to-warning-800/20 border border-warning-200/70 dark:border-warning-700/40 shadow-lg">
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Em Andamento</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning-700 dark:text-warning-400">
                {inProgressGoals}
              </p>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/70 dark:border-blue-700/40 shadow-lg">
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Progresso Médio</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">
                {averageProgress}%
              </p>
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
                placeholder="Buscar objetivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>

            {/* Filtro de Tipo */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              <button
                onClick={() => setFilterType('all')}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0",
                  filterType === 'all'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                Todos
              </button>
              {Object.entries(goalTypes).map(([key, goalType]) => {
                const Icon = goalType.icon
                return (
                  <button
                    key={key}
                    onClick={() => setFilterType(key as HealthGoal['type'])}
                    className={cn(
                      "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0",
                      filterType === key
                        ? `bg-gradient-to-r ${goalType.color} text-white shadow-md`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}
                  >
                    <Icon size={14} />
                    <span>{goalType.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-4"
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
                  `bg-gradient-to-br ${goalTypes[formData.type].color}`
                )}>
                  {React.createElement(goalTypes[formData.type].icon, {
                    className: "text-white",
                    size: 20,
                    strokeWidth: 2.5
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingGoal ? 'Editar Objetivo' : `Novo Objetivo - ${goalTypes[formData.type].label}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {goalTypes[formData.type].description}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Objetivo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(goalTypes).map(([key, goalType]) => {
                      const Icon = goalType.icon
                      const typeKey = key as HealthGoal['type']
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: typeKey })}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm",
                            formData.type === typeKey
                              ? `bg-gradient-to-r ${goalType.color} text-white shadow-md`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon size={16} />
                          {goalType.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Perder 5kg, Dormir 8h..."
                  required
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada do objetivo..."
                  className="text-sm sm:text-base"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Valor Atual"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                  <Input
                    label="Meta"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
                <Input
                  label="Unidade"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="ex: kg, horas, dias, calorias..."
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Prazo (opcional)"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="text-sm sm:text-base"
                />
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
                      Este objetivo será vinculado à tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingGoal ? 'Salvar' : 'Adicionar'}
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

        {/* Goals List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => {
              const progress = getProgress(goal)
              const goalType = goalTypes[goal.type]
              const linkedTask = goal.taskId ? getTaskById(goal.taskId) : null
              return (
                <Card key={goal.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                  `border-l-4 bg-gradient-to-r ${goalType.bgColor}`,
                  goal.completed && 'opacity-75'
                )}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
                          `bg-gradient-to-br ${goalType.color}`
                        )}>
                          {React.createElement(goalType.icon, {
                            className: "text-white",
                            size: 16,
                            strokeWidth: 2.5
                          })}
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-semibold",
                          `bg-gradient-to-r ${goalType.color} text-white`
                        )}>
                          {goalType.label}
                        </span>
                        {goal.completed && (
                          <CheckCircle2 size={16} className="text-success-600" />
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 break-words">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={14} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este objetivo?')) {
                            deleteHealthGoal(goal.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={14} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            progress >= 100 
                              ? 'bg-gradient-to-r from-success-500 to-success-600' 
                              : progress >= 70
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                              : 'bg-gradient-to-r from-warning-500 to-warning-600'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                        {Math.round(progress)}%
                      </p>
                    </div>
                    {goal.deadline && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} />
                        <span>
                          Prazo: {format(new Date(goal.deadline), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
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
                    <button
                      onClick={() =>
                        updateHealthGoal(goal.id, {
                          currentValue: Math.min(
                            goal.currentValue + (goal.targetValue * 0.1),
                            goal.targetValue
                          ),
                          completed: goal.currentValue + (goal.targetValue * 0.1) >= goal.targetValue,
                        })
                      }
                      className={cn(
                        "w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2",
                        goal.completed
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md active:scale-95'
                      )}
                      disabled={goal.completed}
                    >
                      {goal.completed ? (
                        <>
                          <CheckCircle2 size={16} />
                          Concluído
                        </>
                      ) : (
                        <>
                          <TrendingUp size={16} />
                          Atualizar Progresso (+10%)
                        </>
                      )}
                    </button>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <Target className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || filterType !== 'all'
                  ? 'Nenhum objetivo encontrado'
                  : 'Nenhum objetivo cadastrado ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || filterType !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && filterType === 'all' && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  {Object.entries(goalTypes).slice(0, 2).map(([key, goalType]) => {
                    const Icon = goalType.icon
                    return (
                      <Button
                        key={key}
                        onClick={() => handleOpenModal(key as HealthGoal['type'])}
                        className={cn(
                          "w-full sm:w-auto bg-gradient-to-r text-white text-sm sm:text-base",
                          goalType.color
                        )}
                        size="md"
                      >
                        <Icon size={16} className="mr-2" />
                        {goalType.label}
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
