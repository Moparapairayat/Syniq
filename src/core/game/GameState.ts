import type { GameStatus } from './GameStatus'
import type { SimonColor } from './SimonColor'

/**
 * Immutable snapshot of the current state of a Simon game.
 */
export class GameState {
  readonly #status: GameStatus
  readonly #round: number
  readonly #score: number
  readonly #sequence: ReadonlyArray<SimonColor>
  readonly #playerInput: ReadonlyArray<SimonColor>

  public constructor(
    status: GameStatus,
    round: number,
    score: number,
    sequence: ReadonlyArray<SimonColor>,
    playerInput: ReadonlyArray<SimonColor>,
  ) {
    this.#status = status
    this.#round = round
    this.#score = score
    this.#sequence = Object.freeze([...sequence])
    this.#playerInput = Object.freeze([...playerInput])
  }

  public get status(): GameStatus {
    return this.#status
  }

  public get round(): number {
    return this.#round
  }

  public get score(): number {
    return this.#score
  }

  public get sequence(): ReadonlyArray<SimonColor> {
    return this.#sequence
  }

  public get playerInput(): ReadonlyArray<SimonColor> {
    return this.#playerInput
  }
}
