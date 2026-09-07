import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import ApiReportList from '../../components/domain/ApiReportList'
import { SkeletonRows } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/StateView'
import { ApiError, fetchMyReports } from '../../api'
import type { ReportListItem } from '../../api'
import { SORT_OPTIONS } from '../../data/mock'

/** 운영보고서 목록 (사업자 로그인). */
function OwnerReportsPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchMyReports(sort === 'recent' ? 'month_desc' : 'month_asc')
      .then((response) => {
        if (!active) return
        setReports(response.items)
        setError(null)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof ApiError ? cause.message : '운영보고서를 불러오지 못했습니다.',
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [sort, nonce])

  return (
    <PageContainer>
      <PageHeading
        title="운영보고서"
        backTo="/owner"
        meta={!loading && !error ? <span className="num">{reports.length}건</span> : undefined}
        subtitle="월별 재무제표와 위험도 분석 결과입니다."
        actions={
          <>
            <Select
              variant="inline"
              ariaLabel="정렬 기준"
              options={SORT_OPTIONS}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              disabled={loading}
            />
            <Button size="md" onClick={() => navigate('/owner/reports/new')}>
              전월 보고서 작성
            </Button>
          </>
        }
      />

      <Card flush>
        {error ? (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        ) : loading ? (
          <SkeletonRows rows={6} label="운영보고서를 불러오는 중" />
        ) : (
          <ApiReportList
            reports={reports}
            onOpen={(report) => navigate(`/owner/reports/${report.report_id}`)}
          />
        )}
      </Card>
    </PageContainer>
  )
}

export default OwnerReportsPage
