import { motion } from 'framer-motion'
import { GameStatus } from '@/core/game/GameStatus'

export interface ControlPanelProps {
  readonly status: GameStatus
  readonly onStart: () => void
  readonly onNextRound: () => void
  readonly onReset: () => void
}

export function ControlPanel({ status, onStart, onNextRound, onReset }: ControlPanelProps) {
  const isIdle        = status === GameStatus.Idle
  const isGameOver    = status === GameStatus.GameOver
  const isRoundDone   = status === GameStatus.RoundCompleted
  const isInProgress  = !isIdle && !isGameOver && !isRoundDone

  const primaryAction = isRoundDone ? onNextRound : onStart
  const primaryLabel  = isIdle ? 'Begin' : isGameOver ? 'Begin Again' : 'Next Step'
  const primaryIcon   = isIdle ? '🍃' : isGameOver ? '🍂' : '🌿'

  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* Primary zen button */}
      {(isIdle || isGameOver || isRoundDone) && (
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98, y: 2 }}
          onClick={primaryAction}
          type="button"
          className={isGameOver ? 'zen-primary zen-primary-danger' : 'zen-primary'}
        >
          <span className="text-sm">{primaryIcon}</span>
          {primaryLabel}
        </motion.button>
      )}

      {/* Quit — shown while playing */}
      {isInProgress && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          type="button"
          className="zen-secondary"
        >
          ✕ Pause
        </motion.button>
      )}

      {/* Back to menu — after game over or round done */}
      {(isGameOver || isRoundDone) && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          type="button"
          className="zen-secondary"
        >
          🏠 Return
        </motion.button>
      )}
    </div>
  )
}
