import type { ScoreEntry } from '@/models/ScoreEntry'
import { storageService } from '@/services/StorageService'
import type { IRepository } from './IRepository'

/**
 * Repository implementation for managing ScoreEntry storage in IndexedDB.
 */
export class LeaderboardRepository implements IRepository<ScoreEntry, string> {
  readonly #storeName = 'leaderboard'

  public async get(key: string): Promise<ScoreEntry | undefined> {
    return storageService.executeTransaction<ScoreEntry>(
      this.#storeName,
      'readonly',
      (store) => store.get(key),
    )
  }

  public async getAll(): Promise<ReadonlyArray<ScoreEntry>> {
    return storageService.executeTransaction<ScoreEntry[]>(
      this.#storeName,
      'readonly',
      (store) => store.getAll(),
    )
  }

  public async put(item: ScoreEntry): Promise<void> {
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

export const leaderboardRepository = new LeaderboardRepository()
