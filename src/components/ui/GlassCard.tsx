import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/classNames'

export interface GlassCardProps extends ComponentPropsWithoutRef<'div'> {
  readonly hoverEffect?: boolean
}

/**
  Ultra Clean Modern Minimal Container — flat solid slate surface with crisp subtle borders.
 */
export function GlassCard({ className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#334155] bg-[#1e293b] p-5 shadow-md transition-all duration-200',
        hoverEffect && 'hover:border-[#475569] hover:bg-[#273549]',
        className,
      )}
      {...props}
    />
  )
}
