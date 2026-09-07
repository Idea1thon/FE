import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { useSession } from '../../session/useSession'

interface MyPageModalProps {
  open: boolean
  onClose: () => void
  /** Fired when 신규 점포 추가 is pressed (enterprise). */
  onAddStore?: () => void
  /** Fired for the owner actions. */
  onManageReports?: () => void
  onCreateReport?: () => void
}

/**
 * 마이페이지 팝업. 로그인 역할에 따라 신원 블록이 바뀐다.
 *
 * 이름은 세션의 실제 사용자 값을 쓴다. 점포 삭제는 API 가 아직 없어 비활성으로 두고
 * 이유를 라벨과 `title` 에 적는다 — 눌러도 아무 일이 없는 버튼을 두지 않는다.
 */
function MyPageModal({
  open,
  onClose,
  onAddStore,
  onManageReports,
  onCreateReport,
}: MyPageModalProps) {
  const { role, user, logout } = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/login')
  }

  const isOwner = role === 'owner'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="마이페이지"
      titleAction={
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-ctl-md bg-transparent border-0 text-muted cursor-pointer transition-colors duration-150 hover:bg-surface hover:text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="설정"
        >
          <Icon name="settings" size={20} />
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 rounded-panel bg-surface p-5">
          <p className="text-bodysm text-muted">{isOwner ? '사업자 계정' : '본사 계정'}</p>
          <p className="text-h4 text-fg">{user?.name ?? (isOwner ? '사업자' : '본사')}</p>
          <p className="text-bodysm text-muted">
            {isOwner
              ? '연결된 점포 정보는 운영보고서에서 확인할 수 있습니다.'
              : '가맹점 현황은 본사 대시보드에서 확인할 수 있습니다.'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {isOwner ? (
            <>
              <Button size="lg" block onClick={onManageReports}>
                운영보고서 관리
              </Button>
              <Button variant="secondary" size="lg" block onClick={onCreateReport}>
                전월 보고서 작성
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" block onClick={onAddStore}>
                신규 점포 입지 분석
              </Button>
              <Button
                variant="secondary"
                size="lg"
                block
                disabled
                title="점포 삭제 API 연결 후 사용할 수 있습니다"
              >
                점포 삭제 (준비 중)
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="md" block onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </Modal>
  )
}

export default MyPageModal
