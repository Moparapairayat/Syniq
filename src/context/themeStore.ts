import { createContext, useContext } from 'react'
import type { ThemeContextValue, ThemeMode } from '@/types/theme'

export const defaultThemeMode: ThemeMode = 'dark'

export const ThemeContext = createContext<ThemeContextValue>({
  themeMode: defaultThemeMode,
})

export function useTheme() {
  return useContext(ThemeContext)
}
