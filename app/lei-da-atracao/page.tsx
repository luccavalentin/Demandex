'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Sparkles, Target, Image as ImageIcon, ArrowRight, Star, Heart } from 'lucide-react'
import Link from 'next/link'

export default function LeiDaAtracaoPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Header Melhorado */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 sm:gap-5 mb-6 sm:mb-8 text-center">
            {/* Ícone com animação e efeito brilhante */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-purple-500/40 transform hover:scale-105 transition-transform duration-300">
                <Sparkles className="text-white" size={32} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent mb-2">
                Lei da Atração
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                Manifeste seus sonhos e objetivos na realidade através da visualização e foco
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Navegação Melhorados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link href="/lei-da-atracao/objetivos" className="group">
            <Card className="p-6 sm:p-8 h-full relative overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
              {/* Gradiente de fundo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                {/* Ícone melhorado */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    Objetivos
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                    Registre seus sonhos e objetivos e acompanhe seu progresso de manifestação. Visualize suas metas e transforme-as em realidade.
                  </p>
                  <div className="flex items-center text-purple-600 font-semibold text-sm sm:text-base group-hover:text-purple-700 transition-colors">
                    Acessar 
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Borda lateral colorida */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-violet-600 rounded-l-xl"></div>
            </Card>
          </Link>

          <Link href="/lei-da-atracao/mural" className="group">
            <Card className="p-6 sm:p-8 h-full relative overflow-hidden border-2 border-transparent hover:border-pink-300 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-1">
              {/* Gradiente de fundo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                {/* Ícone melhorado */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-pink-400 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="text-white" size={28} strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Mural
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">
                    Crie murais visuais inspiradores com fotos, vídeos e links organizados por data. Visualize seus sonhos de forma criativa.
                  </p>
                  <div className="flex items-center text-pink-600 font-semibold text-sm sm:text-base group-hover:text-pink-700 transition-colors">
                    Acessar 
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Borda lateral colorida */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-rose-600 rounded-l-xl"></div>
            </Card>
          </Link>
        </div>

        {/* Card de Informações Melhorado */}
        <Card className="p-6 sm:p-8 md:p-10 relative overflow-hidden border-2 border-purple-200/50 bg-gradient-to-br from-purple-50 via-pink-50/30 to-violet-50/50">
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            {/* Ícone decorativo */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={24} strokeWidth={2.5} />
              </div>
              {/* Estrelas decorativas */}
              <Star className="absolute -top-1 -right-1 text-yellow-400" size={16} fill="currentColor" />
              <Heart className="absolute -bottom-1 -left-1 text-pink-400" size={14} fill="currentColor" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>Sobre a Lei da Atração</span>
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p>
                  A <strong className="text-purple-600">Lei da Atração</strong> é baseada na ideia de que pensamentos positivos atraem experiências positivas. 
                  Nossos pensamentos e emoções têm o poder de manifestar nossa realidade.
                </p>
                <p>
                  Use esta seção para <strong className="text-pink-600">registrar seus objetivos</strong>, criar murais visuais inspiradores e 
                  acompanhar sua jornada de manifestação. Visualize seus sonhos, mantenha o foco e acredite na realização!
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">Visualização</span>
                  <span className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold">Foco</span>
                  <span className="px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">Manifestação</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

