import { cn } from '@/utils/classNames'
import { useTheme } from '@/context/themeStore'
import type { ThemeMode } from '@/types/theme'

export interface ThemeSelectorProps {
  readonly value?: 'dark' | 'light' | 'system'
  readonly onChange?: (value: 'dark' | 'light' | 'system') => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { themeMode, setThemeMode } = useTheme()
  const activeValue = value || themeMode

  const options = [
    { key: 'dark', label: '🌙 Dark Mode' },
    { key: 'light', label: '☀️ Light Mode' },
  ] as const

  const handleSelect = (val: ThemeMode) => {
    setThemeMode(val)
    onChange?.(val)
  }

  return (
    <div className="flex flex-col gap-2 py-1 select-none">
      <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
        Color Theme
      </span>
      <div className="flex rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1">
        {options.map((opt) => {
          const isActive = activeValue === opt.key
          return (
            <button
              className={cn(
                'flex-1 rounded-xl py-2 text-center text-xs font-bold tracking-wider transition-all duration-150 outline-none cursor-pointer',
                isActive
                  ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
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
