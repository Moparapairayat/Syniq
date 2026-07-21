import { GlassCard } from './GlassCard'

export interface EmptyStateProps {
  readonly title: string
  readonly description: string
  readonly icon?: string
  readonly action?: React.ReactNode
}

/**
 * Reusable clean layout card to display when list arrays or statistics are empty.
 */
export function EmptyState({ title, description, icon = '📂', action }: EmptyStateProps) {
  return (
    <GlassCard className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-4xl" role="img">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-[var(--color-text-secondary)]">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </GlassCard>
  )
}
