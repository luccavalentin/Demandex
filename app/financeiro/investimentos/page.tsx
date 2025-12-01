'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Investment, Task } from '@/types'
import { Plus, Trash2, Edit2, TrendingUp, X, Search, Link2, Calendar, DollarSign, TrendingDown, BarChart3, Coins, Building2, FileText, Activity } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { formatCurrency, cn } from '@/lib/utils'
import Link from 'next/link'

export default function InvestimentosPage() {
  const { investments, addInvestment, updateInvestment, deleteInvestment, tasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | Investment['type']>('all')
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as Investment['type'],
    amount: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    currentValue: '',
    notes: '',
    taskId: '',
  })

  const handleOpenModal = (type?: Investment['type']) => {
    setFormData({
      name: '',
      type: type || 'stocks',
      amount: '',
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
      currentValue: '',
      notes: '',
      taskId: '',
    })
    setEditingInvestment(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const investment: Investment = {
      id: editingInvestment?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      purchaseDate: formData.purchaseDate,
      currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
      notes: formData.notes || undefined,
      taskId: formData.taskId || undefined,
    }

    if (editingInvestment) {
      updateInvestment(editingInvestment.id, investment)
    } else {
      addInvestment(investment)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'stocks',
      amount: '',
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
      currentValue: '',
      notes: '',
      taskId: '',
    })
    setEditingInvestment(null)
    setIsModalOpen(false)
  }

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment)
    setFormData({
      name: investment.name,
      type: investment.type,
      amount: investment.amount.toString(),
      purchaseDate: investment.purchaseDate,
      currentValue: investment.currentValue?.toString() || '',
      notes: investment.notes || '',
      taskId: investment.taskId || '',
    })
    setIsModalOpen(true)
  }

  const investmentTypes = {
    stocks: { 
      label: 'Ações', 
      icon: BarChart3, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100/80',
      description: 'Ações de empresas'
    },
    bonds: { 
      label: 'Títulos', 
      icon: FileText, 
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100/80',
      description: 'Títulos de renda fixa'
    },
    crypto: { 
      label: 'Criptomoedas', 
      icon: Coins, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100/80',
      description: 'Criptomoedas e tokens'
    },
    'real-estate': { 
      label: 'Imóveis', 
      icon: Building2, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100/80',
      description: 'Investimentos imobiliários'
    },
    other: { 
      label: 'Outros', 
      icon: Activity, 
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100/80',
      description: 'Outros tipos de investimento'
    },
  }

  const filteredInvestments = useMemo(() => {
    return investments.filter((investment) => {
      // Filtro de tipo
      if (filterType !== 'all' && investment.type !== filterType) {
        return false
      }

      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          investment.name.toLowerCase().includes(query) ||
          investment.notes?.toLowerCase().includes(query) ||
          investmentTypes[investment.type].label.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [investments, filterType, searchQuery])

  // Estatísticas
  const totalInvested = useMemo(() => 
    filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0),
    [filteredInvestments]
  )
  const totalCurrent = useMemo(() => 
    filteredInvestments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amount),
      0
    ),
    [filteredInvestments]
  )
  const totalReturn = useMemo(() => totalCurrent - totalInvested, [totalCurrent, totalInvested])
  const returnPercentage = useMemo(() => 
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0,
    [totalReturn, totalInvested]
  )

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
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <TrendingUp className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Investimentos
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Gerencie seus investimentos e acompanhe o retorno
              </p>
            </div>
          </div>

          {/* Botões Rápidos por Tipo */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {Object.entries(investmentTypes).map(([key, invType]) => {
              const Icon = invType.icon
              const typeKey = key as Investment['type']
              return (
                <Button
                  key={key}
                  onClick={() => handleOpenModal(typeKey)}
                  className={cn(
                    "w-full bg-gradient-to-r text-white shadow-lg transition-all duration-200",
                    "hover:shadow-xl active:scale-95 text-xs sm:text-sm",
                    invType.color
                  )}
                  size="md"
                >
                  <Icon size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{invType.label}</span>
                  <span className="sm:hidden">{invType.label.split(' ')[0]}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/70 dark:border-blue-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-200/50 flex-shrink-0">
                <DollarSign className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Investido</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 truncate">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/70 dark:border-purple-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-200/50 flex-shrink-0">
                <BarChart3 className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Valor Atual</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400 truncate">
                  {formatCurrency(totalCurrent)}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-4 sm:p-5 border shadow-lg",
            totalReturn >= 0
              ? 'bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border-success-200/70 dark:border-success-700/40'
              : 'bg-gradient-to-br from-danger-50 to-danger-100/80 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200/70 dark:border-danger-700/40'
          )}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg ring-2 flex-shrink-0",
                totalReturn >= 0
                  ? 'bg-gradient-to-br from-success-500 to-success-600 ring-success-200/50'
                  : 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50'
              )}>
                {totalReturn >= 0 ? (
                  <TrendingUp className="text-white" size={18} strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="text-white" size={18} strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Retorno</p>
                <p className={cn(
                  "text-lg sm:text-xl md:text-2xl font-bold truncate",
                  totalReturn >= 0
                    ? 'text-success-700 dark:text-success-400'
                    : 'text-danger-700 dark:text-danger-400'
                )}>
                  {totalReturn >= 0 ? '+' : ''}{formatCurrency(totalReturn)}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-4 sm:p-5 border shadow-lg",
            returnPercentage >= 0
              ? 'bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border-success-200/70 dark:border-success-700/40'
              : 'bg-gradient-to-br from-danger-50 to-danger-100/80 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200/70 dark:border-danger-700/40'
          )}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg ring-2 flex-shrink-0",
                returnPercentage >= 0
                  ? 'bg-gradient-to-br from-success-500 to-success-600 ring-success-200/50'
                  : 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50'
              )}>
                {returnPercentage >= 0 ? (
                  <TrendingUp className="text-white" size={18} strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="text-white" size={18} strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Retorno %</p>
                <p className={cn(
                  "text-lg sm:text-xl md:text-2xl font-bold",
                  returnPercentage >= 0
                    ? 'text-success-700 dark:text-success-400'
                    : 'text-danger-700 dark:text-danger-400'
                )}>
                  {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
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
                placeholder="Buscar investimentos..."
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
              {Object.entries(investmentTypes).map(([key, invType]) => {
                const Icon = invType.icon
                return (
                  <button
                    key={key}
                    onClick={() => setFilterType(key as Investment['type'])}
                    className={cn(
                      "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0",
                      filterType === key
                        ? `bg-gradient-to-r ${invType.color} text-white shadow-md`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}
                  >
                    <Icon size={14} />
                    <span>{invType.label}</span>
                  </button>
                )
              })}
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
                  `bg-gradient-to-br ${investmentTypes[formData.type].color}`
                )}>
                  {React.createElement(investmentTypes[formData.type].icon, {
                    className: "text-white",
                    size: 20,
                    strokeWidth: 2.5
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingInvestment ? 'Editar Investimento' : `Novo Investimento - ${investmentTypes[formData.type].label}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {investmentTypes[formData.type].description}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Investimento
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(investmentTypes).map(([key, invType]) => {
                      const Icon = invType.icon
                      const typeKey = key as Investment['type']
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: typeKey })}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm",
                            formData.type === typeKey
                              ? `bg-gradient-to-r ${invType.color} text-white shadow-md`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon size={16} />
                          {invType.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <Input
                  label="Nome do Investimento"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ações PETR4, Bitcoin, Tesouro Direto..."
                  required
                  className="text-sm sm:text-base"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Valor Investido"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                    className="text-sm sm:text-base"
                  />
                  <Input
                    label="Valor Atual (opcional)"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    placeholder="0.00"
                    className="text-sm sm:text-base"
                  />
                </div>
                <Input
                  label="Data de Compra"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
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
                    placeholder="Ex: Investimento de longo prazo, estratégia conservadora..."
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
                      Este investimento será vinculado à tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingInvestment ? 'Salvar' : 'Adicionar'}
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

        {/* Investments List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredInvestments.length > 0 ? (
            filteredInvestments.map((investment) => {
              const returnValue = (investment.currentValue || investment.amount) - investment.amount
              const returnPercent =
                investment.amount > 0 ? (returnValue / investment.amount) * 100 : 0
              const invType = investmentTypes[investment.type]
              const linkedTask = investment.taskId ? getTaskById(investment.taskId) : null

              return (
                <Card key={investment.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                  `border-l-4 bg-gradient-to-r ${invType.bgColor}`
                )}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
                          `bg-gradient-to-br ${invType.color}`
                        )}>
                          {React.createElement(invType.icon, {
                            className: "text-white",
                            size: 16,
                            strokeWidth: 2.5
                          })}
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs font-semibold",
                          `bg-gradient-to-r ${invType.color} text-white`
                        )}>
                          {invType.label}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 break-words">
                        {investment.name}
                      </h3>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(investment)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={14} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este investimento?')) {
                            deleteInvestment(investment.id)
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
                    <div className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Investido</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(investment.amount)}
                      </span>
                    </div>
                    {investment.currentValue && (
                      <>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Valor Atual</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(investment.currentValue)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Retorno</span>
                          <span className={cn(
                            "font-bold",
                            returnValue >= 0 
                              ? 'text-success-600 dark:text-success-400' 
                              : 'text-danger-600 dark:text-danger-400'
                          )}>
                            {returnValue >= 0 ? '+' : ''}{formatCurrency(returnValue)} ({returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <Calendar size={14} />
                      <span>
                        Comprado em {format(new Date(investment.purchaseDate), "dd 'de' MMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Link2 size={12} />
                        {linkedTask.title}
                      </Link>
                    )}
                    {investment.notes && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {investment.notes}
                      </p>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <TrendingUp className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || filterType !== 'all'
                  ? 'Nenhum investimento encontrado'
                  : 'Nenhum investimento cadastrado ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || filterType !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && filterType === 'all' && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  {Object.entries(investmentTypes).slice(0, 2).map(([key, invType]) => {
                    const Icon = invType.icon
                    return (
                      <Button
                        key={key}
                        onClick={() => handleOpenModal(key as Investment['type'])}
                        className={cn(
                          "w-full sm:w-auto bg-gradient-to-r text-white text-sm sm:text-base",
                          invType.color
                        )}
                        size="md"
                      >
                        <Icon size={16} className="mr-2" />
                        {invType.label}
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
