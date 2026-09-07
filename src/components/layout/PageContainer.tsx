import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  /** `wide` (default) for dashboards, `narrow` for single-column reading views. */
  width?: 'wide' | 'narrow'
  className?: string
}

/**
 * Centred content column.
 *
 * DESIGN.md does not establish a desktop maximum width, so the cap here is a
 * LOCAL EXTENSION chosen for readability rather than copied from a breakpoint
 * table the sources do not contain. Padding follows the verified 16/24/32
 * spacing cluster and grows with the viewport, which is where the wide
 * whitespace of the target comes from.
 */
function PageContainer({ children, width = 'wide', className }: PageContainerProps) {
  const classes = [
    'w-full mx-auto px-5 pt-6 pb-16 sm:px-6 lg:px-8 lg:pt-10 lg:pb-24',
    width === 'narrow' ? 'max-w-[840px]' : 'max-w-[1200px]',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}

export default PageContainer
