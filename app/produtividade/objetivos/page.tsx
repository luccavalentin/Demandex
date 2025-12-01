'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { ProductivityGoal } from '@/types'
import { Plus, Trash2, Edit2, Target, CheckCircle2, X, Search, Link2, Filter, CheckSquare, BookOpen, FolderKanban, TrendingUp, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ObjetivosProdutividadePage() {
  const { productivityGoals, tasks, addProductivityGoal, updateProductivityGoal, deleteProductivityGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<ProductivityGoal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | ProductivityGoal['type']>('all')
  const [formData, setFormData] = useState({
    type: 'tasks' as ProductivityGoal['type'],
    title: '',
    description: '',
    targetValue: '',
    currentValue: '0',
    deadline: '',
    taskId: '',
  })

  const handleOpenModal = (type?: ProductivityGoal['type']) => {
    setFormData({
      type: type || 'tasks',
      title: '',
      description: '',
      targetValue: '',
      currentValue: '0',
      deadline: '',
      taskId: '',
    })
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: ProductivityGoal = {
      id: editingGoal?.id || Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      targetValue: parseInt(formData.targetValue),
      currentValue: parseInt(formData.currentValue),
      deadline: formData.deadline || undefined,
      taskId: formData.taskId || undefined,
      completed: editingGoal?.completed || false,
    }

    if (editingGoal) {
      updateProductivityGoal(editingGoal.id, goal)
    } else {
      addProductivityGoal(goal)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      type: 'tasks',
      title: '',
      description: '',
      targetValue: '',
      currentValue: '0',
      deadline: '',
      taskId: '',
    })
    setEditingGoal(null)
    setIsModalOpen(false)
  }

  const handleEdit = (goal: ProductivityGoal) => {
    setEditingGoal(goal)
    setFormData({
      type: goal.type,
      title: goal.title,
      description: goal.description || '',
      targetValue: goal.targetValue.toString(),
      currentValue: goal.currentValue.toString(),
      deadline: goal.deadline || '',
      taskId: goal.taskId || '',
    })
    setIsModalOpen(true)
  }

  const goalTypes = {
    tasks: { 
      label: 'Tarefas', 
      icon: CheckSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100/80',
    },
    study: { 
      label: 'Estudos', 
      icon: BookOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100/80',
    },
    project: { 
      label: 'Projetos', 
      icon: FolderKanban,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100/80',
    },
  }

  const filteredGoals = useMemo(() => {
    return productivityGoals.filter((goal) => {
      // Filtro por tipo
      const typeMatch = filterType === 'all' || goal.type === filterType
      
      // Filtro por busca
      const searchMatch = !searchQuery || 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return typeMatch && searchMatch
    })
  }, [productivityGoals, filterType, searchQuery])

  // Estatísticas
  const stats = useMemo(() => {
    const all = productivityGoals.length
    const completed = productivityGoals.filter(g => g.completed).length
    const inProgress = productivityGoals.filter(g => !g.completed).length
    const totalProgress = productivityGoals.reduce((sum, g) => {
      const progress = g.targetValue > 0 ? (g.currentValue / g.targetValue) * 100 : 0
      return sum + progress
    }, 0)
    const avgProgress = all > 0 ? totalProgress / all : 0

    return { all, completed, inProgress, avgProgress }
  }, [productivityGoals])

  const getProgress = (goal: ProductivityGoal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-success-500 via-success-600 to-success-700 flex items-center justify-center shadow-lg shadow-success-500/30">
              <Target className="text-white" size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Objetivos de Produtividade
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Defina e acompanhe suas metas de produtividade
              </p>
            </div>
          </div>

          {/* Botões Rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {Object.entries(goalTypes).map(([key, typeConfig]) => {
              const Icon = typeConfig.icon
              return (
                <Button
                  key={key}
                  onClick={() => handleOpenModal(key as ProductivityGoal['type'])}
                  className={cn(
                    "w-full bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4",
                    typeConfig.color
                  )}
                  size="md"
                >
                  <Icon size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Novo {typeConfig.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200/70 dark:border-slate-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200/50 flex-shrink-0">
                <Target className="text-white" size={12} strokeWidth={2.5} />
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
            "bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border-success-200/70 dark:border-success-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md ring-2 ring-success-200/50 flex-shrink-0">
                <CheckCircle2 className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Concluídos</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-success-700 dark:text-success-400 truncate">
                  {stats.completed}
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
                <TrendingUp className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Em Andamento</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-700 dark:text-blue-400 truncate">
                  {stats.inProgress}
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
                <TrendingUp className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Progresso Médio</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-warning-700 dark:text-warning-400 truncate">
                  {stats.avgProgress.toFixed(0)}%
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
                placeholder="Buscar objetivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base w-full"
              />
            </div>

            {/* Filtro de Tipo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Filter size={14} />
                Filtros
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {(['all', 'tasks', 'study', 'project'] as const).map((type) => {
                  const typeConfig = type === 'all' 
                    ? { icon: Filter, color: 'from-slate-500 to-slate-600', label: 'Todos' }
                    : goalTypes[type]
                  const Icon = typeConfig.icon
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={cn(
                        "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0",
                        filterType === type
                          ? `bg-gradient-to-r ${typeConfig.color} text-white shadow-md`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      <Icon size={12} className="flex-shrink-0" />
                      <span className="truncate">{typeConfig.label}</span>
                    </button>
                  )
                })}
              </div>
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
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(goalTypes).map(([key, typeConfig]) => {
                      const Icon = typeConfig.icon
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: key as ProductivityGoal['type'] })}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs",
                            formData.type === key
                              ? `bg-gradient-to-r ${typeConfig.color} text-white shadow-md`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon size={14} />
                          <span className="hidden sm:inline truncate">{typeConfig.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Completar 50 tarefas este mês..."
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
                    placeholder="Adicione detalhes sobre este objetivo..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Valor Atual"
                    type="number"
                    min="0"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                  <Input
                    label="Meta"
                    type="number"
                    min="1"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
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
                    className="input-field text-sm sm:text-base w-full"
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

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => {
              const progress = getProgress(goal)
              const typeConfig = goalTypes[goal.type]
              const linkedTask = goal.taskId ? getTaskById(goal.taskId) : null

              return (
                <Card key={goal.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg overflow-hidden",
                  `border-l-4 bg-gradient-to-r ${typeConfig.bgColor} border-${typeConfig.color.split('-')[1]}-200/70`
                )}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0",
                          `bg-gradient-to-br ${typeConfig.color}`
                        )}>
                          {React.createElement(typeConfig.icon, {
                            className: "text-white",
                            size: 16,
                            strokeWidth: 2.5
                          })}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white break-words flex-1 min-w-0">
                          {goal.title}
                        </h3>
                      </div>
                      {goal.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 break-words">
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
                        <Edit2 size={12} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este objetivo?')) {
                            deleteProductivityGoal(goal.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={12} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-2 sm:mb-3">
                    <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Progresso</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          progress >= 100 ? 'bg-success-500' : 'bg-primary-500'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                      {progress.toFixed(0)}%
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className={cn(
                      "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap",
                      `bg-gradient-to-r ${typeConfig.color} text-white`
                    )}>
                      {typeConfig.label}
                    </span>
                    {goal.deadline && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <Calendar size={10} className="flex-shrink-0" />
                        {format(new Date(goal.deadline), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] sm:text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Link2 size={10} />
                        <span className="truncate max-w-[100px] sm:max-w-none">{linkedTask.title}</span>
                      </Link>
                    )}
                  </div>
                  <Button
                    onClick={() =>
                      updateProductivityGoal(goal.id, {
                        currentValue: Math.min(goal.currentValue + 1, goal.targetValue),
                        completed: goal.currentValue + 1 >= goal.targetValue,
                      })
                    }
                    className={cn(
                      "w-full mt-2 sm:mt-3 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2",
                      goal.completed
                        ? 'bg-success-500 hover:bg-success-600 text-white'
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                    )}
                    disabled={goal.completed}
                    size="sm"
                  >
                    {goal.completed ? (
                      <>
                        <CheckCircle2 size={14} className="mr-2" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <TrendingUp size={14} className="mr-2" />
                        Atualizar Progresso (+1)
                      </>
                    )}
                  </Button>
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
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-gradient-to-r from-success-500 to-success-600 text-white"
                  size="md"
                >
                  <Plus size={16} className="mr-2" />
                  Novo Objetivo
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
