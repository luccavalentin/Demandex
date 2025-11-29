'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Meal } from '@/types'
import { Plus, Trash2, Edit2, UtensilsCrossed } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default function AlimentacaoPage() {
  const { meals, addMeal, updateMeal, deleteMeal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [formData, setFormData] = useState({
    type: 'breakfast' as Meal['type'],
    name: '',
    calories: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const meal: Meal = {
      id: editingMeal?.id || Date.now().toString(),
      type: formData.type,
      name: formData.name,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      date: formData.date,
      notes: formData.notes || undefined,
    }

    if (editingMeal) {
      updateMeal(editingMeal.id, meal)
    } else {
      addMeal(meal)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      type: 'breakfast',
      name: '',
      calories: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    })
    setEditingMeal(null)
    setIsModalOpen(false)
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
    setFormData({
      type: meal.type,
      name: meal.name,
      calories: meal.calories?.toString() || '',
      date: meal.date,
      notes: meal.notes || '',
    })
    setIsModalOpen(true)
  }

  const mealTypes = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche',
  }

  const sortedMeals = [...meals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Alimentação
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Registre suas refeições e acompanhe sua nutrição
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} size="sm" className="sm:size-md">
              <Plus size={18} className="mr-1.5 sm:mr-2 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Nova Refeição</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
            <Card className="w-full max-w-md p-4 sm:p-6 my-auto max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                {editingMeal ? 'Editar Refeição' : 'Nova Refeição'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Refeição
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Meal['type'] })
                    }
                    className="input-field"
                  >
                    {Object.entries(mealTypes).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Nome da Refeição"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Calorias (opcional)"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                />
                <Input
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    {editingMeal ? 'Salvar' : 'Adicionar'}
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

        {/* Meals List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedMeals.map((meal) => (
            <Card key={meal.id} className="p-3 sm:p-4">
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <span className="badge badge-primary text-xs">
                    {mealTypes[meal.type]}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-2 truncate">
                    {meal.name}
                  </h3>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(meal)}
                    className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors touch-manipulation"
                    aria-label="Editar"
                  >
                    <Edit2 size={14} className="sm:w-4 sm:h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-1.5 sm:p-2 hover:bg-danger-50 rounded-lg transition-colors touch-manipulation"
                    aria-label="Excluir"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4 text-danger-600" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                {format(new Date(meal.date), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
              {meal.calories && (
                <p className="text-sm font-medium text-slate-700">
                  {meal.calories} calorias
                </p>
              )}
              {meal.notes && (
                <p className="text-sm text-slate-500 mt-2">{meal.notes}</p>
              )}
            </Card>
          ))}
        </div>

        {meals.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhuma refeição cadastrada ainda. Clique em "Nova Refeição" para
              começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

