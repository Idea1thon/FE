import { useState } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import StoreList from './StoreList'
import { REGION_OPTIONS } from '../../data/mock'
import type { StoreSummary } from '../../data/mock'

interface StoreRankingCardProps {
  title: string
  stores: StoreSummary[]
  /** 첫 로딩 중이면 목록 대신 안내를 보여준다. */
  loading?: boolean
  /** 호출 실패 메시지. 비어 있으면 정상. */
  error?: string | null
  onSelect?: (store: StoreSummary) => void
  onLoadMore?: () => void
}

/** Dashboard card: 매출 TOP 점포 랭킹 / 집중 관리 필요 점포 — region dropdown + store list. */
function StoreRankingCard({
  title,
  stores,
  loading = false,
  error = null,
  onSelect,
  onLoadMore,
}: StoreRankingCardProps) {
  const [region, setRegion] = useState(REGION_OPTIONS[0].value)

  return (
    <Card
      title={title}
      flush
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
        <p className="m-0 px-4 py-6 text-[16px] text-w-ink lg:px-6 lg:text-[20px]">{error}</p>
      ) : loading ? (
        <p className="m-0 px-4 py-6 text-[16px] text-w-placeholder lg:px-6 lg:text-[20px]">
          불러오는 중…
        </p>
      ) : stores.length === 0 ? (
        <p className="m-0 px-4 py-6 text-[16px] text-w-placeholder lg:px-6 lg:text-[20px]">
          표시할 점포가 없습니다.
        </p>
      ) : (
        <StoreList stores={stores} onSelect={onSelect} onLoadMore={onLoadMore} />
      )}
    </Card>
  )
}

export default StoreRankingCard
