import { useState } from 'react'
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
 * The four outcomes — loading, failed, empty, populated — are all explicit, as
 * DESIGN.md §1 asks. Loading uses row-shaped skeletons so the card does not
 * change height when the data lands.
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
      ) : stores.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <StoreList
          stores={stores}
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
