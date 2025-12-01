'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { StudyArea, Subject, Class } from '@/types'
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, BookOpen, Timer, X, Search, Link2, GraduationCap, FolderOpen, Clock, Target, Filter } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function EstudosPage() {
  const { studyAreas, addStudyArea, updateStudyArea, deleteStudyArea, addSubject, updateSubject, deleteSubject, addClass, updateClass, deleteClass, addPomodoro, tasks } = useStore()
  const [expandedAreas, setExpandedAreas] = useState<string[]>([])
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
  const [modalType, setModalType] = useState<'area' | 'subject' | 'class' | null>(null)
  const [editingItem, setEditingItem] = useState<{ type: 'area' | 'subject' | 'class', areaId?: string, subjectId?: string, item: any } | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    taskId: '',
  })

  const handleOpenModal = (type: 'area' | 'subject' | 'class', areaId?: string, subjectId?: string) => {
    setFormData({ name: '', description: '', color: areaId ? studyAreas.find(a => a.id === areaId)?.color || '#3b82f6' : '#3b82f6', taskId: '' })
    setModalType(type)
    setSelectedAreaId(areaId || null)
    setSelectedSubjectId(subjectId || null)
    setEditingItem(null)
  }

  const handleEdit = (type: 'area' | 'subject' | 'class', areaId: string, subjectId: string | null, item: any) => {
    setEditingItem({ type, areaId, subjectId: subjectId || undefined, item })
    setModalType(type)
    setSelectedAreaId(areaId)
    setSelectedSubjectId(subjectId)
    if (type === 'area') {
      setFormData({
        name: item.name,
        description: item.description || '',
        color: item.color,
        taskId: '',
      })
    } else if (type === 'subject') {
      setFormData({
        name: item.name,
        description: item.description || '',
        color: studyAreas.find(a => a.id === areaId)?.color || '#3b82f6',
        taskId: '',
      })
    } else if (type === 'class') {
      setFormData({
        name: item.title,
        description: item.description || '',
        color: studyAreas.find(a => a.id === areaId)?.color || '#3b82f6',
        taskId: item.taskId || '',
      })
    }
  }

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]
    )
  }

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      if (editingItem.type === 'area') {
        updateStudyArea(editingItem.item.id, {
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
        })
      } else if (editingItem.type === 'subject' && editingItem.areaId) {
        updateSubject(editingItem.areaId, editingItem.item.id, {
          name: formData.name,
          description: formData.description || undefined,
        })
      } else if (editingItem.type === 'class' && editingItem.subjectId) {
        updateClass(editingItem.subjectId, editingItem.item.id, {
          title: formData.name,
          description: formData.description || undefined,
          taskId: formData.taskId || undefined,
        })
      }
    } else {
      if (modalType === 'area') {
        const area: StudyArea = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
          subjects: [],
        }
        addStudyArea(area)
      } else if (modalType === 'subject' && selectedAreaId) {
        addSubject(selectedAreaId, {
          name: formData.name,
          description: formData.description || undefined,
          classes: [],
        })
      } else if (modalType === 'class' && selectedSubjectId) {
        addClass(selectedSubjectId, {
          title: formData.name,
          description: formData.description || undefined,
          taskId: formData.taskId || undefined,
          links: [],
          files: [],
          pomodoros: [],
          createdAt: new Date().toISOString(),
        })
      }
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3b82f6', taskId: '' })
    setModalType(null)
    setSelectedAreaId(null)
    setSelectedSubjectId(null)
    setEditingItem(null)
  }

  const handleStartPomodoro = (classId: string, subjectId: string) => {
    const duration = 25 // minutos padrão
    addPomodoro(classId, {
      duration,
      completedAt: new Date().toISOString(),
    })
  }

  // Estatísticas
  const stats = useMemo(() => {
    const totalAreas = studyAreas.length
    const totalSubjects = studyAreas.reduce((sum, area) => sum + area.subjects.length, 0)
    const totalClasses = studyAreas.reduce((sum, area) => 
      sum + area.subjects.reduce((subSum, subject) => subSum + subject.classes.length, 0), 0
    )
    const totalPomodoros = studyAreas.reduce((sum, area) => 
      sum + area.subjects.reduce((subSum, subject) => 
        subSum + subject.classes.reduce((classSum, classItem) => classSum + classItem.pomodoros.length, 0), 0
      ), 0
    )
    const totalMinutes = studyAreas.reduce((sum, area) => 
      sum + area.subjects.reduce((subSum, subject) => 
        subSum + subject.classes.reduce((classSum, classItem) => 
          classSum + classItem.pomodoros.reduce((pomSum, pom) => pomSum + pom.duration, 0), 0
        ), 0
      ), 0
    )

    return { totalAreas, totalSubjects, totalClasses, totalPomodoros, totalMinutes }
  }, [studyAreas])

  // Filtro de busca
  const filteredAreas = useMemo(() => {
    if (!searchQuery) return studyAreas

    const query = searchQuery.toLowerCase()
    return studyAreas
      .map(area => {
        const areaMatch = area.name.toLowerCase().includes(query) || 
          area.description?.toLowerCase().includes(query)
        
        const filteredSubjects = area.subjects
          .map(subject => {
            const subjectMatch = subject.name.toLowerCase().includes(query) || 
              subject.description?.toLowerCase().includes(query)
            
            const filteredClasses = subject.classes.filter(classItem =>
              classItem.title.toLowerCase().includes(query) ||
              classItem.description?.toLowerCase().includes(query)
            )
            
            return subjectMatch || filteredClasses.length > 0
              ? { ...subject, classes: filteredClasses.length > 0 ? filteredClasses : subject.classes }
              : null
          })
          .filter(Boolean) as Subject[]
        
        return areaMatch || filteredSubjects.length > 0
          ? { ...area, subjects: filteredSubjects }
          : null
      })
      .filter(Boolean) as StudyArea[]
  }, [studyAreas, searchQuery])

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="text-white" size={20} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Estudos
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Organize seus estudos de forma hierárquica
              </p>
            </div>
          </div>

          {/* Botão Rápido */}
          <div className="flex justify-center">
            <Button
              onClick={() => handleOpenModal('area')}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              size="md"
            >
              <Plus size={16} className="mr-2" />
              Nova Área de Estudo
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className={cn(
            "p-3 sm:p-4 border shadow-lg",
            "bg-gradient-to-br from-purple-50 to-purple-100/80 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/70 dark:border-purple-700/40"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md ring-2 ring-purple-200/50 flex-shrink-0">
                <FolderOpen className="text-white" size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Áreas</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-purple-700 dark:text-purple-400">
                  {stats.totalAreas}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-3 sm:p-4 border shadow-lg",
            "bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/70 dark:border-blue-700/40"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md ring-2 ring-blue-200/50 flex-shrink-0">
                <BookOpen className="text-white" size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Matérias</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-blue-700 dark:text-blue-400">
                  {stats.totalSubjects}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-3 sm:p-4 border shadow-lg",
            "bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border-success-200/70 dark:border-success-700/40"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md ring-2 ring-success-200/50 flex-shrink-0">
                <GraduationCap className="text-white" size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Aulas</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-success-700 dark:text-success-400">
                  {stats.totalClasses}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-3 sm:p-4 border shadow-lg",
            "bg-gradient-to-br from-warning-50 to-warning-100/80 dark:from-warning-900/20 dark:to-warning-800/20 border-warning-200/70 dark:border-warning-700/40"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-md ring-2 ring-warning-200/50 flex-shrink-0">
                <Timer className="text-white" size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Pomodoros</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-warning-700 dark:text-warning-400">
                  {stats.totalPomodoros}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-3 sm:p-4 border shadow-lg",
            "bg-gradient-to-br from-indigo-50 to-indigo-100/80 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200/70 dark:border-indigo-700/40"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-indigo-200/50 flex-shrink-0">
                <Clock className="text-white" size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Minutos</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-indigo-700 dark:text-indigo-400">
                  {stats.totalMinutes}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Busca */}
        <Card className="p-3 sm:p-4 md:p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar áreas, matérias ou aulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 text-sm sm:text-base"
            />
          </div>
        </Card>

        {/* Modal */}
        {modalType && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-4"
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
                  `bg-gradient-to-br from-purple-500 to-purple-600`
                )}>
                  {modalType === 'area' && <FolderOpen className="text-white" size={20} strokeWidth={2.5} />}
                  {modalType === 'subject' && <BookOpen className="text-white" size={20} strokeWidth={2.5} />}
                  {modalType === 'class' && <GraduationCap className="text-white" size={20} strokeWidth={2.5} />}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingItem 
                    ? `Editar ${modalType === 'area' ? 'Área' : modalType === 'subject' ? 'Matéria' : 'Aula'}`
                    : modalType === 'area' ? 'Nova Área de Estudo'
                    : modalType === 'subject' ? 'Nova Matéria'
                    : 'Nova Aula'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label={modalType === 'area' ? 'Nome da Área' : modalType === 'subject' ? 'Nome da Matéria' : 'Título da Aula'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={modalType === 'area' ? 'Ex: Programação, Matemática...' : modalType === 'subject' ? 'Ex: React, Cálculo...' : 'Ex: Introdução ao React...'}
                  required
                  className="text-sm sm:text-base"
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field text-sm sm:text-base"
                    rows={3}
                    placeholder="Adicione uma descrição..."
                  />
                </div>
                {modalType === 'area' && (
                  <Input
                    label="Cor"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="text-sm sm:text-base"
                  />
                )}
                {modalType === 'class' && (
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
                        Esta aula será vinculada à tarefa selecionada
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingItem ? 'Salvar' : 'Adicionar'}
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

        {/* Study Areas */}
        <div className="space-y-4">
          {filteredAreas.length > 0 ? (
            filteredAreas.map((area) => (
              <Card key={area.id} className={cn(
                "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg",
                "border-l-4"
              )} style={{ borderLeftColor: area.color }}>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleArea(area.id)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors active:scale-95 flex-shrink-0"
                    >
                      {expandedAreas.includes(area.id) ? (
                        <ChevronDown size={18} className="text-slate-600 dark:text-slate-400" />
                      ) : (
                        <ChevronRight size={18} className="text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: area.color }}
                    />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {area.name}
                    </h3>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {area.subjects.length} matéria{area.subjects.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedAreaId(area.id)
                        handleOpenModal('subject', area.id)
                      }}
                      className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors text-primary-600 dark:text-primary-400 active:scale-95"
                      title="Adicionar Matéria"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => handleEdit('area', area.id, null, area)}
                      className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors text-primary-600 dark:text-primary-400 active:scale-95"
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta área de estudo?')) {
                          deleteStudyArea(area.id)
                        }
                      }}
                      className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors text-danger-600 dark:text-danger-400 active:scale-95"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {area.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 ml-8 sm:ml-10">{area.description}</p>
                )}

                {/* Subjects */}
                {expandedAreas.includes(area.id) && (
                  <div className="ml-6 sm:ml-8 space-y-3 mt-3">
                    {area.subjects.length > 0 ? (
                      area.subjects.map((subject) => (
                        <Card key={subject.id} className={cn(
                          "p-3 transition-all duration-200",
                          "bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-900/20 dark:to-slate-800/20"
                        )}>
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <button
                                onClick={() => toggleSubject(subject.id)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors active:scale-95 flex-shrink-0"
                              >
                                {expandedSubjects.includes(subject.id) ? (
                                  <ChevronDown size={16} className="text-slate-600 dark:text-slate-400" />
                                ) : (
                                  <ChevronRight size={16} className="text-slate-600 dark:text-slate-400" />
                                )}
                              </button>
                              <BookOpen size={16} className="text-slate-600 dark:text-slate-400 flex-shrink-0" />
                              <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                {subject.name}
                              </h4>
                              <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg">
                                {subject.classes.length} aula{subject.classes.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                              <button
                                onClick={() => {
                                  setSelectedSubjectId(subject.id)
                                  handleOpenModal('class', area.id, subject.id)
                                }}
                                className="p-1.5 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors text-primary-600 dark:text-primary-400 active:scale-95"
                                title="Adicionar Aula"
                              >
                                <Plus size={12} />
                              </button>
                              <button
                                onClick={() => handleEdit('subject', area.id, subject.id, subject)}
                                className="p-1.5 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors text-primary-600 dark:text-primary-400 active:scale-95"
                                title="Editar"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Tem certeza que deseja excluir esta matéria?')) {
                                    deleteSubject(area.id, subject.id)
                                  }
                                }}
                                className="p-1.5 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors text-danger-600 dark:text-danger-400 active:scale-95"
                                title="Excluir"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {subject.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 ml-6 sm:ml-8">{subject.description}</p>
                          )}

                          {/* Classes */}
                          {expandedSubjects.includes(subject.id) && (
                            <div className="ml-4 sm:ml-6 space-y-2 mt-2">
                              {subject.classes.length > 0 ? (
                                subject.classes.map((classItem) => {
                                  const linkedTask = classItem.taskId ? getTaskById(classItem.taskId) : null
                                  return (
                                    <Card key={classItem.id} className={cn(
                                      "p-3 transition-all duration-200 hover:shadow-md",
                                      "bg-gradient-to-r from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-900/80"
                                    )}>
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h5 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                                              {classItem.title}
                                            </h5>
                                            {linkedTask && (
                                              <Link
                                                href="/produtividade/tarefas"
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                              >
                                                <Link2 size={10} />
                                                {linkedTask.title}
                                              </Link>
                                            )}
                                          </div>
                                          {classItem.description && (
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                              {classItem.description}
                                            </p>
                                          )}
                                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 rounded-lg">
                                              <Timer size={12} />
                                              {classItem.pomodoros.length} pomodoro{classItem.pomodoros.length !== 1 ? 's' : ''}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                              <Clock size={12} />
                                              {format(new Date(classItem.createdAt), "dd 'de' MMM", {
                                                locale: ptBR,
                                              })}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                          <button
                                            onClick={() =>
                                              handleStartPomodoro(classItem.id, subject.id)
                                            }
                                            className="p-1.5 hover:bg-success-100 dark:hover:bg-success-900/30 rounded-lg transition-colors text-success-600 dark:text-success-400 active:scale-95"
                                            title="Iniciar Pomodoro"
                                          >
                                            <Timer size={12} />
                                          </button>
                                          <button
                                            onClick={() => handleEdit('class', area.id, subject.id, classItem)}
                                            className="p-1.5 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors text-primary-600 dark:text-primary-400 active:scale-95"
                                            title="Editar"
                                          >
                                            <Edit2 size={12} />
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (confirm('Tem certeza que deseja excluir esta aula?')) {
                                                deleteClass(subject.id, classItem.id)
                                              }
                                            }}
                                            className="p-1.5 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors text-danger-600 dark:text-danger-400 active:scale-95"
                                            title="Excluir"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    </Card>
                                  )
                                })
                              ) : (
                                <Card className="p-4 text-center bg-slate-50 dark:bg-slate-800/50">
                                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    Nenhuma aula cadastrada ainda
                                  </p>
                                  <Button
                                    onClick={() => {
                                      setSelectedSubjectId(subject.id)
                                      handleOpenModal('class', area.id, subject.id)
                                    }}
                                    size="sm"
                                    className="mt-2 text-xs"
                                  >
                                    <Plus size={12} className="mr-1" />
                                    Adicionar Aula
                                  </Button>
                                </Card>
                              )}
                            </div>
                          )}
                        </Card>
                      ))
                    ) : (
                      <Card className="p-4 text-center bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Nenhuma matéria cadastrada ainda
                        </p>
                        <Button
                          onClick={() => {
                            setSelectedAreaId(area.id)
                            handleOpenModal('subject', area.id)
                          }}
                          size="sm"
                          className="mt-2 text-xs"
                        >
                          <Plus size={12} className="mr-1" />
                          Adicionar Matéria
                        </Button>
                      </Card>
                    )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card className="p-8 sm:p-12 text-center">
              <BookOpen className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery
                  ? 'Nenhum resultado encontrado'
                  : 'Nenhuma área de estudo cadastrada ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery
                  ? 'Tente ajustar sua busca'
                  : 'Clique no botão acima para começar!'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => handleOpenModal('area')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                  size="md"
                >
                  <Plus size={16} className="mr-2" />
                  Nova Área de Estudo
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
