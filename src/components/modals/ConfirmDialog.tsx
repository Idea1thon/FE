import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface ConfirmDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  lines?: string[]
  cancelLabel?: string
  confirmLabel?: string
}

/** 삭제 확인 팝업 — generic two-button confirm. */
function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  lines = ['삭제 시 복구되지 않습니다.', '삭제하시겠습니까?'],
  cancelLabel = '뒤로가기',
  confirmLabel = '네',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} size="sm">
      <div className="flex flex-col gap-6 px-1 pt-3 pb-1 text-center">
        <div className="flex flex-col gap-1.5 text-[18px] text-w-ink">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          <Button className="min-w-24" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button className="min-w-24" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
