export interface LoaderProps {
  readonly size?: 'sm' | 'md' | 'lg'
  readonly label?: string
}

export function Loader({ size = 'md', label }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 select-none">
      <div
        className={`animate-spin rounded-full border-[#fcd34d] border-t-transparent ${sizeClasses[size]}`}
      />
      {label && <span className="text-xs font-bold text-[#ffe49e]">{label}</span>}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl border border-[#78431e]/50 bg-[#3a1d0d]/60 p-4 shadow-inner">
      <div className="h-4 w-1/3 rounded bg-[#78431e]/40" />
      <div className="mt-3 h-8 w-full rounded bg-[#78431e]/30" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse flex flex-col gap-2 p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 w-full rounded-xl bg-[#3a1d0d]/60 border border-[#78431e]/40" />
      ))}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Loader size="lg" label="Loading..." />
    </div>
  )
}
