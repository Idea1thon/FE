import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import PublishToggle from '../../components/ui/PublishToggle'
import ReportViewer from '../../components/domain/ReportViewer'
import ReportDetailBody from '../../components/domain/ReportDetailBody'
import ConfirmDialog from '../../components/modals/ConfirmDialog'
import { SkeletonRows } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/StateView'
import * as api from '../../api'
import { currentStore, getReport } from '../../data/mock'

/**
 * 운영보고서 상세.
 *
 * 숫자 ID 는 실제 백엔드 저장 결과, 기존 문자열 ID 는 와이어프레임 fixture 다
 * (dev 의 분기를 그대로 유지).
 */
function OwnerReportDetailPage() {
  const { reportId } = useParams()
  const numericReportId = Number(reportId)

  if (Number.isInteger(numericReportId) && numericReportId > 0) {
    return <SubmittedReportDetail reportId={numericReportId} />
  }

  return <LegacyOwnerReportDetail key={reportId} reportId={reportId} />
}

function SubmittedReportDetail({ reportId }: { reportId: number }) {
  const [report, setReport] = useState<api.ReportDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

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
  }, [reportId, nonce])

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        backTo="/owner/reports"
        eyebrow={report?.branch.name}
        title={report ? `${report.report_month} 운영보고서` : '운영보고서'}
        subtitle={report ? `보고서 #${report.report_id}` : '저장된 보고서를 불러오는 중'}
      />

      {error ? (
        <Card flush>
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        </Card>
      ) : !report ? (
        <Card flush>
          <SkeletonRows rows={4} label="저장된 보고서를 불러오는 중" />
        </Card>
      ) : (
        <ReportDetailBody
          report={report}
          analyzingDescription="보고서는 저장되었습니다. 분석이 끝나면 위험 사이렌 수신 대상에 따라 앱 내 알림이 생성됩니다."
        />
      )}
    </PageContainer>
  )
}

/** 와이어프레임 fixture 기반 상세 — 수정 / 삭제 / 공개 설정. */
function LegacyOwnerReportDetail({ reportId }: { reportId: string | undefined }) {
  const navigate = useNavigate()
  const report = getReport(reportId)

  const [published, setPublished] = useState(report.published)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(report.content)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <PageContainer width="narrow">
      <PageHeading
        size="lg"
        backTo="/owner/reports"
        eyebrow={`${currentStore.region} · ${currentStore.name}`}
        title={report.period}
        subtitle={`위험도 ${report.riskPercent}`}
        actions={
          <>
            <PublishToggle published={published} onChange={setPublished} />
            <Button
              variant={editing ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setEditing((value) => !value)}
            >
              {editing ? '저장' : '수정'}
            </Button>
            <Button variant="ghost" size="md" onClick={() => setConfirmOpen(true)}>
              삭제
            </Button>
          </>
        }
      />

      <ReportViewer content={content} editing={editing} onChange={setContent} />

      <ConfirmDialog
        open={confirmOpen}
        ariaLabel="보고서 삭제"
        title="보고서를 삭제할까요?"
        lines={[
          `${report.period} 보고서와 함께 계산된 위험도 분석도 사라집니다.`,
          '삭제하면 되돌릴 수 없습니다.',
        ]}
        confirmLabel="삭제"
        destructive
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
