import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useSession } from '../../session/useSession'

interface MyPageModalProps {
  open: boolean
  onClose: () => void
  /** Fired when 신규 점포 추가 / 점포 삭제 is pressed (enterprise). */
  onAddStore?: () => void
  /** Fired for the owner actions. */
  onManageReports?: () => void
  onCreateReport?: () => void
}

/**
 * 마이페이지 팝업. Layout switches on the logged-in role:
 * `enterprise` shows 기업명 / 가맹 점포 수, `owner` shows the store identity.
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="마이페이지"
    >
      {role === 'owner' ? (
        <div className="flex flex-col gap-2.5 pt-2 pb-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[28px] font-medium text-w-ink">사업자 계정</p>
            <span className="text-[18px] text-w-ink">{user?.name ?? '사업자'}</span>
          </div>
          <p className="text-[18px] text-w-placeholder">연결된 점포 정보는 운영보고서에서 확인할 수 있습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 pt-2 pb-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[28px] font-medium text-w-ink">본사 계정</p>
            <span className="text-[18px] text-w-ink">{user?.name ?? '본사'}</span>
          </div>
          <p className="text-[18px] text-w-placeholder">가맹점 현황은 본사 대시보드에서 확인할 수 있습니다.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {role === 'owner' ? (
          <>
            <Button block onClick={onManageReports}>
              재무재표보고서 관리
            </Button>
            <Button block onClick={onCreateReport}>
              전월 재무재표보고서 생성
            </Button>
          </>
        ) : (
          <>
            <Button block onClick={onAddStore}>
              신규 점포 추가
            </Button>
            <Button block disabled title="점포 삭제 API 연결 후 사용할 수 있습니다">
              점포 삭제 (준비 중)
            </Button>
          </>
        )}
      </div>

      <button
        type="button"
        className="self-center mt-4 px-3 py-1.5 text-w-ink bg-transparent border-0 cursor-pointer underline"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </Modal>
  )
}

export default MyPageModal
