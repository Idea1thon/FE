import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { useSession } from '../../session/useSession'
import { currentStore } from '../../data/mock'

interface MyPageModalProps {
  open: boolean
  onClose: () => void
  /** Fired when 신규 점포 추가 / 점포 삭제 is pressed (enterprise). */
  onAddStore?: () => void
  onDeleteStore?: () => void
  /** Fired for the owner actions. */
  onManageReports?: () => void
  onCreateReport?: () => void
}

/**
 * 마이페이지 팝업. 로그인 역할에 따라 신원 블록이 바뀐다 —
 * `enterprise` 는 기업명 / 가맹 점포 수, `owner` 는 점포 정보.
 *
 * 신원은 `surface` 블록에 얹어 액션 목록과 시각적으로 분리한다. 로그아웃은
 * 되돌리기 쉬운 동작이라 파괴적 톤을 쓰지 않고 조용한 ghost 로 둔다.
 */
function MyPageModal({
  open,
  onClose,
  onAddStore,
  onDeleteStore,
  onManageReports,
  onCreateReport,
}: MyPageModalProps) {
  const { role, logout } = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/login')
  }

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
          {role === 'owner' ? (
            <>
              <p className="text-bodysm text-muted">{currentStore.region}</p>
              <p className="text-h4 text-fg">{currentStore.name}</p>
              <p className="text-bodysm text-muted">
                {currentStore.manager} · 업종명
              </p>
            </>
          ) : (
            <>
              <p className="text-bodysm text-muted">업종명</p>
              <p className="text-h4 text-fg">기업명</p>
              <p className="text-bodysm text-muted">
                가맹 점포 <span className="num font-semibold text-body">OO</span>곳
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {role === 'owner' ? (
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
              <Button variant="secondary" size="lg" block onClick={onDeleteStore}>
                점포 삭제
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
