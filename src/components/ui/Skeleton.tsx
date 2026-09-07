/**
 * Loading placeholder — LOCAL EXTENSION.
 *
 * DESIGN.md publishes no skeleton component and no motion token, so this uses
 * only the verified `surface` neutral and a slow opacity pulse that the global
 * `prefers-reduced-motion` rule switches off. It never fakes content: the bars
 * mirror the shape of what is loading, not plausible values.
 */

interface SkeletonProps {
  /** Tailwind sizing classes for a single bar. */
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={['block rounded-sm bg-surface', className ?? 'h-4 w-full'].join(' ')}
      style={{ animation: 'tds-pulse 1.4s ease-in-out infinite' }}
    />
  )
}

interface SkeletonRowsProps {
  /** How many placeholder rows to draw. */
  rows?: number
  /** Row height, matching the real list row so the layout does not jump. */
  rowClassName?: string
  /** Accessible description of what is loading. */
  label?: string
}

/** Stacked row placeholders for list and table bodies. */
export function SkeletonRows({
  rows = 5,
  rowClassName = 'h-[60px]',
  label = '불러오는 중',
}: SkeletonRowsProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={[
            'flex items-center gap-4 px-5 border-b border-line last:border-b-0 lg:px-6',
            rowClassName,
          ].join(' ')}
        >
          <Skeleton className="h-4 w-24 rounded-xs" />
          <Skeleton className="h-4 flex-1 max-w-[220px] rounded-xs" />
          <Skeleton className="ml-auto h-4 w-16 rounded-xs" />
        </div>
      ))}
    </div>
  )
}

export default Skeleton
