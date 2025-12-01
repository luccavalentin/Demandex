'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { AttractionGoal } from '@/types'
import { Plus, Trash2, Sparkles, CheckCircle2, X } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function LeiAtracaoPage() {
  const { attractionGoals, addAttractionGoal, updateAttractionGoal, deleteAttractionGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: AttractionGoal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      notes: formData.notes || undefined,
      images: [],
      links: [],
      createdAt: new Date().toISOString(),
      completed: false,
    }

    addAttractionGoal(goal)
    resetForm()
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', notes: '' })
    setIsModalOpen(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="text-white" size={28} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                Lei da Atração
              </h1>
              <p className="text-base text-slate-600 font-medium">
                Registre seus sonhos e objetivos
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Novo Objetivo
            </Button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                resetForm()
              }
            }}
          >
            <Card className="w-full max-w-md p-6 relative">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
                aria-label="Fechar"
              >
                <X size={20} className="text-slate-600 dark:text-slate-300" />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pr-8">
                Novo Objetivo
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Observações / Visualizações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={4}
                    placeholder="Descreva como você visualiza este objetivo se realizando..."
                  />
                </div>
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

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attractionGoals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-purple-600" size={20} />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {goal.title}
                  </h3>
                </div>
                <button
                  onClick={() => deleteAttractionGoal(goal.id)}
                  className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-danger-600" />
                </button>
              </div>
              {goal.description && (
                <p className="text-sm text-slate-600 mb-3">{goal.description}</p>
              )}
              {goal.notes && (
                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-purple-900 italic">{goal.notes}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {format(new Date(goal.createdAt), "dd 'de' MMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </span>
                <button
                  onClick={() =>
                    updateAttractionGoal(goal.id, { completed: !goal.completed })
                  }
                  className={`p-2 rounded-lg transition-colors ${
                    goal.completed
                      ? 'bg-success-100 text-success-600'
                      : 'bg-slate-100 text-slate-400 hover:bg-success-100'
                  }`}
                >
                  <CheckCircle2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {attractionGoals.length === 0 && (
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

