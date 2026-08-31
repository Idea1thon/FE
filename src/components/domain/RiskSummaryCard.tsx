import type { ReactNode } from 'react'
import Card from '../ui/Card'
import RiskText from '../ui/RiskText'
import { riskThresholds } from '../../data/mock'

interface RiskSummaryCardProps {
  /** e.g. "OO%" */
  percent: string
  /** Optional nested content — e.g. the 집중 관리 필요 점포 list. */
  children?: ReactNode
}

/** "지난 달 점포 운영 위험도는 OO% 입니다." + 안전/보통/위험 기준 (+ 선택적 하위 목록). */
function RiskSummaryCard({ percent, children }: RiskSummaryCardProps) {
  return (
    <Card>
      <p className="text-[22px] leading-[1.3] text-w-ink lg:text-[30px]">
        지난 달 점포 운영 위험도는{' '}
        <RiskText level="safe" className="text-[30px] lg:text-[40px]">
          {percent}
        </RiskText>{' '}
        입니다.
      </p>
      <ul className="list-none mt-5 mb-0 p-0 flex flex-wrap gap-x-5 gap-y-2 text-[16px] lg:gap-x-8 lg:gap-y-4 lg:text-[20px]">
        {riskThresholds.map((t) => (
          <li key={t.level}>
            <RiskText level={t.level}>{t.label}</RiskText>
          </li>
        ))}
      </ul>
      {children && <div className="mt-6">{children}</div>}
    </Card>
  )
}

export default RiskSummaryCard
