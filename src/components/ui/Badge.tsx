import type { ReactNode } from 'react'

/**
 * TDS Mobile Badge (DESIGN.md §4).
 *
 * Verified contract — fill or weak, xsmall/small/medium/large, semantic colors,
 * and **descriptive rather than interactive**. So this renders a `<span>` and
 * never accepts an `onClick`: DESIGN.md's don't-list calls out treating badge
 * content as an action affordance.
 */

export type BadgeTone = 'primary' | 'neutral' | 'safe' | 'warn' | 'danger'
export type BadgeVariant = 'fill' | 'weak'
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const sizes: Record<BadgeSize, string> = {
  xs: 'h-5 px-1.5 text-[11px] rounded-xs',
  sm: 'h-6 px-2 text-[12px] rounded-xs',
  md: 'h-7 px-2.5 text-bodysm rounded-sm',
  lg: 'h-8 px-3 text-bodysm rounded-sm',
}

const fill: Record<BadgeTone, string> = {
  primary: 'bg-primary text-on-primary',
  neutral: 'bg-body text-canvas',
  safe: 'bg-risk-safe text-canvas',
  warn: 'bg-risk-warn text-canvas',
  danger: 'bg-danger text-on-primary',
}

/**
 * `weak` uses the verified light-blue pair for primary. The other weak tones
 * are a LOCAL EXTENSION: a tinted background derived from the same tone token,
 * since DESIGN.md publishes weak values only for the marketing blue.
 */
const weak: Record<BadgeTone, string> = {
  primary: 'bg-weak text-weak-fg',
  neutral: 'bg-surface text-body',
  safe: 'bg-risk-safe/10 text-risk-safe',
  warn: 'bg-risk-warn/10 text-risk-warn',
  danger: 'bg-danger/10 text-danger',
}

function Badge({
  children,
  tone = 'neutral',
  variant = 'weak',
  size = 'md',
  className,
}: BadgeProps) {
  const classes = [
    'inline-flex flex-none items-center justify-center font-semibold',
    sizes[size],
    variant === 'fill' ? fill[tone] : weak[tone],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}

export default Badge
