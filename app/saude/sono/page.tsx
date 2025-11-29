'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Sleep } from '@/types'
import { Plus, Trash2, Edit2, Star, Moon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export default function SonoPage() {
  const { sleeps, addSleep, updateSleep, deleteSleep } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSleep, setEditingSleep] = useState<Sleep | null>(null)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bedtime: '22:00',
    wakeTime: '07:00',
    quality: 3 as Sleep['quality'],
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bedtimeDate = new Date(`${formData.date}T${formData.bedtime}`)
    const wakeDate = new Date(`${formData.date}T${formData.wakeTime}`)
    if (wakeDate < bedtimeDate) {
      wakeDate.setDate(wakeDate.getDate() + 1)
    }
    const duration = (wakeDate.getTime() - bedtimeDate.getTime()) / (1000 * 60 * 60)

    const sleep: Sleep = {
      id: editingSleep?.id || Date.now().toString(),
      date: formData.date,
      bedtime: formData.bedtime,
      wakeTime: formData.wakeTime,
      duration: Math.round(duration * 10) / 10,
      quality: formData.quality,
      notes: formData.notes || undefined,
    }

    if (editingSleep) {
      updateSleep(editingSleep.id, sleep)
    } else {
      addSleep(sleep)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      bedtime: '22:00',
      wakeTime: '07:00',
      quality: 3,
      notes: '',
    })
    setEditingSleep(null)
    setIsModalOpen(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Moon className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Sono
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Monitore a qualidade e duração do seu sono
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Registrar Sono
            </Button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingSleep ? 'Editar Registro' : 'Registrar Sono'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <Input
                  label="Horário de Dormir"
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                  required
                />
                <Input
                  label="Horário de Acordar"
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Qualidade (1-5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, quality: rating as Sleep['quality'] })}
                        className={`p-2 rounded-lg transition-colors ${
                          formData.quality >= rating
                            ? 'bg-warning-100 text-warning-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Star
                          size={24}
                          className={formData.quality >= rating ? 'fill-current' : ''}
                        />
                      </button>
                    ))}
                  </div>
                </div>
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
                    {editingSleep ? 'Salvar' : 'Adicionar'}
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
          {sleeps.map((sleep) => (
            <Card key={sleep.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {format(new Date(sleep.date), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSleep(sleep)
                      setFormData({
                        date: sleep.date,
                        bedtime: sleep.bedtime,
                        wakeTime: sleep.wakeTime,
                        quality: sleep.quality,
                        notes: sleep.notes || '',
                      })
                      setIsModalOpen(true)
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} className="text-slate-600" />
                  </button>
                  <button
                    onClick={() => deleteSleep(sleep.id)}
                    className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-danger-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  {sleep.bedtime} - {sleep.wakeTime}
                </p>
                <p className="text-sm font-medium text-slate-700">
                  {sleep.duration} horas
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      size={16}
                      className={
                        sleep.quality >= rating
                          ? 'text-warning-500 fill-current'
                          : 'text-slate-300'
                      }
                    />
                  ))}
                </div>
                {sleep.notes && (
                  <p className="text-sm text-slate-500 mt-2">{sleep.notes}</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {sleeps.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhum registro de sono ainda. Clique em "Registrar Sono" para
              começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

