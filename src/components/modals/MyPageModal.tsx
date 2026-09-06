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
 * 마이페이지 팝업. Layout switches on the logged-in role:
 * `enterprise` shows 기업명 / 가맹 점포 수, `owner` shows the store identity.
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
          className="inline-flex p-1 bg-transparent border-0 cursor-pointer text-w-ink"
          aria-label="설정"
        >
          <Icon name="settings" size={26} />
        </button>
      }
    >
      {role === 'owner' ? (
        <div className="flex flex-col gap-2.5 pt-2 pb-6">
          <p className="text-[20px] text-w-ink">{currentStore.region}</p>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[28px] font-medium text-w-ink">{currentStore.name}</p>
            <span className="text-[18px] text-w-ink">{currentStore.manager}</span>
          </div>
          <p className="text-[18px] text-w-ink">업종명</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 pt-2 pb-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[28px] font-medium text-w-ink">기업명</p>
            <span className="text-[18px] text-w-ink">업종명</span>
          </div>
          <p className="text-[18px] text-w-ink">
            가맹 점포 수 <strong className="text-[24px] font-medium ml-2">OO</strong>
          </p>
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
            <Button block onClick={onDeleteStore}>
              점포 삭제
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
