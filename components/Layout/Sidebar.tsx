'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Heart,
  DollarSign,
  CheckSquare,
  Sparkles,
  Bell,
  Menu,
  X,
  UtensilsCrossed,
  Dumbbell,
  Moon,
  Target,
  Wallet,
  TrendingUp,
  PiggyBank,
  BookOpen,
  FolderKanban,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Logo } from '@/components/UI/Logo'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    exact: true,
  },
  {
    title: 'Gestão da Minha Saúde',
    icon: Heart,
    href: '/saude',
    submenu: [
      { title: 'Alimentação', icon: UtensilsCrossed, href: '/saude/alimentacao' },
      { title: 'Treino', icon: Dumbbell, href: '/saude/treino' },
      { title: 'Sono', icon: Moon, href: '/saude/sono' },
      { title: 'Objetivos', icon: Target, href: '/saude/objetivos' },
    ],
  },
  {
    title: 'Gestão Financeira',
    icon: DollarSign,
    href: '/financeiro',
    submenu: [
      { title: 'Transações', icon: Wallet, href: '/financeiro/transacoes' },
      { title: 'Metas Financeiras', icon: Target, href: '/financeiro/metas' },
      { title: 'Reserva de Emergência', icon: PiggyBank, href: '/financeiro/reserva' },
      { title: 'Investimentos', icon: TrendingUp, href: '/financeiro/investimentos' },
      { title: 'Objetivos', icon: Target, href: '/financeiro/objetivos' },
    ],
  },
  {
    title: 'Produtividade',
    icon: CheckSquare,
    href: '/produtividade',
    submenu: [
      { title: 'Tarefas', icon: CheckSquare, href: '/produtividade/tarefas' },
      { title: 'Estudos', icon: BookOpen, href: '/produtividade/estudos' },
      { title: 'Projetos Pessoais', icon: FolderKanban, href: '/produtividade/projetos' },
      { title: 'Objetivos', icon: Target, href: '/produtividade/objetivos' },
    ],
  },
  {
    title: 'Lei da Atração',
    icon: Sparkles,
    href: '/lei-atracao',
    submenu: [
      { title: 'Objetivos', icon: Target, href: '/lei-atracao/objetivos' },
      { title: 'Mural', icon: Lightbulb, href: '/lei-atracao/mural' },
    ],
  },
]

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()
  const { notifications } = useStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((m) => m !== title) : [...prev, title]
    )
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-primary-50 via-primary-50/50 to-transparent">
            <Logo size="md" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const hasSubmenu = item.submenu && item.submenu.length > 0
              const isExpanded = expandedMenus.includes(item.title)
              const active = isActive(item.href, item.exact)

              return (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleMenu(item.title)
                      } else {
                        setIsOpen(false)
                      }
                    }}
                    className={cn(
                      'flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-md transition-all duration-200 ease-out text-sm sm:text-base',
                      active
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-medium truncate">{item.title}</span>
                    </div>
                    {item.title === 'Notificações' && unreadCount > 0 && (
                      <span className="bg-danger-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Submenu */}
                  {hasSubmenu && isExpanded && (
                    <div className="ml-2 sm:ml-4 mt-1 sm:mt-2 space-y-1 border-l-2 border-slate-200 pl-2 sm:pl-4">
                      {item.submenu.map((subitem) => {
                        const SubIcon = subitem.icon
                        const subActive = isActive(subitem.href)

                        return (
                          <Link
                            key={subitem.title}
                            href={subitem.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-200 ease-out text-xs sm:text-sm',
                              subActive
                                ? 'bg-slate-100 text-slate-900 font-medium'
                                : 'text-slate-600 hover:bg-slate-50'
                            )}
                          >
                            <SubIcon size={14} className="sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={1.5} />
                            <span className="truncate">{subitem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Notificações */}
            <Link
              href="/notificacoes"
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base',
                isActive('/notificacoes')
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Bell size={18} className="sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={1.5} />
                <span className="font-medium">Notificações</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-danger-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                  {unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

