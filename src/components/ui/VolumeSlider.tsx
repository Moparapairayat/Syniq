import { cn } from '@/utils/classNames'

export interface VolumeSliderProps {
  readonly value: number
  readonly onChange: (value: number) => void
  readonly label: string
  readonly disabled?: boolean
  readonly className?: string
}

/**
 * Reusable volume slider widget with mute indicators and percentage indicators.
 */
export function VolumeSlider({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: VolumeSliderProps) {
  const percentage = Math.round(value * 100)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    onChange(val)
  }

  return (
    <div className={cn('flex flex-col gap-2 py-2', className)}>
      <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
        <span>{label}</span>
        <span className="font-mono text-xs">{percentage}%</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Mute Indicator Icon */}
        <span className="text-sm" role="img" aria-label="volume-icon">
          {value === 0 ? '🔇' : value < 0.4 ? '🔈' : value < 0.7 ? '🔉' : '🔊'}
        </span>
        <input
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/5 accent-[var(--color-accent)] outline-none disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled}
          max="1"
          min="0"
          onChange={handleSliderChange}
          step="0.05"
          type="range"
          value={value}
        />
      </div>
    </div>
  )
}
