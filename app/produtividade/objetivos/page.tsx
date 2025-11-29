'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { ProductivityGoal } from '@/types'
import { Plus, Trash2, Target, CheckCircle2 } from 'lucide-react'

export default function ObjetivosProdutividadePage() {
  const { productivityGoals, addProductivityGoal, updateProductivityGoal, deleteProductivityGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'tasks' as ProductivityGoal['type'],
    title: '',
    description: '',
    targetValue: '',
    currentValue: '0',
    deadline: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: ProductivityGoal = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      targetValue: parseInt(formData.targetValue),
      currentValue: parseInt(formData.currentValue),
      deadline: formData.deadline || undefined,
      completed: false,
    }

    addProductivityGoal(goal)
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
    })
    setIsModalOpen(false)
  }

  const goalTypes = {
    tasks: 'Tarefas',
    study: 'Estudos',
    project: 'Projetos',
  }

  const getProgress = (goal: ProductivityGoal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 flex items-center justify-center shadow-lg shadow-warning-500/30">
              <Target className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Objetivos de Produtividade
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Defina e acompanhe suas metas de produtividade
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Novo Objetivo
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Novo Objetivo
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as ProductivityGoal['type'] })
                    }
                    className="input-field"
                  >
                    {Object.entries(goalTypes).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
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
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    required
                  />
                  <Input
                    label="Meta"
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
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
          {productivityGoals.map((goal) => {
            const progress = getProgress(goal)
            return (
              <Card key={goal.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="badge badge-primary">
                      {goalTypes[goal.type]}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                      {goal.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteProductivityGoal(goal.id)}
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
                      {goal.currentValue} / {goal.targetValue}
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
                    updateProductivityGoal(goal.id, {
                      currentValue: Math.min(goal.currentValue + 1, goal.targetValue),
                      completed: goal.currentValue + 1 >= goal.targetValue,
                    })
                  }
                  className="btn-primary text-sm px-4 py-2 w-full"
                  disabled={goal.completed}
                >
                  {goal.completed ? (
                    <>
                      <CheckCircle2 size={16} className="mr-2" />
                      Concluído
                    </>
                  ) : (
                    'Atualizar Progresso'
                  )}
                </button>
              </Card>
            )
          })}
        </div>

        {productivityGoals.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhum objetivo cadastrado ainda. Clique em "Novo Objetivo" para
              começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

