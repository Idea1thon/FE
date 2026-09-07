import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import { fetchFinancialProducts } from '../../api'
import type { FinancialProductItem, RiskLevel } from '../../api'
import { financialProducts } from '../../data/mock'
import type { FinancialProduct } from '../../data/mock'

interface SolutionCardsProps {
  onSelect?: (product: FinancialProduct) => void
  onLoadMore?: () => void
  fill?: boolean
}

const item =
  'flex flex-col gap-3 p-6 text-left bg-w-row border border-w-line rounded-lg cursor-pointer text-w-ink hover:brightness-[0.97]'

const riskLabels: Record<RiskLevel, string> = {
  NORMAL: '안정',
  CAUTION: '주의',
  DANGER: '위험',
}

function toFinancialProduct(item: FinancialProductItem): FinancialProduct {
  return {
    id: String(item.product_id),
    name: item.name,
    description: item.description ?? '상품 상세 정보를 확인해 보세요.',
  }
}

/** 분석 완료 전에는 예시 상품을 보여주고, 완료 후에는 위험도 기반 API 추천으로 전환한다. */
function SolutionCards({ onSelect, onLoadMore, fill = false }: SolutionCardsProps) {
  const navigate = useNavigate()
  const [products, setProducts] = useState(financialProducts)
  const [recommendationSource, setRecommendationSource] = useState('예시 상품')

  useEffect(() => {
    let active = true

    fetchFinancialProducts()
      .then((response) => {
        if (!active || response.risk_level === null || response.items.length === 0) return

        setProducts(response.items.map(toFinancialProduct))
        setRecommendationSource(`${riskLabels[response.risk_level]} 단계 맞춤 추천`)
      })
      .catch(() => {
        // 운영보고서가 없거나 상품 API를 사용할 수 없을 때는 예시 상품을 유지한다.
      })

    return () => {
      active = false
    }
  }, [])

  const [feature, ...rest] = products

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
      action={<span className="text-[14px] text-w-sub">{recommendationSource}</span>}
      fill={fill}
      className={fill ? 'flex-1' : undefined}
    >
      <p className="mb-4 text-[14px] leading-[1.5] text-w-sub">
        {recommendationSource === '예시 상품'
          ? '운영보고서 분석이 완료되면 점포 위험도에 맞는 상품으로 바뀝니다.'
          : '최근 운영보고서의 분석 결과를 바탕으로 추천한 상품입니다.'}
      </p>
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
