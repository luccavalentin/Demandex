'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import Link from 'next/link'
import { CheckSquare, BookOpen, FolderKanban, Target, ArrowRight } from 'lucide-react'

const productivityModules = [
  {
    title: 'Tarefas',
    description: 'Gerencie suas tarefas e atividades',
    icon: CheckSquare,
    href: '/produtividade/tarefas',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Estudos',
    description: 'Organize seus estudos de forma hierárquica',
    icon: BookOpen,
    href: '/produtividade/estudos',
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Projetos Pessoais',
    description: 'Ideias, metas e objetivos pessoais',
    icon: FolderKanban,
    href: '/produtividade/projetos',
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Objetivos',
    description: 'Metas de produtividade',
    icon: Target,
    href: '/produtividade/objetivos',
    color: 'from-success-500 to-success-600',
  },
]

export default function ProdutividadePage() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 flex items-center justify-center shadow-lg shadow-warning-500/30">
              <CheckSquare className="text-white" size={28} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                Produtividade
              </h1>
              <p className="text-base text-slate-600 font-medium">
                Organize suas tarefas, estudos e projetos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productivityModules.map((module) => {
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

