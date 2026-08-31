import { useState } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import StoreList from './StoreList'
import { REGION_OPTIONS } from '../../data/mock'
import type { StoreSummary } from '../../data/mock'

interface StoreRankingCardProps {
  title: string
  stores: StoreSummary[]
  onSelect?: (store: StoreSummary) => void
  onLoadMore?: () => void
}

/** Dashboard card: 매출 TOP 점포 랭킹 / 집중 관리 필요 점포 — region dropdown + store list. */
function StoreRankingCard({ title, stores, onSelect, onLoadMore }: StoreRankingCardProps) {
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
      <StoreList stores={stores} onSelect={onSelect} onLoadMore={onLoadMore} />
    </Card>
  )
}

export default StoreRankingCard
