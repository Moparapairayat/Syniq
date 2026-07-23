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
    cls: 'status-idle',
    dot: 'bg-emerald-400',
  },
  [GameStatus.ShowingSequence]: {
    label: 'Watch the pattern',
    desc: 'Keep your eyes on the sequence. Do not tap yet.',
    cls: 'status-showing',
    dot: 'bg-blue-400 animate-ping',
  },
  [GameStatus.PlayerTurn]: {
    label: 'Your turn',
    desc: 'Repeat the pattern exactly as you saw it.',
    cls: 'status-player',
    dot: 'bg-emerald-400 animate-pulse',
  },
  [GameStatus.RoundCompleted]: {
    label: 'Pattern secured',
    desc: 'Nice recall. Continue when you are set.',
    cls: 'status-round',
    dot: 'bg-amber-400',
  },
  [GameStatus.GameOver]: {
    label: 'Signal lost',
    desc: 'One wrong input ended this run.',
    cls: 'status-gameover',
    dot: 'bg-rose-500',
  },
} as const

export function StatusPanel({ status, playerInputLength, targetSequenceLength }: StatusPanelProps) {
  const shouldReduceMotion = useReducedMotion()
  const cfg = STATUS_CONFIG[status]
  const progress = targetSequenceLength > 0 ? playerInputLength / targetSequenceLength : 0
  const segmentCount = Math.min(10, Math.max(1, targetSequenceLength))

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* Status chip */}
      <motion.div
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-wider uppercase ${cfg.cls}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </motion.div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={status}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -3 }}
          transition={{ duration: 0.2 }}
          className="text-center text-[10px] font-bold text-white/50"
        >
          {cfg.desc}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <AnimatePresence>
        {status === GameStatus.PlayerTurn && targetSequenceLength > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-[320px]"
          >
            <div className="memory-progress-segments" aria-label={`${playerInputLength} of ${targetSequenceLength} inputs completed`}>
              {Array.from({ length: segmentCount }, (_, index) => {
                const isComplete = index < Math.floor(progress * segmentCount)
                return <motion.span key={index} animate={{ opacity: isComplete ? 1 : 0.32, scaleY: isComplete ? 1 : 0.72 }} className={isComplete ? 'memory-progress-segment is-complete' : 'memory-progress-segment'} transition={{ duration: 0.18 }} />
              })}
            </div>
            <div className="mt-1 flex justify-between text-[8px] font-black tracking-widest text-white/40 uppercase">
              <span>{playerInputLength} recalled</span>
              <span>{targetSequenceLength} sequence</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
