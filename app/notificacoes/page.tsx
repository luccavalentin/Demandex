'use client'

import React from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { useStore } from '@/lib/store'
import { Bell, Trash2, CheckCircle2, UtensilsCrossed, Dumbbell, BookOpen, Moon, CheckSquare, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import Link from 'next/link'

const notificationIcons = {
  diet: UtensilsCrossed,
  workout: Dumbbell,
  study: BookOpen,
  sleep: Moon,
  task: CheckSquare,
  'task-overdue': CheckSquare,
  financial: DollarSign,
}

const notificationLabels = {
  diet: 'Lembrete de Dieta',
  workout: 'Lembrete de Treino',
  study: 'Lembrete de Estudos',
  sleep: 'Aviso de Higiene do Sono',
  task: 'Nova Tarefa',
  'task-overdue': 'Tarefa Atrasada',
  financial: 'Alerta Financeiro',
}

export default function NotificacoesPage() {
  const {
    notifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useStore()

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 relative">
              <Bell className="text-white" size={24} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Notificações
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                {unreadCount > 0
                  ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                  : 'Todas as notificações foram lidas'}
              </p>
            </div>
            {notifications.length > 0 && (
              <Button variant="secondary" onClick={clearAllNotifications}>
                Limpar Todas
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type]
            return (
              <Card
                key={notification.id}
                className={`p-4 ${!notification.read ? 'bg-primary-50 border-primary-200' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    !notification.read ? 'bg-primary-100' : 'bg-slate-100'
                  }`}>
                    <Icon
                      className={!notification.read ? 'text-primary-600' : 'text-slate-600'}
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {notificationLabels[notification.type]}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(notification.createdAt), "dd 'de' MMM 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="p-2 hover:bg-success-50 rounded-lg transition-colors"
                            title="Marcar como lida"
                          >
                            <CheckCircle2 size={16} className="text-success-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-danger-600" />
                        </button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                      >
                        Ver detalhes →
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12 text-center">
            <Bell size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">
              Nenhuma notificação no momento
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

