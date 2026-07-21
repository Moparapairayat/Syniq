import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/classNames'

export interface GlassCardProps extends ComponentPropsWithoutRef<'div'> {
  readonly hoverEffect?: boolean
}

/**
 * Premium glassmorphic container with background blur, subtle gradients, and clean borders.
 */
export function GlassCard({ className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300',
        hoverEffect &&
          'hover:border-white/[0.08] hover:bg-white/[0.02] hover:shadow-[0_20px_48px_-8px_rgba(0,0,0,0.6)]',
        className,
      )}
      {...props}
    />
  )
}
