import { GameStatus } from './GameStatus'
import { SimonColor } from './SimonColor'
import { GameMode } from './GameMode'
import type { SequenceManager } from './SequenceManager'
import type { InputValidator } from './InputValidator'
import type { ScoreCalculator } from './ScoreCalculator'
import type { RandomGenerator } from './RandomGenerator'
import { GameState } from './GameState'
import { Difficulty } from './Difficulty'
import type { Player } from '@/models/Player'

export interface GameEngineDependencies {
  readonly sequenceManager: SequenceManager<SimonColor>
  readonly inputValidator: InputValidator
  readonly scoreCalculator: ScoreCalculator
  readonly randomGenerator: RandomGenerator
}

export type GameStateChangeListener = (state: GameState) => void

/**
 * The core game orchestrator that runs Simon game state logic independently of UI.
 */
export class GameEngine {
  readonly #sequenceManager: SequenceManager<SimonColor>
  readonly #inputValidator: InputValidator
  readonly #scoreCalculator: ScoreCalculator
  readonly #randomGenerator: RandomGenerator

  #player: Player | null = null
  #difficulty: Difficulty = Difficulty.Easy
  #mode: GameMode = GameMode.Classic
  #status: GameStatus = GameStatus.Idle
  #round: number = 0
  #score: number = 0
  #playerInput: SimonColor[] = []
  readonly #listeners: Set<GameStateChangeListener> = new Set()

  public constructor(dependencies: GameEngineDependencies) {
    this.#sequenceManager = dependencies.sequenceManager
    this.#inputValidator = dependencies.inputValidator
    this.#scoreCalculator = dependencies.scoreCalculator
    this.#randomGenerator = dependencies.randomGenerator
  }

  public subscribe(listener: GameStateChangeListener): () => void {
    this.#listeners.add(listener)
    // Emit initial state immediately on subscription
    listener(this.getState())
    return () => {
      this.#listeners.delete(listener)
    }
  }

  #emitChange(): void {
    const state = this.getState()
    for (const listener of this.#listeners) {
      listener(state)
    }
  }

  public getState(): GameState {
    return new GameState(
      this.#status,
      this.#round,
      this.#score,
      this.#sequenceManager.sequence,
      this.#playerInput,
    )
  }

  public get player(): Player | null {
    return this.#player
  }

  public get difficulty(): Difficulty {
    return this.#difficulty
  }

  public get mode(): GameMode {
    return this.#mode
  }

  /**
   * Initializes or resets the engine with a player, difficulty choice, and game mode.
   */
  public initialize(
    player: Player,
    difficulty: Difficulty = Difficulty.Easy,
    mode: GameMode = GameMode.Classic,
  ): void {
    this.#player = player
    this.#difficulty = difficulty
    this.#mode = mode
    this.#status = GameStatus.Idle
    this.#round = 0
    this.#score = 0
    this.#sequenceManager.clear()
    this.#playerInput = []
    this.#emitChange()
  }

  /**
   * Starts a new game session.
   */
  public start(): void {
    if (!this.#player) {
      throw new Error('GameEngine must be initialized with a player before starting.')
    }
    this.#status = GameStatus.ShowingSequence
    this.#round = 1
    this.#score = 0
    this.#sequenceManager.clear()
    this.#playerInput = []

    this.#generateNextSequenceItem()
    this.#emitChange()
  }

  /**
   * Transitions the game from showing the sequence to accepting player input.
   */
  public playSequenceCompleted(): void {
    if (this.#status !== GameStatus.ShowingSequence) {
      return
    }
    this.#status = GameStatus.PlayerTurn
    this.#playerInput = []
    this.#emitChange()
  }

  /**
   * Submits a color choice from the player during their turn.
   */
  public submitInput(color: SimonColor): void {
    if (this.#status !== GameStatus.PlayerTurn) {
      return
    }

    this.#playerInput.push(color)
    const currentIndex = this.#playerInput.length - 1
    const targetSequence = this.#sequenceManager.sequence

    // Reverse validation check
    const validationIndex =
      this.#mode === GameMode.Reverse
        ? targetSequence.length - 1 - currentIndex
        : currentIndex

    const isStepValid = this.#inputValidator.validateStep(
      color,
      targetSequence,
      validationIndex,
    )

    if (!isStepValid) {
      this.#status = GameStatus.GameOver
      this.#emitChange()
      return
    }

    // Check if player has input all sequence items successfully
    if (this.#playerInput.length === targetSequence.length) {
      this.#status = GameStatus.RoundCompleted

      const roundScore = this.#scoreCalculator.calculateScore({
        round: this.#round,
        difficulty: this.#difficulty,
      })
      this.#score += roundScore

      this.#emitChange()
    } else {
      this.#emitChange()
    }
  }

  /**
   * Transitions the game to the next round, adding another element to the sequence.
   */
  public nextRound(): void {
    if (this.#status !== GameStatus.RoundCompleted) {
      return
    }

    this.#round += 1
    this.#status = GameStatus.ShowingSequence
    this.#playerInput = []
    this.#generateNextSequenceItem()
    this.#emitChange()
  }

  /**
   * Resets the game session entirely.
   */
  public reset(): void {
    this.#status = GameStatus.Idle
    this.#round = 0
    this.#score = 0
    this.#sequenceManager.clear()
    this.#playerInput = []
    this.#emitChange()
  }

  /**
   * Triggers a game over state externally (e.g. on countdown timers).
   */
  public triggerGameOver(): void {
    if (this.#status === GameStatus.Idle || this.#status === GameStatus.GameOver) {
      return
    }
    this.#status = GameStatus.GameOver
    this.#emitChange()
  }

  #generateNextSequenceItem(): void {
    const colors = [SimonColor.Red, SimonColor.Green, SimonColor.Blue, SimonColor.Yellow]
    const nextColor = this.#randomGenerator.getRandomElement(colors)
    this.#sequenceManager.append(nextColor)
  }
}
