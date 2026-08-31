import Modal from '../ui/Modal'
import { notifications } from '../../data/mock'

interface NotificationModalProps {
  open: boolean
  onClose: () => void
}

/** 알림 팝업 — scrollable list of notifications opened from the header bell. */
function NotificationModal({ open, onClose }: NotificationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="알림" hideDivider>
      <ul className="list-none m-0 p-0 flex flex-col">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="flex flex-col gap-3 px-5 py-[18px] bg-w-field border border-w-line -mt-px first:mt-0"
          >
            <p className="text-[18px] leading-[1.4] text-w-ink">{n.message}</p>
            <span className="self-end text-[15px] text-w-ink">{n.time}</span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default NotificationModal
