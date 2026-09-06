import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `outline` (default) is the boxed wireframe button; `ghost` is text-only. */
  variant?: 'outline' | 'ghost'
  /** Stretch to the full width of the parent. */
  block?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 text-[16px] leading-tight text-w-ink rounded-lg cursor-pointer transition-colors hover:bg-w-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-w-ink disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  outline: 'px-5 py-3 bg-w-field border border-w-line',
  ghost: 'px-3 py-2 bg-transparent border border-transparent',
}

function Button({
  variant = 'outline',
  block = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  const classes = [base, variants[variant], block ? 'w-full' : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...rest} />
}

export default Button
