export type ThemeMode = 'dark'

export interface ThemeContextValue {
  readonly themeMode: ThemeMode
  readonly toggleTheme: () => void
  readonly setThemeMode: (mode: ThemeMode) => void
}
