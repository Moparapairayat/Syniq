import { storageService } from '@/services/StorageService'
import type { IRepository } from './IRepository'

export interface AppSettings {
  readonly id: string // e.g. 'current_settings'
  readonly themeMode: 'dark' | 'light' | 'system'
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
    return storageService.executeTransaction<AppSettings>(
      this.#storeName,
      'readonly',
      (store) => store.get(key),
    )
  }

  public async getAll(): Promise<ReadonlyArray<AppSettings>> {
    return storageService.executeTransaction<AppSettings[]>(
      this.#storeName,
      'readonly',
      (store) => store.getAll(),
    )
  }

  public async put(item: AppSettings): Promise<void> {
    await storageService.executeTransaction<void>(
      this.#storeName,
      'readwrite',
      (store) => {
        store.put(item)
      },
    )
  }

  public async delete(key: string): Promise<void> {
    await storageService.executeTransaction<void>(
      this.#storeName,
      'readwrite',
      (store) => {
        store.delete(key)
      },
    )
  }
}

export const settingsRepository = new SettingsRepository()
