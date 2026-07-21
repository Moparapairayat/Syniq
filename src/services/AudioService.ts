import { SimonColor } from '@/core/game/SimonColor'

export interface SoundTheme {
  readonly name: string
  readonly getFrequency: (color: SimonColor) => number
  readonly duration: number
  readonly type: OscillatorType
}

const DEFAULT_SOUND_THEME: SoundTheme = {
  name: 'default',
  getFrequency: (color: SimonColor) => {
    switch (color) {
      case SimonColor.Red:
        return 329.63 // E4
      case SimonColor.Green:
        return 261.63 // C4
      case SimonColor.Blue:
        return 392.0 // G4
      case SimonColor.Yellow:
        return 440.0 // A4
      default:
        return 220.0
    }
  },
  duration: 0.28,
  type: 'sine',
}

/**
 * Premium Web Audio synthesizer supporting custom SoundThemes, volume multipliers,
 * arpeggios, game event chimes, and tactile haptic vibration feedback.
 */
export class AudioService {
  #audioContext: AudioContext | null = null
  #currentTheme: SoundTheme = DEFAULT_SOUND_THEME
  #volume = 0.8

  #getAudioContext(): AudioContext {
    if (!this.#audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      this.#audioContext = new AudioCtx()
    }
    return this.#audioContext
  }

  #vibrate(pattern: number | number[]): void {
    if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
      try {
        window.navigator.vibrate(pattern)
      } catch {
        // Silently bypass if unsupported
      }
    }
  }

  public setSoundTheme(theme: SoundTheme): void {
    this.#currentTheme = theme
  }

  public setVolume(volume: number): void {
    this.#volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Plays a clean frequency note for a specific Simon Color.
   */
  public playColor(color: SimonColor): void {
    try {
      this.#vibrate(15) // Light tap tactile haptic

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = this.#currentTheme.type
      osc.frequency.setValueAtTime(
        this.#currentTheme.getFrequency(color),
        ctx.currentTime,
      )

      gainNode.gain.setValueAtTime(0.08 * this.#volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + this.#currentTheme.duration,
      )

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + this.#currentTheme.duration)
    } catch (error) {
      console.warn('Audio playColor failed:', error)
    }
  }

  /**
   * Plays a rewarding ascending arpeggio for matching a sequence.
   */
  public playSuccess(): void {
    try {
      this.#vibrate([30, 45, 30]) // Success double tick haptic

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const notes = [261.63, 329.63, 392.0, 523.25] // C4 -> E4 -> G4 -> C5
      const noteDuration = 0.08
      const gap = 0.06

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const startTime = ctx.currentTime + index * gap

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gainNode.gain.setValueAtTime(0.06 * this.#volume, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration)

        osc.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + noteDuration)
      })
    } catch (error) {
      console.warn('Audio playSuccess failed:', error)
    }
  }

  /**
   * Plays a clean ascending chime for starting a game.
   */
  public playStart(): void {
    try {
      this.#vibrate([20, 30, 20]) // Start chime double tap haptic

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const notes = [392.0, 523.25, 659.25] // G4 -> C5 -> E5
      const noteDuration = 0.15
      const gap = 0.1

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const startTime = ctx.currentTime + index * gap

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gainNode.gain.setValueAtTime(0.08 * this.#volume, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration)

        osc.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + noteDuration)
      })
    } catch (error) {
      console.warn('Audio playStart failed:', error)
    }
  }

  /**
   * Plays a simple double chime signaling restart/reset.
   */
  public playRestart(): void {
    try {
      this.#vibrate([15, 35, 15]) // Reset chime haptic

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const notes = [523.25, 392.0] // C5 -> G4
      const noteDuration = 0.12
      const gap = 0.08

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const startTime = ctx.currentTime + index * gap

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gainNode.gain.setValueAtTime(0.06 * this.#volume, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration)

        osc.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + noteDuration)
      })
    } catch (error) {
      console.warn('Audio playRestart failed:', error)
    }
  }

  /**
   * Plays a descending flat tone on game over.
   */
  public playGameOver(): void {
    try {
      this.#vibrate(150) // Long drop fail haptic vibration

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(130, ctx.currentTime)
      osc.frequency.setTargetAtTime(70, ctx.currentTime, 0.25)

      gainNode.gain.setValueAtTime(0.12 * this.#volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch (error) {
      console.warn('Audio playGameOver failed:', error)
    }
  }
}

export const audioService = new AudioService()
