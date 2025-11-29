'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Transaction } from '@/types'
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default function TransacoesPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    type: 'expense' as Transaction['type'],
    category: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    tags: '',
  })

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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Wallet className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Transações
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Gerencie suas receitas e despesas
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-success-50">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-success-600" size={24} />
              <div>
                <p className="text-sm text-slate-600">Receitas</p>
                <p className="text-2xl font-bold text-success-700">
                  R$ {totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-danger-50">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-danger-600" size={24} />
              <div>
                <p className="text-sm text-slate-600">Despesas</p>
                <p className="text-2xl font-bold text-danger-700">
                  R$ {totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          <Card className={`p-4 ${balance >= 0 ? 'bg-primary-50' : 'bg-danger-50'}`}>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-slate-600">Saldo</p>
                <p
                  className={`text-2xl font-bold ${
                    balance >= 0 ? 'text-primary-700' : 'text-danger-700'
                  }`}
                >
                  R$ {balance.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Transaction['type'] })
                    }
                    className="input-field"
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </select>
                </div>
                <Input
                  label="Categoria"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
                <Input
                  label="Valor"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <Input
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <Input
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <Input
                  label="Tags (separadas por vírgula)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="ex: alimentação, transporte"
                />
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingTransaction ? 'Salvar' : 'Adicionar'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-3">
          {sortedTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {transaction.type === 'income' ? (
                      <TrendingUp className="text-success-600" size={20} />
                    ) : (
                      <TrendingDown className="text-danger-600" size={20} />
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {transaction.description}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {transaction.category} •{' '}
                        {format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {transaction.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge badge-primary text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === 'income'
                        ? 'text-success-600'
                        : 'text-danger-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}R${' '}
                    {transaction.amount.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
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
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-danger-600" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {transactions.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhuma transação cadastrada ainda. Clique em "Nova Transação"
              para começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

