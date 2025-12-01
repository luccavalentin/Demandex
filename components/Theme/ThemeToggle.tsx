'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
        'dark:focus:ring-offset-slate-800',
        theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300',
        className
      )}
      aria-label={theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
    >
      <div
        className={cn(
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full',
          'bg-white shadow-md transition-transform duration-300',
          'flex items-center justify-center',
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        )}
      >
        {theme === 'dark' ? (
          <Moon size={14} className="text-primary-600" />
        ) : (
          <Sun size={14} className="text-warning-500" />
        )}
      </div>
    </button>
  )
}

