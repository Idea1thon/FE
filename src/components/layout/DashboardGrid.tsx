import type { ReactNode } from 'react'

interface DashboardGridProps {
  left: ReactNode
  right: ReactNode
  /** Stretch both columns to equal height instead of aligning to the top. */
  stretch?: boolean
}

/**
 * Two-column dashboard body that stacks below `lg`.
 *
 * The 24px gutter is from the verified spacing cluster. DESIGN.md does not
 * publish breakpoints, so the single stacking point is a LOCAL EXTENSION — one
 * breakpoint keeps the mobile order predictable instead of inventing a grid
 * table the sources do not contain.
 */
function DashboardGrid({ left, right, stretch = false }: DashboardGridProps) {
  return (
    <div
      className={[
        'grid grid-cols-1 gap-6 lg:grid-cols-2',
        stretch ? 'items-stretch' : 'items-start',
      ].join(' ')}
    >
      <div className="flex min-w-0 flex-col gap-6">{left}</div>
      <div className="flex min-w-0 flex-col gap-6">{right}</div>
    </div>
  )
}

export default DashboardGrid
