'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { FinancialGoal } from '@/types'
import { Plus, Trash2, Target, CheckCircle2 } from 'lucide-react'

export default function MetasFinanceirasPage() {
  const { financialGoals, addFinancialGoal, updateFinancialGoal, deleteFinancialGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: FinancialGoal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline || undefined,
      completed: false,
    }

    addFinancialGoal(goal)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: '',
    })
    setIsModalOpen(false)
  }

  const getProgress = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-success-500 via-success-600 to-success-700 flex items-center justify-center shadow-lg shadow-success-500/30">
              <Target className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Metas Financeiras
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Defina e acompanhe suas metas financeiras
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Nova Meta
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Nova Meta Financeira
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  label="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Valor Atual"
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    required
                  />
                  <Input
                    label="Meta"
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Prazo (opcional)"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Adicionar
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialGoals.map((goal) => {
            const progress = getProgress(goal)
            return (
              <Card key={goal.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Target className="text-primary-600 mb-2" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">
                      {goal.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteFinancialGoal(goal.id)}
                    className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-danger-600" />
                  </button>
                </div>
                {goal.description && (
                  <p className="text-sm text-slate-600 mb-3">{goal.description}</p>
                )}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Progresso</span>
                    <span className="font-semibold text-slate-900">
                      R$ {goal.currentAmount.toFixed(2)} / R${' '}
                      {goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        progress >= 100 ? 'bg-success-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateFinancialGoal(goal.id, {
                      currentAmount: Math.min(
                        goal.currentAmount + 100,
                        goal.targetAmount
                      ),
                      completed: goal.currentAmount + 100 >= goal.targetAmount,
                    })
                  }
                  className="btn-primary text-sm px-4 py-2 w-full"
                  disabled={goal.completed}
                >
                  {goal.completed ? (
                    <>
                      <CheckCircle2 size={16} className="mr-2" />
                      Meta Atingida!
                    </>
                  ) : (
                    'Adicionar R$ 100'
                  )}
                </button>
              </Card>
            )
          })}
        </div>

        {financialGoals.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhuma meta financeira cadastrada ainda. Clique em "Nova Meta"
              para começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

