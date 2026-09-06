import Card from '../ui/Card'
import { financialProducts } from '../../data/mock'
import type { FinancialProduct } from '../../data/mock'

interface SolutionCardsProps {
  /** 금융상품명 클릭 시 금융 상품 페이지로 이동. */
  onSelect?: (product: FinancialProduct) => void
  onLoadMore?: () => void
  /** Stretch the card to fill a stretched dashboard column (bottom edges align). */
  fill?: boolean
}

const item =
  'flex flex-col gap-3 p-6 text-left bg-w-row border border-w-line rounded-lg cursor-pointer text-w-ink hover:brightness-[0.97]'

/** "OOO님에게 딱 맞는 솔루션!" — 추천 금융상품 그리드. */
function SolutionCards({ onSelect, onLoadMore, fill = false }: SolutionCardsProps) {
  const [feature, ...rest] = financialProducts

  return (
    <Card
      title="OOO님에게 딱 맞는 솔루션!"
      fill={fill}
      className={fill ? 'flex-1' : undefined}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <button type="button" className={`${item} justify-start`} onClick={() => onSelect?.(feature)}>
          <span className="text-[20px] font-medium lg:text-[24px]">{feature.name}</span>
          <span className="text-[16px] leading-[1.4]">{feature.description}</span>
        </button>
        <div className="flex flex-col gap-4">
          {rest.map((product) => (
            <button
              key={product.id}
              type="button"
              className={`${item} flex-1 basis-0`}
              onClick={() => onSelect?.(product)}
            >
              <span className="text-[20px] font-medium lg:text-[24px]">{product.name}</span>
              <span className="text-[16px] leading-[1.4]">{product.description}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={[
          'block w-full p-3 text-[18px] text-w-ink bg-transparent border-0 cursor-pointer hover:underline',
          fill ? 'mt-auto pt-4' : 'mt-4',
        ].join(' ')}
        onClick={onLoadMore}
      >
        + 더 알아보기
      </button>
    </Card>
  )
}

export default SolutionCards
