import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { financialProducts } from '../../data/mock'
import type { FinancialProduct } from '../../data/mock'

interface SolutionCardsProps {
  onSelect?: (product: FinancialProduct) => void
  onLoadMore?: () => void
  /** Stretch the card to fill a stretched dashboard column. */
  fill?: boolean
}

/**
 * 맞춤 금융상품 카드. 상품 API 연결 전까지 목데이터를 쓰며, 그 사실을 카드 설명에
 * 적어 실제 심사 결과처럼 보이지 않게 한다.
 *
 * `onSelect` 가 없으면 상세 경로로 직접 이동한다 (dev 동작 유지).
 */
const item = [
  'flex w-full flex-col gap-1.5 rounded-ctl-md border border-line bg-canvas p-4 text-left',
  'cursor-pointer transition-colors duration-150 hover:border-primary hover:bg-weak/40',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
].join(' ')

function SolutionCards({ onSelect, onLoadMore, fill = false }: SolutionCardsProps) {
  const navigate = useNavigate()

  const selectProduct = (product: FinancialProduct) => {
    if (onSelect) {
      onSelect(product)
      return
    }
    navigate(`/finance/${product.id}`)
  }

  return (
    <Card
      title="맞춤 금융상품"
      description="상품 API 연결 전이라 예시 목록을 보여줍니다."
      fill={fill}
      className={fill ? 'flex-1' : undefined}
    >
      <div className="flex flex-col gap-3">
        {financialProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            className={item}
            onClick={() => selectProduct(product)}
          >
            <span className="text-body font-semibold text-fg">{product.name}</span>
            <span className="text-bodysm text-muted">{product.description}</span>
          </button>
        ))}
      </div>
      {onLoadMore && (
        <div className={fill ? 'mt-auto pt-4' : 'pt-4'}>
          <Button variant="ghost" size="md" block onClick={onLoadMore}>
            더 알아보기
          </Button>
        </div>
      )}
    </Card>
  )
}

export default SolutionCards
