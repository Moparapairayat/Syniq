import { cn } from '@/utils/classNames'

export interface ThemeSelectorProps {
  readonly value: 'dark' | 'light' | 'system'
  readonly onChange: (value: 'dark' | 'light' | 'system') => void
}

/**
 * Segmented control button picker for Dark, Light, or System preferences.
 */
export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const options = [
    { key: 'dark', label: 'Dark' },
    { key: 'light', label: 'Light' },
    { key: 'system', label: 'System' },
  ] as const

  return (
    <div className="flex flex-col gap-2 py-2">
      <span className="text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
        Color Theme
      </span>
      <div className="flex rounded-xl border border-white/[0.04] bg-white/[0.01] p-1">
        {options.map((opt) => {
          const isActive = value === opt.key
          return (
            <button
              className={cn(
                'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus)]',
                isActive
                  ? 'bg-white/5 text-[var(--color-text-primary)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              )}
              key={opt.key}
              onClick={() => onChange(opt.key)}
              type="button"
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
