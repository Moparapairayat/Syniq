import { SettingsProvider } from '@/context/SettingsContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/ui'
import { AppRouterProvider } from './providers/AppRouterProvider'

export function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppRouterProvider />
        </ToastProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}
