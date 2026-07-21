import { motion } from 'framer-motion'
import { cn } from '@/utils/classNames'

export interface LoaderProps {
  readonly className?: string
  readonly size?: 'sm' | 'md' | 'lg'
}

const spinnerSizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
} as const

/**
 * Reusable premium loading spinner and layout skeletal loaders.
 */
export function Loader({ className, size = 'md' }: LoaderProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-[var(--color-border-subtle)] border-t-[var(--color-accent)]',
          spinnerSizes[size],
        )}
      />
    </div>
  )
}

/**
 * Skeletal grid animation loader for cards.
 */
export function CardSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.01] p-6">
      <div className="h-6 w-1/3 rounded-md bg-white/5" />
      <div className="mt-4 h-4 w-2/3 rounded-md bg-white/5" />
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="h-10 rounded-md bg-white/5" />
        <div className="h-10 rounded-md bg-white/5" />
        <div className="h-10 rounded-md bg-white/5" />
      </div>
    </div>
  )
}

/**
 * Skeletal row animation loader for lists and tables.
 */
export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-xl border border-white/[0.04] bg-white/[0.01] p-5">
      <div className="flex justify-between border-b border-white/5 pb-4">
        <div className="h-4 w-12 rounded bg-white/5" />
        <div className="h-4 w-24 rounded bg-white/5" />
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>
      <div className="mt-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="flex justify-between py-2" key={i}>
            <div className="h-4 w-8 rounded bg-white/5" />
            <div className="h-4 w-32 rounded bg-white/5" />
            <div className="h-4 w-12 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      <Loader size="lg" />
      <span className="text-xs font-medium tracking-wider text-[var(--color-text-tertiary)] uppercase">
        Initializing
      </span>
    </motion.div>
  )
}
