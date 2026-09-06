import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface ConfirmDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  /** Question form — what will happen if they continue. */
  title?: string
  /** Consequence lines under the title. */
  lines?: string[]
  cancelLabel?: string
  confirmLabel?: string
  /** Renders the confirm action in the danger tone. */
  destructive?: boolean
  /** Accessible name for the dialog. */
  ariaLabel?: string
}

/**
 * 확인 팝업.
 *
 * DESIGN.md §1 asks that a person recovering from an interrupted flow be told
 * the state, the consequence, and the next safe action. So the title states the
 * action, the body states what cannot be undone, and the cancel button is the
 * one that reads as safe — the destructive action is the tinted one.
 */
function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = '계속할까요?',
  lines = ['이 작업은 되돌릴 수 없습니다.'],
  cancelLabel = '취소',
  confirmLabel = '확인',
  destructive = false,
  ariaLabel = '확인',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} size="sm" ariaLabel={ariaLabel}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-h4 text-fg">{title}</p>
          {lines.map((line) => (
            <p key={line} className="text-bodysm text-muted">
              {line}
            </p>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="lg" block onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} size="lg" block onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
