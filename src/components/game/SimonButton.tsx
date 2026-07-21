import { motion, useReducedMotion } from 'framer-motion'
import { SimonColor } from '@/core/game/SimonColor'
import { cn } from '@/utils/classNames'

export interface SimonButtonProps {
  readonly color: SimonColor
  readonly isActive: boolean
  readonly isDisabled: boolean
  readonly onClick: () => void
  readonly label: string
  readonly shortcutKey?: string
  readonly showSymbol?: boolean
  readonly className?: string
}

const colorStyles = {
  [SimonColor.Red]: {
    base: 'bg-red-500/[0.03] border-red-500/25 hover:border-red-500/50 hover:bg-red-500/[0.08] active:bg-red-500/20 text-red-400',
    lit: 'bg-gradient-to-br from-red-400 to-rose-600 border-red-300 text-white shadow-[0_0_45px_rgba(239,68,68,0.6)]',
    ring: 'focus-visible:ring-red-500',
    dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]',
  },
  [SimonColor.Green]: {
    base: 'bg-emerald-500/[0.03] border-emerald-500/25 hover:border-emerald-500/50 hover:bg-emerald-500/[0.08] active:bg-emerald-500/20 text-emerald-400',
    lit: 'bg-gradient-to-br from-emerald-400 to-green-600 border-emerald-300 text-white shadow-[0_0_45px_rgba(16,185,129,0.6)]',
    ring: 'focus-visible:ring-emerald-500',
    dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
  },
  [SimonColor.Blue]: {
    base: 'bg-blue-500/[0.03] border-blue-500/25 hover:border-blue-500/50 hover:bg-blue-500/[0.08] active:bg-blue-500/20 text-blue-400',
    lit: 'bg-gradient-to-br from-blue-400 to-indigo-600 border-blue-300 text-white shadow-[0_0_45px_rgba(59,130,246,0.6)]',
    ring: 'focus-visible:ring-blue-500',
    dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]',
  },
  [SimonColor.Yellow]: {
    base: 'bg-amber-500/[0.03] border-amber-500/25 hover:border-amber-500/50 hover:bg-amber-500/[0.08] active:bg-amber-500/20 text-amber-400',
    lit: 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-[0_0_45px_rgba(245,158,11,0.6)]',
    ring: 'focus-visible:ring-amber-500',
    dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
  },
} as const

const colorSymbols = {
  [SimonColor.Red]: '▲', // Triangle
  [SimonColor.Green]: '●', // Circle
  [SimonColor.Blue]: '■', // Square
  [SimonColor.Yellow]: '◆', // Diamond
} as const

/**
 * An individual interactive Simon color button.
 * Supports screen readers (ARIA), keyboard navigation, focus indicator styles,
 * and optional shape symbols representation for color-blind accessibility support.
 */
export function SimonButton({
  color,
  isActive,
  isDisabled,
  onClick,
  label,
  shortcutKey,
  showSymbol = false,
  className,
}: SimonButtonProps) {
  const styles = colorStyles[color]
  const shouldReduceMotion = useReducedMotion()

  const hoverAnimation = shouldReduceMotion || isDisabled ? {} : { scale: 1.025 }
  const tapAnimation = shouldReduceMotion || isDisabled ? {} : { scale: 0.97 }

  return (
    <motion.button
      aria-label={label}
      aria-live="polite"
      className={cn(
        'relative aspect-square w-full border text-center transition-all duration-300 select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] focus-visible:outline-none',
        className || 'rounded-[24px]',
        isActive ? styles.lit : styles.base,
        styles.ring,
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
      disabled={isDisabled}
      onClick={onClick}
      style={{ backdropFilter: 'blur(8px)' }}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
    >
      <div className="flex h-full flex-col items-center justify-between p-5">
        {/* Color State Dot */}
        <div className="flex w-full items-center justify-between">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-all duration-300',
              isActive ? 'scale-125 bg-white shadow-none' : styles.dot,
            )}
          />
          {shortcutKey ? (
            <span className="font-mono text-[10px] text-[var(--color-text-tertiary)] uppercase opacity-50">
              key {shortcutKey}
            </span>
          ) : null}
        </div>

        {/* Dynamic Display (Shape symbol vs. Color Text) */}
        {showSymbol ? (
          <span className="text-2xl font-bold opacity-90 transition-transform duration-300">
            {colorSymbols[color]}
          </span>
        ) : (
          <span className="text-xs font-semibold tracking-wider uppercase opacity-60">
            {color}
          </span>
        )}
      </div>
    </motion.button>
  )
}
