import { motion } from 'framer-motion'
import { GameStatus } from '@/core/game/GameStatus'

export interface StatusPanelProps {
  readonly status: GameStatus
  readonly playerInputLength: number
  readonly targetSequenceLength: number
}

const STATUS_CONFIG = {
  [GameStatus.ShowingSequence]: {
    label: 'Watch the pattern',
    cls: 'border border-[#38bdf8] bg-[#0c4a6e] text-[#7dd3fc] shadow-[0_0_12px_rgba(56,189,248,0.4)]',
    dot: 'bg-[#38bdf8] animate-ping',
  },
  [GameStatus.PlayerTurn]: {
    label: 'Your turn',
    cls: 'border-2 border-[#fcd34d] bg-[#2a1307] text-[#fcd34d] shadow-[0_0_14px_rgba(252,211,77,0.5)]',
    dot: 'bg-[#fcd34d] animate-pulse',
  },
  [GameStatus.RoundCompleted]: {
    label: 'Pattern secured',
    cls: 'border border-emerald-400 bg-emerald-950 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.4)]',
    dot: 'bg-emerald-400',
  },
  [GameStatus.GameOver]: {
    label: 'Signal lost',
    cls: 'border border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    dot: 'bg-rose-500',
  },
} as const

export function StatusPanel({ status, playerInputLength, targetSequenceLength }: StatusPanelProps) {
  const isIdle = status === GameStatus.Idle
  const cfg = isIdle ? null : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
  const progress = targetSequenceLength > 0 ? playerInputLength / targetSequenceLength : 0
  const segmentCount = Math.min(10, Math.max(1, targetSequenceLength))

  return (
    <div className="flex w-full flex-col items-center gap-1.5 min-h-[32px]">
      {/* Status chip */}
      {cfg ? (
        <motion.div
          className={`flex items-center gap-2 rounded-full px-4 py-1 text-[10.5px] font-black tracking-widest uppercase shadow-md ${cfg.cls}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </motion.div>
      ) : null}

      {/* Progress bar */}
      <div className="h-10 w-full max-w-[320px] flex flex-col justify-center">
        {status === GameStatus.PlayerTurn && targetSequenceLength > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col gap-1"
          >
            <div className="memory-progress-segments" aria-label={`${playerInputLength} of ${targetSequenceLength} inputs completed`}>
              {Array.from({ length: segmentCount }, (_, index) => {
                const isComplete = index < Math.floor(progress * segmentCount)
                return <motion.span key={index} animate={{ opacity: isComplete ? 1 : 0.45, scaleY: isComplete ? 1 : 0.8 }} className={isComplete ? 'memory-progress-segment is-complete' : 'memory-progress-segment'} transition={{ duration: 0.18 }} />
              })}
            </div>
            <div className="flex justify-between text-[9.5px] font-black tracking-widest text-[#ffe49e] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#2a1307]/90 px-3 py-0.5 rounded-md border border-[#78431e]">
              <span>{playerInputLength} RECALLED</span>
              <span>{targetSequenceLength} SEQUENCE</span>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
