import { describe, test, expect, beforeEach, vi } from 'vitest'
import { settingsService } from '@/services/SettingsService'

import type { AppSettings } from '@/repositories/SettingsRepository'

// Mock SettingsRepository because it depends on IndexedDB transaction
vi.mock('@/repositories/SettingsRepository', () => {
  let mockStore: AppSettings | null = null
  return {
    settingsRepository: {
      get: vi.fn().mockImplementation(async () => mockStore || undefined),
      put: vi.fn().mockImplementation(async (item) => {
        mockStore = item
      }),
      delete: vi.fn().mockImplementation(async () => {
        mockStore = null
      }),
    },
  }
})

describe('SettingsService', () => {
  beforeEach(async () => {
    await settingsService.resetSettings()
  })

  test('should load factory defaults when store is empty', async () => {
    const settings = await settingsService.getSettings()
    expect(settings.themeMode).toBe('dark')
    expect(settings.soundVolume).toBe(0.8)
    expect(settings.musicVolume).toBe(0.5)
    expect(settings.animationSpeed).toBe('normal')
    expect(settings.buttonSymbols).toBe(false)
  })

  test('should update specific settings fields successfully', async () => {
    const updated = await settingsService.updateSettings({
      themeMode: 'light',
      buttonSymbols: true,
      soundVolume: 0.25,
    })

    expect(updated.themeMode).toBe('light')
    expect(updated.buttonSymbols).toBe(true)
    expect(updated.soundVolume).toBe(0.25)
    expect(updated.musicVolume).toBe(0.5) // Unaffected

    const current = await settingsService.getSettings()
    expect(current.themeMode).toBe('light')
  })

  test('should reset all preferences to factory defaults', async () => {
    await settingsService.updateSettings({
      themeMode: 'light',
      animationSpeed: 'fast',
      highContrast: true,
    })

    const reset = await settingsService.resetSettings()
    expect(reset.themeMode).toBe('dark')
    expect(reset.animationSpeed).toBe('normal')
    expect(reset.highContrast).toBe(false)
  })
})
