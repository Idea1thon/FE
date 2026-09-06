interface ReportViewerProps {
  content: string
  editing?: boolean
  onChange?: (value: string) => void
}

/** 보고서 내용 영역 — 읽기 모드는 스크롤 박스, 수정 모드는 textarea. */
function ReportViewer({ content, editing = false, onChange }: ReportViewerProps) {
  return (
    <div className="flex border border-w-line rounded-[10px] bg-w-field min-h-[420px] max-h-[70vh] overflow-hidden lg:min-h-[560px]">
      {editing ? (
        <textarea
          className="flex-auto resize-none p-5 [font:inherit] [letter-spacing:inherit] text-[18px] leading-[1.6] text-w-ink bg-w-field border-0 lg:px-9 lg:py-8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-w-ink"
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label="보고서 내용"
        />
      ) : (
        <div className="flex-auto overflow-y-auto p-5 lg:px-9 lg:py-8">
          <h2 className="text-[25px] mb-4">보고서 내용</h2>
          <p className="text-[18px] leading-[1.6] whitespace-pre-wrap text-w-ink">{content}</p>
        </div>
      )}
    </div>
  )
}

export default ReportViewer
