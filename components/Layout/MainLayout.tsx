'use client'

import React, { createContext, useContext, useState } from 'react'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within MainLayout')
  }
  return context
}

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen relative">
        <Sidebar />
        <main 
          className={cn(
            'flex-1 min-w-0 min-h-screen transition-all duration-100',
            isCollapsed ? 'lg:ml-20' : 'lg:ml-80'
          )}
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[90rem] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  )
}

