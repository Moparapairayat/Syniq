import type { PlayerProfile } from '@/models/Player'
import { storageService } from '@/services/StorageService'
import type { IRepository } from './IRepository'

/**
 * Repository implementation for managing PlayerProfile storage in IndexedDB.
 */
export class PlayerRepository implements IRepository<PlayerProfile, string> {
  readonly #storeName = 'player_profiles'

  public async get(key: string): Promise<PlayerProfile | undefined> {
    return storageService.get<PlayerProfile>(this.#storeName, key)
  }

  public async getAll(): Promise<ReadonlyArray<PlayerProfile>> {
    return storageService.getAll<PlayerProfile>(this.#storeName)
  }

  public async put(item: PlayerProfile): Promise<void> {
    await storageService.put(this.#storeName, item)
  }

  public async delete(key: string): Promise<void> {
    await storageService.delete(this.#storeName, key)
  }
}

export const playerRepository = new PlayerRepository()
