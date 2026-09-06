import DataList, { DataRow } from '../ui/DataList'
import type { ReportListItem } from '../../api'

interface ApiReportListProps {
  reports: ReportListItem[]
  onOpen?: (report: ReportListItem) => void
  onLoadMore?: () => void
  fill?: boolean
}

function periodLabel(value: string) {
  const [year, month] = value.split('-')
  return year && month ? `${year}년 ${month}월` : value
}

function riskLabel(report: ReportListItem) {
  if (report.risk_score !== null) return `${report.risk_score.toFixed(1)}점`
  if (report.status === 'ANALYZING') return '분석 중'
  if (report.status === 'FAILED') return '분석 실패'
  return '미분석'
}

/** Backend-backed report list shared by the owner and HQ report screens. */
function ApiReportList({ reports, onOpen, onLoadMore, fill = false }: ApiReportListProps) {
  return (
    <DataList onLoadMore={onLoadMore} fill={fill}>
      {reports.length === 0 ? (
        <p className="m-0 border border-w-line bg-w-row px-6 py-8 text-center text-[16px] text-w-placeholder">
          저장된 운영보고서가 없습니다.
        </p>
      ) : (
        reports.map((report) => (
          <DataRow key={report.report_id} onClick={() => onOpen?.(report)}>
            <span className="flex-auto text-[16px] lg:text-[20px]">
              {periodLabel(report.report_month)}
            </span>
            <span className="flex-none text-right text-[15px] lg:text-[18px]">
              위험도 {riskLabel(report)}
            </span>
          </DataRow>
        ))
      )}
    </DataList>
  )
}

export default ApiReportList
