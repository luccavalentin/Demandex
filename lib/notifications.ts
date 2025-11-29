import { useStore } from './store'
import type { Notification } from '@/types'

const notificationMessages = {
  diet: {
    title: 'Lembrete de Dieta',
    defaultMessage: 'Hora de fazer sua refeição!',
  },
  workout: {
    title: 'Lembrete de Treino',
    defaultMessage: 'Hora de treinar!',
  },
  study: {
    title: 'Lembrete de Estudos',
    defaultMessage: 'Hora de estudar!',
  },
  sleep: {
    title: 'Aviso de Higiene do Sono',
    defaultMessage: 'Hora de preparar para dormir!',
  },
  task: {
    title: 'Nova Tarefa',
    defaultMessage: 'Você tem uma nova tarefa!',
  },
  'task-overdue': {
    title: 'Tarefa Atrasada',
    defaultMessage: 'Você tem tarefas atrasadas!',
  },
  financial: {
    title: 'Alerta Financeiro',
    defaultMessage: 'Atenção nas suas finanças!',
  },
}

// Hook para usar notificações dentro de componentes
export const useNotifications = () => {
  const { addNotification } = useStore()

  const createNotification = (
    type: Notification['type'],
    message?: string,
    actionUrl?: string
  ) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title: notificationMessages[type].title,
      message: message || notificationMessages[type].defaultMessage,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl,
    }

    addNotification(notification)

    // Se o navegador suporta notificações, mostrar também
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
            })
          }
        })
      }
    }
  }

  return { createNotification }
}
