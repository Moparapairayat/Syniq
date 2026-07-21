import { cn } from '@/utils/classNames'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export interface ButtonStyleOptions {
  readonly className?: string
  readonly size?: ButtonSize
  readonly variant?: ButtonVariant
}

const buttonBaseClassName =
  'inline-flex items-center justify-center rounded-[var(--radius-full)] font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]'

const buttonVariantClassNames = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-accent-strong)]',
  secondary:
    'border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]',
  ghost:
    'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]',
} as const satisfies Record<ButtonVariant, string>

const buttonSizeClassNames = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-5 text-sm',
} as const satisfies Record<ButtonSize, string>

export function getButtonClassName({
  className,
  size = 'md',
  variant = 'primary',
}: ButtonStyleOptions = {}) {
  return cn(
    buttonBaseClassName,
    buttonVariantClassNames[variant],
    buttonSizeClassNames[size],
    className,
  )
}
