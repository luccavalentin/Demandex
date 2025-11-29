'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import Link from 'next/link'
import { Card } from '@/components/UI/Card'
import { Target, ArrowRight } from 'lucide-react'

export default function ObjetivosFinanceirosPage() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-success-500 via-success-600 to-success-700 flex items-center justify-center shadow-lg shadow-success-500/30">
              <Target className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Objetivos Financeiros
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Gerencie seus objetivos financeiros
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Target className="text-primary-600" size={32} />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Metas Financeiras
              </h2>
              <p className="text-slate-600">
                Defina e acompanhe suas metas financeiras
              </p>
            </div>
          </div>
          <Link href="/financeiro/metas">
            <div className="flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Acessar Metas <ArrowRight size={16} className="ml-2" />
            </div>
          </Link>
        </Card>
      </div>
    </MainLayout>
  )
}

