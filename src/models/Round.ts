import type { SimonColor } from '@/core/game/SimonColor'

export interface Round {
  readonly roundNumber: number
  readonly sequence: ReadonlyArray<SimonColor>
  readonly playerInput: ReadonlyArray<SimonColor>
  readonly success: boolean
  readonly durationMs: number
}
