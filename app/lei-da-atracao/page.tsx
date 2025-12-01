'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Sparkles, Target, Image as ImageIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LeiDaAtracaoPage() {
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
                Lei da Atração
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
                Manifeste seus sonhos e objetivos na realidade
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link href="/lei-da-atracao/objetivos">
            <Card className="p-4 sm:p-5 md:p-6 transition-all duration-200 hover:shadow-lg cursor-pointer border-l-4 border-purple-500 h-full">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <Target className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Objetivos
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Registre seus sonhos e objetivos e acompanhe seu progresso de manifestação
                  </p>
                  <div className="flex items-center text-primary-600 font-medium text-xs sm:text-sm">
                    Acessar <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/lei-da-atracao/mural">
            <Card className="p-4 sm:p-5 md:p-6 transition-all duration-200 hover:shadow-lg cursor-pointer border-l-4 border-pink-500 h-full">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <ImageIcon className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Mural
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3">
                    Crie murais visuais com fotos, vídeos e links organizados por data
                  </p>
                  <div className="flex items-center text-primary-600 font-medium text-xs sm:text-sm">
                    Acessar <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Informações */}
        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100/80 border-purple-200/70">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-white" size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Sobre a Lei da Atração
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                A Lei da Atração é baseada na ideia de que pensamentos positivos atraem experiências positivas. 
                Use esta seção para registrar seus objetivos, criar murais visuais e acompanhar sua jornada de manifestação. 
                Visualize seus sonhos, mantenha o foco e acredite na realização!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

