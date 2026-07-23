import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { GameStatus } from '@/core/game/GameStatus'

export interface StatusPanelProps {
  readonly status: GameStatus
  readonly playerInputLength: number
  readonly targetSequenceLength: number
}

const STATUS_CONFIG = {
  [GameStatus.Idle]: {
    label: 'Memory core ready',
    desc: 'When you are ready, start from the centre core.',
    cls: 'border border-[#78431e] bg-[#2a1307] text-[#ffe49e]',
    dot: 'bg-emerald-400',
  },
  [GameStatus.ShowingSequence]: {
    label: 'Watch the pattern',
    desc: 'Keep your eyes on the sequence. Do not tap yet.',
    cls: 'border border-[#38bdf8] bg-[#0c4a6e] text-[#7dd3fc] shadow-[0_0_12px_rgba(56,189,248,0.4)]',
    dot: 'bg-[#38bdf8] animate-ping',
  },
  [GameStatus.PlayerTurn]: {
    label: 'Your turn',
    desc: 'Repeat the pattern exactly as you saw it.',
    cls: 'border-2 border-[#fcd34d] bg-[#2a1307] text-[#fcd34d] shadow-[0_0_14px_rgba(252,211,77,0.5)]',
    dot: 'bg-[#fcd34d] animate-pulse',
  },
  [GameStatus.RoundCompleted]: {
    label: 'Pattern secured',
    desc: 'Nice recall. Continue when you are set.',
    cls: 'border border-emerald-400 bg-emerald-950 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.4)]',
    dot: 'bg-emerald-400',
  },
  [GameStatus.GameOver]: {
    label: 'Signal lost',
    desc: 'One wrong input ended this run.',
    cls: 'border border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    dot: 'bg-rose-500',
  },
} as const

export function StatusPanel({ status, playerInputLength, targetSequenceLength }: StatusPanelProps) {
  const shouldReduceMotion = useReducedMotion()
  const cfg = STATUS_CONFIG[status]
  const progress = targetSequenceLength > 0 ? playerInputLength / targetSequenceLength : 0
  const segmentCount = Math.min(10, Math.max(1, targetSequenceLength))

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      {/* Status chip */}
      <motion.div
        className={`flex items-center gap-2 rounded-full px-4 py-1 text-[10.5px] font-black tracking-widest uppercase shadow-md ${cfg.cls}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </motion.div>

      {/* Description - Fixed height to avoid shift */}
      <div className="h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -2 }}
            transition={{ duration: 0.15 }}
            className="text-center text-xs font-black text-[#fff3cd] bg-[#2a1307]/95 border border-[#78431e] px-4 py-0.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          >
            {cfg.desc}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar - Fixed height container so layout never shifts */}
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
