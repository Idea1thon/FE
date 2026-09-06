import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationModal from '../modals/NotificationModal'
import MyPageModal from '../modals/MyPageModal'
import ConfirmDialog from '../modals/ConfirmDialog'
import { useSession } from '../../session/useSession'
import { notifications } from '../../data/mock'

/**
 * Global top bar.
 *
 * Sticky on a white canvas with a single hairline underneath — the verified flat
 * layering rule, so it separates from the content without a shadow. Height steps
 * from 56px on mobile to 64px on desktop, both comfortably above the 48px touch
 * target the TDS large control implies.
 */
function AppHeader() {
  const { role } = useSession()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [myPageOpen, setMyPageOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const hasNotifications = notifications.length > 0
  const home = role === 'owner' ? '/owner' : '/enterprise'

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
          서비스명
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={iconBtn}
            aria-label={hasNotifications ? '알림 (읽지 않은 알림 있음)' : '알림'}
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

      <NotificationModal open={notifOpen} onClose={() => setNotifOpen(false)} />

      <MyPageModal
        open={myPageOpen}
        onClose={() => setMyPageOpen(false)}
        onAddStore={() => go('/enterprise/location-analysis')}
        onDeleteStore={() => {
          setMyPageOpen(false)
          setConfirmDeleteOpen(true)
        }}
        onManageReports={() => go('/owner/reports')}
        onCreateReport={() => go('/owner/reports/new')}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        ariaLabel="점포 삭제"
        title="점포를 삭제할까요?"
        lines={['삭제하면 이 점포의 운영보고서와 분석 결과를 되돌릴 수 없습니다.']}
        confirmLabel="삭제"
        destructive
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => setConfirmDeleteOpen(false)}
      />
    </header>
  )
}

export default AppHeader
