import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui'

export interface ScorePanelProps {
  readonly round: number
  readonly score: number
}

/**
 * Displays active game session metrics with gentle fade micro-animations on values changes.
 */
export function ScorePanel({ round, score }: ScorePanelProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <GlassCard className="flex flex-col items-center justify-center py-4 text-center">
        <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}>
          Round
        </span>
        <motion.span
          className="mt-1.5 text-2xl font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
          initial={{ opacity: 0.6, y: 4 }}
          key={`round-${round}`}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          animate={{ opacity: 1, y: 0 }}
        >
          {round > 0 ? round : '--'}
        </motion.span>
      </GlassCard>

      <GlassCard className="flex flex-col items-center justify-center py-4 text-center">
        <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}>
          Score
        </span>
        <motion.span
          className="mt-1.5 text-2xl font-semibold"
          style={{ color: '#c4b498' }}
          initial={{ opacity: 0.6, y: 4 }}
          key={`score-${score}`}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          animate={{ opacity: 1, y: 0 }}
        >
          {score}
        </motion.span>
      </GlassCard>
    </div>
  )
}
