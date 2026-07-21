import type { PlayerProfile } from '@/models/Player'
import { storageService } from '@/services/StorageService'
import type { IRepository } from './IRepository'

/**
 * Repository implementation for managing PlayerProfile storage in IndexedDB.
 */
export class PlayerRepository implements IRepository<PlayerProfile, string> {
  readonly #storeName = 'player_profiles'

  public async get(key: string): Promise<PlayerProfile | undefined> {
    return storageService.executeTransaction<PlayerProfile>(
      this.#storeName,
      'readonly',
      (store) => store.get(key),
    )
  }

  public async getAll(): Promise<ReadonlyArray<PlayerProfile>> {
    return storageService.executeTransaction<PlayerProfile[]>(
      this.#storeName,
      'readonly',
      (store) => store.getAll(),
    )
  }

  public async put(item: PlayerProfile): Promise<void> {
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

export const playerRepository = new PlayerRepository()
