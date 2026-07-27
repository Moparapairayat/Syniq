import type { ScoreEntry } from '@/models/ScoreEntry'
import { storageService } from '@/services/StorageService'
import type { IRepository } from './IRepository'

/**
 * Repository implementation for managing ScoreEntry storage in IndexedDB.
 */
export class LeaderboardRepository implements IRepository<ScoreEntry, string> {
  readonly #storeName = 'leaderboard'

  public async get(key: string): Promise<ScoreEntry | undefined> {
    return storageService.get<ScoreEntry>(this.#storeName, key)
  }

  public async getAll(): Promise<ReadonlyArray<ScoreEntry>> {
    return storageService.getAll<ScoreEntry>(this.#storeName)
  }

  public async put(item: ScoreEntry): Promise<void> {
    await storageService.put(this.#storeName, item as unknown as Record<string, unknown>)
  }

  public async delete(key: string): Promise<void> {
    await storageService.delete(this.#storeName, key)
  }
}

export const leaderboardRepository = new LeaderboardRepository()
