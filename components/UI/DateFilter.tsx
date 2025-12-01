'use client'

import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'last30' | 'custom'

export interface DateRange {
  start: Date | null
  end: Date | null
}

interface DateFilterProps {
  onFilterChange: (range: DateRange) => void
  className?: string
}

export function DateFilter({ onFilterChange, className }: DateFilterProps) {
  const [filterType, setFilterType] = useState<DateFilterType>('all')
  const [customStart, setCustomStart] = useState<string>('')
  const [customEnd, setCustomEnd] = useState<string>('')
  const [showCustom, setShowCustom] = useState(false)

  const today = new Date()

  const applyFilter = (type: DateFilterType, start?: string, end?: string) => {
    let range: DateRange = { start: null, end: null }

    switch (type) {
      case 'today':
        range = {
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
        }
        break
      case 'week':
        range = {
          start: startOfWeek(today, { locale: ptBR }),
          end: endOfWeek(today, { locale: ptBR }),
        }
        break
      case 'month':
        range = {
          start: startOfMonth(today),
          end: endOfMonth(today),
        }
        break
      case 'last30':
        range = {
          start: subDays(today, 30),
          end: today,
        }
        break
      case 'custom':
        if (start && end) {
          range = {
            start: new Date(start),
            end: new Date(end + 'T23:59:59'),
          }
        }
        break
      case 'all':
      default:
        range = { start: null, end: null }
    }

    onFilterChange(range)
  }

  const handleFilterChange = (type: DateFilterType) => {
    setFilterType(type)
    setShowCustom(type === 'custom')

    if (type === 'custom') {
      return
    }

    applyFilter(type)
  }

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      applyFilter('custom', customStart, customEnd)
    }
  }

  const handleClear = () => {
    setFilterType('all')
    setCustomStart('')
    setCustomEnd('')
    setShowCustom(false)
    onFilterChange({ start: null, end: null })
  }

  const getFilterLabel = () => {
    switch (filterType) {
      case 'today':
        return 'Hoje'
      case 'week':
        return 'Esta Semana'
      case 'month':
        return 'Este Mês'
      case 'last30':
        return 'Últimos 30 dias'
      case 'custom':
        if (customStart && customEnd) {
          return `${format(new Date(customStart), 'dd/MM', { locale: ptBR })} - ${format(new Date(customEnd), 'dd/MM', { locale: ptBR })}`
        }
        return 'Personalizado'
      default:
        return 'Todos'
    }
  }

  return (
    <div className={cn('flex flex-col sm:flex-row gap-2 sm:items-center', className)}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Calendar size={16} className="text-slate-600 dark:text-slate-300" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {getFilterLabel()}
          </span>
        </div>

        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterType === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            Todos
          </button>
          <button
            onClick={() => handleFilterChange('today')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterType === 'today'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            Hoje
          </button>
          <button
            onClick={() => handleFilterChange('week')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterType === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            Semana
          </button>
          <button
            onClick={() => handleFilterChange('month')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterType === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            Mês
          </button>
          <button
            onClick={() => handleFilterChange('last30')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterType === 'last30'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            30 dias
          </button>
          <button
            onClick={() => handleFilterChange('custom')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              filterType === 'custom'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            )}
          >
            Personalizado
          </button>
        </div>

        {filterType !== 'all' && (
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {showCustom && (
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              De:
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Até:
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleCustomApply}
            disabled={!customStart || !customEnd}
            className="px-4 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  )
}

