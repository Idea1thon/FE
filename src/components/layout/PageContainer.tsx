import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  /** `wide` (default, ~1440px) or `narrow` for single-column reading views. */
  width?: 'wide' | 'narrow'
  className?: string
}

/** Centered content column with the standard page padding. */
function PageContainer({ children, width = 'wide', className }: PageContainerProps) {
  const classes = [
    'w-full mx-auto px-5 pt-6 pb-10 lg:px-11 lg:pt-10 lg:pb-14',
    width === 'narrow' ? 'max-w-[1040px]' : 'max-w-[1440px]',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}

export default PageContainer
