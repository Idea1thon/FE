import DataList, { DataRow } from '../ui/DataList'
import type { StoreSummary } from '../../data/mock'

interface StoreListProps {
  stores: StoreSummary[]
  onSelect?: (store: StoreSummary) => void
  onLoadMore?: () => void
  /** Fill the card body and pin the load-more row to the bottom. */
  fill?: boolean
  /** Show a 1-based rank in front of each row (매출 랭킹). */
  ranked?: boolean
}

/**
 * 점포 행 목록 — 랭킹 · 집중관리 공통.
 *
 * 지역은 한 단계 작게 두고 점포명을 강조한다. 우측 값(매출 또는 위험도)은 tabular
 * numerals 로 정렬해 행마다 자리가 흔들리지 않게 한다.
 */
function StoreList({ stores, onSelect, onLoadMore, fill = false, ranked = false }: StoreListProps) {
  return (
    <DataList onLoadMore={onLoadMore} fill={fill}>
      {stores.map((store, index) => (
        <DataRow key={store.id} onClick={onSelect ? () => onSelect(store) : undefined}>
          <span className="flex min-w-0 items-center gap-3">
            {ranked && (
              <span className="num w-5 flex-none text-bodysm font-bold text-muted" aria-hidden="true">
                {index + 1}
              </span>
            )}
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-semibold text-fg">{store.name}</span>
              <span className="truncate text-bodysm text-muted">{store.region}</span>
            </span>
          </span>
          <span className="num flex-none text-right text-bodysm font-semibold text-body">
            {store.trailing || store.manager}
          </span>
        </DataRow>
      ))}
    </DataList>
  )
}

export default StoreList
