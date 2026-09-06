import DataList, { DataRow } from '../ui/DataList'
import Badge from '../ui/Badge'
import { EmptyState } from '../ui/StateView'
import type { OperationReport } from '../../data/mock'

interface ReportListProps {
  reports: OperationReport[]
  /** `owner` shows the 공개/비공개 control; `enterprise` is read-only. */
  variant: 'owner' | 'enterprise'
  onOpen?: (report: OperationReport) => void
  onTogglePublish?: (report: OperationReport) => void
  onLoadMore?: () => void
  /** Fill the card body and pin the load-more row to the bottom. */
  fill?: boolean
}

/**
 * 운영보고서 목록.
 *
 * 기간이 행의 제목이고 위험도가 우측 값이다. 공개 상태는 배지가 아니라 버튼으로
 * 둔다 — DESIGN.md §4 는 배지를 상태 메타데이터로만 쓰고 동작 어피던스로 쓰지
 * 말라고 명시한다. 읽기 전용(기업) 화면에서는 같은 값을 배지로 보여준다.
 */
function ReportList({
  reports,
  variant,
  onOpen,
  onTogglePublish,
  onLoadMore,
  fill = false,
}: ReportListProps) {
  if (reports.length === 0) {
    return (
      <EmptyState
        title="아직 등록된 운영보고서가 없습니다"
        description="전월 재무제표를 입력하면 위험도 분석이 함께 생성됩니다."
      />
    )
  }

  return (
    <DataList onLoadMore={onLoadMore} fill={fill}>
      {reports.map((report) => (
        <DataRow key={report.id}>
          <button
            type="button"
            className="flex min-w-0 flex-auto items-center gap-3 rounded-ctl-sm py-1 text-left cursor-pointer bg-transparent border-0 transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => onOpen?.(report)}
          >
            <span className="num truncate font-semibold text-fg">{report.period}</span>
            {variant === 'enterprise' && (
              <Badge tone={report.published ? 'primary' : 'neutral'} size="xs">
                {report.published ? '공개' : '비공개'}
              </Badge>
            )}
          </button>

          <span className="flex flex-none items-center gap-3">
            <span className="num text-bodysm font-semibold text-body">
              위험도 {report.riskPercent}
            </span>
            {variant === 'owner' && (
              <button
                type="button"
                className={[
                  'h-8 min-w-[60px] rounded-ctl-sm px-2.5 text-[12px] font-semibold cursor-pointer',
                  'border transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  report.published
                    ? 'border-primary bg-weak text-weak-fg'
                    : 'border-line bg-canvas text-muted hover:text-body',
                ].join(' ')}
                aria-pressed={report.published}
                onClick={() => onTogglePublish?.(report)}
              >
                {report.published ? '공개' : '비공개'}
              </button>
            )}
          </span>
        </DataRow>
      ))}
    </DataList>
  )
}

export default ReportList
