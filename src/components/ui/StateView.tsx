import type { ReactNode } from 'react'
import Button from './Button'

/**
 * Empty / error / working states — LOCAL EXTENSION.
 *
 * Shaped by DESIGN.md §1 and §6 rather than by a generic empty-state pattern:
 * "treat financial outcomes as explicit states with clear next actions", and a
 * person recovering from an interrupted flow "needs the current state,
 * consequence, and next safe action stated explicitly". So every state here
 * takes a title, an optional consequence line, and an optional action — and no
 * state is allowed to be a bare shrug.
 */

interface StateViewProps {
  /** What is true right now, in one line. */
  title: ReactNode
  /** What it means or what to do about it. */
  description?: ReactNode
  /** The next safe action. */
  action?: ReactNode
  /** `page` adds breathing room for a full-width surface. */
  size?: 'inline' | 'page'
  className?: string
}

function StateView({ title, description, action, size = 'inline', className }: StateViewProps) {
  return (
    <div
      className={[
        'flex flex-col items-center text-center',
        size === 'page' ? 'gap-3 px-6 py-16' : 'gap-2 px-5 py-10',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className={size === 'page' ? 'text-h4 text-fg' : 'text-body font-semibold text-fg'}>
        {title}
      </p>
      {description && (
        <p className="max-w-[420px] text-bodysm text-muted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

interface EmptyStateProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  size?: 'inline' | 'page'
}

/** Nothing to show, and that is a valid outcome. */
export function EmptyState({ title, description, action, size }: EmptyStateProps) {
  return <StateView title={title} description={description} action={action} size={size} />
}

interface ErrorStateProps {
  /** The message the API returned. Shown verbatim — it is written for the user. */
  message: ReactNode
  /** Retry handler. Omit when the failure is not retryable. */
  onRetry?: () => void
  retryLabel?: string
  size?: 'inline' | 'page'
}

/**
 * A request failed. The server's message is surfaced as-is instead of being
 * replaced by a generic apology, and retry is offered when it is safe.
 */
export function ErrorState({
  message,
  onRetry,
  retryLabel = '다시 시도',
  size,
}: ErrorStateProps) {
  return (
    <div role="alert">
      <StateView
        title={<span className="text-danger">{message}</span>}
        description="잠시 후 다시 시도해 주세요. 계속 실패하면 네트워크 상태를 확인해 주세요."
        action={
          onRetry && (
            <Button variant="secondary" size="md" onClick={onRetry}>
              {retryLabel}
            </Button>
          )
        }
        size={size}
      />
    </div>
  )
}

interface WorkingStateProps {
  /** What is happening, and how far along if known. */
  title: ReactNode
  description?: ReactNode
}

/** A long-running job is in progress. Announced politely, not as an alert. */
export function WorkingState({ title, description }: WorkingStateProps) {
  return (
    <div role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
        <span
          className="size-6 rounded-full border-2 border-primary border-t-transparent"
          style={{ animation: 'tds-spin 0.7s linear infinite' }}
          aria-hidden="true"
        />
        <p className="text-body font-semibold text-fg">{title}</p>
        {description && (
          <p className="max-w-[420px] text-bodysm text-muted">{description}</p>
        )}
      </div>
    </div>
  )
}

export default StateView
