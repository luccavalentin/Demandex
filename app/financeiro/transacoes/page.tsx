'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Transaction } from '@/types'
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet, X, Filter, Search } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { DateFilter, type DateRange } from '@/components/UI/DateFilter'
import { formatCurrency, cn } from '@/lib/utils'

export default function TransacoesPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [formData, setFormData] = useState({
    type: 'expense' as Transaction['type'],
    category: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    tags: '',
  })

  const handleOpenModal = (type: 'income' | 'expense') => {
    setFormData({
      type,
      category: '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      tags: '',
    })
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : undefined,
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction)
    } else {
      addTransaction(transaction)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      tags: '',
    })
    setEditingTransaction(null)
    setIsModalOpen(false)
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtro de data
      if (dateRange.start && dateRange.end) {
        const transactionDate = new Date(transaction.date)
        if (transactionDate < dateRange.start || transactionDate > dateRange.end) {
          return false
        }
      }

      // Filtro de tipo
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false
      }

      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          transaction.description.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query) ||
          transaction.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [transactions, dateRange, filterType, searchQuery])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredTransactions])

  const totalIncome = useMemo(() => 
    filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )

  const totalExpenses = useMemo(() => 
    filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    transactions.forEach(t => cats.add(t.category))
    return Array.from(cats).sort()
  }, [transactions])

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header - Mobile Otimizado */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Wallet className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Transações
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Gerencie suas receitas e despesas
              </p>
            </div>
          </div>

          {/* Botões de Ação Rápida - Mobile Stack */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={() => handleOpenModal('income')}
              className="w-full sm:w-auto bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-lg shadow-success-500/30 text-sm sm:text-base"
              size="md"
            >
              <TrendingUp size={18} className="mr-2" />
              Nova Receita
            </Button>
            <Button
              onClick={() => handleOpenModal('expense')}
              className="w-full sm:w-auto bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white shadow-lg shadow-danger-500/30 text-sm sm:text-base"
              size="md"
            >
              <TrendingDown size={18} className="mr-2" />
              Nova Despesa
            </Button>
          </div>
        </div>

        {/* Summary Cards - Mobile Compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border border-success-200/70 dark:border-success-700/40 shadow-lg shadow-success-200/30">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg ring-2 ring-success-200/50 flex-shrink-0">
                <TrendingUp className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Receitas</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-success-700 dark:text-success-400 truncate">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-danger-50 to-danger-100/80 dark:from-danger-900/20 dark:to-danger-800/20 border border-danger-200/70 dark:border-danger-700/40 shadow-lg shadow-danger-200/30">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center shadow-lg ring-2 ring-danger-200/50 flex-shrink-0">
                <TrendingDown className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Despesas</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-danger-700 dark:text-danger-400 truncate">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-4 sm:p-5 md:p-6 border shadow-lg",
            balance >= 0
              ? 'bg-gradient-to-br from-primary-50 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200/70 dark:border-primary-700/40 shadow-primary-200/30'
              : 'bg-gradient-to-br from-danger-50 to-danger-100/80 dark:from-danger-900/20 dark:to-danger-800/20 border-danger-200/70 dark:border-danger-700/40 shadow-danger-200/30'
          )}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg ring-2 flex-shrink-0",
                balance >= 0
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 ring-primary-200/50'
                  : 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50'
              )}>
                {balance >= 0 ? (
                  <TrendingUp className="text-white" size={18} strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="text-white" size={18} strokeWidth={2.5} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Saldo</p>
                <p className={cn(
                  "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate",
                  balance >= 0
                    ? 'text-primary-700 dark:text-primary-400'
                    : 'text-danger-700 dark:text-danger-400'
                )}>
                  {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros e Busca - Mobile Otimizado */}
        <Card className="p-3 sm:p-4 md:p-5">
          <div className="space-y-3 sm:space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col gap-3">
              {/* Filtro de Data */}
              <div className="w-full">
                <DateFilter onFilterChange={setDateRange} />
              </div>

              {/* Filtro de Tipo - Mobile Horizontal Scroll */}
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
                  Todas
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0",
                    filterType === 'income'
                      ? 'bg-success-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  <TrendingUp size={14} />
                  <span>Receitas</span>
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0",
                    filterType === 'expense'
                      ? 'bg-danger-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  <TrendingDown size={14} />
                  <span>Despesas</span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Modal - Mobile Otimizado */}
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
                  formData.type === 'income'
                    ? 'bg-gradient-to-br from-success-500 to-success-600'
                    : 'bg-gradient-to-br from-danger-500 to-danger-600'
                )}>
                  {formData.type === 'income' ? (
                    <TrendingUp className="text-white" size={20} strokeWidth={2.5} />
                  ) : (
                    <TrendingDown className="text-white" size={20} strokeWidth={2.5} />
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingTransaction ? 'Editar Transação' : `Nova ${formData.type === 'income' ? 'Receita' : 'Despesa'}`}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={cn(
                        "flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base",
                        formData.type === 'income'
                          ? 'bg-success-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      <TrendingUp size={16} />
                      Receita
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={cn(
                        "flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base",
                        formData.type === 'expense'
                          ? 'bg-danger-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      <TrendingDown size={16} />
                      Despesa
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Categoria
                  </label>
                  <Input
                    list="categories"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Alimentação, Transporte..."
                    required
                    className="text-sm sm:text-base"
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <Input
                  label="Valor"
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
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Supermercado, Salário..."
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
                <Input
                  label="Tags (separadas por vírgula)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="ex: alimentação, transporte"
                  className="text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingTransaction ? 'Salvar' : 'Adicionar'}
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

        {/* Transactions List - Mobile Otimizado */}
        <div className="space-y-2 sm:space-y-3">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => (
              <Card 
                key={transaction.id} 
                className={cn(
                  "p-3 sm:p-4 md:p-5 transition-all duration-200 hover:shadow-lg",
                  transaction.type === 'income'
                    ? 'border-l-4 border-success-500'
                    : 'border-l-4 border-danger-500'
                )}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                    <div className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
                      transaction.type === 'income'
                        ? 'bg-gradient-to-br from-success-500 to-success-600'
                        : 'bg-gradient-to-br from-danger-500 to-danger-600'
                    )}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="text-white" size={18} strokeWidth={2.5} />
                      ) : (
                        <TrendingDown className="text-white" size={18} strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-1 break-words">
                        {transaction.description}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <span className="font-medium">{transaction.category}</span>
                        <span>•</span>
                        <span className="whitespace-nowrap">
                          {format(new Date(transaction.date), "dd 'de' MMM", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {transaction.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 sm:py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto flex-shrink-0">
                    <p className={cn(
                      "text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap",
                      transaction.type === 'income'
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-danger-600 dark:text-danger-400'
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction)
                          setFormData({
                            type: transaction.type,
                            category: transaction.category,
                            amount: transaction.amount.toString(),
                            description: transaction.description,
                            date: transaction.date,
                            tags: transaction.tags?.join(', ') || '',
                          })
                          setIsModalOpen(true)
                        }}
                        className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={16} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir esta transação?')) {
                            deleteTransaction(transaction.id)
                          }
                        }}
                        className="p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={16} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 sm:p-12 text-center">
              <Wallet className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || filterType !== 'all' || dateRange.start
                  ? 'Nenhuma transação encontrada'
                  : 'Nenhuma transação cadastrada ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || filterType !== 'all' || dateRange.start
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && filterType === 'all' && !dateRange.start && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                  <Button
                    onClick={() => handleOpenModal('income')}
                    className="w-full sm:w-auto bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-sm sm:text-base"
                    size="md"
                  >
                    <TrendingUp size={16} className="mr-2" />
                    Nova Receita
                  </Button>
                  <Button
                    onClick={() => handleOpenModal('expense')}
                    className="w-full sm:w-auto bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-sm sm:text-base"
                    size="md"
                  >
                    <TrendingDown size={16} className="mr-2" />
                    Nova Despesa
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
