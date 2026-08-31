import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Heading text shown top-left of the panel. Also becomes the dialog's accessible name. */
  title?: ReactNode
  /** Accessible name when there is no visible `title` (e.g. a bare confirm dialog). */
  ariaLabel?: string
  /** Content pinned to the top-right of the header (e.g. a settings icon). */
  titleAction?: ReactNode
  size?: 'sm' | 'md'
  /** Hide the default divider under the header. */
  hideDivider?: boolean
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Popup shell for 알림 / 마이페이지 / 삭제 확인. */
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

  // Focus handling + scroll lock — runs only on open/close, not on every `onClose` identity change.
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

  // Escape to close + Tab focus trap.
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

  const headClasses = [
    'flex items-start justify-between gap-4 px-5 pt-5 pb-3 lg:px-8 lg:pt-7 lg:pb-4',
    hideDivider ? '' : 'border-b border-w-line',
  ]
    .filter(Boolean)
    .join(' ')

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-w-overlay"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`flex flex-col w-full max-h-[calc(100vh-48px)] bg-w-panel border border-w-line rounded-2xl shadow-[var(--shadow)] overflow-hidden focus:outline-none ${
          size === 'sm' ? 'max-w-[420px]' : 'max-w-[560px]'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || titleAction) && (
          <header className={headClasses}>
            {title && (
              <h2 id={titleId} className="text-[20px] tracking-[-0.25px] lg:text-[25px]">
                {title}
              </h2>
            )}
            {titleAction && (
              <div className="flex flex-none items-center gap-2">{titleAction}</div>
            )}
          </header>
        )}
        <div className="px-5 pb-5 pt-4 overflow-y-auto lg:px-8 lg:pb-7 lg:pt-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
