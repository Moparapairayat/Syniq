import type { ReactNode } from 'react'
import { defaultThemeMode, ThemeContext } from './themeStore'

export interface ThemeProviderProps {
  readonly children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ themeMode: defaultThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
