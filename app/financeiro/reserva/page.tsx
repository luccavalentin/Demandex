'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { EmergencyReserve, Task } from '@/types'
import { PiggyBank, TrendingUp, Edit2, X, Link2, Calendar, Target, DollarSign, Clock, Plus, CheckCircle2 } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'

export default function ReservaPage() {
  const { emergencyReserve, updateEmergencyReserve, tasks } = useStore()
  const [isEditing, setIsEditing] = useState(!emergencyReserve)
  const [formData, setFormData] = useState({
    targetAmount: emergencyReserve?.targetAmount.toString() || '',
    currentAmount: emergencyReserve?.currentAmount.toString() || '0',
    monthlyContribution: emergencyReserve?.monthlyContribution.toString() || '',
    taskId: emergencyReserve?.taskId || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const reserve: EmergencyReserve = {
      id: emergencyReserve?.id || Date.now().toString(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      monthlyContribution: parseFloat(formData.monthlyContribution),
      taskId: formData.taskId || undefined,
    }

    updateEmergencyReserve(reserve)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (emergencyReserve) {
      setFormData({
        targetAmount: emergencyReserve.targetAmount.toString(),
        currentAmount: emergencyReserve.currentAmount.toString(),
        monthlyContribution: emergencyReserve.monthlyContribution.toString(),
        taskId: emergencyReserve.taskId || '',
      })
    } else {
      setFormData({
        targetAmount: '',
        currentAmount: '0',
        monthlyContribution: '',
        taskId: '',
      })
    }
    setIsEditing(false)
  }

  const progress = useMemo(() => {
    if (!emergencyReserve) return 0
    return Math.min((emergencyReserve.currentAmount / emergencyReserve.targetAmount) * 100, 100)
  }, [emergencyReserve])

  const monthsRemaining = useMemo(() => {
    if (!emergencyReserve || emergencyReserve.monthlyContribution === 0) return 0
    return Math.ceil(
      (emergencyReserve.targetAmount - emergencyReserve.currentAmount) /
        emergencyReserve.monthlyContribution
    )
  }, [emergencyReserve])

  const remainingAmount = useMemo(() => {
    if (!emergencyReserve) return 0
    return Math.max(0, emergencyReserve.targetAmount - emergencyReserve.currentAmount)
  }, [emergencyReserve])

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  const linkedTask = emergencyReserve?.taskId ? getTaskById(emergencyReserve.taskId) : null

  const handleAddContribution = () => {
    if (!emergencyReserve) return
    const amount = prompt(`Quanto deseja adicionar à reserva? (Faltam ${formatCurrency(remainingAmount)})`)
    if (amount && !isNaN(parseFloat(amount))) {
      const addAmount = parseFloat(amount)
      updateEmergencyReserve({
        ...emergencyReserve,
        currentAmount: Math.min(
          emergencyReserve.currentAmount + addAmount,
          emergencyReserve.targetAmount
        ),
      })
    }
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 flex items-center justify-center shadow-lg shadow-warning-500/30">
              <PiggyBank className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Reserva de Emergência
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Controle sua reserva financeira de emergência
              </p>
            </div>
            {emergencyReserve && !isEditing && (
              <Button 
                variant="secondary" 
                onClick={() => {
                  setFormData({
                    targetAmount: emergencyReserve.targetAmount.toString(),
                    currentAmount: emergencyReserve.currentAmount.toString(),
                    monthlyContribution: emergencyReserve.monthlyContribution.toString(),
                    taskId: emergencyReserve.taskId || '',
                  })
                  setIsEditing(true)
                }}
                size="md"
              >
                <Edit2 size={18} className="mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <Card className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center mb-3 sm:mb-4">
                <PiggyBank className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {emergencyReserve ? 'Editar Reserva de Emergência' : 'Configurar Reserva de Emergência'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Configure sua reserva financeira para emergências
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <Input
                label="Meta da Reserva (R$)"
                type="number"
                step="0.01"
                min="0"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="Ex: 30000"
                required
                className="text-sm sm:text-base"
              />
              <Input
                label="Valor Atual (R$)"
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
                label="Contribuição Mensal (R$)"
                type="number"
                step="0.01"
                min="0"
                value={formData.monthlyContribution}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyContribution: e.target.value })
                }
                placeholder="Ex: 1000"
                required
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
                    Esta reserva será vinculada à tarefa selecionada
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                  {emergencyReserve ? 'Salvar Alterações' : 'Criar Reserva'}
                </Button>
                {emergencyReserve && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    className="flex-1 w-full sm:w-auto"
                    size="md"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>
        ) : (
          emergencyReserve && (
            <>
              {/* Card Principal de Progresso */}
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-warning-50 to-amber-50 dark:from-warning-900/20 dark:to-amber-900/20 border border-warning-200/70 dark:border-warning-700/40 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg ring-2 ring-warning-200/50 flex-shrink-0">
                    <PiggyBank className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {formatCurrency(emergencyReserve.currentAmount)}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      de {formatCurrency(emergencyReserve.targetAmount)}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">Progresso</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        progress >= 100 
                          ? 'bg-gradient-to-r from-success-500 to-success-600' 
                          : 'bg-gradient-to-r from-warning-500 to-warning-600'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {remainingAmount > 0 && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 text-right">
                      Faltam {formatCurrency(remainingAmount)}
                    </p>
                  )}
                </div>
                {linkedTask && (
                  <div className="mb-4">
                    <Link
                      href="/produtividade/tarefas"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      <Link2 size={14} />
                      {linkedTask.title}
                    </Link>
                  </div>
                )}
              </Card>

              {/* Cards de Informações */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/70 dark:border-blue-700/40 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-200/50 flex-shrink-0">
                      <DollarSign className="text-white" size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contribuição Mensal</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 truncate">
                        {formatCurrency(emergencyReserve.monthlyContribution)}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/70 dark:border-purple-700/40 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-200/50 flex-shrink-0">
                      <Clock className="text-white" size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Meses Restantes</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400">
                        {monthsRemaining}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 sm:p-5 bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border border-success-200/70 dark:border-success-700/40 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg ring-2 ring-success-200/50 flex-shrink-0">
                      <Target className="text-white" size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Progresso</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-success-700 dark:text-success-400">
                        {Math.round(progress)}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Card de Ação Rápida */}
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200/70 dark:border-primary-700/40 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-200/50 flex-shrink-0">
                    <TrendingUp className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-base sm:text-lg">
                      Próxima Contribuição
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Adicione {formatCurrency(emergencyReserve.monthlyContribution)} para continuar progredindo em sua reserva
                    </p>
                    {progress >= 100 ? (
                      <div className="flex items-center gap-2 text-success-600 dark:text-success-400">
                        <CheckCircle2 size={18} />
                        <span className="text-sm font-semibold">Reserva completa!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => {
                            updateEmergencyReserve({
                              ...emergencyReserve,
                              currentAmount: Math.min(
                                emergencyReserve.currentAmount + emergencyReserve.monthlyContribution,
                                emergencyReserve.targetAmount
                              ),
                            })
                          }}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md"
                          size="sm"
                        >
                          <Plus size={16} className="mr-2" />
                          Adicionar Contribuição Mensal
                        </Button>
                        <Button
                          onClick={handleAddContribution}
                          variant="secondary"
                          size="sm"
                        >
                          <DollarSign size={16} className="mr-2" />
                          Adicionar Valor Personalizado
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </>
          )
        )}

        {!emergencyReserve && !isEditing && (
          <Card className="p-8 sm:p-12 text-center">
            <PiggyBank size={40} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
              Configure sua reserva de emergência para começar
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
              Uma reserva de emergência é essencial para sua segurança financeira
            </p>
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white"
              size="md"
            >
              <Plus size={16} className="mr-2" />
              Configurar Reserva
            </Button>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
