import { storageService } from '@/services/StorageService'
import type { IRepository } from './IRepository'

export interface AppSettings {
  readonly id: string // e.g. 'current_settings'
  readonly soundVolume: number
  readonly musicVolume: number
  readonly animationSpeed: 'slow' | 'normal' | 'fast'
  readonly reduceMotion: boolean
  readonly highContrast: boolean
  readonly colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
}

/**
 * Repository interface for managing AppSettings in IndexedDB.
 */
export class SettingsRepository implements IRepository<AppSettings, string> {
  readonly #storeName = 'settings'

  public async get(key: string): Promise<AppSettings | undefined> {
    return storageService.get<AppSettings>(this.#storeName, key)
  }

  public async getAll(): Promise<ReadonlyArray<AppSettings>> {
    return storageService.getAll<AppSettings>(this.#storeName)
  }

  public async put(item: AppSettings): Promise<void> {
    await storageService.put(this.#storeName, item)
  }

  public async delete(key: string): Promise<void> {
    await storageService.delete(this.#storeName, key)
  }
}

export const settingsRepository = new SettingsRepository()
