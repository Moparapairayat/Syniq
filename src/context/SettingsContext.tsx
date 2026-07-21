import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { settingsService } from '@/services/SettingsService'
import { audioService } from '@/services/AudioService'
import type { AppSettings } from '@/repositories/SettingsRepository'

export interface SettingsContextType {
  readonly settings: AppSettings
  readonly isLoading: boolean
  readonly updateSetting: (updates: Partial<AppSettings>) => Promise<void>
  readonly resetSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

/* eslint-disable-next-line react-refresh/only-export-components */
export function useSettings() {
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
    // 1. Theme Configuration
    const theme =
      data.themeMode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : data.themeMode
    document.documentElement.setAttribute('data-theme', theme)

    // 2. High Contrast Configuration
    document.documentElement.setAttribute('data-high-contrast', String(data.highContrast))

    // 3. Color Blind Configuration
    document.documentElement.setAttribute('data-color-blind', data.colorBlindMode)

    // 4. Audio Volumes Configuration
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

  // Listen to system prefers-color-scheme changes if themeMode is set to system
  useEffect(() => {
    if (settings.themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applySettings(settings)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [settings])

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
      value={{ settings, isLoading, updateSetting, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
