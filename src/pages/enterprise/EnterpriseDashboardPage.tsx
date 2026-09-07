import { useNavigate } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import PageHeading from '../../components/layout/PageHeading'
import DashboardGrid from '../../components/layout/DashboardGrid'
import StoreSearchCard from '../../components/domain/StoreSearchCard'
import StoreRankingCard from '../../components/domain/StoreRankingCard'
import RiskSummaryCard from '../../components/domain/RiskSummaryCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
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
  // 지역 필터는 카드 안에서 걸러내므로 넉넉히 받아 온다.
  const ranking = useBranches({ sort: 'net_sales_desc', limit: 100 })
  const focus = useBranches({ sort: 'risk_desc', limit: 100 }, true)

  const openStoreReports = (store: StoreSummary) =>
    navigate(`/enterprise/stores/${store.id}/reports`)

  return (
    <PageContainer>
      <PageHeading
        title="가맹점 현황"
        subtitle="위험도가 높은 점포와 매출 상위 점포를 먼저 확인하세요."
      />

      {/* 위험 사이렌 발동 알림. 위험 톤은 danger 로 통일하고, 두꺼운 테두리 대신
          좌측 막대 + 배지로 강조한다 — 섀도·굵은 테두리를 쓰지 않는 규칙을 지킨다. */}
      <section
        aria-labelledby="risk-siren-banner-title"
        className="mb-6 flex flex-col gap-4 overflow-hidden rounded-panel border border-line bg-canvas lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex min-w-0 gap-4 p-5 lg:p-6">
          <span className="w-1 flex-none self-stretch rounded-full bg-danger" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="danger" variant="fill" size="sm">
                위험 사이렌 발동
              </Badge>
              <span className="text-bodysm text-muted">합성 데이터 이벤트 검증</span>
            </div>
            <h2 id="risk-siren-banner-title" className="mt-2 text-h4 text-fg">
              {syntheticRiskSirenEvent.brandName}
            </h2>
            <p className="mt-1 text-bodysm text-muted">
              위험도{' '}
              <span className="num font-semibold text-risk-danger">
                {syntheticRiskSirenEvent.score.toFixed(1)}점
              </span>{' '}
              · {syntheticRiskSirenEvent.recipients.join(' · ')} 알림 대상
            </p>
          </div>
        </div>
        <div className="flex-none px-5 pb-5 lg:px-6 lg:pb-0">
          <Button size="md" onClick={() => navigate('/enterprise/risk-siren')}>
            이벤트 확인하기
          </Button>
        </div>
      </section>

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
