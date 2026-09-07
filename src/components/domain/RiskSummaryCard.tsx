import type { ReactNode } from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'
import type { RiskLevel } from '../ui/RiskText'
import { riskThresholds } from '../../data/mock'

interface RiskSummaryCardProps {
  /** 표시할 값. 이미 서식이 적용된 문자열 (예: "48%"). 없으면 미확인으로 둔다. */
  percent: string
  /** Risk tier for the headline figure. */
  level?: RiskLevel
  /** 첫 로딩 중. */
  loading?: boolean
  /** Optional nested content — e.g. 집중 관리 필요 점포 목록. */
  children?: ReactNode
  /** Stretch the card (and its nested list) to fill a stretched column. */
  fill?: boolean
}

const LEVEL_LABEL: Record<RiskLevel, string> = {
  safe: '안전',
  warn: '보통',
  danger: '위험',
}

const LEVEL_TONE: Record<RiskLevel, 'safe' | 'warn' | 'danger'> = {
  safe: 'safe',
  warn: 'warn',
  danger: 'danger',
}

/**
 * 지난 달 운영 위험도 요약.
 *
 * The number leads at the H1 role (36px/700) because it is the one thing this
 * card exists to answer; the tier badge carries the meaning so the figure does
 * not have to be decoded from colour alone. The threshold legend stays as quiet
 * metadata underneath.
 *
 * "—" 는 값이 없다는 뜻이고 0 이 아니다 — 결측을 안전으로 표시하지 않는다.
 */
function RiskSummaryCard({
  percent,
  level = 'safe',
  loading = false,
  children,
  fill = false,
}: RiskSummaryCardProps) {
  const unknown = percent === '—' || percent === ''

  return (
    <Card fill={fill} className={fill ? 'flex-1' : undefined}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-bodysm font-medium text-muted">지난 달 점포 운영 위험도</p>
          {!loading && !unknown && (
            <Badge tone={LEVEL_TONE[level]} size="sm">
              {LEVEL_LABEL[level]}
            </Badge>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-11 w-32" />
        ) : unknown ? (
          <p className="text-h3 text-muted">아직 분석된 보고서가 없습니다</p>
        ) : (
          <p
            className={[
              'num text-h1',
              level === 'danger'
                ? 'text-risk-danger'
                : level === 'warn'
                  ? 'text-risk-warn'
                  : 'text-risk-safe',
            ].join(' ')}
          >
            {percent}
          </p>
        )}

        <ul className="flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-bodysm text-muted">
          {riskThresholds.map((t) => (
            <li key={t.level} className="flex items-center gap-1.5">
              <span
                className={[
                  'size-2 flex-none rounded-full',
                  t.level === 'danger'
                    ? 'bg-risk-danger'
                    : t.level === 'warn'
                      ? 'bg-risk-warn'
                      : 'bg-risk-safe',
                ].join(' ')}
                aria-hidden="true"
              />
              {t.label}
            </li>
          ))}
        </ul>
      </div>

      {children && (
        <div className={fill ? 'mt-6 flex flex-1 flex-col' : 'mt-6'}>{children}</div>
      )}
    </Card>
  )
}

export default RiskSummaryCard
