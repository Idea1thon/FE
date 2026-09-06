import DataList, { DataRow } from '../ui/DataList'
import type { StoreSummary } from '../../data/mock'

interface StoreListProps {
  stores: StoreSummary[]
  onSelect?: (store: StoreSummary) => void
  onLoadMore?: () => void
  /** Fill the card body and pin `+ 더보기` to the bottom (stretched dashboard column). */
  fill?: boolean
}

/** Grey row list of stores — "지역 | 점포명 ... 점장". Shared by ranking & focus-store views. */
function StoreList({ stores, onSelect, onLoadMore, fill = false }: StoreListProps) {
  return (
    <DataList onLoadMore={onLoadMore} fill={fill}>
      {stores.map((store) => (
        <DataRow
          key={store.id}
          onClick={onSelect ? () => onSelect(store) : undefined}
        >
          <span className="inline-flex items-center gap-3">
            {store.region}
            <span className="text-w-line">|</span>
            {store.name}
          </span>
          <span className="flex-none text-right">{store.trailing || store.manager}</span>
        </DataRow>
      ))}
    </DataList>
  )
}

export default StoreList
