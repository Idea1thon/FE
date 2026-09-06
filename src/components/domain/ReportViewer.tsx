interface ReportViewerProps {
  content: string
  editing?: boolean
  onChange?: (value: string) => void
}

/**
 * 보고서 내용 — 읽기 모드는 스크롤 박스, 수정 모드는 textarea.
 *
 * Reading width is capped so long paragraphs stay scannable, and the edit mode
 * keeps the same padding and type so switching does not shift the text.
 */
function ReportViewer({ content, editing = false, onChange }: ReportViewerProps) {
  return (
    <div className="flex min-h-[420px] overflow-hidden rounded-panel border border-line bg-canvas lg:min-h-[520px]">
      {editing ? (
        <textarea
          className="flex-auto resize-none bg-canvas p-5 text-body leading-[1.7] text-fg border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 lg:p-8"
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="보고서 내용"
        />
      ) : (
        <div className="flex-auto overflow-y-auto p-5 lg:p-8">
          <p className="max-w-[68ch] whitespace-pre-wrap text-body leading-[1.7] text-fg">
            {content}
          </p>
        </div>
      )}
    </div>
  )
}

export default ReportViewer
