import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * TDS Mobile Button (DESIGN.md §4).
 *
 * Verified geometry — small 32px/8px, medium 38px/10px, large 48px/14px,
 * xlarge 56px/16px; padding `0 20px`; xlarge type 17px/600. The documented
 * default size is xlarge, so that is the default here too.
 *
 * Verified state contract — fill or weak, semantic color, plus loading,
 * disabled, pressed and keyboard focus. `loading` keeps the button's width so
 * the surrounding layout does not jump, which DESIGN.md calls out explicitly.
 */

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'primary' | 'weak' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Stretch to the full width of the parent. */
  block?: boolean
  /** Shows the spinner, blocks input, and preserves the current width. */
  loading?: boolean
  /** Optional leading glyph. Hidden while loading so the label stays centred. */
  startIcon?: ReactNode
}

const base = [
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
  'font-semibold cursor-pointer select-none',
  'border border-transparent transition-colors duration-150',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  'disabled:cursor-not-allowed disabled:opacity-40',
].join(' ')

/**
 * Height / radius / padding per documented size. Only the xlarge type size
 * (17px/600) is verified; the smaller type steps are a LOCAL EXTENSION scaled
 * down from it so a 32px control does not overflow.
 */
const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 rounded-ctl-sm text-[13px] leading-none',
  md: 'h-[38px] px-4 rounded-ctl-md text-[14px] leading-none',
  lg: 'h-12 px-5 rounded-ctl-lg text-[16px] leading-none',
  xl: 'h-14 px-5 rounded-ctl-xl text-[17px] leading-none',
}

/**
 * `primary` and `danger` are TDS *fill*; `weak` is the TDS weak treatment and
 * reuses the verified toss.im light-blue pair. `secondary` and `ghost` are a
 * LOCAL EXTENSION built only from verified neutrals (surface / line / body) —
 * DESIGN.md does not publish a neutral outline button.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-strong active:bg-primary-strong data-[pressed=true]:bg-primary-strong',
  weak: 'bg-weak text-weak-fg hover:brightness-[0.97] active:brightness-[0.94]',
  secondary:
    'bg-surface text-body border-line hover:bg-line/60 active:bg-line',
  danger: 'bg-danger text-on-primary hover:brightness-[0.93] active:brightness-[0.88]',
  ghost: 'bg-transparent text-body hover:bg-surface active:bg-line',
}

const spinnerSize: Record<ButtonSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-[18px]',
  xl: 'size-5',
}

function Button({
  variant = 'primary',
  size = 'xl',
  block = false,
  loading = false,
  startIcon,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [base, sizes[size], variants[variant], block ? 'w-full' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      // Keep the button out of the tab order's "clickable" contract while busy
      // without shrinking it — `disabled` alone would drop the accessible name
      // announcement for the state change.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {/* The label stays mounted at full width and is only made invisible, so a
          loading button never changes size. */}
      <span
        className={[
          'inline-flex items-center gap-2',
          loading ? 'invisible' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {startIcon}
        {children}
      </span>
      {loading && (
        <span
          className={[
            'absolute rounded-full border-2 border-current border-t-transparent',
            spinnerSize[size],
          ].join(' ')}
          style={{ animation: 'tds-spin 0.7s linear infinite' }}
          aria-hidden="true"
        />
      )}
    </button>
  )
}

export default Button
