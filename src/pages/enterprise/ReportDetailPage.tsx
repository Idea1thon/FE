import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import RiskText from '../../components/ui/RiskText'
import * as api from '../../api'

function ReportDetailPage() {
  const { storeId, reportId } = useParams()
  const navigate = useNavigate()
  const numericReportId = Number(reportId)
  const numericStoreId = Number(storeId)
  const [report, setReport] = useState<api.ReportDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isInteger(numericReportId) || numericReportId < 1) {
      setError('올바르지 않은 보고서입니다.')
      return
    }

    let active = true
    let timer: number | undefined
    const readReport = async () => {
      try {
        const next = await api.fetchReport(numericReportId)
        if (!active) return
        setReport(next)
        setError(null)
        if (next.status === 'ANALYZING') timer = window.setTimeout(readReport, 1500)
      } catch (cause) {
        if (active) {
          setError(cause instanceof api.ApiError ? cause.message : '보고서를 불러오지 못했습니다.')
        }
      }
    }
    void readReport()

    return () => {
      active = false
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [numericReportId])

  const riskLevel = report?.analysis?.risk_level
  const localRiskLevel =
    riskLevel === 'DANGER' ? 'danger' : riskLevel === 'CAUTION' ? 'warn' : 'safe'

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        title={report ? `${report.branch.name} 운영보고서` : '운영보고서'}
        meta={report?.report_month}
        subtitle={report ? `보고서 #${report.report_id}` : '보고서를 불러오는 중'}
        actions={
          <Button onClick={() => navigate(`/enterprise/stores/${numericStoreId}/reports`)}>
            목록으로 돌아가기
          </Button>
        }
      />

      {error && (
        <p role="alert" className="mb-5 border border-risk-danger bg-w-panel px-4 py-3 text-[15px] text-risk-danger">
          {error}
        </p>
      )}
      {!report && !error && (
        <Card title="보고서 조회">
          <p className="py-8 text-center text-[16px] text-w-placeholder">보고서를 불러오는 중입니다…</p>
        </Card>
      )}

      {report && (
        <div className="flex flex-col gap-6">
          <Card title="분석 상태" action={<span className="text-[14px] text-w-placeholder">{report.status}</span>}>
            {report.status === 'ANALYZING' && (
              <p className="py-4 text-[17px] text-w-ink">위험 사이렌 분석 결과를 기다리는 중입니다…</p>
            )}
            {report.status === 'FAILED' && (
              <p role="alert" className="py-4 text-[17px] text-risk-danger">
                {report.analysis_error ?? '분석에 실패했습니다.'}
              </p>
            )}
            {report.status === 'COMPLETED' && report.analysis && (
              <div className="flex flex-wrap items-end gap-8 py-2">
                <div>
                  <span className="block text-[14px] text-w-placeholder">위험도</span>
                  <RiskText level={localRiskLevel} className="mt-1 block text-[42px] leading-none">
                    {report.analysis.risk_score === null ? '—' : report.analysis.risk_score.toFixed(1)}
                  </RiskText>
                </div>
                <div>
                  <span className="block text-[14px] text-w-placeholder">판정</span>
                  <RiskText level={localRiskLevel} className="mt-1 block text-[22px]">
                    {report.analysis.risk_level ?? '부분 분석'}
                  </RiskText>
                </div>
              </div>
            )}
          </Card>

          <Card title="입력한 금액" action={<span className="text-[14px] text-w-placeholder">원 단위</span>}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {report.inputs.map((input) => (
                <div key={input.field_code} className="flex items-center justify-between gap-3 border-b border-w-line py-2">
                  <span className="text-[15px] text-w-placeholder">{input.name}</span>
                  <strong className="text-[16px] text-w-ink">{input.amount.toLocaleString()}원</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  )
}

export default ReportDetailPage
