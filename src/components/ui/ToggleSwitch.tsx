import { motion, useReducedMotion } from 'framer-motion'

export interface ToggleSwitchProps {
  readonly checked: boolean
  readonly onChange: (checked: boolean) => void
  readonly label: string
  readonly disabled?: boolean
}

/**
 * Reusable premium toggle switch widget for configuration preferences.
 * Supports keyboard triggers, focus indicators, and reduced motion configs.
 */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}: ToggleSwitchProps) {
  const shouldReduceMotion = useReducedMotion()

  const handleToggle = () => {
    if (disabled) return
    onChange(!checked)
  }

  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2 select-none">
      <span className="text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </span>
      <button
        aria-checked={checked}
        className="relative h-6 w-11 rounded-full border border-white/[0.08] bg-white/[0.04] p-0.5 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled}
        onClick={handleToggle}
        role="switch"
        type="button"
        style={{
          backgroundColor: checked ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
        }}
      >
        <motion.span
          animate={{ x: checked ? 20 : 0 }}
          className="block h-4.5 w-4.5 rounded-full bg-white shadow-sm"
          initial={false}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 500, damping: 30 }
          }
        />
      </button>
    </label>
  )
}
