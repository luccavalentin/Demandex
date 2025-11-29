'use client'

import React, { useState, useEffect } from 'react'
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
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Logo } from '@/components/UI/Logo'
import { useSidebar } from './MainLayout'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    exact: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Gestão da Minha Saúde',
    icon: Heart,
    href: '/saude',
    gradient: 'from-pink-500 to-rose-500',
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
    gradient: 'from-emerald-500 to-teal-500',
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
    gradient: 'from-amber-500 to-orange-500',
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
    gradient: 'from-purple-500 to-violet-500',
    submenu: [
      { title: 'Objetivos', icon: Target, href: '/lei-atracao/objetivos' },
      { title: 'Mural', icon: Lightbulb, href: '/lei-atracao/mural' },
    ],
  },
]

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false) // Para mobile
  const { isCollapsed, setIsCollapsed } = useSidebar() // Para desktop - colapsado/expandido
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()
  const { notifications } = useStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  // Auto-expand menus when on a submenu page
  useEffect(() => {
    const activeSubmenus: string[] = []
    menuItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some((sub) => {
          if (pathname === sub.href || pathname?.startsWith(sub.href + '/')) {
            return true
          }
          return false
        })
        if (hasActiveSubmenu && !expandedMenus.includes(item.title)) {
          activeSubmenus.push(item.title)
        }
      }
    })
    if (activeSubmenus.length > 0) {
      setExpandedMenus((prev) => [...new Set([...prev, ...activeSubmenus])])
    }
  }, [pathname])

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
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50 p-3',
          'bg-white/90 backdrop-blur-md rounded-xl',
          'shadow-lg hover:shadow-xl',
          'border border-slate-200/50',
          'transition-all duration-300 ease-out',
          'hover:scale-105 active:scale-95'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-5">
          {isOpen ? (
            <X size={20} className="text-slate-700 transition-transform duration-300 rotate-180" />
          ) : (
            <Menu size={20} className="text-slate-700 transition-transform duration-300" />
          )}
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white/95 backdrop-blur-xl',
          'border-r border-slate-200/60',
          'overflow-y-auto',
          'transition-all duration-300 ease-out',
          // Mobile: fixo e desliza (sobrepõe com overlay)
          'fixed inset-y-0 left-0 z-40',
          'h-screen',
          'shadow-xl',
          'transform',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: estático e empurra conteúdo (não sobrepõe)
          'lg:relative lg:z-auto lg:shadow-none lg:translate-x-0',
          'lg:top-[15px] lg:h-[calc(100vh-15px)] lg:inset-y-auto',
          // Larguras responsivas
          isCollapsed ? 'lg:w-20' : 'lg:w-80',
          'w-80'
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo Header com gradiente sofisticado */}
          <div className="relative px-4 sm:px-6 py-5 sm:py-7 border-b border-slate-200/60 bg-gradient-to-br from-primary-50 via-white to-slate-50/50 overflow-hidden">
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative flex items-center justify-between">
              {/* Logo - completa quando expandido, apenas ícone quando colapsado */}
              {isCollapsed ? (
                <div className="hidden lg:flex justify-center items-center w-full">
                  <Logo size="sm" showText={false} />
                </div>
              ) : (
                <div className="transition-all duration-300 overflow-hidden w-full opacity-100">
                  <Logo size="md" />
                </div>
              )}
              
              {/* Botão para colapsar/expandir no desktop */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                  'hidden lg:flex items-center justify-center',
                  'w-8 h-8 rounded-lg',
                  'bg-white/80 hover:bg-white',
                  'border border-slate-200/60',
                  'shadow-sm hover:shadow-md',
                  'transition-all duration-200',
                  'text-slate-600 hover:text-primary-600',
                  'absolute right-4 top-1/2 -translate-y-1/2'
                )}
                aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
              >
                <Menu size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Navigation com scroll suave */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const hasSubmenu = item.submenu && item.submenu.length > 0
              const isExpanded = expandedMenus.includes(item.title)
              const active = isActive(item.href, item.exact)
              const isHovered = hoveredItem === item.title
              const hasActiveSubmenu = item.submenu?.some((sub) => isActive(sub.href))

              return (
                <div
                  key={item.title}
                  className="relative"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Indicador de ativo - barra lateral */}
                  {active && (
                    <div
                      className={cn(
                        'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full',
                        'bg-gradient-to-b from-primary-500 to-primary-600',
                        'shadow-lg shadow-primary-500/50',
                        'animate-pulse'
                      )}
                    />
                  )}

                  {/* Item principal do menu */}
                  {hasSubmenu ? (
                    // Container para item com submenu (navega + expande/colapsa)
                    <div className="relative group/menu">
                      <div
                        className={cn(
                          'relative flex items-center',
                          'rounded-xl',
                          'transition-all duration-200 ease-out',
                          isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-5 py-3.5 justify-between',
                          active || hasActiveSubmenu
                            ? cn(
                                'bg-gradient-to-r text-white shadow-lg',
                                item.gradient,
                                'shadow-primary-500/30'
                              )
                            : cn(
                                'text-slate-700',
                                'hover:bg-slate-50',
                                'hover:shadow-sm'
                              )
                        )}
                      >
                        {/* Link para navegar para a página principal */}
                        <Link
                          href={item.href}
                          onMouseEnter={() => setHoveredItem(item.title)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center min-w-0 flex-1',
                            'text-base font-medium',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg',
                            'transition-all duration-200',
                            isCollapsed ? 'justify-center' : 'gap-3'
                          )}
                        >
                          {/* Ícone */}
                          <div
                            className={cn(
                              'relative flex-shrink-0 transition-colors duration-200',
                              active || hasActiveSubmenu
                                ? 'text-white'
                                : item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-500' :
                                  item.gradient === 'from-pink-500 to-rose-500' ? 'text-pink-500' :
                                  item.gradient === 'from-emerald-500 to-teal-500' ? 'text-emerald-500' :
                                  item.gradient === 'from-amber-500 to-orange-500' ? 'text-amber-500' :
                                  item.gradient === 'from-purple-500 to-violet-500' ? 'text-purple-500' :
                                  'text-slate-600'
                            )}
                          >
                            <Icon size={22} strokeWidth={2} className="relative z-10" />
                          </div>
                          
                          {/* Texto - escondido quando colapsado */}
                          <span className={cn(
                            'truncate relative z-10 text-[15px] transition-all duration-300 overflow-hidden',
                            isCollapsed ? 'lg:w-0 lg:opacity-0 lg:ml-0' : 'w-auto opacity-100 ml-0'
                          )}>
                            {item.title}
                          </span>
                        </Link>

                        {/* Botão para expandir/colapsar submenu - escondido quando colapsado */}
                        {!isCollapsed && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleMenu(item.title)
                            }}
                            className={cn(
                              'flex-shrink-0 ml-2 p-1.5 rounded-lg',
                              'transition-all duration-200 ease-out',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                              'hover:bg-black/5 active:bg-black/10',
                              active || hasActiveSubmenu
                                ? 'text-white/90 hover:bg-white/10'
                                : 'text-slate-400 hover:text-slate-600'
                            )}
                            aria-label={isExpanded ? 'Fechar submenu' : 'Abrir submenu'}
                          >
                            <ChevronDown
                              size={18}
                              strokeWidth={2.5}
                              className={cn(
                                'transition-transform duration-300 ease-out',
                                isExpanded ? 'rotate-180' : 'rotate-0'
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Link para itens sem submenu (navega diretamente)
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group relative flex items-center',
                        'rounded-xl',
                        'transition-all duration-200 ease-out',
                        'text-base font-medium',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
                        'active:scale-[0.98]',
                        isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-5 py-3.5 justify-start',
                        active
                          ? cn(
                              'bg-gradient-to-r text-white shadow-lg',
                              item.gradient,
                              'shadow-primary-500/30'
                            )
                          : cn(
                              'text-slate-700',
                              'hover:bg-slate-50',
                              'hover:shadow-sm'
                            )
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <div className={cn(
                        'flex items-center min-w-0',
                        isCollapsed ? 'justify-center' : 'gap-3 flex-1'
                      )}>
                        {/* Ícone */}
                        <div
                          className={cn(
                            'relative flex-shrink-0 transition-colors duration-200',
                            active
                              ? 'text-white'
                              : item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-500' :
                                item.gradient === 'from-pink-500 to-rose-500' ? 'text-pink-500' :
                                item.gradient === 'from-emerald-500 to-teal-500' ? 'text-emerald-500' :
                                item.gradient === 'from-amber-500 to-orange-500' ? 'text-amber-500' :
                                item.gradient === 'from-purple-500 to-violet-500' ? 'text-purple-500' :
                                'text-slate-600'
                          )}
                        >
                          <Icon size={22} strokeWidth={2} className="relative z-10" />
                        </div>
                        
                        {/* Texto - escondido quando colapsado */}
                        <span className={cn(
                          'truncate relative z-10 text-[15px] transition-all duration-300 overflow-hidden',
                          isCollapsed ? 'lg:w-0 lg:opacity-0 lg:ml-0' : 'w-auto opacity-100 ml-0'
                        )}>
                          {item.title}
                        </span>
                      </div>
                    </Link>
                  )}

                  {/* Submenu com animação de altura suave - escondido quando colapsado */}
                  {hasSubmenu && !isCollapsed && (
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        isExpanded 
                          ? 'max-h-96 opacity-100 mt-2' 
                          : 'max-h-0 opacity-0 mt-0'
                      )}
                    >
                      <div className="ml-4 pl-4 border-l-2 border-slate-200/50 space-y-1">
                        {item.submenu.map((subitem, subIndex) => {
                          const SubIcon = subitem.icon
                          const subActive = isActive(subitem.href)

                          return (
                            <Link
                              key={subitem.title}
                              href={subitem.href}
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                              }}
                              className={cn(
                                'group/sub relative flex items-center gap-3',
                                'px-5 py-3 rounded-lg',
                                'transition-all duration-200 ease-out',
                                'text-sm font-medium',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                                'cursor-pointer',
                                'active:scale-[0.98]',
                                subActive
                                  ? cn(
                                      'bg-gradient-to-r text-white shadow-md',
                                      item.gradient,
                                      'shadow-primary-500/20'
                                    )
                                  : cn(
                                      'text-slate-600',
                                      'hover:bg-slate-100',
                                      'hover:shadow-sm'
                                    )
                              )}
                              style={{ animationDelay: `${subIndex * 30}ms` }}
                            >
                              {/* Indicador de ativo para submenu */}
                              {subActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full opacity-80" />
                              )}
                              
                              <SubIcon
                                size={18}
                                strokeWidth={2}
                                className={cn(
                                  'flex-shrink-0 transition-colors duration-200',
                                  subActive
                                    ? 'text-white'
                                    : 'text-slate-500 group-hover/sub:text-primary-600'
                                )}
                              />
                              <span className="truncate relative z-10 text-[14px]">{subitem.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Divisor elegante - escondido quando colapsado */}
            <div className={cn(
              'my-4 border-t border-slate-200/60 transition-all duration-300 overflow-hidden',
              isCollapsed ? 'lg:mx-0 lg:w-0 lg:opacity-0' : 'mx-4 w-auto opacity-100'
            )} />

            {/* Notificações com design premium */}
            <Link
              href="/notificacoes"
              onMouseEnter={() => setHoveredItem('notificacoes')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className={cn(
                'group relative flex items-center',
                'rounded-xl',
                'transition-all duration-200 ease-out',
                'text-base font-medium',
                'focus:outline-none focus:ring-2 focus:ring-amber-500/50',
                isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-5 py-3.5 justify-between',
                isActive('/notificacoes')
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : cn(
                      'text-slate-700',
                      'hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50',
                      'hover:shadow-md hover:shadow-amber-200/50',
                      'active:scale-[0.98]',
                      'border border-transparent hover:border-amber-200/50'
                    )
              )}
            >
              <div className={cn(
                'flex items-center',
                isCollapsed ? 'justify-center' : 'gap-3'
              )}>
                <div className="relative">
                  <Bell
                    size={22}
                    strokeWidth={2}
                    className={cn(
                      'transition-all duration-300',
                      isActive('/notificacoes')
                        ? 'text-white'
                        : 'text-amber-500 group-hover:text-amber-600',
                      hoveredItem === 'notificacoes' && !isActive('/notificacoes') && 'animate-pulse'
                    )}
                  />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  )}
                </div>
                {/* Texto - escondido quando colapsado */}
                <span className={cn(
                  'text-[15px] transition-all duration-300 overflow-hidden',
                  isCollapsed ? 'lg:w-0 lg:opacity-0 lg:ml-0' : 'w-auto opacity-100 ml-0'
                )}>
                  Notificações
                </span>
              </div>
              {/* Badge - escondido quando colapsado */}
              {unreadCount > 0 && !isCollapsed && (
                <span
                  className={cn(
                    'flex items-center justify-center min-w-[24px] h-6 px-2.5 rounded-full',
                    'text-xs font-bold',
                    'transition-all duration-300',
                    isActive('/notificacoes')
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-500/30 animate-pulse'
                  )}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className={cn(
            'lg:hidden fixed inset-0 z-30',
            'bg-black/50',
            'transition-opacity duration-300',
            'animate-fade-in'
          )}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

