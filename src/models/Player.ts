export interface PlayerProfile {
  readonly id: string
  readonly name: string
  readonly createdAt: Date
  readonly gamesPlayed: number
  readonly highestScore: number
  readonly highestLevel: number
}

/**
 * Represents a player in the Simon Nexus domain, tracking historical progress.
 */
export class Player {
  readonly #profile: Readonly<PlayerProfile>

  public constructor(profile: PlayerProfile) {
    this.#profile = Object.freeze({ ...profile })
  }

  public get id(): string {
    return this.#profile.id
  }

  public get name(): string {
    return this.#profile.name
  }

  /**
   * Getter for backwards compatibility with Phase 3 code.
   */
  public get displayName(): string {
    return this.#profile.name
  }

  public get createdAt(): Date {
    return this.#profile.createdAt
  }

  public get gamesPlayed(): number {
    return this.#profile.gamesPlayed
  }

  public get highestScore(): number {
    return this.#profile.highestScore
  }

  public get highestLevel(): number {
    return this.#profile.highestLevel
  }
}
