import type { ReactNode } from 'react'

interface DashboardGridProps {
  left: ReactNode
  right: ReactNode
}

/** Two-column dashboard body that stacks below 1024px. */
function DashboardGrid({ left, right }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">
      <div className="flex flex-col gap-6 min-w-0">{left}</div>
      <div className="flex flex-col gap-6 min-w-0">{right}</div>
    </div>
  )
}

export default DashboardGrid
