import type { ReactNode } from 'react'

export type RiskLevel = 'safe' | 'warn' | 'danger'

interface RiskTextProps {
  level: RiskLevel
  children: ReactNode
  className?: string
}

/**
 * Inline text tinted by risk tier — 안전 / 보통 / 위험.
 *
 * Only `danger` maps to a DESIGN.md-verified value (`#e42939`). `safe` and
 * `warn` come from the risk tokens in `index.css`, which are labelled there as
 * a LOCAL EXTENSION because DESIGN.md publishes no positive/warning tier.
 */
const colorByLevel: Record<RiskLevel, string> = {
  safe: 'text-risk-safe',
  warn: 'text-risk-warn',
  danger: 'text-risk-danger',
}

function RiskText({ level, children, className }: RiskTextProps) {
  return (
    <span
      className={['font-semibold', colorByLevel[level], className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}

export default RiskText
