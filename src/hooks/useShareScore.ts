import { useCallback, useState } from 'react'
import { GameMode } from '@/core/game/GameMode'
import { Difficulty } from '@/core/game/Difficulty'

const APP_URL = 'https://syniq.vercel.app'

const MODE_LABELS: Record<GameMode, string> = {
  [GameMode.Classic]: 'Classic',
  [GameMode.SpeedRush]: 'Speed Rush',
  [GameMode.Reverse]: 'Reverse',
  [GameMode.TimeAttack]: 'Time Attack',
  [GameMode.DailyChallenge]: 'Daily Challenge',
}

const DIFF_LABELS: Record<Difficulty, string> = {
  [Difficulty.Easy]: 'Easy',
  [Difficulty.Medium]: 'Medium',
  [Difficulty.Hard]: 'Hard',
}

function buildShareText(score: number, round: number, mode: GameMode, difficulty: Difficulty): string {
  const modeLabel = MODE_LABELS[mode] ?? 'Classic'
  const diffLabel = DIFF_LABELS[difficulty] ?? 'Easy'
  return [
    `🎮 Syniq Memory Challenge`,
    `🏆 I scored ${score} pts on Round ${round} (${modeLabel} · ${diffLabel})!`,
    `🧠 Can you beat me? Try Syniq free:`,
    `👉 ${APP_URL}`,
    `#Syniq #MemoryGame #BrainTraining`,
  ].join('\n')
}

export type ShareResult = 'shared' | 'twitter' | 'copied' | 'failed'

export function useShareScore() {
  const [shareResult, setShareResult] = useState<ShareResult | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  const shareScore = useCallback(
    async (score: number, round: number, mode: GameMode, difficulty: Difficulty): Promise<ShareResult> => {
      setIsSharing(true)
      const text = buildShareText(score, round, mode, difficulty)
      let result: ShareResult = 'failed'

      try {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({
            title: 'Syniq Memory Challenge',
            text,
            url: APP_URL,
          })
          result = 'shared'
        } else {
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
          window.open(twitterUrl, '_blank', 'noopener,noreferrer')
          result = 'twitter'
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          result = 'failed'
        } else {
          try {
            await navigator.clipboard.writeText(text)
            result = 'copied'
          } catch {
            result = 'failed'
          }
        }
      } finally {
        setIsSharing(false)
        setShareResult(result)
        setTimeout(() => setShareResult(null), 3000)
      }

      return result
    },
    [],
  )

  return { shareScore, shareResult, isSharing }
}
