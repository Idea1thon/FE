import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import DashboardGrid from '../../components/layout/DashboardGrid'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import StoreRankingCard from '../../components/domain/StoreRankingCard'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import { useBranches } from '../../hooks/useBranches'
import type { RiskLevel } from '../../components/ui/RiskText'
import type { StoreSummary } from '../../data/mock'

/** 평균 위험 점수를 화면의 안전/보통/위험 구간으로 옮긴다. */
function toLevel(score: number | null): RiskLevel {
  if (score === null) return 'safe'
  if (score >= 70) return 'danger'
  if (score >= 40) return 'warn'
  return 'safe'
}

/** 관리자(기업) 로그인 후 메인 대시보드. */
function EnterpriseDashboardPage() {
  const navigate = useNavigate()

  // 매출 랭킹과 집중 관리 목록은 정렬·필터만 다른 같은 엔드포인트다. (변경 없음)
  const ranking = useBranches({ sort: 'net_sales_desc', limit: 5 })
  const focus = useBranches({ sort: 'risk_desc', limit: 5 }, true)

  const openStoreReports = (store: StoreSummary) =>
    navigate(`/enterprise/stores/${store.id}/reports`)

  return (
    <PageContainer>
      <PageHeading
        title="가맹점 현황"
        subtitle="위험도가 높은 점포와 매출 상위 점포를 먼저 확인하세요."
      />

      <DashboardGrid
        stretch
        left={
          <>
            <RiskSummaryCard
              percent={focus.averageRisk === null ? '—' : `${focus.averageRisk}%`}
              level={toLevel(focus.averageRisk)}
              loading={focus.loading}
            />
            <StoreRankingCard
              title="집중 관리 필요 점포"
              description="최신 보고서의 위험도가 높은 순서입니다."
              stores={focus.stores}
              loading={focus.loading}
              error={focus.error}
              onRetry={focus.reload}
              onSelect={openStoreReports}
              onLoadMore={() => navigate('/enterprise/focus-stores')}
              emptyTitle="집중 관리가 필요한 점포가 없습니다"
              emptyDescription="분석된 보고서가 쌓이면 위험도 순으로 정리해 보여줍니다."
              fill
            />
          </>
        }
        right={
          <>
            <StoreSearchCard
              onSearch={(filters) => navigate('/enterprise/location-analysis', { state: filters })}
            />
            <StoreRankingCard
              title="매출 TOP 점포"
              description="최신 보고서의 순매출 기준입니다."
              stores={ranking.stores}
              loading={ranking.loading}
              error={ranking.error}
              onRetry={ranking.reload}
              onSelect={openStoreReports}
              onLoadMore={() => navigate('/enterprise/ranking')}
              emptyTitle="아직 집계할 매출이 없습니다"
              emptyDescription="점포가 운영보고서를 제출하면 순위가 만들어집니다."
              ranked
              fill
            />
          </>
        }
      />
    </PageContainer>
  )
}

export default EnterpriseDashboardPage
