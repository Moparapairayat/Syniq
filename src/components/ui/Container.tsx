import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils/classNames'

export type ContainerSize = 'sm' | 'md' | 'lg'

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  readonly size?: ContainerSize
}

const containerSizeClassNames = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
} as const satisfies Record<ContainerSize, string>

export function Container({ className, size = 'lg', ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-[var(--space-page-inline)]',
        containerSizeClassNames[size],
        className,
      )}
      {...props}
    />
  )
}
