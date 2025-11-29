'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import Link from 'next/link'
import { Wallet, Target, PiggyBank, TrendingUp, ArrowRight, DollarSign } from 'lucide-react'

const financeModules = [
  {
    title: 'Transações',
    description: 'Cadastre receitas e despesas',
    icon: Wallet,
    href: '/financeiro/transacoes',
    color: 'from-primary-500 to-primary-600',
  },
  {
    title: 'Metas Financeiras',
    description: 'Defina e acompanhe suas metas',
    icon: Target,
    href: '/financeiro/metas',
    color: 'from-success-500 to-success-600',
  },
  {
    title: 'Reserva de Emergência',
    description: 'Controle sua reserva financeira',
    icon: PiggyBank,
    href: '/financeiro/reserva',
    color: 'from-warning-500 to-warning-600',
  },
  {
    title: 'Investimentos',
    description: 'Gerencie seus investimentos',
    icon: TrendingUp,
    href: '/financeiro/investimentos',
    color: 'from-purple-500 to-purple-600',
  },
]

export default function FinanceiroPage() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <DollarSign className="text-white" size={28} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                Gestão Financeira
              </h1>
              <p className="text-base text-slate-600 font-medium">
                Controle completo das suas finanças pessoais
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financeModules.map((module) => {
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

