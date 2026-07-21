import { settingsRepository } from '@/repositories/SettingsRepository'
import type { AppSettings } from '@/repositories/SettingsRepository'

/**
 * Handles coordination of application preferences (theme, volume, motion, symbols).
 */
export class SettingsService {
  readonly #defaultId = 'current_settings'

  public readonly defaultSettings: AppSettings = {
    id: this.#defaultId,
    themeMode: 'dark',
    soundVolume: 0.8,
    musicVolume: 0.5,
    animationSpeed: 'normal',
    reduceMotion: false,
    highContrast: false,
    colorBlindMode: 'none',
    buttonSymbols: false,
  }

  /**
   * Retrieves user preferences, fallback to default configurations if missing.
   */
  public async getSettings(): Promise<AppSettings> {
    try {
      const settings = await settingsRepository.get(this.#defaultId)
      return settings || this.defaultSettings
    } catch {
      return this.defaultSettings
    }
  }

  /**
   * Overwrites current configurations in IndexedDB.
   */
  public async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings()
    const updated = { ...current, ...updates }
    await settingsRepository.put(updated)
    return updated
  }

  /**
   * Reverts all configurations to factory defaults.
   */
  public async resetSettings(): Promise<AppSettings> {
    await settingsRepository.put(this.defaultSettings)
    return this.defaultSettings
  }
}

export const settingsService = new SettingsService()
