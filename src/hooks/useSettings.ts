import { useContext } from 'react'
import { SettingsContext } from '@/context/SettingsContextObject'
import type { SettingsContextValue } from '@/context/SettingsContext'

/**
 * Consumes the SettingsContext and returns the current settings and update methods.
 * Must be used within a SettingsProvider.
 */
export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
