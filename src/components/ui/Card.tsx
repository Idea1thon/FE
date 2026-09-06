import type { ReactNode } from 'react'

interface CardProps {
  /** Heading shown top-left of the card. */
  title?: ReactNode
  /** Optional content pinned to the top-right (dropdown, button, hint). */
  action?: ReactNode
  /** Remove the inner padding — useful when the body is an edge-to-edge table. */
  flush?: boolean
  /** Grow the body to fill the card when the card itself is stretched (`flex-1`) in a column. */
  fill?: boolean
  className?: string
  /** Extra classes for the top-right action container. */
  actionClassName?: string
  children: ReactNode
}

/** The grey rounded panel used across the design (`신규 점포 입지 분석`, `매출 TOP 점포 랭킹`, …). */
function Card({
  title,
  action,
  flush = false,
  fill = false,
  className,
  actionClassName,
  children,
}: CardProps) {
  const classes = [
    'flex flex-col bg-w-panel border border-w-line rounded-[10px] overflow-hidden',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const headClasses = [
    'flex items-start justify-between flex-wrap gap-x-4 gap-y-3 px-5 pt-5 lg:px-7 lg:pt-6',
    flush ? 'pb-4' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const bodyClasses = [
    flush ? 'p-0' : 'px-5 pb-5 pt-4 lg:px-7 lg:pb-7 lg:pt-5',
    fill ? 'flex flex-1 flex-col' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={classes}>
      {(title || action) && (
        <header className={headClasses}>
          {title && (
            <h2 className="text-[20px] tracking-[-0.25px] [word-break:keep-all] lg:text-[25px]">
              {title}
            </h2>
          )}
          {action && (
            <div
              className={[
                'flex flex-none flex-col items-start gap-1.5 text-left lg:items-end lg:text-right',
                actionClassName ?? '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {action}
            </div>
          )}
        </header>
      )}
      <div className={bodyClasses}>{children}</div>
    </section>
  )
}

export default Card
