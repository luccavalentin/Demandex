'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { AttractionGoal } from '@/types'
import { Plus, Trash2, Sparkles, Image as ImageIcon, Link as LinkIcon, Lightbulb } from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

export default function MuralPage() {
  const { attractionGoals, updateAttractionGoal, deleteAttractionGoal } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<AttractionGoal | null>(null)
  const [formData, setFormData] = useState({
    imageUrl: '',
    linkUrl: '',
    notes: '',
  })

  const handleAddImage = (goalId: string) => {
    if (formData.imageUrl) {
      const goal = attractionGoals.find((g) => g.id === goalId)
      if (goal) {
        updateAttractionGoal(goalId, {
          images: [...(goal.images || []), formData.imageUrl],
        })
        setFormData({ ...formData, imageUrl: '' })
      }
    }
  }

  const handleAddLink = (goalId: string) => {
    if (formData.linkUrl) {
      const goal = attractionGoals.find((g) => g.id === goalId)
      if (goal) {
        updateAttractionGoal(goalId, {
          links: [...(goal.links || []), formData.linkUrl],
        })
        setFormData({ ...formData, linkUrl: '' })
      }
    }
  }

  const handleUpdateNotes = (goalId: string) => {
    const goal = attractionGoals.find((g) => g.id === goalId)
    if (goal) {
      updateAttractionGoal(goalId, {
        notes: formData.notes,
      })
      setFormData({ ...formData, notes: '' })
      setIsModalOpen(false)
      setSelectedGoal(null)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Lightbulb className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Mural
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Visualize seus sonhos e objetivos com imagens e links
              </p>
            </div>
          </div>
        </div>

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

              {/* Images */}
              {goal.images && goal.images.length > 0 && (
                <div className="mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    {goal.images.map((image, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-slate-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${goal.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {goal.links && goal.links.length > 0 && (
                <div className="mb-3 space-y-1">
                  {goal.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <LinkIcon size={14} />
                      {link}
                    </a>
                  ))}
                </div>
              )}

              {/* Add Image */}
              <div className="mb-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="URL da imagem"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleAddImage(goal.id)}
                    className="px-4"
                  >
                    <ImageIcon size={16} />
                  </Button>
                </div>
              </div>

              {/* Add Link */}
              <div className="mb-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="URL do link"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleAddLink(goal.id)}
                    className="px-4"
                  >
                    <LinkIcon size={16} />
                  </Button>
                </div>
              </div>

              {/* Notes */}
              {goal.notes && (
                <div className="bg-purple-50 rounded-lg p-3 mb-2">
                  <p className="text-sm text-purple-900 italic">{goal.notes}</p>
                </div>
              )}

              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedGoal(goal)
                  setFormData({ ...formData, notes: goal.notes || '' })
                  setIsModalOpen(true)
                }}
                className="w-full text-sm"
              >
                Editar Observações
              </Button>
            </Card>
          ))}
        </div>

        {/* Modal for Notes */}
        {isModalOpen && selectedGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Observações - {selectedGoal.title}
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visualizações / Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={6}
                  placeholder="Descreva como você visualiza este objetivo se realizando..."
                />
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => handleUpdateNotes(selectedGoal.id)}
                  className="flex-1"
                >
                  Salvar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedGoal(null)
                    setFormData({ ...formData, notes: '' })
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {attractionGoals.length === 0 && (
          <Card className="p-12 text-center">
            <Sparkles size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500 mb-4">
              Nenhum objetivo cadastrado ainda. Vá para a página de Objetivos
              para criar um novo!
            </p>
            <Link href="/lei-atracao">
              <Button>Criar Objetivo</Button>
            </Link>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

