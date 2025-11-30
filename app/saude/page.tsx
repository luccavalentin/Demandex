'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import Link from 'next/link'
import { UtensilsCrossed, Dumbbell, Moon, Target, ArrowRight, Heart } from 'lucide-react'

const healthModules = [
  {
    title: 'Alimentação',
    description: 'Controle suas refeições e nutrição',
    icon: UtensilsCrossed,
    href: '/saude/alimentacao',
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Treino',
    description: 'Acompanhe seus exercícios e treinos',
    icon: Dumbbell,
    href: '/saude/treino',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Sono',
    description: 'Monitore a qualidade do seu sono',
    icon: Moon,
    href: '/saude/sono',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    title: 'Objetivos',
    description: 'Metas relacionadas à sua saúde',
    icon: Target,
    href: '/saude/objetivos',
    color: 'from-success-500 to-success-600',
  },
]

export default function SaudePage() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success-500 via-success-600 to-success-700 flex items-center justify-center shadow-lg shadow-success-500/30">
              <Heart className="text-white" size={28} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                Gestão da Minha Saúde
              </h1>
              <p className="text-base text-slate-600 dark:text-white font-medium">
                Cuide do seu bem-estar físico e mental
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthModules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.title} href={module.href}>
                <Card hover className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${module.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-slate-600 mb-4">{module.description}</p>
                  <div className="flex items-center text-primary-600 font-medium">
                    Acessar <ArrowRight size={16} className="ml-2" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </MainLayout>
  )
}

