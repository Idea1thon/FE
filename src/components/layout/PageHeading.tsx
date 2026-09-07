import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageHeadingProps {
  title: ReactNode
  /** Quiet line above the title — where this page sits (점포명, 기간 등). */
  eyebrow?: ReactNode
  /** Inline metadata beside the title. */
  meta?: ReactNode
  /** Secondary line under the title. */
  subtitle?: ReactNode
  /** Right-aligned controls. */
  actions?: ReactNode
  /** `lg` uses the H2 role, `md` uses H3. */
  size?: 'md' | 'lg'
  /** Renders a back link above the title. */
  backTo?: 'history' | string
}

/**
 * Title block for list and detail pages.
 *
 * Uses the documented type roles directly (H2 30/600/45, H3 24/600/36) instead
 * of ad-hoc pixel sizes, so the hierarchy is the same everywhere.
 */
function PageHeading({
  title,
  eyebrow,
  meta,
  subtitle,
  actions,
  size = 'md',
  backTo,
}: PageHeadingProps) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="min-w-0">
        {backTo && (
          <button
            type="button"
            className="mb-2 -ml-1 inline-flex h-8 items-center gap-1 rounded-ctl-sm px-1 text-bodysm font-medium text-muted transition-colors duration-150 hover:text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => (backTo === 'history' ? navigate(-1) : navigate(backTo))}
          >
            <span aria-hidden="true">←</span> 뒤로
          </button>
        )}
        {eyebrow && <p className="mb-1 text-bodysm font-medium text-muted">{eyebrow}</p>}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className={size === 'lg' ? 'text-h2 text-fg' : 'text-h3 text-fg'}>{title}</h1>
          {meta && <span className="text-body text-muted">{meta}</span>}
        </div>
        {subtitle && <div className="mt-2 text-bodysm text-muted">{subtitle}</div>}
      </div>
      {actions && (
        <div className="flex flex-none flex-wrap items-center gap-3 lg:justify-end">{actions}</div>
      )}
    </div>
  )
}

export default PageHeading
