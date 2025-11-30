'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { PersonalProject } from '@/types'
import { Plus, Trash2, Edit2, FolderKanban, CheckSquare } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function ProjetosPage() {
  const { personalProjects, tasks, addPersonalProject, updatePersonalProject, deletePersonalProject } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PersonalProject | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'idea' as PersonalProject['status'],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const project: PersonalProject = {
      id: editingProject?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      tasks: [],
      images: [],
      links: [],
      createdAt: editingProject?.createdAt || new Date().toISOString(),
    }

    if (editingProject) {
      updatePersonalProject(editingProject.id, project)
    } else {
      addPersonalProject(project)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'idea' })
    setEditingProject(null)
    setIsModalOpen(false)
  }

  const statusLabels = {
    idea: 'Ideia',
    planning: 'Planejamento',
    'in-progress': 'Em Andamento',
    completed: 'Concluído',
  }

  const statusColors = {
    idea: 'badge-primary',
    planning: 'badge-warning',
    'in-progress': 'badge-primary',
    completed: 'badge-success',
  }

  const projectTasks = (project: PersonalProject) => {
    return tasks.filter((task) => project.tasks.includes(task.id))
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FolderKanban className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Projetos Pessoais
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Organize suas ideias, metas e objetivos pessoais
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
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
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as PersonalProject['status'] })
                    }
                    className="input-field"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingProject ? 'Salvar' : 'Adicionar'}
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personalProjects.map((project) => {
            const projectTasksList = projectTasks(project)
            return (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="text-orange-600" size={20} />
                    <h3 className="text-lg font-semibold text-slate-900">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProject(project)
                        setFormData({
                          title: project.title,
                          description: project.description || '',
                          status: project.status,
                        })
                        setIsModalOpen(true)
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => deletePersonalProject(project.id)}
                      className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-danger-600" />
                    </button>
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className={statusColors[project.status]}>
                    {statusLabels[project.status]}
                  </span>
                  {projectTasksList.length > 0 && (
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <CheckSquare size={14} />
                      {projectTasksList.length} tarefa{projectTasksList.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Criado em{' '}
                  {format(new Date(project.createdAt), "dd 'de' MMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </Card>
            )
          })}
        </div>

        {personalProjects.length === 0 && (
          <Card className="p-12 text-center">
            <FolderKanban size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">
              Nenhum projeto cadastrado ainda. Clique em "Novo Projeto" para
              começar!
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

