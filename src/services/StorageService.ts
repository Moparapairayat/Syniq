import { openDB, type IDBPDatabase } from 'idb'

/**
 * Typed schema for the SyniqDB IndexedDB database.
 * Each store key maps to its record value type.
 */
interface SyniqDBSchema {
  player_profiles: { key: string; value: Record<string, unknown> }
  leaderboard: { key: string; value: Record<string, unknown> }
  settings: { key: string; value: Record<string, unknown> }
  achievements: { key: string; value: Record<string, unknown> }
}

export type StoreName = keyof SyniqDBSchema

const DB_NAME = 'SyniqDB'
const DB_VERSION = 3

/**
 * Core storage orchestrator wrapping idb (IndexedDB wrapper) for clean
 * async/await operations without manual Promise plumbing.
 */
export class StorageService {
  #db: IDBPDatabase<SyniqDBSchema> | null = null

  /**
   * Lazily opens and returns the database connection.
   * Runs schema upgrades on first open or version bump.
   */
  public async getDatabase(): Promise<IDBPDatabase<SyniqDBSchema>> {
    if (this.#db) return this.#db

    this.#db = await openDB<SyniqDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('player_profiles')) {
          db.createObjectStore('player_profiles', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('leaderboard')) {
          db.createObjectStore('leaderboard', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }
      },
      blocked() {
        console.warn('SyniqDB: upgrade blocked by an older tab.')
      },
      blocking() {
        console.warn('SyniqDB: this tab is blocking a newer version upgrade.')
      },
    })

    return this.#db
  }

  /**
   * Retrieves a single record by key from the given store.
   */
  public async get<T>(storeName: StoreName, key: string): Promise<T | undefined> {
    const db = await this.getDatabase()
    return db.get(storeName, key) as Promise<T | undefined>
  }

  /**
   * Retrieves all records from the given store.
   */
  public async getAll<T>(storeName: StoreName): Promise<T[]> {
    const db = await this.getDatabase()
    return db.getAll(storeName) as Promise<T[]>
  }

  /**
   * Inserts or updates a record in the given store.
   * Accepts any object — including ones with Date fields.
   */
  public async put<T extends object>(storeName: StoreName, item: T): Promise<void> {
    const db = await this.getDatabase()
    await db.put(storeName, item as Record<string, unknown>)
  }

  /**
   * Deletes a record by key from the given store.
   */
  public async delete(storeName: StoreName, key: string): Promise<void> {
    const db = await this.getDatabase()
    await db.delete(storeName, key)
  }
}

export const storageService = new StorageService()
