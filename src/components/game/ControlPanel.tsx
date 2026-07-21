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
  const primaryLabel  = isIdle ? 'START GAME' : isGameOver ? 'PLAY AGAIN' : 'NEXT ROUND →'
  const primaryIcon   = isIdle ? '🎮' : isGameOver ? '🔄' : '🚀'

  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* Primary 3D Cyber Action Button */}
      {(isIdle || isGameOver || isRoundDone) && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.96, y: 3 }}
          onClick={primaryAction}
          type="button"
          className="btn-cyber-primary"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-base">{primaryIcon}</span>
            <span>{primaryLabel}</span>
          </div>
        </motion.button>
      )}

      {/* Pause/Quit while playing */}
      {isInProgress && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          type="button"
          className="btn-cyber-secondary"
        >
          ✕ PAUSE MATCH
        </motion.button>
      )}

      {/* Return to menu */}
      {(isGameOver || isRoundDone) && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          type="button"
          className="btn-cyber-secondary"
        >
          🏠 RETURN TO DASHBOARD
        </motion.button>
      )}
    </div>
  )
}
