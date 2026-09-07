import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import ReportDetailBody from '../../components/domain/ReportDetailBody'
import { SkeletonRows } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/StateView'
import * as api from '../../api'

/**
 * 운영보고서 상세 (기업 로그인 — 읽기 전용).
 *
 * ANALYZING 이면 1.5초 간격으로 다시 읽어 상태가 바뀌는 것을 따라간다 (dev 로직 유지).
 */
function ReportDetailPage() {
  const { storeId, reportId } = useParams()
  const numericReportId = Number(reportId)
  const numericStoreId = Number(storeId)
  const [report, setReport] = useState<api.ReportDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

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
  }, [numericReportId, nonce])

  return (
    <PageContainer>
      <PageHeading
        size="lg"
        backTo={`/enterprise/stores/${numericStoreId}/reports`}
        eyebrow={report?.branch.name}
        title={report ? `${report.report_month} 운영보고서` : '운영보고서'}
        meta={
          <Badge tone="neutral" size="sm">
            읽기 전용
          </Badge>
        }
        subtitle={report ? `보고서 #${report.report_id}` : '보고서를 불러오는 중'}
      />

      {error ? (
        <Card flush>
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        </Card>
      ) : !report ? (
        <Card flush>
          <SkeletonRows rows={4} label="보고서를 불러오는 중" />
        </Card>
      ) : (
        <ReportDetailBody
          report={report}
          analyzingDescription="분석이 끝나면 위험도와 판정이 이 화면에 표시됩니다."
        />
      )}
    </PageContainer>
  )
}

export default ReportDetailPage
