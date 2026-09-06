import { useState } from 'react'
import Card from '../ui/Card'
import Select from '../ui/Select'
import StoreList from './StoreList'
import { REGION_OPTIONS } from '../../data/mock'
import type { StoreSummary } from '../../data/mock'
import { useMemo } from 'react'

interface StoreRankingCardProps {
  title: string
  stores: StoreSummary[]
  /** 첫 로딩 중이면 목록 대신 안내를 보여준다. */
  loading?: boolean
  /** 호출 실패 메시지. 비어 있으면 정상. */
  error?: string | null
  onSelect?: (store: StoreSummary) => void
  onLoadMore?: () => void
  /** Stretch the card to fill a stretched dashboard column (bottom edges align). */
  fill?: boolean
}

const noticeClass = 'm-0 px-4 py-6 text-[16px] lg:px-6 lg:text-[20px]'

/** Dashboard card: 매출 TOP 점포 랭킹 / 집중 관리 필요 점포 — region dropdown + store list. */
function StoreRankingCard({
  title,
  stores,
  loading = false,
  error = null,
  onSelect,
  onLoadMore,
  fill = false,
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

  return (
    <Card
      title={title}
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
        <p className={`${noticeClass} text-w-ink`}>{error}</p>
      ) : loading ? (
        <p className={`${noticeClass} text-w-placeholder`}>불러오는 중…</p>
      ) : visibleStores.length === 0 ? (
        <p className={`${noticeClass} text-w-placeholder`}>표시할 점포가 없습니다.</p>
      ) : (
        <StoreList stores={visibleStores} onSelect={onSelect} onLoadMore={onLoadMore} fill={fill} />
      )}
    </Card>
  )
}

export default StoreRankingCard
