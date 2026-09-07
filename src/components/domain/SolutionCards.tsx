import { useState } from 'react'
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

/** FE 목업 상품만 사용해 맞춤 금융상품 예시를 보여준다. */
function SolutionCards({ onSelect, onLoadMore, fill = false }: SolutionCardsProps) {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)
  const visibleProducts = showAll ? financialProducts : financialProducts.slice(0, 3)
  const [feature, ...rest] = visibleProducts

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
      action={<span className="text-[14px] text-w-sub">UI 목업 예시</span>}
      fill={fill}
      className={fill ? 'flex-1' : undefined}
    >
      <p className="mb-4 text-[14px] leading-[1.5] text-w-sub">
        운영보고서 기반 추천 화면을 위한 금융상품 예시입니다.
      </p>
      {showAll ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visibleProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              className={item}
              onClick={() => selectProduct(product)}
            >
              <span className="text-[20px] font-medium lg:text-[24px]">{product.name}</span>
              <span className="text-[16px] leading-[1.4]">{product.description}</span>
            </button>
          ))}
        </div>
      ) : (
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
      )}
      {(onLoadMore || financialProducts.length > 3) && (
        <button
          type="button"
          className={[
            'block w-full p-3 text-[18px] text-w-ink bg-transparent border-0 cursor-pointer hover:underline',
            fill ? 'mt-auto pt-4' : 'mt-4',
          ].join(' ')}
          onClick={() => {
            if (onLoadMore) {
              onLoadMore()
              return
            }
            setShowAll((current) => !current)
          }}
        >
          {onLoadMore ? '+ 더 알아보기' : showAll ? '간단히 보기' : `+ ${financialProducts.length - 3}개 더 알아보기`}
        </button>
      )}
    </Card>
  )
}

export default SolutionCards
