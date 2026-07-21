import type { ReactNode } from 'react'
import { cn } from '@/utils/classNames'

export interface BadgeProps {
  readonly children: ReactNode
  readonly variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  readonly className?: string
}

const badgeVariants = {
  default: 'bg-white/5 text-[var(--color-text-secondary)] border-white/10',
  success: 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30',
  warning: 'bg-amber-950/20 text-amber-400 border-amber-900/30',
  danger: 'bg-red-950/20 text-red-400 border-red-900/30',
  info: 'bg-blue-950/20 text-blue-400 border-blue-900/30',
} as const

/**
 * Reusable pill-shaped badge component for small contextual tags.
 */
export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
