'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Investment } from '@/types'
import { Plus, Trash2, Edit2, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default function InvestimentosPage() {
  const { investments, addInvestment, updateInvestment, deleteInvestment } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as Investment['type'],
    amount: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    currentValue: '',
    notes: '',
  })

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
    })
    setEditingInvestment(null)
    setIsModalOpen(false)
  }

  const investmentTypes = {
    stocks: 'Ações',
    bonds: 'Títulos',
    crypto: 'Criptomoedas',
    'real-estate': 'Imóveis',
    other: 'Outros',
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrent = investments.reduce(
    (sum, inv) => sum + (inv.currentValue || inv.amount),
    0
  )
  const totalReturn = totalCurrent - totalInvested
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <TrendingUp className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Investimentos
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Gerencie seus investimentos e acompanhe o retorno
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Novo Investimento
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Total Investido</p>
            <p className="text-2xl font-bold text-slate-900">
              R$ {totalInvested.toFixed(2)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-slate-600 mb-1">Valor Atual</p>
            <p className="text-2xl font-bold text-slate-900">
              R$ {totalCurrent.toFixed(2)}
            </p>
          </Card>
          <Card className={`p-4 ${totalReturn >= 0 ? 'bg-success-50' : 'bg-danger-50'}`}>
            <p className="text-sm text-slate-600 mb-1">Retorno</p>
            <p
              className={`text-2xl font-bold ${
                totalReturn >= 0 ? 'text-success-700' : 'text-danger-700'
              }`}
            >
              {totalReturn >= 0 ? '+' : ''}R$ {totalReturn.toFixed(2)} (
              {returnPercentage >= 0 ? '+' : ''}
              {returnPercentage.toFixed(2)}%)
            </p>
          </Card>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingInvestment ? 'Editar Investimento' : 'Novo Investimento'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome do Investimento"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Investment['type'] })
                    }
                    className="input-field"
                  >
                    {Object.entries(investmentTypes).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Valor Investido"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                  <Input
                    label="Valor Atual (opcional)"
                    type="number"
                    step="0.01"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  />
                </div>
                <Input
                  label="Data de Compra"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingInvestment ? 'Salvar' : 'Adicionar'}
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

        {/* Investments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investments.map((investment) => {
            const returnValue = (investment.currentValue || investment.amount) - investment.amount
            const returnPercent =
              investment.amount > 0 ? (returnValue / investment.amount) * 100 : 0

            return (
              <Card key={investment.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="badge badge-primary">
                      {investmentTypes[investment.type]}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      {investment.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingInvestment(investment)
                        setFormData({
                          name: investment.name,
                          type: investment.type,
                          amount: investment.amount.toString(),
                          purchaseDate: investment.purchaseDate,
                          currentValue: investment.currentValue?.toString() || '',
                          notes: investment.notes || '',
                        })
                        setIsModalOpen(true)
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => deleteInvestment(investment.id)}
                      className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-danger-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Investido</span>
                    <span className="font-semibold text-slate-900">
                      R$ {investment.amount.toFixed(2)}
                    </span>
                  </div>
                  {investment.currentValue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Valor Atual</span>
                      <span className="font-semibold text-slate-900">
                        R$ {investment.currentValue.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {investment.currentValue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Retorno</span>
                      <span
                        className={`font-semibold ${
                          returnValue >= 0 ? 'text-success-600' : 'text-danger-600'
                        }`}
                      >
                        {returnValue >= 0 ? '+' : ''}R$ {returnValue.toFixed(2)} (
                        {returnPercent >= 0 ? '+' : ''}
                        {returnPercent.toFixed(2)}%)
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    Comprado em{' '}
                    {format(new Date(investment.purchaseDate), "dd 'de' MMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                  {investment.notes && (
                    <p className="text-sm text-slate-500 mt-2">{investment.notes}</p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {investments.length === 0 && (
          <Card className="p-12 text-center">
            <TrendingUp size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">
              Nenhum investimento cadastrado ainda. Clique em "Novo Investimento"
              para começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

