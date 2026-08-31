import type { ReactNode } from 'react'

export type RiskLevel = 'safe' | 'warn' | 'danger'

interface RiskTextProps {
  level: RiskLevel
  children: ReactNode
  className?: string
}

const colorByLevel = {
  safe: 'text-risk-safe',
  warn: 'text-risk-warn',
  danger: 'text-risk-danger',
}

/** Inline text tinted by risk level — 안전 / 보통 / 위험. */
function RiskText({ level, children, className }: RiskTextProps) {
  return (
    <span
      className={['font-medium', colorByLevel[level], className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}

export default RiskText
