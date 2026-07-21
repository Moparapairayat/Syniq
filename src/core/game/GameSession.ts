import type { Player } from '@/models/Player'
import { GameStatus } from './GameStatus'
import type { Difficulty } from './Difficulty'
import type { ScoreEntry } from '@/models/ScoreEntry'

export interface GameSessionOptions {
  readonly id: string
  readonly player: Player
  readonly difficulty: Difficulty
  readonly status?: GameStatus
  readonly currentRound?: number
  readonly currentScore?: number
  readonly startTime?: Date
}

/**
 * Represents a specific gameplay session in the domain model.
 */
export class GameSession {
  readonly #id: string
  readonly #player: Player
  readonly #difficulty: Difficulty
  readonly #status: GameStatus
  readonly #currentRound: number
  readonly #currentScore: number
  readonly #startTime: Date

  public constructor(options: GameSessionOptions) {
    this.#id = options.id
    this.#player = options.player
    this.#difficulty = options.difficulty
    this.#status = options.status ?? GameStatus.Idle
    this.#currentRound = options.currentRound ?? 0
    this.#currentScore = options.currentScore ?? 0
    this.#startTime = options.startTime ?? new Date()
  }

  public get id(): string {
    return this.#id
  }

  public get player(): Player {
    return this.#player
  }

  public get difficulty(): Difficulty {
    return this.#difficulty
  }

  public get status(): GameStatus {
    return this.#status
  }

  public get currentRound(): number {
    return this.#currentRound
  }

  public get currentScore(): number {
    return this.#currentScore
  }

  public get startTime(): Date {
    return this.#startTime
  }

  public toScoreEntry(): ScoreEntry {
    return {
      id: this.#id,
      playerId: this.#player.id,
      playerName: this.#player.displayName,
      score: this.#currentScore,
      roundReached: this.#currentRound,
      difficulty: this.#difficulty,
      timestamp: new Date(),
    }
  }
}
