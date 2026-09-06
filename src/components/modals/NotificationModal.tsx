import Modal from '../ui/Modal'
import { EmptyState } from '../ui/StateView'
import { notifications } from '../../data/mock'

interface NotificationModalProps {
  open: boolean
  onClose: () => void
}

/**
 * 알림 팝업 — 헤더 벨에서 연다.
 *
 * 행 사이는 hairline 으로만 나눈다. 시간은 메타데이터라 한 단계 작고 조용하게 둔다.
 */
function NotificationModal({ open, onClose }: NotificationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="알림">
      {notifications.length === 0 ? (
        <EmptyState
          title="새로운 알림이 없습니다"
          description="위험도 분석이 끝나면 여기로 알려드립니다."
        />
      ) : (
        <ul className="-my-2 flex list-none flex-col p-0">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex flex-col gap-1.5 border-b border-line py-4 last:border-b-0"
            >
              <p className="text-body text-fg">{n.message}</p>
              <span className="text-bodysm text-muted">{n.time}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

export default NotificationModal
