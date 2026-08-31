import type { ReactNode } from 'react'

interface DashboardGridProps {
  left: ReactNode
  right: ReactNode
  /** Stretch both columns to equal height instead of aligning them to the top. */
  stretch?: boolean
}

/** Two-column dashboard body that stacks below 1024px. */
function DashboardGrid({ left, right, stretch = false }: DashboardGridProps) {
  const classes = [
    'grid grid-cols-1 gap-6 lg:grid-cols-2',
    stretch ? 'items-stretch' : 'items-start',
  ].join(' ')

  return (
    <div className={classes}>
      <div className="flex flex-col gap-6 min-w-0">{left}</div>
      <div className="flex flex-col gap-6 min-w-0">{right}</div>
    </div>
  )
}

export default DashboardGrid
