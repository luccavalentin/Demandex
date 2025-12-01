'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { AttractionGoal } from '@/types'
import { Plus, Trash2, Edit2, Sparkles, CheckCircle2, X, Search, Link2, Filter, Star, Calendar, Heart, Target, Wand2 } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ObjetivosLeiAtracaoPage() {
  const { attractionGoals, tasks, addAttractionGoal, updateAttractionGoal, deleteAttractionGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<AttractionGoal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    taskId: '',
  })

  const handleOpenModal = () => {
    setFormData({ title: '', description: '', notes: '', taskId: '' })
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: AttractionGoal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      notes: formData.notes || undefined,
      images: editingGoal?.images || [],
      links: editingGoal?.links || [],
      taskId: formData.taskId || undefined,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      completed: editingGoal?.completed || false,
    }

    if (editingGoal) {
      updateAttractionGoal(editingGoal.id, goal)
    } else {
      addAttractionGoal(goal)
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', notes: '', taskId: '' })
    setEditingGoal(null)
    setIsModalOpen(false)
  }

  const handleEdit = (goal: AttractionGoal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description || '',
      notes: goal.notes || '',
      taskId: goal.taskId || '',
    })
    setIsModalOpen(true)
  }

  const filteredGoals = useMemo(() => {
    return attractionGoals.filter((goal) => {
      // Filtro por status
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'completed' && goal.completed) ||
        (filterStatus === 'active' && !goal.completed)
      
      // Filtro por busca
      const searchMatch = !searchQuery || 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return statusMatch && searchMatch
    })
  }, [attractionGoals, filterStatus, searchQuery])

  // Estatísticas
  const stats = useMemo(() => {
    const all = attractionGoals.length
    const completed = attractionGoals.filter(g => g.completed).length
    const active = attractionGoals.filter(g => !g.completed).length
    const completionRate = all > 0 ? Math.round((completed / all) * 100) : 0

    return { all, completed, active, completionRate }
  }, [attractionGoals])

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
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="text-white" size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                Lei da Atração
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
                Registre seus sonhos e objetivos e manifeste sua realidade
              </p>
            </div>
          </div>

          {/* Botão Rápido */}
          <div className="flex justify-center">
            <Button
              onClick={handleOpenModal}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              size="md"
            >
              <Plus size={16} className="mr-2" />
              Novo Objetivo
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-purple-50 to-purple-100/80 border-purple-200/70"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md ring-2 ring-purple-200/50 flex-shrink-0">
                <Target className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Total</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-purple-700 truncate">
                  {stats.all}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-success-50 to-success-100/80 border-success-200/70"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md ring-2 ring-success-200/50 flex-shrink-0">
                <CheckCircle2 className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Manifestados</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-success-700 truncate">
                  {stats.completed}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-blue-50 to-blue-100/80 border-blue-200/70"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md ring-2 ring-blue-200/50 flex-shrink-0">
                <Heart className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Ativos</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-700 truncate">
                  {stats.active}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-warning-50 to-warning-100/80 border-warning-200/70"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-md ring-2 ring-warning-200/50 flex-shrink-0">
                <Star className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Taxa</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-warning-700 truncate">
                  {stats.completionRate}%
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

            {/* Filtro de Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                <Filter size={14} />
                Filtros
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {(['all', 'active', 'completed'] as const).map((status) => {
                  const labels = {
                    all: 'Todos',
                    active: 'Ativos',
                    completed: 'Manifestados',
                  }
                  const icons = {
                    all: Filter,
                    active: Heart,
                    completed: CheckCircle2,
                  }
                  const Icon = icons[status]
                  const colors = {
                    all: 'from-slate-500 to-slate-600',
                    active: 'from-blue-500 to-blue-600',
                    completed: 'from-success-500 to-success-600',
                  }
                  return (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={cn(
                        "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0",
                        filterStatus === status
                          ? `bg-gradient-to-r ${colors[status]} text-white shadow-md`
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      )}
                    >
                      <Icon size={12} className="flex-shrink-0" />
                      <span className="truncate">{labels[status]}</span>
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
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors z-10"
                aria-label="Fechar"
              >
                <X size={18} className="text-slate-600" />
              </button>
              <div className="mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4">
                  <Sparkles className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pr-8">
                  {editingGoal ? 'Editar Objetivo' : 'Novo Objetivo'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label="Título do Objetivo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Casa própria, Viagem dos sonhos..."
                  required
                  className="text-sm sm:text-base"
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                    rows={3}
                    placeholder="Descreva seu objetivo em detalhes..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Star size={16} />
                    Visualizações / Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                    rows={4}
                    placeholder="Descreva como você visualiza este objetivo se realizando... Use afirmações positivas e visualize o resultado final."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
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
                    <p className="text-xs text-slate-500 mt-1">
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
              const linkedTask = goal.taskId ? getTaskById(goal.taskId) : null
              return (
                <Card key={goal.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg overflow-hidden",
                  goal.completed
                    ? 'border-l-4 bg-gradient-to-r from-success-50 to-success-100/80 border-success-200/70'
                    : 'border-l-4 bg-gradient-to-r from-purple-50 to-purple-100/80 border-purple-200/70'
                )}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0",
                          goal.completed
                            ? 'bg-gradient-to-br from-success-500 to-success-600'
                            : 'bg-gradient-to-br from-purple-500 to-purple-600'
                        )}>
                          {goal.completed ? (
                            <CheckCircle2 className="text-white" size={16} strokeWidth={2.5} />
                          ) : (
                            <Sparkles className="text-white" size={16} strokeWidth={2.5} />
                          )}
                        </div>
                        <h3 className={cn(
                          "text-base sm:text-lg font-bold break-words flex-1 min-w-0",
                          goal.completed
                            ? 'line-through text-slate-500'
                            : 'text-slate-900'
                        )}>
                          {goal.title}
                        </h3>
                      </div>
                      {goal.description && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 break-words">
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={12} className="text-primary-600" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este objetivo?')) {
                            deleteAttractionGoal(goal.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={12} className="text-danger-600" />
                      </button>
                    </div>
                  </div>
                  
                  {goal.notes && (
                    <div className={cn(
                      "p-2 sm:p-3 rounded-lg mb-2 sm:mb-3",
                      goal.completed
                        ? 'bg-success-100/50 border border-success-200/50'
                        : 'bg-purple-100/50 border border-purple-200/50'
                    )}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Star size={12} className={goal.completed ? 'text-success-600' : 'text-purple-600'} />
                        <p className="text-xs font-semibold text-slate-700">Visualização</p>
                      </div>
                      <p className={cn(
                        "text-xs sm:text-sm italic break-words line-clamp-3",
                        goal.completed ? 'text-success-800' : 'text-purple-800'
                      )}>
                        {goal.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] sm:text-xs font-medium rounded-lg hover:bg-primary-200 transition-colors"
                      >
                        <Link2 size={10} />
                        <span className="truncate max-w-[100px] sm:max-w-none">{linkedTask.title}</span>
                      </Link>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 px-1.5 sm:px-2 py-0.5">
                      <Calendar size={10} />
                      {format(new Date(goal.createdAt), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      updateAttractionGoal(goal.id, { completed: !goal.completed })
                    }
                    className={cn(
                      "w-full mt-2 sm:mt-3 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200",
                      goal.completed
                        ? 'bg-success-500 hover:bg-success-600 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    )}
                  >
                    {goal.completed ? (
                      <>
                        <CheckCircle2 size={14} className="mr-2 inline" />
                        Manifestado
                      </>
                    ) : (
                      <>
                        <Wand2 size={14} className="mr-2 inline" />
                        Marcar como Manifestado
                      </>
                    )}
                  </button>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <Sparkles className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 text-base sm:text-lg font-medium mb-2">
                {searchQuery || filterStatus !== 'all'
                  ? 'Nenhum objetivo encontrado'
                  : 'Nenhum objetivo cadastrado ainda'}
              </p>
              <p className="text-slate-400 text-sm sm:text-base mb-4">
                {searchQuery || filterStatus !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Clique no botão acima para começar a manifestar seus sonhos!'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
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
