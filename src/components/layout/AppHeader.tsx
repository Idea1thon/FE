import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationModal from '../modals/NotificationModal'
import MyPageModal from '../modals/MyPageModal'
import ConfirmDialog from '../modals/ConfirmDialog'
import { useSession } from '../../session/useSession'
import { notifications } from '../../data/mock'

/** Global top bar: 서비스명 + 알림 벨 + 마이페이지. */
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
        lines={['점포를 삭제하면 복구되지 않습니다.', '삭제하시겠습니까?']}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => setConfirmDeleteOpen(false)}
      />
    </header>
  )
}

export default AppHeader
