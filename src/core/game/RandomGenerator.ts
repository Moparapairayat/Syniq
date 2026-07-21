/**
 * A stateless utility for generating random elements from options.
 */
export class RandomGenerator {
  /**
   * Selects a random element from a read-only array of choices.
   */
  public getRandomElement<T>(options: ReadonlyArray<T>): T {
    if (options.length === 0) {
      throw new Error('Options array cannot be empty.')
    }
    const index = Math.floor(Math.random() * options.length)
    return options[index]
  }

  /**
   * Generates a random integer within a range (inclusive).
   */
  public getRandomInt(min: number, max: number): number {
    const minCeil = Math.ceil(min)
    const maxFloor = Math.floor(max)
    return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil
  }
}
