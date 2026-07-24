/**
 * Core storage orchestrator wrapping native browser IndexedDB in Promises.
 * Provides isolated transaction operations for clean database repository handlers.
 */
export class StorageService {
  readonly #dbName = 'SyniqDB'
  readonly #dbVersion = 3
  #db: IDBDatabase | null = null

  /**
   * Lazily opens and establishes the connection to the IndexedDB database.
   */
  public async getDatabase(): Promise<IDBDatabase> {
    if (this.#db) return this.#db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.#dbName, this.#dbVersion)

      request.onerror = () => {
        reject(new Error('IndexedDB initialization failed.'))
      }

      request.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        db.onclose = () => {
          this.#db = null
        }
        db.onerror = () => {
          this.#db = null
        }
        this.#db = db
        resolve(this.#db)
      }

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result

        // Setup store for player configuration profile
        if (!db.objectStoreNames.contains('player_profiles')) {
          db.createObjectStore('player_profiles', { keyPath: 'id' })
        }

        // Setup store for scoring entries
        if (!db.objectStoreNames.contains('leaderboard')) {
          db.createObjectStore('leaderboard', { keyPath: 'id' })
        }

        // Setup store for settings entries
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' })
        }

        // Setup store for achievement entries
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }
      }
    })
  }

  /**
   * Helper utility wrapping transactional calls.
   */
  public async executeTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    callback: (store: IDBObjectStore) => IDBRequest<any> | void,
  ): Promise<T> {
    const db = await this.getDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode)
      const store = transaction.objectStore(storeName)

      const request = callback(store)

      transaction.onerror = () => {
        reject(transaction.error || new Error('IndexedDB transaction failed.'))
      }

      transaction.oncomplete = () => {
        if (request) {
          resolve(request.result as T)
        } else {
          resolve(undefined as T)
        }
      }
    })
  }
}

export const storageService = new StorageService()
