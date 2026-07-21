export interface SequenceManagerOptions<TSequenceItem> {
  readonly initialItems?: readonly TSequenceItem[]
}

/**
 * Manages a dynamic, read-only sequence of items for memory challenge rounds.
 */
export class SequenceManager<TSequenceItem> {
  #items: TSequenceItem[]

  public constructor(options: SequenceManagerOptions<TSequenceItem> = {}) {
    this.#items = options.initialItems ? [...options.initialItems] : []
  }

  public get sequence(): ReadonlyArray<TSequenceItem> {
    return this.#items
  }

  public get length(): number {
    return this.#items.length
  }

  public append(item: TSequenceItem): void {
    this.#items.push(item)
  }

  public get(index: number): TSequenceItem | undefined {
    return this.#items[index]
  }

  public clear(): void {
    this.#items = []
  }
}
