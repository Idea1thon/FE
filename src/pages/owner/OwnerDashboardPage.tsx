import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import DashboardGrid from '../../components/layout/DashboardGrid'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import OperationReportCard from '../../components/domain/OperationReportCard'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import SolutionCards from '../../components/domain/SolutionCards'
import { ApiError, fetchMyReports } from '../../api'
import type { ReportListItem } from '../../api'

function toRiskLevel(score: number | null) {
  if (score === null) return 'safe' as const
  if (score >= 70) return 'danger' as const
  if (score >= 40) return 'warn' as const
  return 'safe' as const
}

function OwnerDashboardPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState('recent')
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchMyReports(sort === 'recent' ? 'month_desc' : 'month_asc', 5)
      .then((response) => {
        if (!active) return
        setReports(response.items)
        setError(null)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof ApiError ? cause.message : '운영보고서를 불러오지 못했습니다.')
      })
    return () => {
      active = false
    }
  }, [sort])

  const latestScore = reports.find((report) => report.risk_score !== null)?.risk_score ?? null

  return (
    <PageContainer>
      <DashboardGrid
        stretch
        left={
          <>
            <RiskSummaryCard
              percent={latestScore === null ? '—' : `${latestScore.toFixed(1)}점`}
              level={toRiskLevel(latestScore)}
            />
            <OperationReportCard
              fill
              apiReports={reports}
              apiError={error}
              onCreate={() => navigate('/owner/reports/new')}
              onApiOpen={(report) => navigate(`/owner/reports/${report.report_id}`)}
              onSortChange={setSort}
              onLoadMore={() => navigate('/owner/reports')}
            />
          </>
        }
        right={
          <>
            <StoreSearchCard onSearch={() => navigate('/owner/location-analysis')} />
            <SolutionCards fill />
          </>
        }
      />
    </PageContainer>
  )
}

export default OwnerDashboardPage
