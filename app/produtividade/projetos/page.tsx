'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { PersonalProject } from '@/types'
import { Plus, Trash2, Edit2, FolderKanban, CheckSquare, X, Search, Link2, Lightbulb, Calendar, PlayCircle, CheckCircle, Filter, Target } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function ProjetosPage() {
  const { personalProjects, tasks, addPersonalProject, updatePersonalProject, deletePersonalProject } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PersonalProject | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | PersonalProject['status']>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'idea' as PersonalProject['status'],
    taskId: '',
  })

  const handleOpenModal = (status?: PersonalProject['status']) => {
    setFormData({ 
      title: '', 
      description: '', 
      status: status || 'idea',
      taskId: '',
    })
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const project: PersonalProject = {
      id: editingProject?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      tasks: editingProject?.tasks || [],
      images: editingProject?.images || [],
      links: editingProject?.links || [],
      taskId: formData.taskId || undefined,
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
    setFormData({ title: '', description: '', status: 'idea', taskId: '' })
    setEditingProject(null)
    setIsModalOpen(false)
  }

  const handleEdit = (project: PersonalProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status,
      taskId: project.taskId || '',
    })
    setIsModalOpen(true)
  }

  const statusLabels = {
    idea: 'Ideia',
    planning: 'Planejamento',
    'in-progress': 'Em Andamento',
    completed: 'Concluído',
  }

  const statusIcons = {
    idea: Lightbulb,
    planning: Calendar,
    'in-progress': PlayCircle,
    completed: CheckCircle,
  }

  const statusColors = {
    idea: {
      bg: 'from-primary-50 to-primary-100/80',
      border: 'border-primary-200/70',
      icon: 'from-primary-500 to-primary-600',
      text: 'text-primary-700',
    },
    planning: {
      bg: 'from-warning-50 to-warning-100/80',
      border: 'border-warning-200/70',
      icon: 'from-warning-500 to-warning-600',
      text: 'text-warning-700',
    },
    'in-progress': {
      bg: 'from-blue-50 to-blue-100/80',
      border: 'border-blue-200/70',
      icon: 'from-blue-500 to-blue-600',
      text: 'text-blue-700',
    },
    completed: {
      bg: 'from-success-50 to-success-100/80',
      border: 'border-success-200/70',
      icon: 'from-success-500 to-success-600',
      text: 'text-success-700',
    },
  }

  const filteredProjects = useMemo(() => {
    return personalProjects.filter((project) => {
      // Filtro por status
      const statusMatch = filterStatus === 'all' || project.status === filterStatus
      
      // Filtro por busca
      const searchMatch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return statusMatch && searchMatch
    })
  }, [personalProjects, filterStatus, searchQuery])

  // Estatísticas
  const stats = useMemo(() => {
    const all = personalProjects.length
    const idea = personalProjects.filter(p => p.status === 'idea').length
    const planning = personalProjects.filter(p => p.status === 'planning').length
    const inProgress = personalProjects.filter(p => p.status === 'in-progress').length
    const completed = personalProjects.filter(p => p.status === 'completed').length

    return { all, idea, planning, inProgress, completed }
  }, [personalProjects])

  const projectTasks = (project: PersonalProject) => {
    return tasks.filter((task) => project.tasks.includes(task.id))
  }

  // Tarefas disponíveis para vincular
  const availableTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'done')
  }, [tasks])

  const getTaskById = (taskId: string) => {
    return tasks.find(t => t.id === taskId)
  }

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <FolderKanban className="text-white" size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                Projetos Pessoais
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
                Organize suas ideias, metas e objetivos pessoais
              </p>
            </div>
          </div>

          {/* Botões Rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button
              onClick={() => handleOpenModal('idea')}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <Lightbulb size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Nova Ideia</span>
            </Button>
            <Button
              onClick={() => handleOpenModal('planning')}
              className="w-full bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <Calendar size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Planejamento</span>
            </Button>
            <Button
              onClick={() => handleOpenModal('in-progress')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <PlayCircle size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Em Andamento</span>
            </Button>
            <Button
              onClick={() => handleOpenModal()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm px-2 sm:px-4"
              size="md"
            >
              <Plus size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Novo Projeto</span>
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/20 dark:to-slate-800/20 border-slate-200/70 dark:border-slate-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200/50 flex-shrink-0">
                <FolderKanban className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Total</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white truncate">
                  {stats.all}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-primary-50 to-primary-100/80 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200/70 dark:border-primary-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md ring-2 ring-primary-200/50 flex-shrink-0">
                <Lightbulb className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Ideias</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary-700 dark:text-primary-400 truncate">
                  {stats.idea}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-warning-50 to-warning-100/80 dark:from-warning-900/20 dark:to-warning-800/20 border-warning-200/70 dark:border-warning-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-md ring-2 ring-warning-200/50 flex-shrink-0">
                <Calendar className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Planejamento</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-warning-700 dark:text-warning-400 truncate">
                  {stats.planning}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/70 dark:border-blue-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md ring-2 ring-blue-200/50 flex-shrink-0">
                <PlayCircle className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Andamento</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-700 dark:text-blue-400 truncate">
                  {stats.inProgress}
                </p>
              </div>
            </div>
          </Card>
          <Card className={cn(
            "p-2 sm:p-3 md:p-4 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-success-50 to-success-100/80 dark:from-success-900/20 dark:to-success-800/20 border-success-200/70 dark:border-success-700/40"
          )}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md ring-2 ring-success-200/50 flex-shrink-0">
                <CheckCircle className="text-white" size={12} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5 truncate">Concluídos</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-success-700 dark:text-success-400 truncate">
                  {stats.completed}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="p-3 sm:p-4 md:p-5 overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 text-sm sm:text-base w-full"
              />
            </div>

            {/* Filtro de Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Filter size={14} />
                Filtros
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {(['all', 'idea', 'planning', 'in-progress', 'completed'] as const).map((status) => {
                  const Icon = status === 'all' ? Filter : statusIcons[status]
                  const colors = status === 'all' 
                    ? { icon: 'from-slate-500 to-slate-600' }
                    : statusColors[status]
                  return (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={cn(
                        "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0",
                        filterStatus === status
                          ? `bg-gradient-to-r ${status === 'all' ? 'from-slate-500 to-slate-600' : colors.icon} text-white shadow-md`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}
                    >
                      <Icon size={12} className="flex-shrink-0" />
                      <span className="truncate">{status === 'all' ? 'Todos' : statusLabels[status]}</span>
                    </button>
                  )
                })}
              </div>
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
                  `bg-gradient-to-br ${statusColors[formData.status].icon}`
                )}>
                  {React.createElement(statusIcons[formData.status], {
                    className: "text-white",
                    size: 20,
                    strokeWidth: 2.5
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pr-8">
                  {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label="Título"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Criar aplicativo mobile..."
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
                    className="input-field text-sm sm:text-base w-full"
                    rows={4}
                    placeholder="Descreva seu projeto..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(statusLabels).map(([key, label]) => {
                      const Icon = statusIcons[key as PersonalProject['status']]
                      const colors = statusColors[key as PersonalProject['status']]
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: key as PersonalProject['status'] })}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg font-medium transition-all duration-200 text-xs",
                            formData.status === key
                              ? `bg-gradient-to-r ${colors.icon} text-white shadow-md`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          <Icon size={14} />
                          <span className="hidden sm:inline truncate">{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Link2 size={16} />
                    Vincular a Tarefa (opcional)
                  </label>
                  <select
                    value={formData.taskId}
                    onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
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
                      Este projeto será vinculado à tarefa selecionada
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingProject ? 'Salvar' : 'Adicionar'}
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const projectTasksList = projectTasks(project)
              const statusConfig = statusColors[project.status]
              const linkedTask = project.taskId ? getTaskById(project.taskId) : null

              return (
                <Card key={project.id} className={cn(
                  "p-3 sm:p-4 transition-all duration-200 hover:shadow-lg overflow-hidden",
                  `border-l-4 bg-gradient-to-r ${statusConfig.bg} ${statusConfig.border}`
                )}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0",
                          `bg-gradient-to-br ${statusConfig.icon}`
                        )}>
                          {React.createElement(statusIcons[project.status], {
                            className: "text-white",
                            size: 16,
                            strokeWidth: 2.5
                          })}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white break-words flex-1 min-w-0">
                          {project.title}
                        </h3>
                      </div>
                      {project.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 break-words">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1.5 sm:p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Editar"
                      >
                        <Edit2 size={12} className="text-primary-600 dark:text-primary-400" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este projeto?')) {
                            deletePersonalProject(project.id)
                          }
                        }}
                        className="p-1.5 sm:p-2 hover:bg-danger-100 dark:hover:bg-danger-900/30 rounded-lg transition-colors active:scale-95"
                        aria-label="Excluir"
                      >
                        <Trash2 size={12} className="text-danger-600 dark:text-danger-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
                    <span className={cn(
                      "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap",
                      `bg-gradient-to-r ${statusConfig.icon} text-white`
                    )}>
                      {statusLabels[project.status]}
                    </span>
                    {projectTasksList.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs md:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 whitespace-nowrap">
                        <CheckSquare size={10} className="flex-shrink-0" />
                        {projectTasksList.length} tarefa{projectTasksList.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {linkedTask && (
                      <Link
                        href="/produtividade/tarefas"
                        className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] sm:text-xs font-medium rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Link2 size={10} />
                        <span className="truncate max-w-[100px] sm:max-w-none">{linkedTask.title}</span>
                      </Link>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Criado em {format(new Date(project.createdAt), "dd 'de' MMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 sm:p-12 text-center col-span-full">
              <FolderKanban className="mx-auto mb-4 text-slate-400" size={40} />
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium mb-2">
                {searchQuery || filterStatus !== 'all'
                  ? 'Nenhum projeto encontrado'
                  : 'Nenhum projeto cadastrado ainda'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base mb-4">
                {searchQuery || filterStatus !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Clique nos botões acima para começar!'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                  size="md"
                >
                  <Plus size={16} className="mr-2" />
                  Novo Projeto
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
