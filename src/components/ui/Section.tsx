import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/classNames'

export interface SectionProps extends ComponentPropsWithoutRef<'section'> {
  readonly spacing?: 'compact' | 'regular'
}

const sectionSpacingClassNames = {
  compact: 'py-6 sm:py-8',
  regular: 'py-10 sm:py-14',
} as const satisfies Record<NonNullable<SectionProps['spacing']>, string>

export function Section({ className, spacing = 'regular', ...props }: SectionProps) {
  return (
    <section className={cn(sectionSpacingClassNames[spacing], className)} {...props} />
  )
}
