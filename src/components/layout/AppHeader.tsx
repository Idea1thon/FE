import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationModal from '../modals/NotificationModal'
import MyPageModal from '../modals/MyPageModal'
import { useSession } from '../../session/useSession'
import * as api from '../../api'

/** Global top bar: 서비스명 + 알림 벨 + 마이페이지. */
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

  const iconBtn =
    'relative inline-flex p-1.5 bg-transparent border-0 cursor-pointer text-w-ink rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-w-ink'

  return (
    <header className="flex flex-none items-center justify-between h-16 px-5 bg-w-page border-b border-w-line lg:h-[90px]">
      <Link to={home} className="text-[22px] font-normal text-w-ink no-underline lg:text-[30px]">
        서비스명
      </Link>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className={iconBtn}
          aria-label="알림"
          aria-haspopup="dialog"
          onClick={() => setNotifOpen(true)}
        >
          <Icon name="bell" size={28} />
          {hasNotifications && (
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-risk-danger"
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
          <Icon name="user" size={28} />
        </button>
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
