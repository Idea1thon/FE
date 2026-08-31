import type { ReactNode } from 'react'

interface PageHeadingProps {
  title: ReactNode
  /** Inline text next to the title (e.g. the report period). */
  meta?: ReactNode
  /** Secondary line under the title (e.g. 점장 이름). */
  subtitle?: ReactNode
  /** Right-aligned controls (sort dropdown, buttons, toggle). */
  actions?: ReactNode
  size?: 'md' | 'lg'
}

/** Title block for standalone list & detail pages. */
function PageHeading({ title, meta, subtitle, actions, size = 'md' }: PageHeadingProps) {
  const titleSize =
    size === 'lg'
      ? 'text-[24px] tracking-[-0.3px] lg:text-[30px]'
      : 'text-[20px] tracking-[-0.25px] lg:text-[25px]'

  return (
    <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
      <div>
        <div className="flex items-baseline gap-6 flex-wrap">
          <h1 className={`font-medium ${titleSize}`}>{title}</h1>
          {meta && <span className="text-[18px] text-w-ink">{meta}</span>}
        </div>
        {subtitle && <div className="mt-1.5 text-[18px] text-w-ink">{subtitle}</div>}
      </div>
      {actions && (
        <div className="flex flex-none flex-col items-start gap-3 lg:items-end">{actions}</div>
      )}
    </div>
  )
}

export default PageHeading
