import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import Select from '../../components/ui/Select'
import ApiReportList from '../../components/domain/ApiReportList'
import { ApiError, fetchMyReports } from '../../api'
import type { ReportListItem } from '../../api'
import { SORT_OPTIONS } from '../../data/mock'

function OwnerReportsPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        if (active) setError(cause instanceof ApiError ? cause.message : '운영보고서를 불러오지 못했습니다.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [sort])

  return (
    <PageContainer>
      <PageHeading
        title="운영보고서"
        actions={
          <Select
            variant="inline"
            ariaLabel="정렬 기준"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={loading}
          />
        }
      />

      {error && (
        <p role="alert" className="mb-5 border border-risk-danger bg-w-panel px-4 py-3 text-[15px] text-risk-danger">
          {error}
        </p>
      )}
      {loading ? (
        <p className="border border-w-line bg-w-panel px-6 py-8 text-center text-[16px] text-w-placeholder">
          운영보고서를 불러오는 중입니다…
        </p>
      ) : (
        <ApiReportList
          reports={reports}
          onOpen={(report) => navigate(`/owner/reports/${report.report_id}`)}
        />
      )}
    </PageContainer>
  )
}

export default OwnerReportsPage
