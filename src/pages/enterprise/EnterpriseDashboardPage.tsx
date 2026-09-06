import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import DashboardGrid from '../../components/layout/DashboardGrid'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import StoreRankingCard from '../../components/domain/StoreRankingCard'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import Button from '../../components/ui/Button'
import RiskText from '../../components/ui/RiskText'
import { useBranches } from '../../hooks/useBranches'
import type { RiskLevel } from '../../components/ui/RiskText'
import type { StoreSummary } from '../../data/mock'
import { syntheticRiskSirenEvent } from '../../data/mock'

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
  const ranking = useBranches({ sort: 'net_sales_desc', limit: 100 })
  const focus = useBranches({ sort: 'risk_desc', limit: 100 }, true)

  const openStoreReports = (store: StoreSummary) =>
    navigate(`/enterprise/stores/${store.id}/reports`)

  return (
    <PageContainer>
      <section className="mb-6 flex flex-col gap-5 rounded-[14px] border-2 border-risk-danger bg-w-panel px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-7">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-risk-danger px-3 py-1 text-[13px] font-medium text-white">
              위험 사이렌 발동
            </span>
            <span className="text-[14px] text-w-placeholder">합성 데이터 이벤트 검증</span>
          </div>
          <h2 className="mt-3 text-[22px] font-medium lg:text-[28px]">
            {syntheticRiskSirenEvent.brandName}
          </h2>
          <p className="mt-1 text-[15px] text-w-placeholder">
            위험도 <RiskText level="danger">{syntheticRiskSirenEvent.score.toFixed(1)}점</RiskText> ·{' '}
            {syntheticRiskSirenEvent.recipients.join(' · ')} 알림 대상
          </p>
        </div>
        <Button onClick={() => navigate('/enterprise/risk-siren')}>이벤트 확인하기</Button>
      </section>
      <DashboardGrid
        stretch
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
              fill
            />
          </>
        }
        right={
          <RiskSummaryCard
            percent={focus.averageRisk === null ? '—' : `${focus.averageRisk}%`}
            level={toLevel(focus.averageRisk)}
            fill
          >
            <StoreRankingCard
              title="집중 관리 필요 점포"
              stores={focus.stores}
              loading={focus.loading}
              error={focus.error}
              onSelect={openStoreReports}
              onLoadMore={() => navigate('/enterprise/focus-stores')}
              fill
            />
          </RiskSummaryCard>
        }
      />
    </PageContainer>
  )
}

export default EnterpriseDashboardPage
