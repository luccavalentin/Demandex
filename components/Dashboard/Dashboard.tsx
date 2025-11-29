'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Logo } from '@/components/UI/Logo'
import { useStore } from '@/lib/store'
import {
  Heart,
  DollarSign,
  CheckSquare,
  Target,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'

export default function Dashboard() {
  const {
    meals,
    workouts,
    sleeps,
    healthGoals,
    transactions,
    financialGoals,
    tasks,
    studyAreas,
    personalProjects,
    productivityGoals,
    attractionGoals,
  } = useStore()

  // Cálculos
  const today = new Date()
  const todayMeals = meals.filter(
    (m) => format(new Date(m.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  ).length
  const todayWorkouts = workouts.filter(
    (w) => format(new Date(w.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  ).length
  const todayTasks = tasks.filter((t) => t.status !== 'done').length
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done'
  ).length

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const completedHealthGoals = healthGoals.filter((g) => g.completed).length
  const completedFinancialGoals = financialGoals.filter((g) => g.completed).length
  const completedProductivityGoals = productivityGoals.filter((g) => g.completed).length

  const totalPomodoros = studyAreas.reduce(
    (sum, area) =>
      sum +
      area.subjects.reduce(
        (s, subject) =>
          s +
          subject.classes.reduce(
            (c, classItem) => c + classItem.pomodoros.length,
            0
          ),
        0
      ),
    0
  )

  const stats = [
    {
      title: 'Saúde',
      icon: Heart,
      color: 'from-success-500 to-success-600',
      items: [
        { label: 'Refeições hoje', value: todayMeals },
        { label: 'Treinos hoje', value: todayWorkouts },
        { label: 'Objetivos completos', value: `${completedHealthGoals}/${healthGoals.length}` },
      ],
      href: '/saude',
    },
    {
      title: 'Financeiro',
      icon: DollarSign,
      color: 'from-primary-500 to-primary-600',
      items: [
        { label: 'Saldo', value: `R$ ${balance.toFixed(2)}` },
        { label: 'Receitas', value: `R$ ${totalIncome.toFixed(2)}` },
        { label: 'Objetivos completos', value: `${completedFinancialGoals}/${financialGoals.length}` },
      ],
      href: '/financeiro',
    },
    {
      title: 'Produtividade',
      icon: CheckSquare,
      color: 'from-warning-500 to-warning-600',
      items: [
        { label: 'Tarefas pendentes', value: todayTasks },
        { label: 'Tarefas atrasadas', value: overdueTasks },
        { label: 'Pomodoros completos', value: totalPomodoros },
        { label: 'Objetivos completos', value: `${completedProductivityGoals}/${productivityGoals.length}` },
      ],
      href: '/produtividade',
    },
    {
      title: 'Lei da Atração',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      items: [
        { label: 'Objetivos cadastrados', value: attractionGoals.length },
        { label: 'Objetivos completos', value: attractionGoals.filter((g) => g.completed).length },
      ],
      href: '/lei-atracao',
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <Logo size="lg" showText={false} />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Dashboard
              </h1>
              <p className="text-base text-slate-600 font-medium">
                Visão geral das suas atividades
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card hover className="p-5 sm:p-6">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                    {stat.title}
                  </h3>
                  <div className="space-y-2">
                    {stat.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-slate-600 truncate pr-2">{item.label}</span>
                        <span className="font-medium text-slate-900 flex-shrink-0">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Tasks */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Tarefas Recentes
              </h2>
              <Link
                href="/produtividade/tarefas"
                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium transition-colors"
              >
                Ver todas
              </Link>
            </div>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {task.dueDate
                        ? format(new Date(task.dueDate), "dd 'de' MMM", {
                            locale: ptBR,
                          })
                        : 'Sem data'}
                    </p>
                  </div>
                  <span
                    className={`badge text-xs flex-shrink-0 ${
                      task.status === 'done'
                        ? 'badge-success'
                        : task.status === 'in-progress'
                        ? 'badge-warning'
                        : 'badge-primary'
                    }`}
                  >
                    {task.status === 'done'
                      ? 'Concluída'
                      : task.status === 'in-progress'
                      ? 'Em andamento'
                      : 'Pendente'}
                  </span>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  Nenhuma tarefa cadastrada ainda
                </p>
              )}
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                Resumo Financeiro
              </h2>
              <Link
                href="/financeiro"
                className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium transition-colors"
              >
                Ver detalhes
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-success-50 rounded-md border border-success-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-success-600 flex-shrink-0 w-5 h-5" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600">Receitas</p>
                    <p className="text-xl font-semibold text-success-700 truncate">
                      R$ {totalIncome.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-danger-50 rounded-md border border-danger-200">
                <div className="flex items-center gap-3">
                  <TrendingDown className="text-danger-600 flex-shrink-0 w-5 h-5" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600">Despesas</p>
                    <p className="text-xl font-semibold text-danger-700 truncate">
                      R$ {totalExpenses.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-md border border-primary-200">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-primary-600 flex-shrink-0 w-5 h-5" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-600">Saldo</p>
                    <p
                      className={`text-xl font-semibold truncate ${
                        balance >= 0 ? 'text-success-700' : 'text-danger-700'
                      }`}
                    >
                      R$ {balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/saude/alimentacao"
              className="p-4 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors text-center"
            >
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                Adicionar Refeição
              </p>
            </Link>
            <Link
              href="/saude/treino"
              className="p-4 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors text-center"
            >
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                Registrar Treino
              </p>
            </Link>
            <Link
              href="/financeiro/transacoes"
              className="p-4 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors text-center"
            >
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                Nova Transação
              </p>
            </Link>
            <Link
              href="/produtividade/tarefas"
              className="p-4 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors text-center"
            >
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                Nova Tarefa
              </p>
            </Link>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

