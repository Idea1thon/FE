import type { ReactNode } from 'react'

/**
 * Panel surface — LOCAL EXTENSION.
 *
 * DESIGN.md deliberately does not publish a card component ("Don't invent
 * cards, shadows, tabs, toasts, or dialogs"), so this is built only from values
 * that *are* verified: white canvas, the 1px `#e5e8eb` line, the 16px xlarge
 * radius, and the 8/16/24/32 spacing cluster. Depth comes from flat layering,
 * never a drop shadow, because DESIGN.md promotes no elevation token.
 */

interface CardProps {
  /** Heading shown top-left. Rendered at the documented H4 role. */
  title?: ReactNode
  /** One quiet line under the title — what the number means, or its period. */
  description?: ReactNode
  /** Content pinned to the top-right (dropdown, button, hint). */
  action?: ReactNode
  /** Remove body padding — for edge-to-edge lists and tables. */
  flush?: boolean
  /** Grow the body when the card is stretched in a column. */
  fill?: boolean
  /** `surface` swaps the white body for the quiet neutral layer. */
  tone?: 'canvas' | 'surface'
  className?: string
  actionClassName?: string
  children: ReactNode
}

function Card({
  title,
  description,
  action,
  flush = false,
  fill = false,
  tone = 'canvas',
  className,
  actionClassName,
  children,
}: CardProps) {
  const classes = [
    'flex flex-col rounded-panel border border-line overflow-hidden',
    tone === 'surface' ? 'bg-surface' : 'bg-canvas',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const hasHeader = Boolean(title || description || action)

  return (
    <section className={classes}>
      {hasHeader && (
        <header
          className={[
            'flex items-start justify-between flex-wrap gap-x-4 gap-y-3',
            'px-5 pt-5 lg:px-6 lg:pt-6',
            flush ? 'pb-4' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="min-w-0">
            {title && <h2 className="text-h4 text-fg">{title}</h2>}
            {description && <p className="mt-1 text-bodysm text-muted">{description}</p>}
          </div>
          {action && (
            <div
              className={[
                'flex flex-none flex-col items-start gap-2 lg:items-end',
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
      <div
        className={[
          // Header already supplies the top padding; without one the body owns it.
          flush
            ? 'p-0'
            : hasHeader
              ? 'px-5 pt-4 pb-5 lg:px-6 lg:pt-4 lg:pb-6'
              : 'px-5 pt-5 pb-5 lg:px-6 lg:pt-6 lg:pb-6',
          fill ? 'flex flex-1 flex-col' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  )
}

export default Card
