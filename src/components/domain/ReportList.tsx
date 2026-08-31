import DataList, { DataRow } from '../ui/DataList'
import type { OperationReport } from '../../data/mock'

interface ReportListProps {
  reports: OperationReport[]
  /** `owner` shows the 공개/비공개 toggle; `enterprise` is read-only. */
  variant: 'owner' | 'enterprise'
  onOpen?: (report: OperationReport) => void
  onTogglePublish?: (report: OperationReport) => void
  onLoadMore?: () => void
}

/** 운영보고서 목록 — 기간 클릭 시 보고서 오픈. */
function ReportList({
  reports,
  variant,
  onOpen,
  onTogglePublish,
  onLoadMore,
}: ReportListProps) {
  return (
    <DataList onLoadMore={onLoadMore}>
      {reports.map((report) => (
        <DataRow key={report.id}>
          {variant === 'owner' && (
            <button
              type="button"
              className="flex-none min-w-[72px] px-2.5 py-1.5 text-[16px] text-w-ink bg-transparent border border-w-line rounded-md cursor-pointer hover:bg-w-panel"
              onClick={() => onTogglePublish?.(report)}
            >
              {report.published ? '공개' : '비공개'}
            </button>
          )}
          <button
            type="button"
            className="flex-auto text-left py-1 text-[16px] lg:text-[20px] text-w-ink bg-transparent border-0 cursor-pointer hover:underline"
            onClick={() => onOpen?.(report)}
          >
            {report.period}
          </button>
          <span className="flex-none text-[16px] lg:text-[20px]">위험도 {report.riskPercent}</span>
        </DataRow>
      ))}
    </DataList>
  )
}

export default ReportList
