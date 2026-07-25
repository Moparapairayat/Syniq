import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { AppSettings } from '@/repositories/SettingsRepository'
import { settingsService } from '@/services/SettingsService'
import { audioService } from '@/services/AudioService'

export interface SettingsContextValue {
  readonly settings: AppSettings
  readonly isLoading: boolean
  readonly updateSetting: (updates: Partial<AppSettings>) => Promise<void>
  readonly resetSettings: () => Promise<void>
}

export type SettingsContextType = SettingsContextValue

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export function SettingsProvider({ children }: { readonly children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(
    () => settingsService.defaultSettings,
  )
  const [isLoading, setIsLoading] = useState(true)

  const applySettings = (data: AppSettings) => {
    // 1. High Contrast Configuration
    document.documentElement.setAttribute('data-high-contrast', String(data.highContrast))

    // 2. Color Blind Configuration
    document.documentElement.setAttribute('data-color-blind', data.colorBlindMode)

    // 3. Audio Volumes Configuration
    audioService.setVolume(data.soundVolume)
  }

  // Load preferences from IndexedDB on startup
  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await settingsService.getSettings()
        if (!active) return
        setSettings(data)
        applySettings(data)
      } catch (error) {
        console.error('Failed to load settings context:', error)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const updateSetting = async (updates: Partial<AppSettings>) => {
    try {
      const updated = await settingsService.updateSettings(updates)
      setSettings(updated)
      applySettings(updated)
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const resetSettings = async () => {
    try {
      const reset = await settingsService.resetSettings()
      setSettings(reset)
      applySettings(reset)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
