import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PublishToggle from '../../components/ui/PublishToggle'
import ReportViewer from '../../components/domain/ReportViewer'
import ConfirmDialog from '../../components/modals/ConfirmDialog'
import RiskText from '../../components/ui/RiskText'
import * as api from '../../api'
import { currentStore, getReport } from '../../data/mock'

/** 운영보고서 상세. 숫자 ID는 실제 백엔드 저장 결과, 기존 문자열 ID는 와이어프레임 fixture다. */
function OwnerReportDetailPage() {
  const { reportId } = useParams()
  const numericReportId = Number(reportId)

  if (Number.isInteger(numericReportId) && numericReportId > 0) {
    return <SubmittedReportDetail reportId={numericReportId} />
  }

  return <LegacyOwnerReportDetail key={reportId} reportId={reportId} />
}

function SubmittedReportDetail({ reportId }: { reportId: number }) {
  const navigate = useNavigate()
  const [report, setReport] = useState<api.ReportDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let timer: number | undefined

    const readReport = async () => {
      try {
        const next = await api.fetchReport(reportId)
        if (!active) return
        setReport(next)
        setError(null)
        if (next.status === 'ANALYZING') {
          timer = window.setTimeout(readReport, 1500)
        }
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
  }, [reportId])

  const riskLevel = report?.analysis?.risk_level
  const localRiskLevel =
    riskLevel === 'DANGER' ? 'danger' : riskLevel === 'CAUTION' ? 'warn' : 'safe'

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        title={report ? `${report.branch.name} 운영보고서` : '운영보고서'}
        meta={report?.report_month}
        subtitle={report ? `보고서 #${report.report_id}` : '저장된 보고서를 불러오는 중'}
        actions={<Button onClick={() => navigate('/owner/reports')}>목록으로 돌아가기</Button>}
      />

      {error && (
        <p role="alert" className="mb-5 border border-risk-danger bg-w-panel px-4 py-3 text-[15px] text-risk-danger">
          {error}
        </p>
      )}

      {!report && !error && (
        <Card title="보고서 조회">
          <p className="py-8 text-center text-[16px] text-w-placeholder">저장된 보고서를 불러오는 중입니다…</p>
        </Card>
      )}

      {report && (
        <div className="flex flex-col gap-6">
          <Card title="분석 상태" action={<span className="text-[14px] text-w-placeholder">{report.status}</span>}>
            {report.status === 'ANALYZING' && (
              <p className="py-4 text-[17px] text-w-ink">
                운영보고서는 저장되었습니다. 위험 사이렌 분석과 앱 내 알림 생성을 기다리는 중입니다…
              </p>
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
                    {report.analysis.risk_level}
                  </RiskText>
                </div>
                <p className="text-[15px] text-w-placeholder">
                  분석이 완료되면 위험 사이렌 수신 대상에 따라 앱 내 알림이 생성됩니다.
                </p>
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

function LegacyOwnerReportDetail({ reportId }: { reportId: string | undefined }) {
  const navigate = useNavigate()
  const report = getReport(reportId)

  const [published, setPublished] = useState(report.published)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(report.content)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        title={`${currentStore.region} | ${currentStore.name} 운영보고서`}
        meta={report.period}
        subtitle={currentStore.manager}
        actions={
          <>
            <PublishToggle published={published} onChange={setPublished} />
            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <Button onClick={() => setEditing((value) => !value)}>
                {editing ? '보고서 저장' : '보고서 수정'}
              </Button>
              <Button onClick={() => setConfirmOpen(true)}>보고서 삭제</Button>
            </div>
          </>
        }
      />

      <ReportViewer content={content} editing={editing} onChange={setContent} />

      <ConfirmDialog
        open={confirmOpen}
        ariaLabel="보고서 삭제"
        lines={['보고서를 삭제하면 복구되지 않습니다.', '삭제하시겠습니까?']}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          navigate('/owner/reports')
        }}
      />
    </PageContainer>
  )
}

export default OwnerReportDetailPage
