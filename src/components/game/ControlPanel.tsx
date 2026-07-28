import { motion } from 'framer-motion'
import { GameStatus } from '@/core/game/GameStatus'

export interface ControlPanelProps {
  readonly status: GameStatus
  readonly onNextRound: () => void
  readonly onQuitRequest: () => void
  readonly onReturnToDashboard: () => void
}

export function ControlPanel({
  status,
  onNextRound,
  onQuitRequest,
  onReturnToDashboard,
}: ControlPanelProps) {
  const isGameOver = status === GameStatus.GameOver
  const isRoundDone = status === GameStatus.RoundCompleted
  const isInProgress = !isGameOver && !isRoundDone && status !== GameStatus.Idle

  const primaryAction = onNextRound
  const primaryLabel = 'NEXT ROUND'

  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* ── 3D Golden Next Round Button ── */}
      {isRoundDone && (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97, y: 2 }}
          onClick={primaryAction}
          type="button"
          className="w-full cursor-pointer rounded-2xl border-[2px] border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] px-4 py-3 text-sm font-black tracking-wider text-[#3a1d0d] uppercase shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(120,53,15,0.4),0_5px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] transition-all outline-none"
        >
          <div className="flex items-center justify-center gap-2">
            <span>{primaryLabel}</span>
            <span aria-hidden="true" className="text-base font-black">
              →
            </span>
          </div>
        </motion.button>
      )}

      {/* ── 3D Wood End Run Button ── */}
      {isInProgress && (
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          onClick={onQuitRequest}
          type="button"
          className="w-full cursor-pointer rounded-2xl border-[2px] border-[#78281a] bg-gradient-to-b from-[#b91c1c] via-[#8c1d1d] to-[#5a1212] px-4 py-2.5 text-xs font-black tracking-widest text-[#ffe49e] uppercase shadow-[inset_0_1.5px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(40,10,10,0.7),0_4px_0_#4a0d06,0_8px_16px_rgba(0,0,0,0.5)] transition-all outline-none hover:border-[#fca5a5]"
        >
          <div className="flex items-center justify-center gap-1.5">
            <span aria-hidden="true" className="text-sm">
              🛑
            </span>
            <span>END THIS RUN</span>
          </div>
        </motion.button>
      )}

      {/* ── 3D Wood Return to Dashboard Button ── */}
      {(isGameOver || isRoundDone) && (
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          onClick={onReturnToDashboard}
          type="button"
          className="w-full cursor-pointer rounded-2xl border-[2px] border-[#3e2211] bg-gradient-to-b from-[#9e5d2b] via-[#753f1a] to-[#5a2e12] px-4 py-2.5 text-xs font-black tracking-widest text-[#fff3cd] uppercase shadow-[inset_0_1.5px_0_rgba(255,226,162,0.5),inset_0_-2px_0_rgba(30,12,4,0.6),0_4px_0_#381c0d,0_8px_16px_rgba(0,0,0,0.5)] transition-all outline-none hover:border-[#fcd34d]"
        >
          RETURN TO DASHBOARD
        </motion.button>
      )}
    </div>
  )
}
