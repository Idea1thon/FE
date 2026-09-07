import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationModal from '../modals/NotificationModal'
import MyPageModal from '../modals/MyPageModal'
import { useSession } from '../../session/useSession'
import * as api from '../../api'

/**
 * Global top bar: safeOn 로고 + 알림 벨 + 마이페이지.
 *
 * 알림은 서버에서 받아온다 (`/notifications`). 읽음 처리도 API 를 거친 뒤 로컬
 * 상태를 맞춘다 — 낙관적 갱신만 하면 실패가 화면에 남지 않는다.
 *
 * 시각적으로는 흰 canvas 에 hairline 하나로 본문과 구분한다(평면 레이어링).
 */
function AppHeader() {
  const { role } = useSession()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notificationItems, setNotificationItems] = useState<api.NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationLoading, setNotificationLoading] = useState(role !== null)
  const [notificationError, setNotificationError] = useState<string | null>(null)
  const [myPageOpen, setMyPageOpen] = useState(false)

  const hasNotifications = unreadCount > 0
  const home = role === 'owner' ? '/owner' : '/enterprise'

  useEffect(() => {
    if (!role) return
    let active = true
    api
      .fetchNotifications({ limit: 20 })
      .then((response) => {
        if (!active) return
        setNotificationItems(response.items)
        setUnreadCount(response.unread_count)
        setNotificationError(null)
      })
      .catch((cause: unknown) => {
        if (!active) return
        setNotificationError(
          cause instanceof api.ApiError ? cause.message : '알림을 불러오지 못했습니다.',
        )
      })
      .finally(() => {
        if (active) setNotificationLoading(false)
      })

    return () => {
      active = false
    }
  }, [role, notifOpen])

  const markNotificationRead = async (notificationId: number) => {
    try {
      await api.markNotificationRead(notificationId)
      setNotificationItems((items) =>
        items.map((item) =>
          item.notification_id === notificationId ? { ...item, is_read: true } : item,
        ),
      )
      setUnreadCount((count) => Math.max(0, count - 1))
    } catch (cause) {
      setNotificationError(
        cause instanceof api.ApiError ? cause.message : '알림 읽음 처리에 실패했습니다.',
      )
    }
  }

  const go = (path: string) => {
    setMyPageOpen(false)
    navigate(path)
  }

  const iconBtn = [
    'relative inline-flex size-10 items-center justify-center rounded-ctl-md',
    'text-body cursor-pointer bg-transparent border-0 transition-colors duration-150',
    'hover:bg-surface hover:text-fg',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  ].join(' ')

  return (
    <header className="sticky top-0 z-50 flex-none bg-canvas border-b border-line">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 lg:h-16 lg:px-8">
        <Link
          to={home}
          className="text-[19px] font-bold tracking-[-0.02em] text-fg no-underline lg:text-[21px]"
        >
          safeOn
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={iconBtn}
            // 미확인 개수를 라벨에 담아 색 점만으로 상태를 전달하지 않는다.
            aria-label={hasNotifications ? `알림 (미확인 ${unreadCount}개)` : '알림'}
            aria-haspopup="dialog"
            onClick={() => setNotifOpen(true)}
          >
            <Icon name="bell" size={22} />
            {hasNotifications && (
              <span
                className="absolute right-2 top-2 size-1.5 rounded-full bg-danger ring-2 ring-canvas"
                aria-hidden="true"
              />
            )}
          </button>
          <button
            type="button"
            className={iconBtn}
            aria-label="마이페이지"
            aria-haspopup="dialog"
            onClick={() => setMyPageOpen(true)}
          >
            <Icon name="user" size={22} />
          </button>
        </div>
      </div>

      <NotificationModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        items={notificationItems}
        unreadCount={unreadCount}
        loading={notificationLoading}
        error={notificationError}
        onRead={markNotificationRead}
      />

      <MyPageModal
        open={myPageOpen}
        onClose={() => setMyPageOpen(false)}
        onAddStore={() => go('/enterprise/location-analysis')}
        onManageReports={() => go('/owner/reports')}
        onCreateReport={() => go('/owner/reports/new')}
      />
    </header>
  )
}

export default AppHeader
