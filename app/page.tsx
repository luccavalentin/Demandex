'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard/Dashboard'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se há dados salvos, senão inicializar
    if (typeof window !== 'undefined') {
      const hasData = localStorage.getItem('demandex-initialized')
      if (!hasData) {
        localStorage.setItem('demandex-initialized', 'true')
      }
    }
  }, [])

  return <Dashboard />
}

