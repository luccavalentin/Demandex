'use client'

import React, { useState, useMemo } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import { Plus, Trash2, Edit2, Sparkles, X, Search, Image as ImageIcon, Video, Link2, Calendar, FileText } from 'lucide-react'
import { format, parseISO, isToday, isYesterday, startOfDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'

interface MuralItem {
  id: string
  title: string
  description?: string
  date: string
  images: string[]
  videos: string[]
  links: string[]
  notes?: string
  createdAt: string
}

export default function MuralPage() {
  const [murals, setMurals] = useState<MuralItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('attractionMurals')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMural, setEditingMural] = useState<MuralItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    imageUrl: '',
    videoUrl: '',
    linkUrl: '',
    notes: '',
  })

  const saveMurals = (newMurals: MuralItem[]) => {
    setMurals(newMurals)
    if (typeof window !== 'undefined') {
      localStorage.setItem('attractionMurals', JSON.stringify(newMurals))
    }
  }

  const handleOpenModal = (date?: string) => {
    const dateToUse = date || selectedDate
    setFormData({
      title: '',
      description: '',
      date: dateToUse,
      imageUrl: '',
      videoUrl: '',
      linkUrl: '',
      notes: '',
    })
    setEditingMural(null)
    setIsModalOpen(true)
  }

  const handleEdit = (mural: MuralItem) => {
    setEditingMural(mural)
    setFormData({
      title: mural.title,
      description: mural.description || '',
      date: mural.date,
      imageUrl: '',
      videoUrl: '',
      linkUrl: '',
      notes: mural.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mural: MuralItem = {
      id: editingMural?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date,
      images: editingMural?.images || [],
      videos: editingMural?.videos || [],
      links: editingMural?.links || [],
      notes: formData.notes || undefined,
      createdAt: editingMural?.createdAt || new Date().toISOString(),
    }

    if (editingMural) {
      const updated = murals.map(m => m.id === mural.id ? mural : m)
      saveMurals(updated)
    } else {
      saveMurals([...murals, mural])
    }
    resetForm()
  }

  const handleAddImage = () => {
    if (formData.imageUrl && editingMural) {
      const updated = murals.map(m =>
        m.id === editingMural.id
          ? { ...m, images: [...m.images, formData.imageUrl] }
          : m
      )
      saveMurals(updated)
      setFormData({ ...formData, imageUrl: '' })
      setEditingMural(updated.find(m => m.id === editingMural.id) || null)
    }
  }

  const handleAddVideo = () => {
    if (formData.videoUrl && editingMural) {
      const updated = murals.map(m =>
        m.id === editingMural.id
          ? { ...m, videos: [...m.videos, formData.videoUrl] }
          : m
      )
      saveMurals(updated)
      setFormData({ ...formData, videoUrl: '' })
      setEditingMural(updated.find(m => m.id === editingMural.id) || null)
    }
  }

  const handleAddLink = () => {
    if (formData.linkUrl && editingMural) {
      const updated = murals.map(m =>
        m.id === editingMural.id
          ? { ...m, links: [...m.links, formData.linkUrl] }
          : m
      )
      saveMurals(updated)
      setFormData({ ...formData, linkUrl: '' })
      setEditingMural(updated.find(m => m.id === editingMural.id) || null)
    }
  }

  const handleRemoveImage = (muralId: string, index: number) => {
    const updated = murals.map(m =>
      m.id === muralId
        ? { ...m, images: m.images.filter((_, i) => i !== index) }
        : m
    )
    saveMurals(updated)
  }

  const handleRemoveVideo = (muralId: string, index: number) => {
    const updated = murals.map(m =>
      m.id === muralId
        ? { ...m, videos: m.videos.filter((_, i) => i !== index) }
        : m
    )
    saveMurals(updated)
  }

  const handleRemoveLink = (muralId: string, index: number) => {
    const updated = murals.map(m =>
      m.id === muralId
        ? { ...m, links: m.links.filter((_, i) => i !== index) }
        : m
    )
    saveMurals(updated)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      imageUrl: '',
      videoUrl: '',
      linkUrl: '',
      notes: '',
    })
    setEditingMural(null)
    setIsModalOpen(false)
  }

  const filteredMurals = useMemo(() => {
    return murals.filter((mural) => {
      const searchMatch = !searchQuery ||
        mural.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mural.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mural.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      return searchMatch
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [murals, searchQuery])

  const muralsByDate = useMemo(() => {
    const grouped: Record<string, MuralItem[]> = {}
    filteredMurals.forEach(mural => {
      const dateKey = mural.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(mural)
    })
    return grouped
  }, [filteredMurals])

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="text-white" size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                Mural da Lei da Atração
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
                Organize seus sonhos e objetivos por data com fotos, vídeos e links
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <Button
              onClick={() => handleOpenModal()}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              size="md"
            >
              <Plus size={16} className="mr-2" />
              Novo Mural
            </Button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Busca */}
        <Card className="p-3 sm:p-4 md:p-5 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar murais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 text-sm sm:text-base w-full"
            />
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
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative animate-scale-in">
              <button
                onClick={resetForm}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors z-10"
                aria-label="Fechar"
              >
                <X size={18} className="text-slate-600" />
              </button>
              <div className="mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4">
                  <Sparkles className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pr-8">
                  {editingMural ? 'Editar Mural' : 'Novo Mural'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  label="Título do Mural"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Minha casa dos sonhos..."
                  required
                  className="text-sm sm:text-base"
                />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                    rows={3}
                    placeholder="Descreva seu objetivo ou sonho..."
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                    required
                  />
                </div>

                {editingMural && (
                  <>
                    {/* Adicionar Imagem */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <ImageIcon size={16} />
                        Adicionar Imagem (URL)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://exemplo.com/imagem.jpg"
                          className="flex-1 text-sm sm:text-base"
                        />
                        <Button
                          type="button"
                          onClick={handleAddImage}
                          disabled={!formData.imageUrl}
                          size="md"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      {editingMural.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {editingMural.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img}
                                alt={`Imagem ${idx + 1}`}
                                className="w-full aspect-square object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(editingMural.id, idx)}
                                className="absolute top-1 right-1 p-1 bg-danger-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Adicionar Vídeo */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Video size={16} />
                        Adicionar Vídeo (URL)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                          className="flex-1 text-sm sm:text-base"
                        />
                        <Button
                          type="button"
                          onClick={handleAddVideo}
                          disabled={!formData.videoUrl}
                          size="md"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      {editingMural.videos.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {editingMural.videos.map((video, idx) => (
                            <div key={idx} className="relative group bg-slate-100 rounded-lg p-2">
                              <div className="flex items-center justify-between">
                                <a
                                  href={video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 flex-1 min-w-0"
                                >
                                  <Video size={14} />
                                  <span className="truncate">{video}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVideo(editingMural.id, idx)}
                                  className="p-1 text-danger-600 hover:bg-danger-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Adicionar Link */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <Link2 size={16} />
                        Adicionar Link
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          value={formData.linkUrl}
                          onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                          placeholder="https://exemplo.com"
                          className="flex-1 text-sm sm:text-base"
                        />
                        <Button
                          type="button"
                          onClick={handleAddLink}
                          disabled={!formData.linkUrl}
                          size="md"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      {editingMural.links.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {editingMural.links.map((link, idx) => (
                            <div key={idx} className="relative group bg-slate-100 rounded-lg p-2">
                              <div className="flex items-center justify-between">
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 flex-1 min-w-0"
                                >
                                  <Link2 size={14} />
                                  <span className="truncate">{link}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLink(editingMural.id, idx)}
                                  className="p-1 text-danger-600 hover:bg-danger-50 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Visualizações / Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field text-sm sm:text-base w-full"
                    rows={4}
                    placeholder="Descreva como você visualiza este objetivo se realizando..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button type="submit" className="flex-1 w-full sm:w-auto" size="md">
                    {editingMural ? 'Salvar' : 'Criar Mural'}
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

        {/* Lista de Murais por Data */}
        {Object.keys(muralsByDate).length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(muralsByDate)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([date, dateMurals]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Calendar className="text-purple-600" size={18} />
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {getDateLabel(date)}
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({dateMurals.length} {dateMurals.length === 1 ? 'mural' : 'murais'})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {dateMurals.map((mural) => (
                      <Card
                        key={mural.id}
                        className="p-3 sm:p-4 transition-all duration-200 hover:shadow-lg overflow-hidden border-l-4 border-purple-500"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 break-words">
                              {mural.title}
                            </h3>
                            {mural.description && (
                              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 break-words">
                                {mural.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(mural)}
                              className="p-1.5 sm:p-2 hover:bg-primary-100 rounded-lg transition-colors active:scale-95"
                              aria-label="Editar"
                            >
                              <Edit2 size={12} className="text-primary-600" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este mural?')) {
                                  saveMurals(murals.filter(m => m.id !== mural.id))
                                }
                              }}
                              className="p-1.5 sm:p-2 hover:bg-danger-100 rounded-lg transition-colors active:scale-95"
                              aria-label="Excluir"
                            >
                              <Trash2 size={12} className="text-danger-600" />
                            </button>
                          </div>
                        </div>

                        {/* Imagens */}
                        {mural.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {mural.images.slice(0, 4).map((img, idx) => (
                              <div key={idx} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                                <img
                                  src={img}
                                  alt={`${mural.title} ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            ))}
                            {mural.images.length > 4 && (
                              <div className="aspect-square bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-semibold text-purple-700">
                                  +{mural.images.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Vídeos */}
                        {mural.videos.length > 0 && (
                          <div className="space-y-1 mb-3">
                            {mural.videos.map((video, idx) => (
                              <a
                                key={idx}
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs sm:text-sm text-primary-600 hover:text-primary-700 p-2 bg-primary-50 rounded-lg"
                              >
                                <Video size={14} />
                                <span className="truncate">Vídeo {idx + 1}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Links */}
                        {mural.links.length > 0 && (
                          <div className="space-y-1 mb-3">
                            {mural.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs sm:text-sm text-primary-600 hover:text-primary-700 p-2 bg-primary-50 rounded-lg"
                              >
                                <Link2 size={14} />
                                <span className="truncate">{link}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Notas */}
                        {mural.notes && (
                          <div className="p-2 sm:p-3 bg-purple-50 rounded-lg mb-2 sm:mb-3">
                            <p className="text-xs sm:text-sm italic text-purple-800 line-clamp-3 break-words">
                              {mural.notes}
                            </p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Card className="p-8 sm:p-12 text-center col-span-full">
            <Sparkles className="mx-auto mb-4 text-slate-400" size={40} />
            <p className="text-slate-500 text-base sm:text-lg font-medium mb-2">
              {searchQuery
                ? 'Nenhum mural encontrado'
                : 'Nenhum mural cadastrado ainda'}
            </p>
            <p className="text-slate-400 text-sm sm:text-base mb-4">
              {searchQuery
                ? 'Tente ajustar sua busca'
                : 'Clique no botão acima para criar seu primeiro mural!'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                size="md"
              >
                <Plus size={16} className="mr-2" />
                Novo Mural
              </Button>
            )}
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

