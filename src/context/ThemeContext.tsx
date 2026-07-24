import { useEffect, type ReactNode } from 'react'
import type { ThemeMode } from '@/types/theme'
import { ThemeContext } from './themeStore'
import { useSettings } from './SettingsContext'

export interface ThemeProviderProps {
  readonly children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings, updateSetting } = useSettings()

  const currentThemeMode: ThemeMode =
    settings.themeMode === 'light' ? 'light' : 'dark'

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', currentThemeMode)
    if (currentThemeMode === 'light') {
      root.classList.add('light-theme')
      root.classList.remove('dark-theme')
    } else {
      root.classList.add('dark-theme')
      root.classList.remove('light-theme')
    }
  }, [currentThemeMode])

  const toggleTheme = () => {
    const nextMode: ThemeMode = currentThemeMode === 'dark' ? 'light' : 'dark'
    updateSetting({ themeMode: nextMode })
  }

  const setThemeMode = (mode: ThemeMode) => {
    updateSetting({ themeMode: mode })
  }

  return (
    <ThemeContext.Provider
      value={{ themeMode: currentThemeMode, toggleTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
