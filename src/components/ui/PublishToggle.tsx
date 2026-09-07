interface PublishToggleProps {
  published: boolean
  onChange: (published: boolean) => void
}

/**
 * 공개 / 비공개 세그먼트 — LOCAL EXTENSION.
 *
 * Built from the verified surface/canvas/primary roles and the 8px small-control
 * radius. The selected side is filled with primary rather than merely underlined
 * so the current state is legible at a glance, which is the point of the control.
 */
const option = [
  'h-8 min-w-[64px] px-3 rounded-ctl-sm text-bodysm font-semibold cursor-pointer',
  'border border-transparent transition-colors duration-150',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
].join(' ')

function PublishToggle({ published, onChange }: PublishToggleProps) {
  const cls = (active: boolean) =>
    [option, active ? 'bg-primary text-on-primary' : 'bg-transparent text-muted hover:text-body'].join(
      ' ',
    )

  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-ctl-md bg-surface"
      role="group"
      aria-label="공개 상태"
    >
      <button type="button" className={cls(published)} aria-pressed={published} onClick={() => onChange(true)}>
        공개
      </button>
      <button
        type="button"
        className={cls(!published)}
        aria-pressed={!published}
        onClick={() => onChange(false)}
      >
        비공개
      </button>
    </div>
  )
}

export default PublishToggle
