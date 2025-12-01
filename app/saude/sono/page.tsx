'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Sleep, Task } from '@/types'
import { Plus, Trash2, Edit2, Star, Moon, X, Search, Clock, Bed, Sunrise, Link2 } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { DateFilter, type DateRange } from '@/components/UI/DateFilter'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SonoPage() {
  const { sleeps, addSleep, updateSleep, deleteSleep, tasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSleep, setEditingSleep] = useState<Sleep | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bedtime: '22:00',
    wakeTime: '07:00',
    quality: 3 as Sleep['quality'],
    notes: '',
    taskId: '',
  })

  const handleOpenModal = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      bedtime: '22:00',
      wakeTime: '07:00',
      quality: 3,
      notes: '',
      taskId: '',
    })
    setEditingSleep(null)
    setIsModalOpen(true)
  }

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
      taskId: formData.taskId || undefined,
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
      taskId: '',
    })
    setEditingSleep(null)
    setIsModalOpen(false)
  }

  const handleEdit = (sleep: Sleep) => {
    setEditingSleep(sleep)
    setFormData({
      date: sleep.date,
      bedtime: sleep.bedtime,
      wakeTime: sleep.wakeTime,
      quality: sleep.quality,
      notes: sleep.notes || '',
      taskId: sleep.taskId || '',
    })
    setIsModalOpen(true)
  }

  const filteredSleeps = useMemo(() => {
    return sleeps.filter((sleep) => {
      // Filtro de data
      if (dateRange.start && dateRange.end) {
        const sleepDate = new Date(sleep.date)
        if (sleepDate < dateRange.start || sleepDate > dateRange.end) {
          return false
        }
      }

      // Filtro de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          sleep.notes?.toLowerCase().includes(query) ||
          format(new Date(sleep.date), 'dd/MM/yyyy', { locale: ptBR }).includes(query)
        )
      }

      return true
    })
  }, [sleeps, dateRange, searchQuery])

  const sortedSleeps = useMemo(() => {
    return [...filteredSleeps].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [filteredSleeps])

  // Estatísticas
  const todaySleep = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return sleeps.find(s => s.date === today)
  }, [sleeps])

  const averageDuration = useMemo(() => {
    if (sleeps.length === 0) return 0
    const total = sleeps.reduce((sum, s) => sum + s.duration, 0)
    return Math.round((total / sleeps.length) * 10) / 10
  }, [sleeps])

  const averageQuality = useMemo(() => {
    if (sleeps.length === 0) return 0
    const total = sleeps.reduce((sum, s) => sum + s.quality, 0)
    return Math.round((total / sleeps.length) * 10) / 10
  }, [sleeps])

  const weekSleeps = useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return sleeps.filter(s => new Date(s.date) >= weekAgo)
  }, [sleeps])

  const averageWeekDuration = useMemo(() => {
    if (weekSleeps.length === 0) return 0
    const total = weekSleeps.reduce((sum, s) => sum + s.duration, 0)
    return Math.round((total / weekSleeps.length) * 10) / 10
  }, [weekSleeps])

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return 'from-success-500 to-success-600'
    if (quality >= 3) return 'from-warning-500 to-warning-600'
    return 'from-danger-500 to-danger-600'
  }

  const getQualityLabel = (quality: number) => {
    if (quality === 5) return 'Excelente'
    if (quality === 4) return 'Bom'
    if (quality === 3) return 'Regular'
    if (quality === 2) return 'Ruim'
    return 'Muito Ruim'
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Moon className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Sono
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Monitore a qualidade e duração do seu sono
              </p>
            </div>
          </div>

          {/* Botão de Ação Rápida */}
          <div className="flex justify-center">
            <Button
              onClick={handleOpenModal}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
              size="md"
            >
              <Plus size={18} className="mr-2" />
              Registrar Sono
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/70 dark:border-indigo-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-200/50 flex-shrink-0">
                <Moon className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Sono Hoje</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                  {todaySleep ? `${todaySleep.duration}h` : '--'}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/70 dark:border-blue-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-200/50 flex-shrink-0">
                <Clock className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Média Geral</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {averageDuration}h
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/70 dark:border-purple-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-200/50 flex-shrink-0">
                <Star className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualidade</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {averageQuality.toFixed(1)}/5
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-200/70 dark:border-cyan-700/40 shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg ring-2 ring-cyan-200/50 flex-shrink-0">
                <Bed className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Esta Semana</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                  {averageWeekDuration}h
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
                placeholder="Buscar registros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base"
              />
            </div>

            {/* Filtro de Data */}
            <div className="w-full">
              <DateFilter onFilterChange={setDateRange} />
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
                  `bg-gradient-to-br ${getQualityColor(formData.quality)}`
                )}>
                  <Moon className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingSleep ? 'Editar Registro' : 'Registrar Sono'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label="Data"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="text-sm sm:text-base"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Bed size={16} />
                      Horário de Dormir
                    </label>
                    <Input
                      type="time"
                      value={formData.bedtime}
                      onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Sunrise size={16} />
                      Horário de Acordar
                    </label>
                    <Input
                      type="time"
                      value={formData.wakeTime}
                      onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Qualidade do Sono (1-5)
                  </label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, quality: rating as Sleep['quality'] })}
                        className={cn(
                          "p-2 sm:p-3 rounded-lg transition-all duration-200 active:scale-95",
                          formData.quality >= rating
                            ? `bg-gradient-to-br ${getQualityColor(rating)} text-white shadow-md`
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        )}
                      >
                        <Star
                          size={20}
                          className={formData.quality >= rating ? 'fill-current' : ''}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                    {getQualityLabel(formData.quality)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field text-sm sm:text-base"
                    rows={3}
                    placeholder="Ex: Acordei algumas vezes, sono profundo..."
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
                      Este registro será vinculado à tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingSleep ? 'Salvar' : 'Adicionar'}
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

        {/* Sleeps List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedSleeps.length > 0 ? (
            sortedSleeps.map((sleep) => {
              const linkedTask = sleep.taskId ? getTaskById(sleep.taskId) : null
              const qualityColor = getQualityColor(sleep.quality)
              return (
                <Card key={sleep.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                  `border-l-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50`
                )}>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md",
                          `bg-gradient-to-br ${qualityColor}`
                        )}>
                          <Moon className="text-white" size={16} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {format(new Date(sleep.date), "dd 'de' MMMM", {
                            locale: ptBR,
                          })}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(sleep)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={14} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este registro?')) {
                            deleteSleep(sleep.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={14} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Bed size={14} />
                        <span>{sleep.bedtime}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-1.5">
                        <Sunrise size={14} />
                        <span>{sleep.wakeTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock size={14} />
                        {sleep.duration} horas
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            size={14}
                            className={cn(
                              sleep.quality >= rating
                                ? `text-warning-500 fill-current`
                                : 'text-slate-300'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {getQualityLabel(sleep.quality)}
                    </p>
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Link2 size={12} />
                        {linkedTask.title}
                      </Link>
                    )}
                    {sleep.notes && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {sleep.notes}
                      </p>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <Moon className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || dateRange.start
                  ? 'Nenhum registro encontrado'
                  : 'Nenhum registro de sono ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || dateRange.start
                  ? 'Tente ajustar os filtros'
                  : 'Clique no botão acima para começar!'}
              </p>
              {!searchQuery && !dateRange.start && (
                <Button
                  onClick={handleOpenModal}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-sm sm:text-base"
                  size="md"
                >
                  <Plus size={16} className="mr-2" />
                  Registrar Sono
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
