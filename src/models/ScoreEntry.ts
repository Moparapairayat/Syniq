import type { Difficulty } from '@/core/game/Difficulty'

export interface ScoreEntry {
  readonly id: string
  readonly playerId: string
  readonly playerName: string
  readonly score: number
  readonly roundReached: number
  readonly difficulty: Difficulty
  readonly timestamp: Date
}
