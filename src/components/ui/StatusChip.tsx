import { GameStatus } from '@/core/game/GameStatus'
import { Badge } from './Badge'
import { cn } from '@/utils/classNames'

export interface StatusChipProps {
  readonly status: GameStatus
  readonly className?: string
}

const statusBadgeConfig = {
  [GameStatus.Idle]: {
    variant: 'default',
    label: 'Ready',
    dotClass: 'bg-neutral-500',
  },
  [GameStatus.ShowingSequence]: {
    variant: 'info',
    label: 'Playback',
    dotClass: 'bg-blue-400 animate-pulse',
  },
  [GameStatus.PlayerTurn]: {
    variant: 'success',
    label: 'Your Turn',
    dotClass: 'bg-emerald-400 animate-ping',
  },
  [GameStatus.RoundCompleted]: {
    variant: 'success',
    label: 'Cleared',
    dotClass: 'bg-indigo-400',
  },
  [GameStatus.GameOver]: {
    variant: 'danger',
    label: 'Game Over',
    dotClass: 'bg-red-500',
  },
} as const

/**
 * Enhanced game status chip showing a pulsating colored dot indicator.
 */
export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusBadgeConfig[status]

  return (
    <Badge
      className={cn('flex items-center gap-1.5', className)}
      variant={config.variant}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      <span>{config.label}</span>
    </Badge>
  )
}
