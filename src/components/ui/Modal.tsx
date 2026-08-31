import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** Heading text shown top-left of the panel. */
  title?: ReactNode
  /** Content pinned to the top-right of the header (e.g. a settings icon). */
  titleAction?: ReactNode
  size?: 'sm' | 'md'
  /** Hide the default divider under the header. */
  hideDivider?: boolean
  children: ReactNode
}

/** Popup shell for 알림 / 마이페이지 / 삭제 확인. */
function Modal({
  open,
  onClose,
  title,
  titleAction,
  size = 'md',
  hideDivider = false,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
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
        className={`flex flex-col w-full max-h-[calc(100vh-48px)] bg-w-panel border border-w-line rounded-2xl shadow-[var(--shadow)] overflow-hidden ${
          size === 'sm' ? 'max-w-[420px]' : 'max-w-[560px]'
        }`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {(title || titleAction) && (
          <header className={headClasses}>
            {title && (
              <h2 className="text-[20px] tracking-[-0.25px] lg:text-[25px]">{title}</h2>
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
