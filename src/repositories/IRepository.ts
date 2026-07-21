/**
 * Generic asynchronous repository interface.
 */
export interface IRepository<T, TKey> {
  get(key: TKey): Promise<T | undefined>
  getAll(): Promise<ReadonlyArray<T>>
  put(item: T): Promise<void>
  delete(key: TKey): Promise<void>
}
