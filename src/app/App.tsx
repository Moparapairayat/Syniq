import { SettingsProvider } from '@/context/SettingsContext'
import { ToastProvider } from '@/components/ui'
import { AppRouterProvider } from './providers/AppRouterProvider'

export function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <AppRouterProvider />
      </ToastProvider>
    </SettingsProvider>
  )
}
