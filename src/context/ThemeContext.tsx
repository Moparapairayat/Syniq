import { useState, useEffect, type ReactNode } from 'react'
import type { ThemeMode } from '@/types/theme'
import { defaultThemeMode, ThemeContext } from './themeStore'

export interface ThemeProviderProps {
  readonly children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('syniq-theme-mode') as ThemeMode | null
      if (stored === 'light' || stored === 'dark') return stored
    }
    return defaultThemeMode
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', themeMode)
    if (themeMode === 'light') {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    } else {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    }
    localStorage.setItem('syniq-theme-mode', themeMode)
  }, [themeMode])

  const toggleTheme = () => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
  }

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
