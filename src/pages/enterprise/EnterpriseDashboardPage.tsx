import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import DashboardGrid from '../../components/layout/DashboardGrid'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import StoreRankingCard from '../../components/domain/StoreRankingCard'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import { rankingStores, focusStores } from '../../data/mock'
import type { StoreSummary } from '../../data/mock'

/** 관리자(기업) 로그인 후 메인 대시보드. */
function EnterpriseDashboardPage() {
  const navigate = useNavigate()

  const openStoreReports = (store: StoreSummary) =>
    navigate(`/enterprise/stores/${store.id}/reports`)

  return (
    <PageContainer>
      <DashboardGrid
        left={
          <>
            <StoreSearchCard onSearch={() => navigate('/enterprise/location-analysis')} />
            <StoreRankingCard
              title="매출 TOP 점포 랭킹"
              stores={rankingStores.slice(0, 5)}
              onSelect={openStoreReports}
              onLoadMore={() => navigate('/enterprise/ranking')}
            />
          </>
        }
        right={
          <RiskSummaryCard percent="OO%">
            <StoreRankingCard
              title="집중 관리 필요 점포"
              stores={focusStores.slice(0, 5)}
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
