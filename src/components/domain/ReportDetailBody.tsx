import Card from '../ui/Card'
import Badge from '../ui/Badge'
import RiskText from '../ui/RiskText'
import { EmptyState, WorkingState } from '../ui/StateView'
import type { ReportDetail, RiskLevel as ApiRiskLevel } from '../../api'
import type { RiskLevel } from '../ui/RiskText'

interface ReportDetailBodyProps {
  report: ReportDetail
  /** ANALYZING 상태에서 보여줄 설명. 화면마다 다음 행동이 다르다. */
  analyzingDescription: string
}

const STATUS_LABEL: Record<ReportDetail['status'], string> = {
  DRAFT: '작성 중',
  ANALYZING: '분석 중',
  COMPLETED: '분석 완료',
  FAILED: '분석 실패',
}

const STATUS_TONE: Record<ReportDetail['status'], 'neutral' | 'primary' | 'safe' | 'danger'> = {
  DRAFT: 'neutral',
  ANALYZING: 'primary',
  COMPLETED: 'safe',
  FAILED: 'danger',
}

function toLocalLevel(level: ApiRiskLevel | null | undefined): RiskLevel {
  if (level === 'DANGER') return 'danger'
  if (level === 'CAUTION') return 'warn'
  return 'safe'
}

const RISK_LABEL: Record<ApiRiskLevel, string> = {
  NORMAL: '정상',
  CAUTION: '주의',
  DANGER: '위험',
}

/**
 * 보고서 상세 본문 — 분석 상태 + 입력 금액.
 *
 * 기업/사업자 상세 화면이 같은 응답을 같은 방식으로 읽으므로 한곳에 둔다.
 *
 * 부분 분석(`calculation_status === 'partial'`)을 배지로 드러낸다. 백엔드가 시장·
 * 가맹점 층 중 하나라도 불완전하면 점수·등급을 의도적으로 null 로 주므로, 그걸
 * "정상"으로 보이게 하면 안 된다.
 */
function ReportDetailBody({ report, analyzingDescription }: ReportDetailBodyProps) {
  const analysis = report.analysis
  const localLevel = toLocalLevel(analysis?.risk_level)
  const partial = analysis?.calculation_status === 'partial'

  return (
    <div className="flex flex-col gap-6">
      <Card
        title="분석 상태"
        action={
          <span className="flex items-center gap-2">
            {partial && <Badge tone="warn" size="sm">부분 분석</Badge>}
            <Badge tone={STATUS_TONE[report.status]} size="sm">
              {STATUS_LABEL[report.status]}
            </Badge>
          </span>
        }
      >
        {report.status === 'ANALYZING' && (
          <WorkingState title="위험 사이렌 분석을 기다리는 중입니다" description={analyzingDescription} />
        )}

        {report.status === 'FAILED' && (
          <div role="alert" className="rounded-ctl-md bg-danger/5 p-4">
            <p className="text-body font-semibold text-danger">분석에 실패했습니다</p>
            {report.analysis_error && (
              <p className="mt-1 text-bodysm text-body">{report.analysis_error}</p>
            )}
          </div>
        )}

        {report.status === 'COMPLETED' && analysis && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-8">
              <div>
                <span className="block text-bodysm text-muted">위험도</span>
                <RiskText level={localLevel} className="num mt-1 block text-h1">
                  {analysis.risk_score === null ? '—' : analysis.risk_score.toFixed(1)}
                </RiskText>
              </div>
              <div>
                <span className="block text-bodysm text-muted">판정</span>
                <RiskText level={localLevel} className="mt-1 block text-h4">
                  {analysis.risk_level ? RISK_LABEL[analysis.risk_level] : '판정 보류'}
                </RiskText>
              </div>
            </div>
            {partial && (
              <p className="rounded-ctl-md bg-surface p-4 text-bodysm text-muted">
                일부 데이터가 완전하지 않아 종합 점수와 등급을 확정하지 않았습니다. 값이 채워지면
                다시 계산됩니다.
              </p>
            )}
          </div>
        )}

        {report.status === 'DRAFT' && (
          <EmptyState
            title="아직 분석이 시작되지 않았습니다"
            description="입력을 마치고 제출하면 위험도 분석이 실행됩니다."
          />
        )}
      </Card>

      <Card title="입력한 금액" description="단위: 원">
        {report.inputs.length === 0 ? (
          <EmptyState title="입력된 금액이 없습니다" />
        ) : (
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {report.inputs.map((input) => (
              <div
                key={input.field_code}
                className="flex items-center justify-between gap-3 border-b border-line py-3"
              >
                <span className="min-w-0 text-bodysm text-muted">{input.name}</span>
                <strong className="num flex-none text-bodysm font-semibold text-fg">
                  {input.amount.toLocaleString()}
                </strong>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReportDetailBody
