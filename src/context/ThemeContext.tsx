import { useEffect, type ReactNode } from 'react'
import type { ThemeMode } from '@/types/theme'
import { ThemeContext } from './themeStore'
import { useSettings } from './SettingsContext'

export interface ThemeProviderProps {
  readonly children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { updateSetting } = useSettings()
  const currentThemeMode: ThemeMode = 'dark'

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', 'dark')
    root.classList.add('dark-theme')
    root.classList.remove('light-theme')
  }, [])

  const toggleTheme = () => {
    updateSetting({ themeMode: 'dark' })
  }

  const setThemeMode = (_mode: ThemeMode) => {
    updateSetting({ themeMode: 'dark' })
  }

  return (
    <ThemeContext.Provider
      value={{ themeMode: currentThemeMode, toggleTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
