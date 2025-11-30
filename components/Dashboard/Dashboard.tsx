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
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

  // Cálculos de progresso
  const healthProgress = healthGoals.length > 0 
    ? Math.round((completedHealthGoals / healthGoals.length) * 100) 
    : 0
  const financialProgress = financialGoals.length > 0 
    ? Math.round((completedFinancialGoals / financialGoals.length) * 100) 
    : 0
  const productivityProgress = productivityGoals.length > 0 
    ? Math.round((completedProductivityGoals / productivityGoals.length) * 100) 
    : 0
  const stats = [
    {
      title: 'Saúde',
      icon: Heart,
      color: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      progress: healthProgress,
      progressColor: 'bg-success-500',
      items: [
        { label: 'Refeições hoje', value: todayMeals, target: 3, icon: '🍽️' },
        { label: 'Treinos hoje', value: todayWorkouts, target: 1, icon: '💪' },
        { label: 'Objetivos', value: `${completedHealthGoals}/${healthGoals.length || 0}`, progress: healthProgress },
      ],
      href: '/saude',
    },
    {
      title: 'Produtividade',
      icon: CheckSquare,
      color: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      progress: productivityProgress,
      progressColor: 'bg-warning-500',
      items: [
        { label: 'Tarefas pendentes', value: todayTasks, icon: '📋' },
        { label: 'Tarefas atrasadas', value: overdueTasks, warning: overdueTasks > 0, icon: '⚠️' },
        { label: 'Pomodoros', value: totalPomodoros, icon: '🍅' },
        { label: 'Objetivos', value: `${completedProductivityGoals}/${productivityGoals.length || 0}`, progress: productivityProgress },
      ],
      href: '/produtividade',
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="animate-scale-in flex flex-col items-center gap-3" style={{ animationDelay: '0.1s' }}>
              <Logo size="md" showText={false} />
              <div className="flex flex-col items-center">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                  DemandeX
                </h2>
                <p className="text-sm sm:text-base mt-2 font-medium italic tracking-wide leading-relaxed max-w-md mx-auto px-4 relative">
                  <span className="drop-shadow-sm font-semibold">
                    <span className="text-slate-700 dark:!text-white">Gerenciando sua vida com</span>{' '}
                    <span className="text-primary-600 dark:text-primary-400 font-bold">inteligência</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Cards - Resumo Financeiro e Tarefas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Resumo Financeiro */}
          <Card className="p-5 sm:p-6 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 dark:from-primary-900/20 via-transparent to-transparent pointer-events-none" />
            
            <Link href="/financeiro" className="group">
              <div className="flex items-center justify-between mb-6 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-200/50">
                    <DollarSign className="text-white" size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Resumo Financeiro
                  </h2>
                </div>
                <div className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 flex items-center gap-1">
                  Ver detalhes
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
              
              {/* Indicador de saldo geral */}
              <div className={cn(
                'mb-4 p-3 rounded-xl border transition-all duration-300 relative z-10',
                balance >= 0
                  ? 'bg-gradient-to-br from-success-50/90 to-success-100/60 border-success-300/50 shadow-lg shadow-success-200/30'
                  : 'bg-gradient-to-br from-danger-50/90 to-danger-100/60 border-danger-300/50 shadow-lg shadow-danger-200/30'
              )}>
                <div className="flex items-center justify-between">
            <div>
                    <p className="text-sm font-bold text-slate-900 mb-1">Saldo Total</p>
                    <p className={cn(
                      'text-2xl sm:text-3xl font-bold',
                      balance >= 0 ? 'text-success-700' : 'text-danger-700'
                    )}>
                      {balance >= 0 ? '+' : ''}R$ {Math.abs(balance).toFixed(2)}
                    </p>
                  </div>
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                    balance >= 0
                      ? 'bg-gradient-to-br from-success-500 to-success-600'
                      : 'bg-gradient-to-br from-danger-500 to-danger-600'
                  )}>
                    {balance >= 0 ? (
                      <TrendingUp className="text-white" size={20} strokeWidth={2.5} />
                    ) : (
                      <TrendingDown className="text-white" size={20} strokeWidth={2.5} />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-success-50/90 to-success-100/80 rounded-lg border border-success-200/70 hover:border-success-300/70 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg ring-1 ring-success-200/50 transition-all duration-300">
                      <TrendingUp className="text-white" size={18} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 mb-1">Total de Receitas</p>
                      <p className="text-xl sm:text-2xl font-bold text-success-700 break-words">
                        R$ {totalIncome.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-danger-50/90 to-danger-100/80 rounded-lg border border-danger-200/70 hover:border-danger-300/70 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-danger-500 to-danger-600 flex items-center justify-center shadow-lg ring-1 ring-danger-200/50 transition-all duration-300">
                      <TrendingDown className="text-white" size={18} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 mb-1">Total de Despesas</p>
                      <p className="text-xl sm:text-2xl font-bold text-danger-700 break-words">
                        R$ {totalExpenses.toFixed(2)}
                      </p>
                    </div>
                  </div>
                      </div>
                  </div>
            </Link>
                </Card>

          {/* Tarefas */}
          <Card className="p-5 sm:p-6 animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-warning-50/30 dark:from-warning-900/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 relative">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-md ring-1 ring-warning-200/50">
                  <CheckSquare className="text-white" size={16} strokeWidth={2.5} />
        </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Tarefas Recentes
              </h2>
              </div>
              <Link
                href="/produtividade/tarefas"
                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 flex items-center gap-1 group"
              >
                Ver todas
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
            
            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
              <div className="bg-gradient-to-br from-primary-50/80 dark:from-primary-900/60 to-primary-100/50 dark:to-primary-800/50 rounded-lg p-2.5 border border-primary-200/50 dark:border-primary-600/60">
                <p className="text-sm text-slate-900 font-bold mb-1">Pendentes</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary-700">{todayTasks}</p>
              </div>
              <div className="bg-gradient-to-br from-danger-50/80 to-danger-100/50 rounded-lg p-2.5 border border-danger-200/50">
                <p className="text-sm text-slate-900 font-bold mb-1">Atrasadas</p>
                <p className="text-2xl sm:text-3xl font-bold text-danger-700">{overdueTasks}</p>
              </div>
            </div>
            <div className="space-y-2.5 relative z-10">
              {tasks.slice(0, 5).map((task, idx) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < today && task.status !== 'done'
                return (
                <div
                  key={task.id}
                    className={cn(
                      'flex items-center justify-between gap-2 p-3 rounded-lg border transition-all duration-300 animate-fade-in group/item',
                      isOverdue 
                        ? 'bg-gradient-to-r from-danger-50/90 dark:from-danger-900/40 to-danger-100/50 dark:to-danger-800/30 border-danger-200/70 dark:border-danger-700/40 hover:border-danger-300/70 dark:hover:border-danger-600/50 hover:shadow-md' :
                      task.status === 'done'
                        ? 'bg-gradient-to-r from-success-50/90 dark:from-success-900/40 to-success-100/50 dark:to-success-800/30 border-success-200/70 dark:border-success-700/40 hover:border-success-300/70 dark:hover:border-success-600/50 hover:shadow-md' :
                        'bg-gradient-to-r from-white/95 dark:from-slate-500/90 to-slate-50/80 dark:to-slate-500/60 border-slate-200/70 dark:border-slate-500/60 hover:border-primary-200/50 dark:hover:border-primary-500/70 hover:shadow-md'
                    )}
                    style={{ 
                      animationDelay: `${0.3 + idx * 0.1}s`,
                    }}
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                        isOverdue ? 'bg-danger-500' :
                        task.status === 'done' ? 'bg-success-500' :
                        task.status === 'in-progress' ? 'bg-warning-500' :
                        'bg-primary-500'
                      )} />
                  <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm sm:text-base font-semibold break-words mb-1',
                          isOverdue ? 'text-danger-900' :
                          task.status === 'done' ? 'text-success-900 line-through opacity-70' :
                          'text-slate-900'
                        )}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={cn(
                            'text-xs text-slate-600 font-medium',
                            isOverdue && 'text-danger-700'
                          )}>
                      {task.dueDate
                        ? format(new Date(task.dueDate), "dd 'de' MMM", {
                            locale: ptBR,
                          })
                        : 'Sem data'}
                    </p>
                          {isOverdue && (
                            <span className="text-[10px] font-bold text-danger-700 bg-danger-200 px-2 py-0.5 rounded-full">
                              ATRASADA
                            </span>
                          )}
                        </div>
                      </div>
                  </div>
                  <span
                      className={cn(
                        'badge text-xs font-semibold px-2 py-1 flex-shrink-0 whitespace-nowrap shadow-sm',
                      task.status === 'done'
                        ? 'badge-success'
                        : task.status === 'in-progress'
                        ? 'badge-warning'
                        : 'badge-primary'
                      )}
                  >
                    {task.status === 'done'
                        ? '✓ Concluída'
                      : task.status === 'in-progress'
                        ? '⏳ Em andamento'
                        : '○ Pendente'}
                  </span>
                </div>
                )
              })}
              {tasks.length === 0 && (
                <div className="text-center py-6">
                  <CheckSquare size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Nenhuma tarefa cadastrada ainda
                </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Stats Grid - Saúde e Produtividade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const gradientColor = stat.color === 'from-success-500 to-success-600' ? 'from-success-50/30' :
                                 stat.color === 'from-warning-500 to-warning-600' ? 'from-warning-50/30' :
                                 'from-primary-50/30'
            
            return (
              <Card 
                key={stat.title}
                className="p-5 sm:p-6 animate-fade-in relative overflow-hidden" 
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                {/* Background gradient */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br pointer-events-none',
                  gradientColor,
                  'dark:opacity-20 via-transparent to-transparent'
                )} />
                
                <div className="flex items-center justify-between mb-4 relative">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-md ring-1',
                      stat.color,
                      stat.color === 'from-success-500 to-success-600' ? 'ring-success-200/50' :
                      stat.color === 'from-warning-500 to-warning-600' ? 'ring-warning-200/50' :
                      'ring-primary-200/50'
                    )}>
                      <Icon className="text-white" size={16} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {stat.title}
              </h2>
                  </div>
              <Link
                    href={stat.href}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 flex items-center gap-1 group"
              >
                Ver detalhes
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

                {/* Barra de progresso geral */}
                {stat.progress !== undefined && (
                  <div className="mb-4 relative z-10">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-900">Progresso Geral</span>
                      <span className="text-base font-bold text-slate-900">{stat.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-300 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all duration-500 ease-out',
                          stat.progressColor
                        )}
                        style={{ width: `${stat.progress}%` }}
                      />
                  </div>
                </div>
                )}

                <div className="space-y-2 relative z-10">
                  {stat.items.map((item: any, idx) => {
                    const hasProgress = item.progress !== undefined
                    const itemProgress = hasProgress ? item.progress : (item.target ? Math.min((item.value / item.target) * 100, 100) : null)
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border transition-all duration-300 group',
                          item.warning ? 'bg-gradient-to-br from-danger-50/90 to-danger-100/80 border-danger-200/70 hover:border-danger-300/70' :
                          item.highlight ? (item.positive ? 'bg-gradient-to-br from-success-50/90 to-success-100/80 border-success-200/70 hover:border-success-300/70' : 'bg-gradient-to-br from-danger-50/90 to-danger-100/80 border-danger-200/70 hover:border-danger-300/70') :
                          'bg-gradient-to-br from-white/95 to-slate-50/80 border-slate-200/70 hover:border-slate-300/70',
                          'hover:shadow-md'
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.icon && (
                            <div className={cn(
                              'w-10 h-10 rounded-lg flex items-center justify-center shadow-md ring-1',
                              item.warning ? 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50' :
                              item.highlight ? (item.positive ? 'bg-gradient-to-br from-success-500 to-success-600 ring-success-200/50' : 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50') :
                              stat.color === 'from-success-500 to-success-600' ? `bg-gradient-to-br ${stat.color} ring-success-200/50` :
                              stat.color === 'from-warning-500 to-warning-600' ? `bg-gradient-to-br ${stat.color} ring-warning-200/50` :
                              `bg-gradient-to-br ${stat.color} ring-primary-200/50`,
                              'transition-all duration-300'
                            )}>
                              <span className="text-lg">{item.icon}</span>
              </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className={cn(
                              'text-xs sm:text-sm font-semibold mb-1',
                              item.warning ? 'text-danger-800' :
                              item.highlight ? (item.positive ? 'text-success-800' : 'text-danger-800') :
                              'text-slate-900 font-bold'
                            )}>
                              {item.label}
                            </p>
                            <p className={cn(
                              'text-xl sm:text-2xl font-bold break-words',
                              item.warning ? 'text-danger-700' :
                              item.highlight ? (item.positive ? 'text-success-700' : 'text-danger-700') :
                              'text-slate-900'
                            )}>
                              {item.value}
                            </p>
                            
                            {/* Barra de progresso individual para itens com target */}
                            {itemProgress !== null && item.target && (
                              <div className="w-full mt-1.5">
                                <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      'h-full rounded-full transition-all duration-500 ease-out',
                                      itemProgress >= 100 ? 'bg-success-500' :
                                      itemProgress >= 70 ? 'bg-warning-500' :
                                      'bg-primary-500'
                                    )}
                                    style={{ width: `${itemProgress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-[10px] sm:text-xs text-slate-700 font-medium">Meta: {item.target}</span>
                                  <span className="text-[10px] sm:text-xs font-semibold text-slate-900">{Math.round(itemProgress)}%</span>
                  </div>
                              </div>
                            )}
                            
                            {/* Barra de progresso para objetivos */}
                            {hasProgress && (
                              <div className="w-full mt-1.5">
                                <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-500/60 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      'h-full rounded-full transition-all duration-500 ease-out',
                                      itemProgress >= 100 ? 'bg-success-500' :
                                      itemProgress >= 70 ? stat.progressColor :
                                      stat.progressColor
                                    )}
                                    style={{ width: `${itemProgress}%` }}
                                  />
                </div>
              </div>
                            )}
                  </div>
                </div>
              </div>
                    )
                  })}
            </div>
          </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-4 sm:p-5 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 text-center">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Adicionar Refeição', href: '/saude/alimentacao', icon: Heart, color: 'from-success-500 to-success-600' },
              { label: 'Registrar Treino', href: '/saude/treino', icon: Heart, color: 'from-pink-500 to-rose-500' },
              { label: 'Nova Transação', href: '/financeiro/transacoes', icon: DollarSign, color: 'from-primary-500 to-primary-600' },
              { label: 'Nova Tarefa', href: '/produtividade/tarefas', icon: CheckSquare, color: 'from-warning-500 to-warning-600' },
            ].map((action, idx) => {
              const ActionIcon = action.icon
              return (
            <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    'group relative p-3 bg-gradient-to-br from-white/95 dark:from-slate-500/90 to-slate-50/80 dark:to-slate-500/70 rounded-lg',
                    'border border-slate-200/70 dark:border-slate-500/60 hover:border-primary-200/50 dark:hover:border-primary-500/70',
                    'hover:shadow-md transition-all duration-300',
                    'animate-fade-in flex flex-col items-center justify-center'
                  )}
                  style={{ 
                    animationDelay: `${0.8 + idx * 0.1}s`,
                  }}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg bg-gradient-to-br mb-2',
                    action.color,
                    'flex items-center justify-center shadow-md ring-1 ring-white/50 dark:ring-slate-700/50 transition-all duration-300 mx-auto'
                  )}>
                    <ActionIcon className="text-white" size={18} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-primary-600/80 transition-colors duration-300 text-center">
                    {action.label}
                  </p>
            </Link>
              )
            })}
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
