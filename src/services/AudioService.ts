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

export type ChimeType = 'round_clear' | 'level_up' | 'high_score' | 'streak_milestone'

/**
 * Premium Web Audio synthesizer supporting rich Harmonic Overtones, Dual-Tone Polyphonic Chimes,
 * volume multipliers, game event chimes, and tactile haptic vibration feedback.
 */
export class AudioService {
  #audioContext: AudioContext | null = null
  #currentTheme: SoundTheme = DEFAULT_SOUND_THEME
  #volume = 0.8
  #hapticsEnabled = true

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
    if (this.#hapticsEnabled && typeof window !== 'undefined' && 'vibrate' in window.navigator) {
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

  public setHapticsEnabled(enabled: boolean): void {
    this.#hapticsEnabled = enabled
  }

  /**
   * Plays a rich tone with 2nd & 3rd harmonic overtones for a specific Simon Color.
   */
  public playColor(color: SimonColor): void {
    try {
      this.#vibrate(18) // Crisp tactile tap

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const f0 = this.#currentTheme.getFrequency(color)
      const duration = this.#currentTheme.duration
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.1 * this.#volume, ctx.currentTime)
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      masterGain.connect(ctx.destination)

      // Fundamental oscillator
      const osc1 = ctx.createOscillator()
      osc1.type = this.#currentTheme.type
      osc1.frequency.setValueAtTime(f0, ctx.currentTime)
      osc1.connect(masterGain)
      osc1.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + duration)

      // 2nd Harmonic Overtone (Octave, f0 * 2) for warm resonance
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(f0 * 2, ctx.currentTime)
      gain2.gain.setValueAtTime(0.25, ctx.currentTime)
      osc2.connect(gain2)
      gain2.connect(masterGain)
      osc2.start(ctx.currentTime)
      osc2.stop(ctx.currentTime + duration)

      // 3rd Harmonic Overtone (Perfect 5th, f0 * 3) for crisp arcade shine
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.type = 'triangle'
      osc3.frequency.setValueAtTime(f0 * 3, ctx.currentTime)
      gain3.gain.setValueAtTime(0.12, ctx.currentTime)
      osc3.connect(gain3)
      gain3.connect(masterGain)
      osc3.start(ctx.currentTime)
      osc3.stop(ctx.currentTime + duration)
    } catch (error) {
      console.warn('Audio playColor failed:', error)
    }
  }

  /**
   * Plays polyphonic dual-tone harmonic chimes with tactile vibration pulses for key milestones.
   */
  public playHarmonicChime(type: ChimeType): void {
    try {
      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      if (type === 'round_clear') {
        this.#vibrate([25, 35, 45])
        // Polyphonic dual-tone C5-E5 chord followed by G5-C6
        const chords = [
          { f1: 523.25, f2: 659.25, duration: 0.12 }, // C5 + E5
          { f1: 783.99, f2: 1046.5, duration: 0.22 }, // G5 + C6
        ]

        chords.forEach((chord, i) => {
          const startTime = ctx.currentTime + i * 0.1
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.08 * this.#volume, startTime)
          g.gain.exponentialRampToValueAtTime(0.0001, startTime + chord.duration)
          g.connect(ctx.destination)

          const o1 = ctx.createOscillator()
          const o2 = ctx.createOscillator()
          o1.type = 'sine'
          o2.type = 'triangle'
          o1.frequency.setValueAtTime(chord.f1, startTime)
          o2.frequency.setValueAtTime(chord.f2, startTime)

          o1.connect(g)
          o2.connect(g)
          o1.start(startTime)
          o2.start(startTime)
          o1.stop(startTime + chord.duration)
          o2.stop(startTime + chord.duration)
        })
      } else if (type === 'level_up' || type === 'high_score' || type === 'streak_milestone') {
        this.#vibrate([40, 50, 90])
        // Triad fanfare chime: C4/G4 -> E4/B4 -> G4/D5 -> C5/E5/G5
        const notes = [
          { f1: 261.63, f2: 392.0 },  // C4 + G4
          { f1: 329.63, f2: 493.88 }, // E4 + B4
          { f1: 392.0, f2: 587.33 }, // G4 + D5
          { f1: 523.25, f2: 659.25 }, // C5 + E5
        ]

        notes.forEach((n, idx) => {
          const startTime = ctx.currentTime + idx * 0.08
          const duration = 0.2
          const g = ctx.createGain()
          g.gain.setValueAtTime(0.09 * this.#volume, startTime)
          g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
          g.connect(ctx.destination)

          const o1 = ctx.createOscillator()
          const o2 = ctx.createOscillator()
          o1.type = 'triangle'
          o2.type = 'sine'
          o1.frequency.setValueAtTime(n.f1, startTime)
          o2.frequency.setValueAtTime(n.f2, startTime)

          o1.connect(g)
          o2.connect(g)
          o1.start(startTime)
          o2.start(startTime)
          o1.stop(startTime + duration)
          o2.stop(startTime + duration)
        })
      }
    } catch (error) {
      console.warn('Audio playHarmonicChime failed:', error)
    }
  }

  /**
   * Plays a rewarding ascending arpeggio for matching a sequence.
   */
  public playSuccess(): void {
    this.playHarmonicChime('round_clear')
  }

  /**
   * Plays a clean ascending chime for starting a game.
   */
  public playStart(): void {
    try {
      this.#vibrate([20, 30, 20])

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
      this.#vibrate([15, 35, 15])

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
   * Plays a dual-sawtooth beating buzz on game over.
   */
  public playGameOver(): void {
    try {
      this.#vibrate([120, 60, 180]) // Heavy fail buzz vibration

      const ctx = this.#getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc1.type = 'sawtooth'
      osc2.type = 'sawtooth'
      osc1.frequency.setValueAtTime(130, ctx.currentTime)
      osc2.frequency.setValueAtTime(133, ctx.currentTime) // Beating overtone
      osc1.frequency.setTargetAtTime(65, ctx.currentTime, 0.25)
      osc2.frequency.setTargetAtTime(67, ctx.currentTime, 0.25)

      gainNode.gain.setValueAtTime(0.12 * this.#volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc1.start(ctx.currentTime)
      osc2.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + 0.55)
      osc2.stop(ctx.currentTime + 0.55)
    } catch (error) {
      console.warn('Audio playGameOver failed:', error)
    }
  }
}

export const audioService = new AudioService()
