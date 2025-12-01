'use client'

import React, { useMemo, useState, useEffect } from 'react'
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
  UtensilsCrossed,
  Dumbbell,
  Moon,
  Zap,
  BookOpen,
  FolderKanban,
  Calendar,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
  Award,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { format, isToday, isPast, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { cn, formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false)
  const {
    meals,
    workouts,
    sleeps,
    healthGoals,
    transactions,
    financialGoals,
    investments,
    tasks,
    studyAreas,
    personalProjects,
    productivityGoals,
  } = useStore()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const today = new Date()
  const startOfThisWeek = startOfWeek(today, { locale: ptBR })
  const endOfThisWeek = endOfWeek(today, { locale: ptBR })
  const startOfThisMonth = startOfMonth(today)
  const endOfThisMonth = endOfMonth(today)

  // Estatísticas de Saúde
  const healthStats = useMemo(() => {
    const todayMeals = meals.filter(m => isToday(new Date(m.date))).length
    const weekMeals = meals.filter(m => {
      const mealDate = new Date(m.date)
      return mealDate >= startOfThisWeek && mealDate <= endOfThisWeek
    }).length
    const todayWorkouts = workouts.filter(w => isToday(new Date(w.date))).length
    const weekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate >= startOfThisWeek && workoutDate <= endOfThisWeek
    }).length
    const todaySleep = sleeps.find(s => isToday(new Date(s.date)))
    const avgSleepQuality = sleeps.length > 0
      ? sleeps.reduce((sum, s) => sum + s.quality, 0) / sleeps.length
      : 0
    const completedHealthGoals = healthGoals.filter(g => g.completed).length
    const healthProgress = healthGoals.length > 0
      ? Math.round((completedHealthGoals / healthGoals.length) * 100)
      : 0

    return {
      todayMeals,
      weekMeals,
      todayWorkouts,
      weekWorkouts,
      todaySleep,
      avgSleepQuality: Math.round(avgSleepQuality),
      completedHealthGoals,
      totalHealthGoals: healthGoals.length,
      healthProgress,
    }
  }, [meals, workouts, sleeps, healthGoals])

  // Estatísticas Financeiras
  const financialStats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = transactions.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    const balance = totalIncome - totalExpenses

    const monthIncome = transactions
      .filter(t => {
        if (t.type !== 'income') return false
        const tDate = new Date(t.date)
        return tDate >= startOfThisMonth && tDate <= endOfThisMonth
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const monthExpenses = transactions
      .filter(t => {
        if (t.type !== 'expense') return false
        const tDate = new Date(t.date)
        return tDate >= startOfThisMonth && tDate <= endOfThisMonth
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const monthBalance = monthIncome - monthExpenses

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
    const totalCurrentValue = investments.reduce(
      (sum, inv) => sum + (inv.currentValue || inv.amount),
      0
    )
    const investmentReturn = totalCurrentValue - totalInvested
    const investmentReturnPercent = totalInvested > 0
      ? ((investmentReturn / totalInvested) * 100)
      : 0

    const completedFinancialGoals = financialGoals.filter(g => g.completed).length
    const financialProgress = financialGoals.length > 0
      ? Math.round((completedFinancialGoals / financialGoals.length) * 100)
      : 0

    return {
      totalIncome,
      totalExpenses,
      balance,
      monthIncome,
      monthExpenses,
      monthBalance,
      totalInvested,
      totalCurrentValue,
      investmentReturn,
      investmentReturnPercent: Math.round(investmentReturnPercent * 100) / 100,
      completedFinancialGoals,
      totalFinancialGoals: financialGoals.length,
      financialProgress,
    }
  }, [transactions, investments, financialGoals])

  // Estatísticas de Produtividade
  const productivityStats = useMemo(() => {
    const pendingTasks = tasks.filter(t => t.status === 'todo' && (!t.dueDate || new Date(t.dueDate) >= today))
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
    const overdueTasks = tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'done')
    const completedTasks = tasks.filter(t => t.status === 'done')
    const todayTasks = tasks.filter(t => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== 'done')

    const totalPomodoros = studyAreas.reduce(
      (sum, area) =>
        sum +
        area.subjects.reduce(
          (s, subject) =>
            s +
            subject.classes.reduce((c, classItem) => c + classItem.pomodoros.length, 0),
          0
        ),
      0
    )

    const totalStudyMinutes = studyAreas.reduce(
      (sum, area) =>
        sum +
        area.subjects.reduce(
          (s, subject) =>
            s +
            subject.classes.reduce(
              (c, classItem) =>
                c +
                classItem.pomodoros.reduce((p, pom) => p + pom.duration, 0),
              0
            ),
          0
        ),
      0
    )

    const activeProjects = personalProjects.filter(p => p.status === 'in-progress').length
    const completedProjects = personalProjects.filter(p => p.status === 'completed').length

    const completedProductivityGoals = productivityGoals.filter(g => g.completed).length
    const productivityProgress = productivityGoals.length > 0
      ? Math.round((completedProductivityGoals / productivityGoals.length) * 100) 
      : 0

    return {
      pendingTasks: pendingTasks.length,
      inProgressTasks: inProgressTasks.length,
      overdueTasks: overdueTasks.length,
      completedTasks: completedTasks.length,
      todayTasks: todayTasks.length,
      totalTasks: tasks.length,
      totalPomodoros,
      totalStudyMinutes,
      activeProjects,
      completedProjects,
      totalProjects: personalProjects.length,
      completedProductivityGoals,
      totalProductivityGoals: productivityGoals.length,
      productivityProgress,
    }
  }, [tasks, studyAreas, personalProjects, productivityGoals])

  // Tarefas recentes e urgentes
  const recentTasks = useMemo(() => {
    return tasks
      .filter(t => t.status !== 'done')
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        }
        if (a.dueDate) return -1
        if (b.dueDate) return 1
        return 0
      })
      .slice(0, 5)
  }, [tasks])

  // Transações recentes
  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [transactions])

  return (
    <MainLayout>
      <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 text-center">
            <div className="animate-scale-in flex flex-col items-center gap-2 sm:gap-3" style={{ animationDelay: '0.1s' }}>
              <Logo size="md" showText={false} />
              <div className="flex flex-col items-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 font-medium text-slate-600">
                  Visão geral da sua vida organizada
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {/* Saúde */}
          <Card className={cn(
            "p-3 sm:p-4 md:p-5 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-success-50 to-success-100/80 border-success-200/70"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-md ring-2 ring-success-200/50 flex-shrink-0">
                <Heart className="text-white" size={16} strokeWidth={2.5} />
                    </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Saúde</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-success-700 truncate">
                  {healthStats.healthProgress}%
                </p>
                  </div>
            </div>
          </Card>

          {/* Financeiro */}
          <Card className={cn(
            "p-3 sm:p-4 md:p-5 border shadow-lg overflow-hidden",
            financialStats.balance >= 0
              ? 'bg-gradient-to-br from-primary-50 to-primary-100/80 border-primary-200/70'
              : 'bg-gradient-to-br from-danger-50 to-danger-100/80 border-danger-200/70'
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shadow-md ring-2 flex-shrink-0",
                financialStats.balance >= 0
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 ring-primary-200/50'
                  : 'bg-gradient-to-br from-danger-500 to-danger-600 ring-danger-200/50'
              )}>
                <DollarSign className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Saldo</p>
                    <p className={cn(
                  "text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate",
                  financialStats.balance >= 0
                    ? 'text-primary-700'
                    : 'text-danger-700'
                )}>
                  {formatCurrency(Math.abs(financialStats.balance))}
                    </p>
                  </div>
            </div>
          </Card>

          {/* Produtividade */}
          <Card className={cn(
            "p-3 sm:p-4 md:p-5 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-warning-50 to-warning-100/80 border-warning-200/70"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-md ring-2 ring-warning-200/50 flex-shrink-0">
                <CheckSquare className="text-white" size={16} strokeWidth={2.5} />
                  </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Tarefas</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-warning-700 truncate">
                  {productivityStats.pendingTasks}
                      </p>
                    </div>
                  </div>
          </Card>

          {/* Objetivos */}
          <Card className={cn(
            "p-3 sm:p-4 md:p-5 border shadow-lg overflow-hidden",
            "bg-gradient-to-br from-purple-50 to-purple-100/80 border-purple-200/70"
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md ring-2 ring-purple-200/50 flex-shrink-0">
                <Target className="text-white" size={16} strokeWidth={2.5} />
                    </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-0.5 truncate">Objetivos</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-purple-700 truncate">
                  {isClient ? healthStats.completedHealthGoals + financialStats.completedFinancialGoals + productivityStats.completedProductivityGoals : 0}
                </p>
              </div>
              </div>
                </Card>
              </div>
              
        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Coluna Esquerda - Produtividade e Saúde */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Produtividade */}
            <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg ring-2 ring-warning-200/50">
                    <CheckSquare className="text-white" size={20} strokeWidth={2.5} />
                      </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                    Produtividade
                      </h2>
                    </div>
                <Link
                  href="/produtividade"
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowRight size={20} />
                </Link>
                  </div>
                  
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100/80 rounded-lg border border-primary-200/70">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Pendentes</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary-700">
                    {productivityStats.pendingTasks}
                      </p>
                    </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-lg border border-blue-200/70">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Andamento</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700">
                    {productivityStats.inProgressTasks}
                      </p>
                    </div>
                    <div className={cn(
                  "p-3 rounded-lg border",
                  productivityStats.overdueTasks > 0
                    ? 'bg-gradient-to-br from-danger-50 to-danger-100/80 border-danger-200/70'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100/80 border-slate-200/70'
                )}>
                  <p className="text-xs font-semibold text-slate-700 mb-1">Atrasadas</p>
                  <p className={cn(
                    "text-xl sm:text-2xl font-bold",
                    productivityStats.overdueTasks > 0
                      ? 'text-danger-700'
                      : 'text-slate-700'
                  )}>
                    {productivityStats.overdueTasks}
                        </p>
                      </div>
                <div className="p-3 bg-gradient-to-br from-success-50 to-success-100/80 rounded-lg border border-success-200/70">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Concluídas</p>
                  <p className="text-xl sm:text-2xl font-bold text-success-700">
                    {productivityStats.completedTasks}
                  </p>
                        </div>
                      </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/80 rounded-lg border border-purple-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="text-purple-600" size={14} />
                    <p className="text-xs font-semibold text-slate-700">Pomodoros</p>
                        </div>
                  <p className="text-lg sm:text-xl font-bold text-purple-700">
                    {productivityStats.totalPomodoros}
                  </p>
                      </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100/80 rounded-lg border border-orange-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <FolderKanban className="text-orange-600" size={14} />
                    <p className="text-xs font-semibold text-slate-700">Projetos</p>
                    </div>
                  <p className="text-lg sm:text-xl font-bold text-orange-700">
                    {productivityStats.activeProjects}
                          </p>
                        </div>
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/80 rounded-lg border border-indigo-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="text-indigo-600" size={14} />
                    <p className="text-xs font-semibold text-slate-700">Minutos</p>
                      </div>
                  <p className="text-lg sm:text-xl font-bold text-indigo-700">
                    {productivityStats.totalStudyMinutes}
                  </p>
            </div>
          </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">Progresso Objetivos</span>
                  <span className="text-sm font-bold text-slate-900">
                    {productivityStats.completedProductivityGoals}/{productivityStats.totalProductivityGoals}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-warning-500 to-warning-600 rounded-full transition-all duration-500"
                    style={{ width: `${productivityStats.productivityProgress}%` }}
                  />
              </div>
            </div>
          </Card>

            {/* Saúde */}
            <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg ring-2 ring-success-200/50">
                    <Heart className="text-white" size={20} strokeWidth={2.5} />
                      </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                    Saúde
                      </h2>
                    </div>
                <Link
                  href="/saude"
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowRight size={20} />
                </Link>
                  </div>
                  
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-success-50 to-success-100/80 rounded-lg border border-success-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <UtensilsCrossed className="text-success-600" size={16} />
                    <p className="text-xs font-semibold text-slate-700">Refeições Hoje</p>
                        </div>
                  <p className="text-xl sm:text-2xl font-bold text-success-700">
                    {healthStats.todayMeals}
                  </p>
                      </div>
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-lg border border-blue-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <Dumbbell className="text-blue-600" size={16} />
                    <p className="text-xs font-semibold text-slate-700">Treinos Hoje</p>
                    </div>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700">
                    {healthStats.todayWorkouts}
                  </p>
                        </div>
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100/80 rounded-lg border border-indigo-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <Moon className="text-indigo-600" size={16} />
                    <p className="text-xs font-semibold text-slate-700">Qualidade Sono</p>
                      </div>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-700">
                    {healthStats.avgSleepQuality}/5
                  </p>
                      </div>
                    </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">Progresso Objetivos</span>
                  <span className="text-sm font-bold text-slate-900">
                    {healthStats.completedHealthGoals}/{healthStats.totalHealthGoals}
                  </span>
                        </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full transition-all duration-500"
                    style={{ width: `${healthStats.healthProgress}%` }}
                  />
                      </div>
                      </div>
            </Card>
                    </div>

          {/* Coluna Direita - Financeiro e Tarefas */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Financeiro */}
            <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg ring-2 ring-primary-200/50">
                    <DollarSign className="text-white" size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                    Financeiro
                  </h2>
                </div>
                    <Link 
                  href="/financeiro"
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                  <ArrowRight size={20} />
                    </Link>
        </div>

              <div className="space-y-3 mb-4">
                      <div className={cn(
                  "p-3 rounded-lg border",
                  financialStats.balance >= 0
                    ? 'bg-gradient-to-br from-success-50 to-success-100/80 border-success-200/70'
                    : 'bg-gradient-to-br from-danger-50 to-danger-100/80 border-danger-200/70'
                )}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700">Saldo Total</p>
                    {financialStats.balance >= 0 ? (
                      <TrendingUp className="text-success-600" size={16} />
                    ) : (
                      <TrendingDown className="text-danger-600" size={16} />
                    )}
                        </div>
                  <p className={cn(
                    "text-xl sm:text-2xl font-bold mt-1",
                    financialStats.balance >= 0
                      ? 'text-success-700'
                      : 'text-danger-700'
                  )}>
                    {formatCurrency(Math.abs(financialStats.balance))}
                  </p>
                      </div>

                <div className="p-3 bg-gradient-to-br from-success-50 to-success-100/80 rounded-lg border border-success-200/70">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Receitas</p>
                  <p className="text-lg sm:text-xl font-bold text-success-700">
                    {formatCurrency(financialStats.totalIncome)}
                  </p>
                    </div>

                <div className="p-3 bg-gradient-to-br from-danger-50 to-danger-100/80 rounded-lg border border-danger-200/70">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Despesas</p>
                  <p className="text-lg sm:text-xl font-bold text-danger-700">
                    {formatCurrency(financialStats.totalExpenses)}
                  </p>
              </div>

                {financialStats.totalInvested > 0 && (
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/80 rounded-lg border border-purple-200/70">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Investimentos</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-700">
                      {formatCurrency(financialStats.totalCurrentValue)}
                            </p>
                            <p className={cn(
                      "text-xs font-medium mt-1",
                      financialStats.investmentReturn >= 0
                        ? 'text-success-600'
                        : 'text-danger-600'
                    )}>
                      {financialStats.investmentReturn >= 0 ? '+' : ''}
                      {formatCurrency(Math.abs(financialStats.investmentReturn))} (
                      {financialStats.investmentReturnPercent >= 0 ? '+' : ''}
                      {financialStats.investmentReturnPercent}%)
                    </p>
                              </div>
                            )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">Progresso Metas</span>
                  <span className="text-sm font-bold text-slate-900">
                    {financialStats.completedFinancialGoals}/{financialStats.totalFinancialGoals}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                    style={{ width: `${financialStats.financialProgress}%` }}
                                  />
                </div>
            </div>
                    </Card>

            {/* Tarefas Urgentes */}
            <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 flex items-center justify-center shadow-lg ring-2 ring-warning-200/50">
                    <AlertCircle className="text-white" size={20} strokeWidth={2.5} />
                          </div>
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Tarefas Urgentes
                          </h2>
                        </div>
                <Link
                  href="/produtividade/tarefas"
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowRight size={20} />
                </Link>
                      </div>
                      
              <div className="space-y-2">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => {
                    const isOverdue = task.dueDate && isPast(new Date(task.dueDate))
                    return (
                      <Link
                        key={task.id}
                        href="/produtividade/tarefas"
                        className="block p-3 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-lg border border-slate-200/70 hover:bg-slate-100 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                              {task.title}
                            </p>
                            {task.dueDate && (
                              <p className={cn(
                                "text-xs font-medium flex items-center gap-1",
                                isOverdue
                                  ? 'text-danger-600'
                                  : 'text-slate-600'
                              )}>
                                <Calendar size={12} />
                                {format(new Date(task.dueDate), "dd 'de' MMM", { locale: ptBR })}
                                {isOverdue && ' (Atrasada)'}
                              </p>
                            )}
                          </div>
                          {isOverdue && (
                            <AlertCircle className="text-danger-600 flex-shrink-0" size={16} />
                          )}
                        </div>
                        </Link>
                    )
                  })
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Nenhuma tarefa urgente
                  </p>
                )}
                      </div>
                    </Card>
                  </div>
        </div>

        {/* Ações Rápidas */}
        <Card className="p-4 sm:p-5 md:p-6 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-200/50">
              <Zap className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
            Ações Rápidas
          </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[
              {
                label: 'Nova Transação',
                href: '/financeiro/transacoes',
                icon: DollarSign,
                color: 'from-primary-500 to-primary-600',
                bgColor: 'from-primary-50 to-primary-100/80',
              },
              {
                label: 'Nova Tarefa',
                href: '/produtividade/tarefas',
                icon: CheckSquare,
                color: 'from-warning-500 to-warning-600',
                bgColor: 'from-warning-50 to-warning-100/80',
              },
              {
                label: 'Registrar Treino',
                href: '/saude/treino',
                icon: Dumbbell,
                color: 'from-pink-500 to-rose-500',
                bgColor: 'from-pink-50 to-rose-100/80',
              },
              {
                label: 'Adicionar Refeição',
                href: '/saude/alimentacao',
                icon: UtensilsCrossed,
                color: 'from-success-500 to-success-600',
                bgColor: 'from-success-50 to-success-100/80',
              },
            ].map((action, idx) => {
              const ActionIcon = action.icon
              return (
            <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    'group relative p-3 sm:p-4 bg-gradient-to-br rounded-xl border border-slate-200/70 transition-all duration-300',
                    action.bgColor,
                    'hover:shadow-lg hover:scale-105 active:scale-95',
                    'flex flex-col items-center justify-center gap-2 sm:gap-3'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ring-1 ring-white/50 transition-all duration-300',
                    action.color,
                    'group-hover:scale-110'
                  )}>
                    <ActionIcon className="text-white" size={18} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 text-center leading-tight">
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
