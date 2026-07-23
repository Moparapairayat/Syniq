import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  GameEngine,
  SequenceManager,
  InputValidator,
  ScoreCalculator,
  RandomGenerator,
  GameStatus,
  Difficulty,
  GameMode,
} from '@/core'
import type { GameState, SimonColor } from '@/core'
import { Player } from '@/models'
import { audioService, playerService, leaderboardService } from '@/services'
import { useSettings } from './useSettings'

/**
 * Custom hook to interface the core GameEngine logic with React states, lifecycles,
 * IndexedDB storage services, settings, and advanced game mode timer configurations.
 */
export function useGame() {
  const { settings } = useSettings()

  const engine = useMemo(() => {
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
  }, [])

  const [state, setState] = useState<GameState>(() => engine.getState())
  const [activeLitColor, setActiveLitColor] = useState<SimonColor | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const playbackTimersRef = useRef<number[]>([])
  const prevStatusRef = useRef<GameStatus | null>(null)
  const countdownIntervalRef = useRef<number | null>(null)
  const prevInputLengthRef = useRef(0)

  // Subscribe to core engine changes
  useEffect(() => {
    return engine.subscribe((newState) => {
      setState(newState)
    })
  }, [engine])

  const clearTimers = () => {
    playbackTimersRef.current.forEach((t) => window.clearTimeout(t))
    playbackTimersRef.current = []
  }

  const clearCountdown = () => {
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }

  // Speed adjustments depending on settings config and Game Mode selection
  const getPlaybackSpeed = useCallback(() => {
    // 1. Settings Multiplier
    let settingsMultiplier = 1
    if (settings.animationSpeed === 'slow') settingsMultiplier = 1.4
    if (settings.animationSpeed === 'fast') settingsMultiplier = 0.7

    // 2. Mode Multiplier
    let modeMultiplier = 1
    if (engine.mode === GameMode.SpeedRush) {
      // Speed up 8% per round, clamping at max 2.5x speed (0.4x duration)
      modeMultiplier = Math.max(0.4, 1 - (state.round - 1) * 0.08)
    } else if (engine.mode === GameMode.TimeAttack) {
      modeMultiplier = 0.8 // time attack is always faster
    }

    const baseFlash = 450
    const baseGap = 200

    return {
      flashDuration: baseFlash * settingsMultiplier * modeMultiplier,
      gapDuration: baseGap * settingsMultiplier * modeMultiplier,
    }
  }, [settings.animationSpeed, engine.mode, state.round])

  // Handle sequence visualization playback
  useEffect(() => {
    if (state.status === GameStatus.ShowingSequence && state.sequence.length > 0) {
      clearTimers()
      let index = 0
      const { flashDuration, gapDuration } = getPlaybackSpeed()

      const playNext = () => {
        if (index < state.sequence.length) {
          const currentColor = state.sequence[index]

          setActiveLitColor(currentColor)
          audioService.playColor(currentColor)

          const turnOffTimer = window.setTimeout(() => {
            setActiveLitColor(null)
            index++

            const gapTimer = window.setTimeout(playNext, gapDuration)
            playbackTimersRef.current.push(gapTimer)
          }, flashDuration)

          playbackTimersRef.current.push(turnOffTimer)
        } else {
          engine.playSequenceCompleted()
        }
      }

      const initialDelayTimer = window.setTimeout(playNext, 600)
      playbackTimersRef.current.push(initialDelayTimer)

      return () => {
        clearTimers()
        setActiveLitColor(null)
      }
    }
  }, [state.status, state.sequence, engine, getPlaybackSpeed])

  // Play Success chime on round success transition
  useEffect(() => {
    if (prevStatusRef.current !== state.status) {
      if (state.status === GameStatus.RoundCompleted) {
        audioService.playSuccess()
      }
      prevStatusRef.current = state.status
    }
  }, [state.status])

  // Coordinate Time Attack countdown timers
  useEffect(() => {
    const isPlaying =
      state.status === GameStatus.PlayerTurn ||
      state.status === GameStatus.ShowingSequence

    if (engine.mode === GameMode.TimeAttack && isPlaying) {
      clearCountdown()

      countdownIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null) return null
          if (prev <= 1) {
            clearCountdown()
            engine.triggerGameOver()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearCountdown()
    }

    return () => clearCountdown()
  }, [state.status, engine.mode, engine])

  // Reactive time bonus adjustments for Time Attack mode
  useEffect(() => {
    if (engine.mode !== GameMode.TimeAttack || timeLeft === null) {
      prevInputLengthRef.current = state.playerInput.length
      return
    }

    const currentLength = state.playerInput.length
    const prevLength = prevInputLengthRef.current

    if (currentLength > prevLength) {
      if (state.status !== GameStatus.GameOver) {
        const isRoundClear =
          state.status === GameStatus.RoundCompleted ||
          currentLength === state.sequence.length

        if (isRoundClear) {
          // Clearing round adds 5 seconds
          Promise.resolve().then(() => {
            setTimeLeft((prev) => (prev !== null ? Math.min(99, prev + 5) : null))
          })
        } else {
          // Correct step adds 1 second
          Promise.resolve().then(() => {
            setTimeLeft((prev) => (prev !== null ? Math.min(99, prev + 1) : null))
          })
        }
      }
    }

    prevInputLengthRef.current = currentLength
  }, [state.playerInput, state.status, state.sequence.length, engine.mode, timeLeft])

  // Play Game Over sound effect and record persistent scores in IndexedDB
  useEffect(() => {
    if (state.status === GameStatus.GameOver) {
      audioService.playGameOver()
      clearCountdown()

      const saveMetrics = async () => {
        try {
          const profile = await playerService.getOrCreateProfile()

          if (state.score > 0) {
            const recordId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
            await leaderboardService.addScore({
              id: recordId,
              playerId: profile.id,
              playerName: profile.name,
              score: state.score,
              roundReached: state.round,
              difficulty: engine.difficulty,
              timestamp: new Date(),
            })
          }

          // Update career statistics count
          await playerService.updateStats(state.score, state.round)
        } catch (error) {
          console.error('Failed to save score or update profile stats:', error)
        }
      }

      saveMetrics()
    }
  }, [state.status, state.score, state.round, engine])

  const startGame = async (mode: GameMode = GameMode.Classic) => {
    try {
      audioService.playStart()
      clearCountdown()

      if (mode === GameMode.TimeAttack) {
        setTimeLeft(45) // Time Attack starts with a 45 second countdown
      } else {
        setTimeLeft(null)
      }

      const profile = await playerService.getOrCreateProfile()
      const activePlayer = new Player(profile)
      engine.initialize(activePlayer, Difficulty.Easy, mode)
      engine.start()
    } catch (error) {
      console.warn('Failed to load profile. Initializing with default player.', error)
      const fallbackPlayer = new Player({
        id: 'local_user',
        name: 'Player 1',
        createdAt: new Date(),
        gamesPlayed: 0,
        highestScore: 0,
        highestLevel: 0,
      })
      engine.initialize(fallbackPlayer, Difficulty.Easy, mode)
      engine.start()
    }
  }

  const submitInput = (color: SimonColor) => {
    if (state.status !== GameStatus.PlayerTurn) {
      return
    }
    setActiveLitColor(color)
    audioService.playColor(color)
    setTimeout(() => {
      setActiveLitColor(null)
    }, 220)
    engine.submitInput(color)
  }

  const resetGame = () => {
    audioService.playRestart()
    clearTimers()
    clearCountdown()
    setTimeLeft(null)
    setActiveLitColor(null)
    engine.reset()
  }

  const nextRound = () => {
    engine.nextRound()
  }

  return {
    state,
    engine,
    activeLitColor,
    timeLeft,
    startGame,
    submitInput,
    resetGame,
    nextRound,
    isPlaybackActive:
      activeLitColor !== null || state.status === GameStatus.ShowingSequence,
  }
}
