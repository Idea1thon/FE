import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import { financialProducts } from '../../data/mock'
import type { FinancialProduct } from '../../data/mock'

interface SolutionCardsProps {
  onSelect?: (product: FinancialProduct) => void
  onLoadMore?: () => void
  fill?: boolean
}

const item =
  'flex flex-col gap-3 p-6 text-left bg-w-row border border-w-line rounded-lg cursor-pointer text-w-ink hover:brightness-[0.97]'

/** 목데이터 기반 맞춤 금융상품 카드. 상품 API 연결 전 데모 콘텐츠로 사용한다. */
function SolutionCards({ onSelect, onLoadMore, fill = false }: SolutionCardsProps) {
  const navigate = useNavigate()
  const [feature, ...rest] = financialProducts

  const selectProduct = (product: FinancialProduct) => {
    if (onSelect) {
      onSelect(product)
      return
    }
    navigate(`/finance/${product.id}`)
  }

  return (
    <Card title="맞춤 금융상품" fill={fill} className={fill ? 'flex-1' : undefined}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <button type="button" className={`${item} justify-start`} onClick={() => selectProduct(feature)}>
          <span className="text-[20px] font-medium lg:text-[24px]">{feature.name}</span>
          <span className="text-[16px] leading-[1.4]">{feature.description}</span>
        </button>
        <div className="flex flex-col gap-4">
          {rest.map((product) => (
            <button
              key={product.id}
              type="button"
              className={`${item} flex-1 basis-0`}
              onClick={() => selectProduct(product)}
            >
              <span className="text-[20px] font-medium lg:text-[24px]">{product.name}</span>
              <span className="text-[16px] leading-[1.4]">{product.description}</span>
            </button>
          ))}
        </div>
      </div>
      {onLoadMore && (
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
      )}
    </Card>
  )
}

export default SolutionCards
