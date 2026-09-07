import DataList, { DataRow } from '../ui/DataList'
import Badge from '../ui/Badge'
import { EmptyState } from '../ui/StateView'
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

/** 점수가 있으면 점수를, 없으면 왜 없는지를 보여준다 — 결측을 0으로 만들지 않는다. */
function riskLabel(report: ReportListItem) {
  if (report.risk_score !== null) return `${report.risk_score.toFixed(1)}점`
  if (report.status === 'ANALYZING') return '분석 중'
  if (report.status === 'FAILED') return '분석 실패'
  return '미분석'
}

function riskTone(report: ReportListItem): 'safe' | 'warn' | 'danger' | 'primary' | 'neutral' {
  if (report.risk_level === 'DANGER') return 'danger'
  if (report.risk_level === 'CAUTION') return 'warn'
  if (report.risk_level === 'NORMAL') return 'safe'
  if (report.status === 'ANALYZING') return 'primary'
  if (report.status === 'FAILED') return 'danger'
  return 'neutral'
}

/** Backend-backed report list shared by the owner and HQ report screens. */
function ApiReportList({ reports, onOpen, onLoadMore, fill = false }: ApiReportListProps) {
  if (reports.length === 0) {
    return (
      <EmptyState
        title="저장된 운영보고서가 없습니다"
        description="전월 재무제표를 입력하면 위험도 분석이 함께 생성됩니다."
      />
    )
  }

  return (
    <DataList onLoadMore={onLoadMore} fill={fill}>
      {reports.map((report) => (
        <DataRow key={report.report_id} onClick={() => onOpen?.(report)}>
          <span className="num min-w-0 flex-auto truncate font-semibold text-fg">
            {periodLabel(report.report_month)}
          </span>
          <Badge tone={riskTone(report)} size="sm">
            <span className="num">{riskLabel(report)}</span>
          </Badge>
        </DataRow>
      ))}
    </DataList>
  )
}

export default ApiReportList
