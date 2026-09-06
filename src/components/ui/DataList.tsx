import type { ReactNode } from 'react'

interface DataListProps {
  children: ReactNode
  /** When set, renders a `+ 더보기` row at the bottom. */
  onLoadMore?: () => void
  loadMoreLabel?: string
  /** Grow to fill the card body and pin the `+ 더보기` row to the bottom edge. */
  fill?: boolean
  className?: string
}

/** Stacked grey rows shared by the ranking / report / focus-store lists. */
function DataList({
  children,
  onLoadMore,
  loadMoreLabel = '+ 더보기',
  fill = false,
  className,
}: DataListProps) {
  return (
    <div
      className={['flex flex-col', fill ? 'flex-1' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
      {onLoadMore && (
        <button
          type="button"
          className={[
            'text-[16px] lg:text-[20px] text-w-ink bg-w-panel border border-w-line p-4 cursor-pointer hover:bg-w-row',
            fill ? 'mt-auto' : 'border-t-0',
          ].join(' ')}
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
  /** Makes the whole row a button. */
  onClick?: () => void
  className?: string
}

const rowBase =
  'flex items-center justify-between gap-4 w-full min-h-[62px] px-4 py-3 lg:px-6 text-[16px] lg:text-[20px] text-left text-w-ink bg-w-row border border-w-line -mt-px first:mt-0'

export function DataRow({ children, onClick, className }: DataRowProps) {
  const classes = [
    rowBase,
    onClick
      ? 'cursor-pointer hover:brightness-[0.96] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-w-ink'
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
