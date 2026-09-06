import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
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

  // 매출 랭킹과 집중 관리 목록은 정렬·필터만 다른 같은 엔드포인트다.
  const ranking = useBranches({ sort: 'net_sales_desc', limit: 5 })
  const focus = useBranches({ sort: 'risk_desc', limit: 5 }, true)

  const openStoreReports = (store: StoreSummary) =>
    navigate(`/enterprise/stores/${store.id}/reports`)

  return (
    <PageContainer>
      <DashboardGrid
        left={
          <>
            <StoreSearchCard
              onSearch={(filters) =>
                navigate('/enterprise/location-analysis', { state: filters })
              }
            />
            <StoreRankingCard
              title="매출 TOP 점포 랭킹"
              stores={ranking.stores}
              loading={ranking.loading}
              error={ranking.error}
              onSelect={openStoreReports}
              onLoadMore={() => navigate('/enterprise/ranking')}
            />
          </>
        }
        right={
          <RiskSummaryCard
            percent={focus.averageRisk === null ? '—' : `${focus.averageRisk}%`}
            level={toLevel(focus.averageRisk)}
          >
            <StoreRankingCard
              title="집중 관리 필요 점포"
              stores={focus.stores}
              loading={focus.loading}
              error={focus.error}
              onSelect={openStoreReports}
              onLoadMore={() => navigate('/enterprise/focus-stores')}
            />
          </RiskSummaryCard>
        }
      />
    </PageContainer>
  )
}

export default EnterpriseDashboardPage
