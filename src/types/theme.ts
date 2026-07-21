export type ThemeMode = 'dark' | 'light'

export interface ThemeContextValue {
  readonly themeMode: ThemeMode
  readonly toggleTheme: () => void
  readonly setThemeMode: (mode: ThemeMode) => void
}
