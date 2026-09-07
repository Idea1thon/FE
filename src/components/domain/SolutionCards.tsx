import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { financialProducts, financialProductsByRisk } from '../../data/mock'
import type { FinancialProduct } from '../../data/mock'
import type { ReportListItem, RiskLevel as ApiRiskLevel } from '../../api'

interface SolutionCardsProps {
  onSelect?: (product: FinancialProduct) => void
  onLoadMore?: () => void
  recommendationReport?: Pick<ReportListItem, 'report_month' | 'status' | 'risk_level'> | null
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

const uiRiskByApiRisk: Record<ApiRiskLevel, 'safe' | 'warn' | 'danger'> = {
  NORMAL: 'safe',
  CAUTION: 'warn',
  DANGER: 'danger',
}

const riskLabel = {
  safe: '안정',
  warn: '주의',
  danger: '위험',
} as const

function SolutionCards({
  onSelect,
  onLoadMore,
  recommendationReport = null,
  fill = false,
}: SolutionCardsProps) {
  const navigate = useNavigate()
  const completedRisk =
    recommendationReport?.status === 'COMPLETED' ? recommendationReport.risk_level : null
  const recommendationLevel = completedRisk ? uiRiskByApiRisk[completedRisk] : null
  const products: FinancialProduct[] = recommendationLevel
    ? financialProductsByRisk[recommendationLevel]
    : financialProducts
  const cardLabel = recommendationLevel
    ? `${riskLabel[recommendationLevel]} 상태 맞춤 목업`
    : recommendationReport?.status === 'ANALYZING'
      ? '분석 중 · 예시 상품'
      : 'UI 목업 예시'
  const cardDescription = recommendationLevel
    ? `${recommendationReport?.report_month ?? '최근'} 운영보고서 분석 결과에 맞춘 금융상품 예시입니다.`
    : recommendationReport?.status === 'ANALYZING'
      ? '운영보고서 분석이 완료되면 해당 위험도 상태의 상품 예시로 전환됩니다.'
      : '운영보고서를 작성하면 분석 결과에 맞는 상품 예시로 전환됩니다.'

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
      description={cardDescription}
      action={<span className="text-bodysm text-muted">{cardLabel}</span>}
      fill={fill}
      className={fill ? 'flex-1' : undefined}
    >
      <div className="flex flex-col gap-3">
        {products.map((product) => (
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
