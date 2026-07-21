import { Difficulty } from './Difficulty'

export interface ScoreCalculationOptions {
  readonly round: number
  readonly difficulty: Difficulty
  readonly basePoints?: number
  readonly speedBonus?: number
}

/**
 * Calculates score entries based on round stats and difficulties.
 */
export class ScoreCalculator {
  /**
   * Computes the score for completing a specific round.
   */
  public calculateScore(options: ScoreCalculationOptions): number {
    const { round, difficulty, basePoints = 10, speedBonus = 0 } = options
    if (round <= 0) return 0

    let difficultyMultiplier = 1
    switch (difficulty) {
      case Difficulty.Medium:
        difficultyMultiplier = 1.5
        break
      case Difficulty.Hard:
        difficultyMultiplier = 2
        break
      case Difficulty.Easy:
      default:
        difficultyMultiplier = 1
        break
    }

    const calculatedPoints = Math.round(round * basePoints * difficultyMultiplier)
    return calculatedPoints + speedBonus
  }
}
