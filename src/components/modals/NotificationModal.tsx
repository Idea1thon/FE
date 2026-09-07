import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'
import { EmptyState, ErrorState } from '../ui/StateView'
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

/**
 * 알림 팝업 — 헤더 벨에서 연다. 목록·읽음 처리는 서버 값을 따른다.
 *
 * 읽지 않은 알림은 불투명도 대신 좌측 파란 막대로 구분한다 — 흐리게 만드는 방식은
 * 읽은 알림의 가독성을 떨어뜨린다.
 */
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
    <Modal
      open={open}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          알림
          {unreadCount > 0 && (
            <Badge tone="primary" variant="fill" size="sm">
              {unreadCount}
            </Badge>
          )}
        </span>
      }
    >
      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <div className="flex flex-col gap-4" role="status" aria-live="polite">
          <span className="sr-only">알림을 불러오는 중</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2 border-b border-line pb-4 last:border-b-0">
              <Skeleton className="h-4 w-full rounded-xs" />
              <Skeleton className="h-3 w-40 rounded-xs" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="새로운 알림이 없습니다"
          description="위험도 분석이 끝나면 여기로 알려드립니다."
        />
      ) : (
        <ul className="-my-2 flex list-none flex-col p-0">
          {items.map((item) => (
            <li
              key={item.notification_id}
              className="flex gap-3 border-b border-line py-4 last:border-b-0"
            >
              <span
                className={[
                  'mt-1 w-0.5 flex-none self-stretch rounded-full',
                  item.is_read ? 'bg-transparent' : 'bg-primary',
                ].join(' ')}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-auto flex-col gap-1.5">
                <p
                  className={[
                    'text-body',
                    item.is_read ? 'text-body' : 'font-semibold text-fg',
                  ].join(' ')}
                >
                  {item.message}
                  {!item.is_read && <span className="sr-only"> (미확인)</span>}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-bodysm text-muted">
                    {item.branch_name} · {new Date(item.created_at).toLocaleString('ko-KR')}
                  </span>
                  {!item.is_read && (
                    <button
                      type="button"
                      className="shrink-0 rounded-ctl-sm border-0 bg-transparent px-1 text-bodysm font-semibold text-primary cursor-pointer transition-colors duration-150 hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      onClick={() => onRead(item.notification_id)}
                    >
                      읽음 처리
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

export default NotificationModal
