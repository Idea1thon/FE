import Modal from '../ui/Modal'
import type { NotificationItem } from '../../api'

interface NotificationModalProps {
  open: boolean
  onClose: () => void
  items: NotificationItem[]
  unreadCount: number
  loading: boolean
  error: string | null
  onRead: (notificationId: number) => void
}

/** 알림 팝업 — scrollable list of notifications opened from the header bell. */
function NotificationModal({
  open,
  onClose,
  items,
  unreadCount,
  loading,
  error,
  onRead,
}: NotificationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={`알림${unreadCount > 0 ? ` · ${unreadCount}개 미확인` : ''}`} hideDivider>
      {error ? (
        <p role="alert" className="px-5 py-6 text-[16px] text-risk-danger">
          {error}
        </p>
      ) : loading ? (
        <p className="px-5 py-6 text-[16px] text-w-placeholder">알림을 불러오는 중입니다…</p>
      ) : items.length === 0 ? (
        <p className="px-5 py-6 text-[16px] text-w-placeholder">새로운 알림이 없습니다.</p>
      ) : (
        <ul className="list-none m-0 p-0 flex flex-col">
          {items.map((item) => (
            <li
              key={item.notification_id}
              className={`flex flex-col gap-3 px-5 py-[18px] bg-w-field border border-w-line -mt-px first:mt-0 ${
                item.is_read ? 'opacity-65' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[18px] leading-[1.4] text-w-ink">{item.message}</p>
                {!item.is_read && (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-risk-danger" aria-label="미확인" />
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] text-w-placeholder">
                  {item.branch_name} · {new Date(item.created_at).toLocaleString('ko-KR')}
                </span>
                {!item.is_read && (
                  <button
                    type="button"
                    className="shrink-0 border-0 bg-transparent p-0 text-[14px] text-w-ink underline underline-offset-2"
                    onClick={() => onRead(item.notification_id)}
                  >
                    읽음 처리
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

export default NotificationModal
