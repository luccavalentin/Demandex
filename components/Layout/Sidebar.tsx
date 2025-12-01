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
      { title: 'Mural', href: '/lei-da-atracao/mural', icon: Sparkles },
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

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  useEffect(() => {
    // Fecha o menu mobile quando a rota muda
    setIsOpen(false)
    
    // Expande automaticamente os menus que contêm a página ativa
    menuItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some((sub) => {
          return pathname?.startsWith(sub.href)
        })
        if (hasActiveSubmenu) {
          setExpandedMenus((prev) => {
            if (!prev.includes(item.title)) {
              return [...prev, item.title]
            }
            return prev
          })
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const toggleMenu = useCallback((menuTitle: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setExpandedMenus((prev) => {
      // Se o menu já está aberto, fecha
      if (prev.includes(menuTitle)) {
        return prev.filter((title) => title !== menuTitle)
      }
      // Se não está aberto, fecha todos os outros e abre apenas este
      return [menuTitle]
    })
  }, [])

  const isActive = useCallback((href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }, [pathname])

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className={cn(
          'lg:hidden fixed top-4 left-4 z-50 p-3.5',
          'bg-white/95 backdrop-blur-sm rounded-xl',
          'shadow-xl hover:shadow-2xl',
          'border border-slate-200/60',
          'transition-all duration-200 ease-out',
          'active:scale-95 hover:scale-105',
          'cursor-pointer'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-5">
          {isOpen ? (
            <X size={21} className="text-primary-600 transition-all duration-200 rotate-180" />
          ) : (
            <Menu size={21} className="text-primary-600 transition-all duration-200" />
          )}
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white',
          'border-r border-slate-200/40',
          'overflow-y-auto',
          'transition-transform duration-300 ease-out',
          // Mobile: fixo e desliza (sobrepõe com overlay)
          'fixed inset-y-0 left-0 z-40',
          'will-change-transform',
          'h-screen',
          'shadow-2xl',
          'transform',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: fixo e sempre visível
          'lg:fixed lg:z-40 lg:shadow-2xl lg:translate-x-0',
          'lg:top-0 lg:left-0 lg:h-screen',
          // Larguras responsivas
          isCollapsed ? 'lg:w-20' : 'lg:w-80',
          'w-80'
        )}
      >

        {/* Header */}
          <div
          className={cn(
            'relative border-b border-slate-200/40',
            'bg-gradient-to-br from-primary-50 via-white to-primary-50/30',
            'px-6 sm:px-8 py-8 sm:py-10',
            isCollapsed && 'lg:px-4 lg:py-7'
          )}
        >
          {/* Toggle button - sempre visível no desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'absolute top-3 right-3 z-50 p-2.5 rounded-xl',
              'bg-white/90 backdrop-blur-sm',
              'border border-slate-200/60',
              'shadow-lg hover:shadow-xl hover:scale-105',
              'transition-all duration-200 ease-out',
              'lg:flex hidden items-center justify-center',
              'active:scale-95',
              'cursor-pointer',
              'hover:bg-white'
            )}
            aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            <Menu size={18} className="text-primary-600" />
          </button>

          {/* Logo e título */}
          {!isCollapsed && (
            <div className="flex flex-col items-center gap-3 text-center animate-fadeIn">
              <div className="relative">
                <Logo size="lg" showText={false} />
                <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-xl -z-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent tracking-tight">
                DemandeX
              </h1>
              <p className="text-xs sm:text-sm mt-0.5 font-medium tracking-wide leading-relaxed max-w-md mx-auto px-2 text-center">
                <span className="font-semibold">
                  <span className="text-slate-600">Gerenciando sua vida com</span>{' '}
                  <span className="text-primary-600 font-bold">inteligência</span>
                </span>
              </p>
            </div>
          )}

          {/* Logo quando colapsado */}
          {isCollapsed && (
            <div className="flex justify-center items-center animate-scaleIn">
              <div className="relative">
                <Logo size="lg" showText={false} />
                <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-xl -z-10" />
              </div>
            </div>
          )}

          {/* Botão fechar mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              'absolute top-4 right-4 z-50 p-2.5 rounded-xl',
              'bg-white/90 backdrop-blur-sm',
              'border border-slate-200/60',
              'shadow-lg hover:shadow-xl hover:scale-105',
              'transition-all duration-200 ease-out',
              'lg:hidden flex items-center justify-center',
              'active:scale-95',
              'cursor-pointer',
              'hover:bg-white'
            )}
            aria-label="Fechar menu"
          >
            <X size={18} className="text-slate-700" />
          </button>
          </div>

        {/* Navigation com scroll suave */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-1.5 min-h-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
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
                      'absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full',
                      'bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700',
                      'shadow-lg shadow-primary-500/40',
                      'animate-fadeIn'
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
                        isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5 justify-between',
                        active || hasActiveSubmenu
                          ? cn(
                              'bg-gradient-to-r text-white shadow-xl',
                              item.gradient,
                              'shadow-primary-500/40',
                              'scale-[1.02]'
                            )
                          : cn(
                              'text-slate-700',
                              'hover:bg-slate-50',
                              'hover:shadow-md',
                              'hover:scale-[1.01]'
                            )
                      )}
                    >
                      {/* Link para navegar para a página principal */}
                  <Link
                    href={item.href}
                        onClick={() => {
                          setIsOpen(false)
                          // Abre este submenu e fecha os outros
                          if (!isExpanded) {
                            setExpandedMenus([item.title])
                          }
                        }}
                        className={cn(
                          'flex items-center min-w-0 flex-1 cursor-pointer',
                          'text-base font-medium',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg',
                          isCollapsed ? 'justify-center' : 'gap-3'
                        )}
                      >
                        {/* Ícone com fundo sofisticado */}
                        <div className="relative flex-shrink-0">
                          {active || hasActiveSubmenu ? (
                            <div className={cn(
                              'w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center',
                              item.gradient,
                              'ring-2 ring-white/30',
                              'animate-scaleIn'
                            )}>
                              <Icon size={21} strokeWidth={2.5} className="text-white drop-shadow-sm" />
                            </div>
                          ) : (
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                              'bg-gradient-to-br from-slate-50 to-white',
                              'border border-slate-200/80',
                              'shadow-sm',
                              'group-hover:shadow-md group-hover:scale-105',
                              item.gradient === 'from-blue-500 to-cyan-500' && 'group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-cyan-50 group-hover:border-blue-300/60',
                              item.gradient === 'from-pink-500 to-rose-500' && 'group-hover:bg-gradient-to-br group-hover:from-pink-50 group-hover:to-rose-50 group-hover:border-pink-300/60',
                              item.gradient === 'from-emerald-500 to-teal-500' && 'group-hover:bg-gradient-to-br group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:border-emerald-300/60',
                              item.gradient === 'from-amber-500 to-orange-500' && 'group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-orange-50 group-hover:border-amber-300/60',
                              item.gradient === 'from-purple-500 to-violet-500' && 'group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-violet-50 group-hover:border-purple-300/60'
                            )}>
                              <Icon 
                                size={21} 
                                strokeWidth={2.5} 
                                className={cn(
                                  'transition-all duration-200',
                                  item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-500 group-hover:text-blue-600' :
                                  item.gradient === 'from-pink-500 to-rose-500' ? 'text-pink-500 group-hover:text-pink-600' :
                                  item.gradient === 'from-emerald-500 to-teal-500' ? 'text-emerald-500 group-hover:text-emerald-600' :
                                  item.gradient === 'from-amber-500 to-orange-500' ? 'text-amber-500 group-hover:text-amber-600' :
                                  item.gradient === 'from-purple-500 to-violet-500' ? 'text-purple-500 group-hover:text-purple-600' :
                                  'text-slate-500 group-hover:text-slate-600'
                                )}
                              />
                            </div>
                          )}
                    </div>
                          
                          {/* Texto - escondido quando colapsado */}
                          <span className={cn(
                            'truncate relative z-10 text-[15px] font-semibold overflow-hidden',
                            active || hasActiveSubmenu ? 'text-white drop-shadow-sm' : 'text-slate-700',
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
                              // Toggle do submenu - fecha todos os outros e abre/fecha este
                              if (isExpanded) {
                                setExpandedMenus([])
                              } else {
                                setExpandedMenus([item.title])
                              }
                            }}
                            className={cn(
                              'p-1.5 rounded-lg cursor-pointer',
                              'hover:bg-white/20',
                              'transition-all duration-200',
                              'flex-shrink-0',
                              'active:scale-95',
                              'hover:scale-110'
                            )}
                          >
                            <ChevronDown
                              size={18}
                              className={cn(
                                'text-slate-600',
                                (active || hasActiveSubmenu) && 'text-white drop-shadow-sm',
                                'transition-all duration-200',
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
                      onClick={() => {
                        setIsOpen(false)
                        // Navegação imediata
                      }}
                      className={cn(
                        'group relative flex items-center',
                        'rounded-xl',
                        'text-base font-semibold',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
                        'transition-all duration-200',
                        'cursor-pointer',
                        isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-4 py-3.5 justify-start',
                      active
                          ? cn(
                              'bg-gradient-to-r text-white shadow-xl',
                              item.gradient,
                              'shadow-primary-500/40',
                              'scale-[1.02]'
                            )
                          : cn(
                              'text-slate-700',
                              'hover:bg-slate-50',
                              'hover:shadow-md',
                              'hover:scale-[1.01]'
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
                              'w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center',
                              item.gradient,
                              'ring-2 ring-white/30',
                              'animate-scaleIn'
                            )}>
                              <Icon size={21} strokeWidth={2.5} className="text-white drop-shadow-sm" />
                            </div>
                          ) : (
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                              'bg-gradient-to-br from-slate-50 to-white',
                              'border border-slate-200/80',
                              'shadow-sm',
                              'group-hover:shadow-md group-hover:scale-105',
                              item.gradient === 'from-blue-500 to-cyan-500' && 'group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-cyan-50 group-hover:border-blue-300/60',
                              item.gradient === 'from-pink-500 to-rose-500' && 'group-hover:bg-gradient-to-br group-hover:from-pink-50 group-hover:to-rose-50 group-hover:border-pink-300/60',
                              item.gradient === 'from-emerald-500 to-teal-500' && 'group-hover:bg-gradient-to-br group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:border-emerald-300/60',
                              item.gradient === 'from-amber-500 to-orange-500' && 'group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-orange-50 group-hover:border-amber-300/60',
                              item.gradient === 'from-purple-500 to-violet-500' && 'group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-violet-50 group-hover:border-purple-300/60'
                            )}>
                              <Icon 
                                size={21} 
                                strokeWidth={2.5} 
                                className={cn(
                                  'transition-all duration-200',
                                  item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-500 group-hover:text-blue-600' :
                                  item.gradient === 'from-pink-500 to-rose-500' ? 'text-pink-500 group-hover:text-pink-600' :
                                  item.gradient === 'from-emerald-500 to-teal-500' ? 'text-emerald-500 group-hover:text-emerald-600' :
                                  item.gradient === 'from-amber-500 to-orange-500' ? 'text-amber-500 group-hover:text-amber-600' :
                                  item.gradient === 'from-purple-500 to-violet-500' ? 'text-purple-500 group-hover:text-purple-600' :
                                  'text-slate-500 group-hover:text-slate-600'
                                )}
                              />
                            </div>
                          )}
                    </div>
                        
                        {/* Texto - escondido quando colapsado */}
                        <span className={cn(
                          'truncate relative z-10 text-[15px] font-semibold overflow-hidden',
                          active ? 'text-white drop-shadow-sm' : 'text-slate-700',
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
                      'overflow-hidden transition-all duration-300 ease-out',
                      isExpanded 
                        ? 'max-h-96 opacity-100 mt-2' 
                        : 'max-h-0 opacity-0 mt-0'
                    )}
                  >
                    <div className="ml-5 pl-5 border-l-2 border-slate-200/40 space-y-1.5">
                      {item.submenu.map((subitem, subIndex) => {
                        const SubIcon = subitem.icon
                        const subActive = isActive(subitem.href)

                        return (
                          <Link
                            key={subitem.title}
                            href={subitem.href}
                              onClick={() => {
                                setIsOpen(false)
                                // Navegação imediata
                              }}
                            className={cn(
                                'group/sub relative flex items-center gap-3',
                                'px-4 py-2.5 rounded-lg',
                                'text-sm font-medium',
                                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                                'transition-all duration-200',
                                'cursor-pointer',
                              subActive
                                  ? cn(
                                      'bg-gradient-to-r text-white shadow-lg',
                                      item.gradient,
                                      'shadow-primary-500/30',
                                      'scale-[1.02]'
                                    )
                                  : cn(
                                      'text-slate-600',
                                      'hover:bg-slate-100',
                                      'hover:shadow-sm',
                                      'hover:scale-[1.01]'
                                    )
                              )}
                            >
                              {/* Indicador de ativo para submenu */}
                              {subActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-white rounded-r-full opacity-90 shadow-sm" />
                              )}
                              
                              <div className="relative flex-shrink-0">
                                {subActive ? (
                                  <div className="w-8 h-8 rounded-lg bg-white/25 flex items-center justify-center shadow-md ring-1 ring-white/30">
                                    <SubIcon
                                      size={17}
                                      strokeWidth={2.5}
                                      className="text-white drop-shadow-sm"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-slate-100/60 flex items-center justify-center group-hover/sub:bg-white group-hover/sub:shadow-sm transition-all duration-200">
                                    <SubIcon
                                      size={17}
                                      strokeWidth={2.5}
                                      className="text-slate-500 group-hover/sub:text-primary-600 transition-colors duration-200"
                                    />
                                  </div>
                                )}
                              </div>
                              <span className={cn(
                                "truncate relative z-10 text-[14px] font-medium",
                                subActive ? "text-white drop-shadow-sm" : "text-slate-600"
                              )}>{subitem.title}</span>
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
            <div className="pt-3 mt-2 border-t border-slate-200/40">
            <Link
              href="/notificacoes"
              onClick={() => {
                setIsOpen(false)
                // Navegação imediata
              }}
              className={cn(
                  'group relative flex items-center gap-3',
                  'px-4 py-3.5 rounded-xl',
                  'text-base font-semibold',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                  'transition-all duration-200',
                  'cursor-pointer',
                isActive('/notificacoes')
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-xl scale-[1.02]'
                    : 'text-slate-700 hover:bg-slate-50 hover:shadow-md hover:scale-[1.01]'
                )}
              >
                <div className="relative">
                  {isActive('/notificacoes') ? (
                    <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center shadow-md ring-1 ring-white/30">
                      <Bell
                        size={21}
                        strokeWidth={2.5}
                        className="text-white drop-shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                      <Bell
                        size={21}
                        strokeWidth={2.5}
                        className="text-yellow-500 group-hover:text-yellow-600 transition-colors duration-200"
                      />
                    </div>
                  )}
              {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
                </div>
                <span className={cn(
                  "truncate",
                  isActive('/notificacoes') ? "text-white drop-shadow-sm" : "text-slate-700"
                )}>Notificações</span>
            </Link>
        </div>
          )}

        </nav>
      </aside>
    </>
  )
}