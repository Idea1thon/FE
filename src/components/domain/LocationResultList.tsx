import type { LocationResult } from '../../data/mock'

interface LocationResultListProps {
  results: LocationResult[]
  /** 결과 클릭 시 부동산 매물 페이지로 이동. */
  onSelect?: (result: LocationResult) => void
}

/** 신규 점포 입지 분석 결과 목록. */
function LocationResultList({ results, onSelect }: LocationResultListProps) {
  return (
    <ul className="list-none m-0 p-0">
      {results.map((result) => (
        <li key={result.id} className="border-t border-w-line first:border-t-0">
          <button
            type="button"
            className="group flex flex-col gap-3.5 w-full px-1 py-6 text-left text-w-ink bg-transparent border-0 cursor-pointer"
            onClick={() => onSelect?.(result)}
          >
            <span className="text-[22px] font-medium group-hover:underline lg:text-[28px]">
              {result.address}
            </span>
            <span className="text-[18px]">{result.detail}</span>
            <span className="text-[18px]">{result.description}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default LocationResultList
