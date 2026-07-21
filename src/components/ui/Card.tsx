import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/classNames'

export type CardTone = 'default' | 'quiet'

export interface CardProps extends ComponentPropsWithoutRef<'article'> {
  readonly tone?: CardTone
}

const cardToneClassNames = {
  default:
    'border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
  quiet: 'border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]',
} as const satisfies Record<CardTone, string>

export function Card({ className, tone = 'default', ...props }: CardProps) {
  return (
    <article
      className={cn(
        'rounded-[var(--radius-lg)] p-5 transition-colors sm:p-6',
        cardToneClassNames[tone],
        className,
      )}
      {...props}
    />
  )
}
