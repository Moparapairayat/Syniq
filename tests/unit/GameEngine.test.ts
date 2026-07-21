import { describe, test, expect } from 'vitest'
import {
  GameEngine,
  SequenceManager,
  InputValidator,
  ScoreCalculator,
  RandomGenerator,
  GameStatus,
  Difficulty,
  GameMode,
  SimonColor,
} from '@/core'
import { Player } from '@/models'

const createEngine = () => {
  const sequenceManager = new SequenceManager<SimonColor>()
  const inputValidator = new InputValidator()
  const scoreCalculator = new ScoreCalculator()
  const randomGenerator = new RandomGenerator()
  return new GameEngine({
    sequenceManager,
    inputValidator,
    scoreCalculator,
    randomGenerator,
  })
}

const mockPlayer = new Player({
  id: 'test_id',
  name: 'Test Player',
  createdAt: new Date(),
  gamesPlayed: 0,
  highestScore: 0,
  highestLevel: 0,
})

describe('GameEngine', () => {
  test('should initialize with default states', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Classic)

    const state = engine.getState()
    expect(state.status).toBe(GameStatus.Idle)
    expect(state.round).toBe(0)
    expect(state.score).toBe(0)
    expect(state.sequence).toEqual([])
    expect(state.playerInput).toEqual([])
    expect(engine.mode).toBe(GameMode.Classic)
    expect(engine.difficulty).toBe(Difficulty.Easy)
    expect(engine.player?.name).toBe('Test Player')
  })

  test('should start a session and generate the initial color sequence', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Classic)
    engine.start()

    const state = engine.getState()
    expect(state.status).toBe(GameStatus.ShowingSequence)
    expect(state.round).toBe(1)
    expect(state.score).toBe(0)
    expect(state.sequence.length).toBe(1)
    expect(state.playerInput).toEqual([])
  })

  test('should play sequence completed and accept player input', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Classic)
    engine.start()
    engine.playSequenceCompleted()

    const state = engine.getState()
    expect(state.status).toBe(GameStatus.PlayerTurn)
  })

  test('should validate input correctly in Classic Mode', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Classic)
    engine.start()

    const targetColor = engine.getState().sequence[0]
    engine.playSequenceCompleted()

    // Submit correct color
    engine.submitInput(targetColor)
    let state = engine.getState()
    expect(state.status).toBe(GameStatus.RoundCompleted)
    expect(state.score).toBeGreaterThan(0) // Earned round score

    // Try next round
    engine.nextRound()
    state = engine.getState()
    expect(state.status).toBe(GameStatus.ShowingSequence)
    expect(state.round).toBe(2)
    expect(state.sequence.length).toBe(2)
  })

  test('should trigger game over on invalid input step', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Classic)
    engine.start()

    const targetColor = engine.getState().sequence[0]
    const wrongColor = targetColor === SimonColor.Red ? SimonColor.Blue : SimonColor.Red

    engine.playSequenceCompleted()
    engine.submitInput(wrongColor)

    const state = engine.getState()
    expect(state.status).toBe(GameStatus.GameOver)
  })

  test('should validate input correctly in Reverse Mode', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Reverse)
    engine.start()

    // Simulate multi-round sequence
    // Round 1
    let targetColors = engine.getState().sequence
    engine.playSequenceCompleted()
    engine.submitInput(targetColors[0]) // single element reverse is identical
    expect(engine.getState().status).toBe(GameStatus.RoundCompleted)

    // Round 2
    engine.nextRound()
    targetColors = engine.getState().sequence
    expect(targetColors.length).toBe(2)

    engine.playSequenceCompleted()
    // For round 2, target is: [A, B].
    // Player must input in reverse order: [B, A]
    engine.submitInput(targetColors[1]) // B (index 1)
    expect(engine.getState().status).toBe(GameStatus.PlayerTurn) // still matches

    engine.submitInput(targetColors[0]) // A (index 0)
    expect(engine.getState().status).toBe(GameStatus.RoundCompleted)
  })

  test('should trigger external game over', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.TimeAttack)
    engine.start()

    engine.triggerGameOver()
    expect(engine.getState().status).toBe(GameStatus.GameOver)
  })

  test('should reset session details', () => {
    const engine = createEngine()
    engine.initialize(mockPlayer, Difficulty.Easy, GameMode.Classic)
    engine.start()
    engine.reset()

    const state = engine.getState()
    expect(state.status).toBe(GameStatus.Idle)
    expect(state.round).toBe(0)
    expect(state.score).toBe(0)
    expect(state.sequence).toEqual([])
  })
})
