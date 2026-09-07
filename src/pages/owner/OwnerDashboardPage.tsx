import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
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

/** 사업자(사용자) 로그인 후 메인 대시보드. */
function OwnerDashboardPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState('recent')
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    // 정렬 변경으로 다시 조회할 때의 `setLoading(true)` 는 아래 핸들러에서 처리한다.
    fetchMyReports(sort === 'recent' ? 'month_desc' : 'month_asc', 5)
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
  }, [sort])

  // 가장 최근에 점수가 산출된 보고서를 대표 값으로 쓴다. 없으면 미확인으로 둔다.
  const latestScore = reports.find((report) => report.risk_score !== null)?.risk_score ?? null
  const recommendationReport =
    reports.find((report) => report.status === 'COMPLETED' && report.risk_level !== null) ?? null

  const changeSort = (value: string) => {
    setLoading(true)
    setSort(value)
  }

  return (
    <PageContainer>
      <PageHeading title="내 점포 현황" subtitle="이번 달 위험도와 보고서를 확인하세요." />

      <DashboardGrid
        stretch
        left={
          <>
            <RiskSummaryCard
              percent={latestScore === null ? '—' : `${latestScore.toFixed(1)}점`}
              level={toRiskLevel(latestScore)}
              loading={loading}
            />
            <OperationReportCard
              fill
              apiReports={reports}
              apiError={error}
              onCreate={() => navigate('/owner/reports/new')}
              onApiOpen={(report) => navigate(`/owner/reports/${report.report_id}`)}
              onSortChange={changeSort}
              onLoadMore={() => navigate('/owner/reports')}
            />
          </>
        }
        right={
          <>
            <StoreSearchCard onSearch={() => navigate('/owner/location-analysis')} />
            <SolutionCards
              fill
              recommendationReport={recommendationReport}
              onLoadMore={() => navigate('/finance/all')}
            />
          </>
        }
      />
    </PageContainer>
  )
}

export default OwnerDashboardPage
