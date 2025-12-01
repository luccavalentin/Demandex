'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { FinancialGoal, Task } from '@/types'
import { Plus, Trash2, Edit2, Target, CheckCircle2, X, Search, Link2, TrendingUp, Calendar, DollarSign, PiggyBank, Wallet } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function MetasFinanceirasPage() {
  const { financialGoals, addFinancialGoal, updateFinancialGoal, deleteFinancialGoal, tasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    taskId: '',
  })

  const handleOpenModal = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
      taskId: '',
    })
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: FinancialGoal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline || undefined,
      completed: false,
      taskId: formData.taskId || undefined,
    }

    if (editingGoal) {
      updateFinancialGoal(editingGoal.id, goal)
    } else {
      addFinancialGoal(goal)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
      taskId: '',
    })
    setEditingGoal(null)
    setIsModalOpen(false)
  }

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline || '',
      taskId: goal.taskId || '',
    })
    setIsModalOpen(true)
  }

  const getProgress = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const filteredGoals = useMemo(() => {
    return financialGoals.filter((goal) => {
      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          goal.title.toLowerCase().includes(query) ||
          goal.description?.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [financialGoals, searchQuery])

  // Estatísticas
  const totalGoals = useMemo(() => financialGoals.length, [financialGoals])
  const completedGoals = useMemo(() => financialGoals.filter(g => g.completed).length, [financialGoals])
  const inProgressGoals = useMemo(() => financialGoals.filter(g => !g.completed).length, [financialGoals])
  const totalTarget = useMemo(() => 
    financialGoals.reduce((sum, g) => sum + g.targetAmount, 0),
    [financialGoals]
  )
  const totalCurrent = useMemo(() => 
    financialGoals.reduce((sum, g) => sum + g.currentAmount, 0),
    [financialGoals]
  )
  const averageProgress = useMemo(() => {
    if (financialGoals.length === 0) return 0
    const total = financialGoals.reduce((sum, g) => sum + getProgress(g), 0)
    return Math.round(total / financialGoals.length)
  }, [financialGoals])

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  const remainingAmount = (goal: FinancialGoal) => {
    return Math.max(0, goal.targetAmount - goal.currentAmount)
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
                Metas Financeiras
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Defina e acompanhe suas metas financeiras
              </p>
            </div>
          </div>

          {/* Botão de Ação Rápida */}
          <div className="flex justify-center">
            <Button
              onClick={handleOpenModal}
              className="w-full sm:w-auto bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-lg shadow-success-500/30"
              size="md"
            >
              <Plus size={18} className="mr-2" />
              Nova Meta Financeira
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200/70 dark:border-primary-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-200/50 flex-shrink-0">
                <Target className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total de Metas</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-700 dark:text-primary-400">
                  {totalGoals}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border border-success-200/70 dark:border-success-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg ring-2 ring-success-200/50 flex-shrink-0">
                <CheckCircle2 className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Concluídas</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-success-700 dark:text-success-400">
                  {completedGoals}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-warning-50 to-warning-100/80 dark:from-warning-900/20 dark:to-warning-800/20 border border-warning-200/70 dark:border-warning-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg ring-2 ring-warning-200/50 flex-shrink-0">
                <PiggyBank className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Arrecadado</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-warning-700 dark:text-warning-400 truncate">
                  {formatCurrency(totalCurrent)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/70 dark:border-blue-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-200/50 flex-shrink-0">
                <Wallet className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Meta Total</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 truncate">
                  {formatCurrency(totalTarget)}
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
                placeholder="Buscar metas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center mb-3 sm:mb-4">
                  <DollarSign className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingGoal ? 'Editar Meta' : 'Nova Meta Financeira'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label="Título da Meta"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Reserva de emergência, Viagem para Europa..."
                  required
                  className="text-sm sm:text-base"
                />
                <Input
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada da meta..."
                  className="text-sm sm:text-base"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Valor Atual"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="0.00"
                    required
                    className="text-sm sm:text-base"
                  />
                  <Input
                    label="Meta"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="0.00"
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
                      Esta meta será vinculada à tarefa selecionada
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
              const remaining = remainingAmount(goal)
              const linkedTask = goal.taskId ? getTaskById(goal.taskId) : null
              return (
                <Card key={goal.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                  "bg-gradient-to-r from-success-50/50 to-emerald-50/50",
                  goal.completed && 'opacity-75'
                )}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md">
                          <DollarSign className="text-white" size={16} strokeWidth={2.5} />
                        </div>
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
                          if (confirm('Tem certeza que deseja excluir esta meta?')) {
                            deleteFinancialGoal(goal.id)
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
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
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
                      <div className="flex justify-between items-center mt-1.5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {Math.round(progress)}% concluído
                        </p>
                        {remaining > 0 && (
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Faltam {formatCurrency(remaining)}
                          </p>
                        )}
                      </div>
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
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() =>
                          updateFinancialGoal(goal.id, {
                            currentAmount: Math.min(
                              goal.currentAmount + (goal.targetAmount * 0.1),
                              goal.targetAmount
                            ),
                            completed: goal.currentAmount + (goal.targetAmount * 0.1) >= goal.targetAmount,
                          })
                        }
                        className={cn(
                          "flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2",
                          goal.completed
                            ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 shadow-md active:scale-95'
                        )}
                        disabled={goal.completed}
                      >
                        {goal.completed ? (
                          <>
                            <CheckCircle2 size={16} />
                            Meta Atingida!
                          </>
                        ) : (
                          <>
                            <TrendingUp size={16} />
                            +10%
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const amount = prompt(`Quanto deseja adicionar? (Faltam ${formatCurrency(remaining)})`)
                          if (amount && !isNaN(parseFloat(amount))) {
                            const addAmount = parseFloat(amount)
                            updateFinancialGoal(goal.id, {
                              currentAmount: Math.min(
                                goal.currentAmount + addAmount,
                                goal.targetAmount
                              ),
                              completed: goal.currentAmount + addAmount >= goal.targetAmount,
                            })
                          }
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2",
                          goal.completed
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
                        )}
                        disabled={goal.completed}
                      >
                        <Plus size={16} />
                        Valor
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <Target className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery
                  ? 'Nenhuma meta encontrada'
                  : 'Nenhuma meta financeira cadastrada ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery
                  ? 'Tente ajustar a busca'
                  : 'Clique no botão acima para começar!'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-sm sm:text-base"
                  size="md"
                >
                  <Plus size={16} className="mr-2" />
                  Nova Meta Financeira
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
