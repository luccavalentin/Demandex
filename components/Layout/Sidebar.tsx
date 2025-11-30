'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  Sun,
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
import { useTheme } from '@/components/Theme/ThemeProvider'

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
      { title: 'Alimentação', href: '/saude/alimentacao', icon: UtensilsCrossed },
      { title: 'Treino', href: '/saude/treino', icon: Dumbbell },
      { title: 'Sono', href: '/saude/sono', icon: Moon },
      { title: 'Metas', href: '/saude/metas', icon: Target },
    ],
  },
  {
    title: 'Gestão Financeira',
    icon: DollarSign,
    href: '/financeiro',
    gradient: 'from-emerald-500 to-teal-500',
    submenu: [
      { title: 'Transações', href: '/financeiro/transacoes', icon: Wallet },
      { title: 'Receitas', href: '/financeiro/receitas', icon: TrendingUp },
      { title: 'Despesas', href: '/financeiro/despesas', icon: PiggyBank },
      { title: 'Metas', href: '/financeiro/metas', icon: Target },
    ],
  },
  {
    title: 'Produtividade',
    icon: CheckSquare,
    href: '/produtividade',
    gradient: 'from-amber-500 to-orange-500',
    submenu: [
      { title: 'Tarefas', href: '/produtividade/tarefas', icon: CheckSquare },
      { title: 'Estudos', href: '/produtividade/estudos', icon: BookOpen },
      { title: 'Projetos', href: '/produtividade/projetos', icon: FolderKanban },
      { title: 'Metas', href: '/produtividade/metas', icon: Target },
    ],
  },
  {
    title: 'Lei da Atração',
    icon: Sparkles,
    href: '/lei-da-atracao',
    gradient: 'from-purple-500 to-violet-500',
    submenu: [
      { title: 'Objetivos', href: '/lei-da-atracao/objetivos', icon: Lightbulb },
      { title: 'Metas', href: '/lei-da-atracao/metas', icon: Target },
    ],
  },
]

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false) // Para mobile
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { notifications } = useStore()
  const { theme, toggleTheme } = useTheme()

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  useEffect(() => {
    // Fecha o menu mobile quando a rota muda
    setIsOpen(false)
  }, [pathname])

  const toggleMenu = useCallback((menuTitle: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuTitle)
        ? prev.filter((title) => title !== menuTitle)
        : [...prev, menuTitle]
    )
  }, [])

  const isActive = useCallback((href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }, [pathname])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50 p-3',
          'bg-white dark:bg-slate-800 rounded-xl',
          'shadow-lg hover:shadow-xl',
          'border border-slate-200/50 dark:border-slate-700/50',
          'transition-all duration-100 ease-out',
          'active:scale-95'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-5">
          {isOpen ? (
            <X size={20} className="text-slate-700 dark:text-slate-200 transition-transform duration-100 rotate-180" />
          ) : (
            <Menu size={20} className="text-slate-700 dark:text-slate-200 transition-transform duration-100" />
          )}
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white dark:bg-slate-900',
          'border-r border-slate-200/60 dark:border-slate-700/60',
          'overflow-y-auto',
          'transition-all duration-100 ease-out',
          // Mobile: fixo e desliza (sobrepõe com overlay)
          'fixed inset-y-0 left-0 z-40',
          'h-screen',
          'shadow-xl',
          'transform',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: fixo e sempre visível
          'lg:fixed lg:z-40 lg:shadow-xl lg:translate-x-0',
          'lg:top-0 lg:left-0 lg:h-screen',
          // Larguras responsivas
          isCollapsed ? 'lg:w-20' : 'lg:w-80',
          'w-80'
        )}
      >

        {/* Header */}
          <div
          className={cn(
            'relative border-b border-slate-200/60 dark:border-slate-700/60',
            'bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800',
            'px-6 sm:px-8 py-7 sm:py-9',
            isCollapsed && 'lg:px-3 lg:py-6'
          )}
        >
          {/* Toggle button - sempre visível no desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'absolute top-2 right-2 z-50 p-2 rounded-lg',
              'bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700',
              'border border-slate-200/60 dark:border-slate-700/60',
              'shadow-md hover:shadow-lg',
              'transition-all duration-100 ease-out',
              'lg:flex hidden items-center justify-center',
              'active:scale-95'
            )}
            aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            <Menu size={16} className="text-slate-700 dark:text-slate-200" />
          </button>

          {/* Logo e título */}
          {!isCollapsed && (
            <div className="flex flex-col items-center gap-2 text-center">
              <Logo size="lg" showText={false} />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-400 dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                DemandeX
              </h1>
              <p className="text-xs sm:text-sm mt-1.5 font-medium italic tracking-wide leading-relaxed max-w-md mx-auto px-2 text-center">
                <span className="drop-shadow-sm font-semibold">
                  <span className="text-slate-700 dark:!text-white">Gerenciando sua vida com</span>{' '}
                  <span className="text-primary-600 dark:text-primary-400 font-bold">inteligência</span>
                </span>
              </p>
            </div>
          )}

          {/* Logo quando colapsado */}
          {isCollapsed && (
            <div className="flex justify-center items-center">
              <Logo size="lg" showText={false} />
            </div>
          )}

          {/* Botão fechar mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              'absolute top-4 right-4 z-50 p-2 rounded-lg',
              'bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700',
              'border border-slate-200/60 dark:border-slate-700/60',
              'shadow-md hover:shadow-lg',
              'transition-all duration-100 ease-out',
              'lg:hidden flex items-center justify-center',
              'active:scale-95'
            )}
            aria-label="Fechar menu"
          >
            <X size={18} className="text-slate-700 dark:text-slate-200" />
          </button>
          </div>

        {/* Navigation com scroll suave */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          {menuItems.map((item, index) => {
              const Icon = item.icon
              const hasSubmenu = item.submenu && item.submenu.length > 0
              const isExpanded = expandedMenus.includes(item.title)
              const active = isActive(item.href, item.exact)
            const hasActiveSubmenu = item.submenu?.some((sub) => isActive(sub.href))

              return (
              <div
                key={item.title}
                className="relative"
              >
                {/* Indicador de ativo - barra lateral */}
                {active && (
                  <div
                    className={cn(
                      'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full',
                      'bg-gradient-to-b from-primary-500 to-primary-600',
                      'shadow-md shadow-primary-500/30'
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
                        isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-5 py-3.5 justify-between',
                        active || hasActiveSubmenu
                          ? cn(
                              'bg-gradient-to-r text-white shadow-lg',
                              item.gradient,
                              'shadow-primary-500/30'
                            )
                          : cn(
                              'text-slate-700 dark:text-slate-200'
                            )
                      )}
                    >
                      {/* Link para navegar para a página principal */}
                  <Link
                    href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center min-w-0 flex-1',
                          'text-base font-medium',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg',
                          isCollapsed ? 'justify-center' : 'gap-3'
                        )}
                      >
                        {/* Ícone com fundo sofisticado */}
                        <div className="relative flex-shrink-0">
                          {active || hasActiveSubmenu ? (
                            <div className={cn(
                              'w-9 h-9 rounded-xl bg-gradient-to-br shadow-md flex items-center justify-center',
                              item.gradient,
                              'ring-1 ring-white/50'
                            )}>
                              <Icon size={20} strokeWidth={2.5} className="text-white" />
                            </div>
                          ) : (
                            <div className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150',
                              'bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800',
                              'border border-slate-200/60 dark:border-slate-600/60',
                              'shadow-sm',
                              'group-hover:shadow-md',
                              item.gradient === 'from-blue-500 to-cyan-500' && 'group-hover:bg-gradient-to-br group-hover:from-blue-50 dark:group-hover:from-blue-900/30 group-hover:to-cyan-50 dark:group-hover:to-cyan-900/30 group-hover:border-blue-200/60 dark:group-hover:border-blue-500/40',
                              item.gradient === 'from-pink-500 to-rose-500' && 'group-hover:bg-gradient-to-br group-hover:from-pink-50 dark:group-hover:from-pink-900/30 group-hover:to-rose-50 dark:group-hover:to-rose-900/30 group-hover:border-pink-200/60 dark:group-hover:border-pink-500/40',
                              item.gradient === 'from-emerald-500 to-teal-500' && 'group-hover:bg-gradient-to-br group-hover:from-emerald-50 dark:group-hover:from-emerald-900/30 group-hover:to-teal-50 dark:group-hover:to-teal-900/30 group-hover:border-emerald-200/60 dark:group-hover:border-emerald-500/40',
                              item.gradient === 'from-amber-500 to-orange-500' && 'group-hover:bg-gradient-to-br group-hover:from-amber-50 dark:group-hover:from-amber-900/30 group-hover:to-orange-50 dark:group-hover:to-orange-900/30 group-hover:border-amber-200/60 dark:group-hover:border-amber-500/40',
                              item.gradient === 'from-purple-500 to-violet-500' && 'group-hover:bg-gradient-to-br group-hover:from-purple-50 dark:group-hover:from-purple-900/30 group-hover:to-violet-50 dark:group-hover:to-violet-900/30 group-hover:border-purple-200/60 dark:group-hover:border-purple-500/40'
                            )}>
                              <Icon 
                                size={20} 
                                strokeWidth={2.5} 
                                className={cn(
                                  'transition-colors duration-150',
                                  item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300' :
                                  item.gradient === 'from-pink-500 to-rose-500' ? 'text-pink-500 dark:text-pink-400 group-hover:text-pink-600 dark:group-hover:text-pink-300' :
                                  item.gradient === 'from-emerald-500 to-teal-500' ? 'text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300' :
                                  item.gradient === 'from-amber-500 to-orange-500' ? 'text-amber-500 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300' :
                                  item.gradient === 'from-purple-500 to-violet-500' ? 'text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300' :
                                  'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                )}
                              />
                            </div>
                          )}
                    </div>
                          
                          {/* Texto - escondido quando colapsado */}
                          <span className={cn(
                            'truncate relative z-10 text-[15px] overflow-hidden',
                            active || hasActiveSubmenu ? 'text-white' : 'text-slate-700 dark:text-slate-200',
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
                              e.stopPropagation()
                        toggleMenu(item.title)
                    }}
                    className={cn(
                              'p-1 rounded-lg',
                              'hover:bg-white/10',
                              'transition-all duration-100',
                              'flex-shrink-0'
                            )}
                          >
                            <ChevronDown
                              size={16}
                              className={cn(
                                'text-slate-600 dark:text-slate-300',
                                (active || hasActiveSubmenu) && 'text-white',
                                'transition-transform duration-100',
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
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group relative flex items-center',
                        'rounded-xl',
                        'text-base font-medium',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
                        isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-5 py-3.5 justify-start',
                      active
                          ? cn(
                              'bg-gradient-to-r text-white shadow-lg',
                              item.gradient,
                              'shadow-primary-500/30'
                            )
                          : cn(
                              'text-slate-700 dark:text-slate-200',
                              'hover:bg-slate-50 dark:hover:bg-slate-800',
                              'hover:shadow-sm'
                            )
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <div className={cn(
                        'flex items-center min-w-0',
                        isCollapsed ? 'justify-center' : 'gap-3 flex-1'
                      )}>
                        {/* Ícone com fundo sofisticado */}
                        <div className="relative flex-shrink-0">
                          {active ? (
                            <div className={cn(
                              'w-9 h-9 rounded-xl bg-gradient-to-br shadow-md flex items-center justify-center',
                              item.gradient,
                              'ring-1 ring-white/50'
                            )}>
                              <Icon size={20} strokeWidth={2.5} className="text-white" />
                            </div>
                          ) : (
                            <div className={cn(
                              'w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150',
                              'bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800',
                              'border border-slate-200/60 dark:border-slate-600/60',
                              'shadow-sm',
                              'group-hover:shadow-md',
                              item.gradient === 'from-blue-500 to-cyan-500' && 'group-hover:bg-gradient-to-br group-hover:from-blue-50 dark:group-hover:from-blue-900/30 group-hover:to-cyan-50 dark:group-hover:to-cyan-900/30 group-hover:border-blue-200/60 dark:group-hover:border-blue-500/40',
                              item.gradient === 'from-pink-500 to-rose-500' && 'group-hover:bg-gradient-to-br group-hover:from-pink-50 dark:group-hover:from-pink-900/30 group-hover:to-rose-50 dark:group-hover:to-rose-900/30 group-hover:border-pink-200/60 dark:group-hover:border-pink-500/40',
                              item.gradient === 'from-emerald-500 to-teal-500' && 'group-hover:bg-gradient-to-br group-hover:from-emerald-50 dark:group-hover:from-emerald-900/30 group-hover:to-teal-50 dark:group-hover:to-teal-900/30 group-hover:border-emerald-200/60 dark:group-hover:border-emerald-500/40',
                              item.gradient === 'from-amber-500 to-orange-500' && 'group-hover:bg-gradient-to-br group-hover:from-amber-50 dark:group-hover:from-amber-900/30 group-hover:to-orange-50 dark:group-hover:to-orange-900/30 group-hover:border-amber-200/60 dark:group-hover:border-amber-500/40',
                              item.gradient === 'from-purple-500 to-violet-500' && 'group-hover:bg-gradient-to-br group-hover:from-purple-50 dark:group-hover:from-purple-900/30 group-hover:to-violet-50 dark:group-hover:to-violet-900/30 group-hover:border-purple-200/60 dark:group-hover:border-purple-500/40'
                            )}>
                              <Icon 
                                size={20} 
                                strokeWidth={2.5} 
                                className={cn(
                                  'transition-colors duration-150',
                                  item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300' :
                                  item.gradient === 'from-pink-500 to-rose-500' ? 'text-pink-500 dark:text-pink-400 group-hover:text-pink-600 dark:group-hover:text-pink-300' :
                                  item.gradient === 'from-emerald-500 to-teal-500' ? 'text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300' :
                                  item.gradient === 'from-amber-500 to-orange-500' ? 'text-amber-500 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300' :
                                  item.gradient === 'from-purple-500 to-violet-500' ? 'text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300' :
                                  'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                )}
                              />
                            </div>
                          )}
                    </div>
                        
                        {/* Texto - escondido quando colapsado */}
                        <span className={cn(
                          'truncate relative z-10 text-[15px] overflow-hidden',
                          active ? 'text-white' : 'text-slate-700 dark:text-slate-200',
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
                      'overflow-hidden transition-all duration-100 ease-in-out',
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
                              onClick={() => setIsOpen(false)}
                            className={cn(
                                'group/sub relative flex items-center gap-3',
                                'px-5 py-3 rounded-lg',
                                'text-sm font-medium',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                              subActive
                                  ? cn(
                                      'bg-gradient-to-r text-white shadow-md',
                                      item.gradient,
                                      'shadow-primary-500/20'
                                    )
                                  : cn(
                                      'text-slate-600 dark:text-slate-300',
                                      'hover:bg-slate-100 dark:hover:bg-slate-800',
                                      'hover:shadow-sm'
                                    )
                              )}
                            >
                              {/* Indicador de ativo para submenu */}
                              {subActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r-full opacity-80" />
                              )}
                              
                              <div className="relative flex-shrink-0">
                                {subActive ? (
                                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shadow-sm">
                                    <SubIcon
                                      size={16}
                                      strokeWidth={2.5}
                                      className="text-white"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-slate-100/50 dark:bg-slate-700/50 flex items-center justify-center group-hover/sub:bg-white/80 dark:group-hover/sub:bg-slate-700/80 group-hover/sub:shadow-sm">
                                    <SubIcon
                                      size={16}
                                      strokeWidth={2.5}
                                      className="text-slate-500 dark:text-slate-300 group-hover/sub:text-primary-600 dark:group-hover/sub:text-primary-400"
                                    />
                                  </div>
                                )}
                              </div>
                              <span className="truncate relative z-10 text-[14px] text-slate-600 dark:text-slate-300">{subitem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Notificações */}
          {!isCollapsed && (
            <div className="pt-2">
            <Link
              href="/notificacoes"
              onClick={() => setIsOpen(false)}
              className={cn(
                  'group relative flex items-center gap-3',
                  'px-5 py-3.5 rounded-xl',
                  'text-base font-medium',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                isActive('/notificacoes')
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm'
                )}
              >
                <div className="relative">
                  <Bell
                    size={20}
                    strokeWidth={2.5}
                    className={cn(
                      isActive('/notificacoes')
                        ? 'text-white'
                        : 'text-yellow-500'
                    )}
                  />
              {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
                </div>
                <span className="truncate">Notificações</span>
            </Link>
        </div>
          )}

          {/* Toggle de tema */}
          <div className={cn(
            'pt-4 border-t border-slate-200/60',
            isCollapsed && 'lg:px-0'
          )}>
            {!isCollapsed ? (
              <div className="flex items-center justify-between gap-3 px-5 py-3 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    'bg-gradient-to-br from-primary-500 to-primary-600',
                    'shadow-md'
                  )}>
                    {theme === 'dark' ? (
                      <Sun size={16} className="text-white" />
                    ) : (
                      <Moon size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors duration-100',
                    theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'
                  )}
                  aria-label="Toggle theme"
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-100',
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    'bg-gradient-to-br from-primary-500 to-primary-600',
                    'shadow-md hover:shadow-lg',
                    'transition-all duration-100',
                    'active:scale-95'
                  )}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun size={16} className="text-white" />
                  ) : (
                    <Moon size={16} className="text-white" />
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  )
}