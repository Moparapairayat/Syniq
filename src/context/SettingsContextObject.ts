import { createContext } from 'react'
import type { SettingsContextValue } from './SettingsContext'

/**
 * The React context object for application settings.
 * Consumed by useSettings hook and provided by SettingsProvider.
 */
export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)
