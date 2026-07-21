import { GlassCard } from '@/components/ui'
import type { GameMode } from '@/core/game/GameMode'

export interface GameModeCardProps {
  readonly mode: GameMode
  readonly title: string
  readonly description: string
  readonly traits: readonly string[]
  readonly isSelected: boolean
  readonly onSelect: (mode: GameMode) => void
}

/**
 * Display card for game modes. Renders parameters, badges, and activation triggers.
 */
export function GameModeCard({
  mode,
  title,
  description,
  isSelected,
  onSelect,
}: GameModeCardProps) {
  return (
    <GlassCard
      onClick={() => onSelect(mode)}
      className={`relative flex min-h-[120px] cursor-pointer flex-col justify-between border p-4 transition-all duration-300 select-none active:scale-95 ${
        isSelected
          ? 'border-[var(--color-accent)] bg-white/[0.04] shadow-[0_0_20px_rgba(255,140,66,0.12)]'
          : 'border-white/[0.04] hover:border-white/[0.08]'
      }`}
    >
      {/* Selected Indicator Dot */}
      {isSelected ? (
        <span className="absolute top-3.5 right-3.5 h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent)]" />
      ) : null}

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{title}</h3>
        <p className="text-[10px] leading-normal text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </GlassCard>
  )
}
