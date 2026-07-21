import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { GameStatus } from '@/core/game/GameStatus'

export interface StatusPanelProps {
  readonly status: GameStatus
  readonly playerInputLength: number
  readonly targetSequenceLength: number
}

const STATUS_CONFIG = {
  [GameStatus.Idle]: {
    label: '🧘 Ready',
    desc: 'Press begin to start your practice',
    cls: 'zen-chip-idle',
    dot: 'bg-stone-400',
  },
  [GameStatus.ShowingSequence]: {
    label: '👁 Observe',
    desc: 'Watch the pattern mindfully',
    cls: 'zen-chip-showing',
    dot: 'bg-blue-300',
  },
  [GameStatus.PlayerTurn]: {
    label: '🌿 Your Turn',
    desc: 'Repeat with intention',
    cls: 'zen-chip-player',
    dot: 'bg-emerald-300',
  },
  [GameStatus.RoundCompleted]: {
    label: '🍃 Round Clear',
    desc: 'Well done. Breathe.',
    cls: 'zen-chip-round',
    dot: 'bg-amber-300',
  },
  [GameStatus.GameOver]: {
    label: '🍂 Stillness',
    desc: 'The pattern fades. Try again.',
    cls: 'zen-chip-gameover',
    dot: 'bg-orange-300',
  },
} as const

export function StatusPanel({ status, playerInputLength, targetSequenceLength }: StatusPanelProps) {
  const shouldReduceMotion = useReducedMotion()
  const cfg = STATUS_CONFIG[status]
  const progress = targetSequenceLength > 0 ? playerInputLength / targetSequenceLength : 0

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      {/* Status chip — soft pill */}
      <motion.div
        className={`zen-chip ${cfg.cls}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </motion.div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={status}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -3 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="text-center text-[11px] font-normal"
          style={{ color: 'var(--color-text-tertiary)', opacity: 0.75 }}
        >
          {cfg.desc}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar — soft sage */}
      <AnimatePresence>
        {status === GameStatus.PlayerTurn && targetSequenceLength > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <div className="zen-progress-track">
              <motion.div
                className="zen-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[8px] font-medium" style={{ color: 'var(--color-text-tertiary)', opacity: 0.55 }}>
              <span>{playerInputLength} tapped</span>
              <span>{targetSequenceLength} needed</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
