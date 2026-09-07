import { useMemo, useState } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import StoreList from './StoreList'
import { SkeletonRows } from '../ui/Skeleton'
import { EmptyState, ErrorState } from '../ui/StateView'
import { REGION_OPTIONS } from '../../data/mock'
import type { StoreSummary } from '../../data/mock'

interface StoreRankingCardProps {
  title: string
  /** One line saying what the trailing value means. */
  description?: string
  stores: StoreSummary[]
  /** 첫 로딩 중이면 스켈레톤을 보여준다. */
  loading?: boolean
  /** 호출 실패 메시지. 비어 있으면 정상. */
  error?: string | null
  /** 실패 시 재시도. */
  onRetry?: () => void
  onSelect?: (store: StoreSummary) => void
  onLoadMore?: () => void
  /** Stretch the card to fill a stretched dashboard column. */
  fill?: boolean
  ranked?: boolean
  /** Empty-state copy for this particular list. */
  emptyTitle?: string
  emptyDescription?: string
}

/**
 * Dashboard card: 매출 TOP 점포 랭킹 / 집중 관리 필요 점포.
 *
 * 지역 드롭다운은 서버가 준 목록을 화면에서 걸러낸다 (dev 동작 유지) — 카드에는
 * 상위 5개만 싣는다. 네 결과(로딩·실패·비어 있음·목록)를 모두 명시한다.
 */
function StoreRankingCard({
  title,
  description,
  stores,
  loading = false,
  error = null,
  onRetry,
  onSelect,
  onLoadMore,
  fill = false,
  ranked = false,
  emptyTitle = '표시할 점포가 없습니다',
  emptyDescription,
}: StoreRankingCardProps) {
  const [region, setRegion] = useState(REGION_OPTIONS[0].value)
  const visibleStores = useMemo(() => {
    const filtered = stores.filter((store) => {
      if (region === 'nation') return true
      if (region === 'seoul') return store.region.startsWith('서울')
      if (region === 'gyeonggi') return store.region.startsWith('경기')
      if (region === 'incheon') return store.region.startsWith('인천')
      return true
    })
    return filtered.slice(0, 5)
  }, [region, stores])

  // 전국에는 점포가 있는데 고른 지역만 비어 있는 경우를 구분해 알려 준다.
  const filteredOut = visibleStores.length === 0 && stores.length > 0

  return (
    <Card
      title={title}
      description={description}
      flush
      fill={fill}
      className={fill ? 'flex-1' : undefined}
      action={
        <Select
          variant="inline"
          ariaLabel={`${title} 지역 선택`}
          options={REGION_OPTIONS}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      }
    >
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : loading ? (
        <SkeletonRows rows={5} label={`${title} 불러오는 중`} />
      ) : visibleStores.length === 0 ? (
        <EmptyState
          title={filteredOut ? '이 지역에는 해당 점포가 없습니다' : emptyTitle}
          description={filteredOut ? '지역을 전국으로 바꿔 보세요.' : emptyDescription}
        />
      ) : (
        <StoreList
          stores={visibleStores}
          onSelect={onSelect}
          onLoadMore={onLoadMore}
          fill={fill}
          ranked={ranked}
        />
      )}
    </Card>
  )
}

export default StoreRankingCard
