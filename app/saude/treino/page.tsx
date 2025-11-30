'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Workout } from '@/types'
import { Plus, Trash2, Edit2, Dumbbell } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function TreinoPage() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'cardio' as Workout['type'],
    duration: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const workout: Workout = {
      id: editingWorkout?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      duration: parseInt(formData.duration),
      date: formData.date,
      notes: formData.notes || undefined,
    }

    if (editingWorkout) {
      updateWorkout(editingWorkout.id, workout)
    } else {
      addWorkout(workout)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'cardio',
      duration: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    })
    setEditingWorkout(null)
    setIsModalOpen(false)
  }

  const workoutTypes = {
    cardio: 'Cardio',
    strength: 'Força',
    flexibility: 'Flexibilidade',
    other: 'Outro',
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Dumbbell className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Treino
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Registre seus exercícios e acompanhe seu progresso
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Novo Treino
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingWorkout ? 'Editar Treino' : 'Novo Treino'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome do Treino"
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
                      setFormData({ ...formData, type: e.target.value as Workout['type'] })
                    }
                    className="input-field"
                  >
                    {Object.entries(workoutTypes).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Duração (minutos)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
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
                    {editingWorkout ? 'Salvar' : 'Adicionar'}
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
          {workouts.map((workout) => (
            <Card key={workout.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="badge badge-primary">
                    {workoutTypes[workout.type]}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 mt-2">
                    {workout.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingWorkout(workout)
                      setFormData({
                        name: workout.name,
                        type: workout.type,
                        duration: workout.duration.toString(),
                        date: workout.date,
                        notes: workout.notes || '',
                      })
                      setIsModalOpen(true)
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => deleteWorkout(workout.id)}
                    className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-danger-600" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                {format(new Date(workout.date), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-sm font-medium text-slate-700">
                {workout.duration} minutos
              </p>
              {workout.notes && (
                <p className="text-sm text-slate-500 mt-2">{workout.notes}</p>
              )}
            </Card>
          ))}
        </div>

        {workouts.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhum treino registrado ainda. Clique em "Novo Treino" para
              começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

