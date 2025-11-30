'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { StudyArea, Subject, Class } from '@/types'
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, BookOpen, Timer } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function EstudosPage() {
  const { studyAreas, addStudyArea, updateStudyArea, deleteStudyArea, addSubject, updateSubject, deleteSubject, addClass, updateClass, deleteClass, addPomodoro } = useStore()
  const [expandedAreas, setExpandedAreas] = useState<string[]>([])
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])
  const [modalType, setModalType] = useState<'area' | 'subject' | 'class' | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
  })

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
        links: [],
        files: [],
        pomodoros: [],
        createdAt: new Date().toISOString(),
      })
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3b82f6' })
    setModalType(null)
    setSelectedAreaId(null)
    setSelectedSubjectId(null)
  }

  const handleStartPomodoro = (classId: string, subjectId: string) => {
    const duration = 25 // minutos padrão
    addPomodoro(classId, {
      duration,
      completedAt: new Date().toISOString(),
    })
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Estudos
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Organize seus estudos de forma hierárquica
              </p>
            </div>
            <Button
              onClick={() => {
                setModalType('area')
                setFormData({ name: '', description: '', color: '#3b82f6' })
              }}
            >
              <Plus size={20} className="mr-2" />
              Nova Área
            </Button>
          </div>
        </div>

        {/* Modal */}
        {modalType && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {modalType === 'area' && 'Nova Área de Estudo'}
                {modalType === 'subject' && 'Nova Matéria'}
                {modalType === 'class' && 'Nova Aula'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={modalType === 'area' ? 'Nome da Área' : modalType === 'subject' ? 'Nome da Matéria' : 'Título da Aula'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                {modalType === 'area' && (
                  <Input
                    label="Cor"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                )}
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

        {/* Study Areas */}
        <div className="space-y-4">
          {studyAreas.map((area) => (
            <Card key={area.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleArea(area.id)}
                    className="p-1 hover:bg-slate-100 rounded-lg"
                  >
                    {expandedAreas.includes(area.id) ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </button>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {area.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAreaId(area.id)
                      setModalType('subject')
                      setFormData({ name: '', description: '', color: area.color })
                    }}
                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                    title="Adicionar Matéria"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => deleteStudyArea(area.id)}
                    className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-danger-600" />
                  </button>
                </div>
              </div>
              {area.description && (
                <p className="text-sm text-slate-600 mb-3 ml-8">{area.description}</p>
              )}

              {/* Subjects */}
              {expandedAreas.includes(area.id) && (
                <div className="ml-8 space-y-3 mt-3">
                  {area.subjects.map((subject) => (
                    <Card key={subject.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleSubject(subject.id)}
                            className="p-1 hover:bg-slate-100 rounded-lg"
                          >
                            {expandedSubjects.includes(subject.id) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          <BookOpen size={16} className="text-slate-600" />
                          <h4 className="font-semibold text-slate-900">
                            {subject.name}
                          </h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubjectId(subject.id)
                              setModalType('class')
                              setFormData({ name: '', description: '', color: area.color })
                            }}
                            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                            title="Adicionar Aula"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => deleteSubject(area.id, subject.id)}
                            className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} className="text-danger-600" />
                          </button>
                        </div>
                      </div>

                      {/* Classes */}
                      {expandedSubjects.includes(subject.id) && (
                        <div className="ml-6 space-y-2 mt-2">
                          {subject.classes.map((classItem) => (
                            <Card key={classItem.id} className="p-3 bg-slate-50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-slate-900 mb-1">
                                    {classItem.title}
                                  </h5>
                                  {classItem.description && (
                                    <p className="text-sm text-slate-600 mb-2">
                                      {classItem.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                      <Timer size={14} />
                                      {classItem.pomodoros.length} pomodoros
                                    </span>
                                    <span>
                                      {format(new Date(classItem.createdAt), "dd 'de' MMM", {
                                        locale: ptBR,
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleStartPomodoro(classItem.id, subject.id)
                                    }
                                    className="p-2 hover:bg-success-50 rounded-lg transition-colors text-success-600"
                                    title="Iniciar Pomodoro"
                                  >
                                    <Timer size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteClass(subject.id, classItem.id)}
                                    className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={14} className="text-danger-600" />
                                  </button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {studyAreas.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              Nenhuma área de estudo cadastrada ainda. Clique em "Nova Área" para
              começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

