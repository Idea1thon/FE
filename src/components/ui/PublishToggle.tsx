interface PublishToggleProps {
  published: boolean
  onChange: (published: boolean) => void
}

// Both options stay full-contrast; the active one is marked by weight + underline
// (dimming the inactive label made it unreadable on the panel background).
const option =
  'text-w-ink bg-transparent border-0 px-1 py-0.5 cursor-pointer aria-pressed:font-bold aria-pressed:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-w-ink'

/** "공개 | 비공개" 클릭 토글 — 보고서 공개 상태 설정. */
function PublishToggle({ published, onChange }: PublishToggleProps) {
  return (
    <div className="inline-flex items-center gap-2.5 text-[20px]" role="group" aria-label="공개 상태">
      <button type="button" className={option} aria-pressed={published} onClick={() => onChange(true)}>
        공개
      </button>
      <span className="text-w-line" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={option}
        aria-pressed={!published}
        onClick={() => onChange(false)}
      >
        비공개
      </button>
    </div>
  )
}

export default PublishToggle
