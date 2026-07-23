import { motion } from 'framer-motion'
import { GameStatus } from '@/core/game/GameStatus'

export interface ControlPanelProps {
  readonly status: GameStatus
  readonly onNextRound: () => void
  readonly onQuitRequest: () => void
  readonly onReturnToDashboard: () => void
}

export function ControlPanel({ status, onNextRound, onQuitRequest, onReturnToDashboard }: ControlPanelProps) {
  const isGameOver    = status === GameStatus.GameOver
  const isRoundDone   = status === GameStatus.RoundCompleted
  const isInProgress  = !isGameOver && !isRoundDone && status !== GameStatus.Idle

  const primaryAction = onNextRound
  const primaryLabel  = 'NEXT ROUND'

  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* One clear continuation action appears only when needed. */}
      {isRoundDone && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.96, y: 3 }}
          onClick={primaryAction}
          type="button"
          className="btn-cyber-primary"
        >
          <div className="flex items-center justify-center gap-2">
            <span>{primaryLabel}</span>
            <span aria-hidden="true">→</span>
          </div>
        </motion.button>
      )}

      {/* A reset is deliberate; it is not a fake pause action. */}
      {isInProgress && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onQuitRequest}
          type="button"
          className="btn-cyber-secondary"
        >
          END THIS RUN
        </motion.button>
      )}

      {/* Return to menu */}
      {(isGameOver || isRoundDone) && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={isGameOver ? onReturnToDashboard : onQuitRequest}
          type="button"
          className="btn-cyber-secondary"
        >
          RETURN TO DASHBOARD
        </motion.button>
      )}
    </div>
  )
}
