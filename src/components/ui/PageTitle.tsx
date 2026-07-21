import type { ReactNode } from 'react'

export interface PageTitleProps {
  readonly actions?: ReactNode
  readonly description?: string
  readonly eyebrow?: string
  readonly title: string
}

export function PageTitle({ actions, description, eyebrow, title }: PageTitleProps) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="tracking-0 mb-3 text-xs font-semibold text-[var(--color-accent)] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="tracking-0 text-4xl font-semibold text-balance text-[var(--color-text-primary)] sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
