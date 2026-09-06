import Card from '../ui/Card'
import Button from '../ui/Button'
import { financialProducts } from '../../data/mock'
import type { FinancialProduct } from '../../data/mock'

interface SolutionCardsProps {
  /** 금융상품명 클릭 시 금융 상품 페이지로 이동. */
  onSelect?: (product: FinancialProduct) => void
  onLoadMore?: () => void
  /** Stretch the card to fill a stretched dashboard column. */
  fill?: boolean
}

/**
 * 추천 금융상품 목록.
 *
 * Each row is a real activation target, so it gets a hover surface and a focus
 * ring rather than looking like a static tile. The description is kept because
 * DESIGN.md §6 asks for the value to be legible before the person commits to a
 * tap.
 */
const item = [
  'flex w-full flex-col gap-1.5 rounded-ctl-md border border-line bg-canvas p-4 text-left',
  'cursor-pointer transition-colors duration-150 hover:border-primary hover:bg-weak/40',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
].join(' ')

function SolutionCards({ onSelect, onLoadMore, fill = false }: SolutionCardsProps) {
  return (
    <Card
      title="맞춤 금융 솔루션"
      description="지금 위험도 구간에 맞춰 고른 상품입니다."
      fill={fill}
      className={fill ? 'flex-1' : undefined}
    >
      <div className="flex flex-col gap-3">
        {financialProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            className={item}
            onClick={() => onSelect?.(product)}
          >
            <span className="text-body font-semibold text-fg">{product.name}</span>
            <span className="text-bodysm text-muted">{product.description}</span>
          </button>
        ))}
      </div>
      <div className={fill ? 'mt-auto pt-4' : 'pt-4'}>
        <Button variant="ghost" size="md" block onClick={onLoadMore}>
          더 알아보기
        </Button>
      </div>
    </Card>
  )
}

export default SolutionCards
