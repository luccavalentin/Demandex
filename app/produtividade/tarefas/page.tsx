'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { Task } from '@/types'
import { Plus, Trash2, Edit2, CheckCircle2, CheckSquare } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function TarefasPage() {
  const { tasks, addTask, updateTask, deleteTask } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const task: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      completedAt: formData.status === 'done' ? new Date().toISOString() : undefined,
    }

    if (editingTask) {
      updateTask(editingTask.id, task)
    } else {
      addTask(task)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    })
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const filteredTasks = tasks.filter(
    (task) => filter === 'all' || task.status === filter
  )

  const statusLabels = {
    todo: 'Pendente',
    'in-progress': 'Em Andamento',
    done: 'Concluída',
  }

  const priorityColors = {
    low: 'badge-primary',
    medium: 'badge-warning',
    high: 'badge-danger',
  }

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CheckSquare className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Tarefas
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Gerencie suas tarefas e atividades diárias
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'todo', 'in-progress', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {status === 'all' ? 'Todas' : statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as Task['status'] })
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as Task['priority'] })
                      }
                      className="input-field"
                    >
                      {Object.entries(priorityLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  label="Data de Vencimento"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingTask ? 'Salvar' : 'Adicionar'}
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

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== 'done'

            return (
              <Card key={task.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() =>
                          updateTask(task.id, {
                            status: task.status === 'done' ? 'todo' : 'done',
                            completedAt:
                              task.status === 'done'
                                ? undefined
                                : new Date().toISOString(),
                          })
                        }
                        className={`p-1 rounded-lg transition-colors ${
                          task.status === 'done'
                            ? 'bg-success-100 text-success-600'
                            : 'bg-slate-100 text-slate-400 hover:bg-success-100'
                        }`}
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-slate-900 ${
                            task.status === 'done' ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={priorityColors[task.priority]}>
                        {priorityLabels[task.priority]}
                      </span>
                      <span className="badge badge-primary">
                        {statusLabels[task.status]}
                      </span>
                      {task.dueDate && (
                        <span
                          className={`text-sm ${
                            isOverdue ? 'text-danger-600 font-semibold' : 'text-slate-600'
                          }`}
                        >
                          {format(new Date(task.dueDate), "dd 'de' MMM", {
                            locale: ptBR,
                          })}
                          {isOverdue && ' (Atrasada)'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingTask(task)
                        setFormData({
                          title: task.title,
                          description: task.description || '',
                          status: task.status,
                          priority: task.priority,
                          dueDate: task.dueDate || '',
                        })
                        setIsModalOpen(true)
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-danger-600" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-slate-500">
              {filter === 'all'
                ? 'Nenhuma tarefa cadastrada ainda. Clique em "Nova Tarefa" para começar!'
                : `Nenhuma tarefa com status "${statusLabels[filter]}".`}
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

