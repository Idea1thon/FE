import type { ReactNode } from 'react'

/**
 * Row list — LOCAL EXTENSION.
 *
 * The pre-redesign list stacked grey blocks with a full border on every row. It
 * is rebuilt on the verified flat-layering rule instead: rows sit on canvas and
 * are separated by the 1px `#e5e8eb` line, with `surface` reserved for hover.
 * No shadow, because DESIGN.md promotes no elevation token.
 */

interface DataListProps {
  children: ReactNode
  /** Renders a full-width "더보기" row at the bottom. */
  onLoadMore?: () => void
  loadMoreLabel?: string
  /** Grow to fill the card body and pin the load-more row to the bottom. */
  fill?: boolean
  className?: string
}

function DataList({
  children,
  onLoadMore,
  loadMoreLabel = '더보기',
  fill = false,
  className,
}: DataListProps) {
  return (
    <div
      className={['flex flex-col', fill ? 'flex-1' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-col">{children}</div>
      {onLoadMore && (
        <button
          type="button"
          className={[
            'w-full py-4 text-bodysm font-semibold text-body cursor-pointer',
            'border-t border-line bg-canvas transition-colors duration-150',
            'hover:bg-surface hover:text-primary',
            'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
            fill ? 'mt-auto' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onLoadMore}
        >
          {loadMoreLabel}
        </button>
      )}
    </div>
  )
}

interface DataRowProps {
  children: ReactNode
  /** Makes the whole row activate. */
  onClick?: () => void
  className?: string
}

const rowBase = [
  'flex items-center justify-between gap-4 w-full min-h-[60px] px-5 py-3 lg:px-6',
  'text-body text-left text-body',
  'border-b border-line last:border-b-0',
].join(' ')

export function DataRow({ children, onClick, className }: DataRowProps) {
  const classes = [
    rowBase,
    onClick
      ? [
          'cursor-pointer bg-canvas transition-colors duration-150 hover:bg-surface',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
        ].join(' ')
      : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    )
  }
  return <div className={classes}>{children}</div>
}

export default DataList
