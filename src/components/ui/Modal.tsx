import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

/**
 * Dialog shell — LOCAL EXTENSION.
 *
 * DESIGN.md does not publish a dialog, so the panel is assembled from verified
 * values only: white canvas, the 1px line, the 16px xlarge radius, and the
 * spacing cluster. There is deliberately **no drop shadow** — separation from
 * the page comes from the flat scrim plus the border, because DESIGN.md
 * promotes no elevation token.
 *
 * The focus trap, scroll lock, Escape handling and focus restore are unchanged
 * behaviour carried over from the previous implementation.
 */

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Heading text. Also becomes the dialog's accessible name. */
  title?: ReactNode
  /** Accessible name when there is no visible title. */
  ariaLabel?: string
  /** Content pinned to the top-right of the header. */
  titleAction?: ReactNode
  size?: 'sm' | 'md'
  /** Hide the divider under the header. */
  hideDivider?: boolean
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Modal({
  open,
  onClose,
  title,
  ariaLabel,
  titleAction,
  size = 'md',
  hideDivider = false,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const panel = panelRef.current

    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(firstFocusable ?? panel)?.focus()

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      const panel = panelRef.current
      if (e.key !== 'Tab' || !panel) return

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (!panel.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{ background: 'var(--overlay)' }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[
          'flex flex-col w-full max-h-[calc(100svh-32px)] bg-canvas border border-line',
          'rounded-t-panel sm:rounded-panel overflow-hidden focus:outline-none',
          size === 'sm' ? 'sm:max-w-[400px]' : 'sm:max-w-[560px]',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || titleAction) && (
          <header
            className={[
              'flex items-start justify-between gap-4 px-6 pt-6 pb-4',
              hideDivider ? '' : 'border-b border-line',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {title && (
              <h2 id={titleId} className="text-h4 text-fg">
                {title}
              </h2>
            )}
            {titleAction && <div className="flex flex-none items-center gap-2">{titleAction}</div>}
          </header>
        )}
        <div className="px-6 py-6 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
