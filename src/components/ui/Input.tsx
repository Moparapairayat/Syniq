import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/utils/classNames'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly helperText?: string
  readonly label: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, errorMessage, helperText, id, label, type = 'text', ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const helperId = helperText ? `${inputId}-helper` : undefined
    const errorId = errorMessage ? `${inputId}-error` : undefined
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

    return (
      <label className="grid gap-2 text-sm font-medium text-[var(--color-text-primary)]">
        <span>{label}</span>
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(errorMessage)}
          className={cn(
            'min-h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 text-sm text-[var(--color-text-primary)] transition outline-none placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-border-strong)] focus:ring-2 focus:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-60',
            className,
          )}
          id={inputId}
          ref={ref}
          type={type}
          {...props}
        />
        {helperText ? (
          <span className="text-xs text-[var(--color-text-tertiary)]" id={helperId}>
            {helperText}
          </span>
        ) : null}
        {errorMessage ? (
          <span className="text-xs text-[var(--color-danger)]" id={errorId}>
            {errorMessage}
          </span>
        ) : null}
      </label>
    )
  },
)

Input.displayName = 'Input'
