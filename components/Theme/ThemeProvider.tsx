'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
})

export const useTheme = () => {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme] = useState<Theme>('light')

  useEffect(() => {
    // Sempre força light mode
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      root.classList.remove('dark')
      root.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }, [])

  const setTheme = () => {
    // Não faz nada, sempre light
  }

  const toggleTheme = () => {
    // Não faz nada, sempre light
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
