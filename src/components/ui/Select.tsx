import type { SelectHTMLAttributes } from 'react'
import Icon from './Icon'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  /** `box` = bordered field (도/시/동); `inline` = text + chevron (전국 ▾, 최신순 ▾). */
  variant?: 'box' | 'inline'
  /** Accessible label (visually hidden). */
  ariaLabel: string
}

const controlBase =
  'w-full appearance-none [font:inherit] [letter-spacing:inherit] text-w-ink cursor-pointer [&>option]:bg-w-field [&>option]:text-w-ink'

const controlByVariant = {
  box: 'h-[50px] pl-4 pr-10 text-center bg-w-field border border-w-line rounded-[7px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-w-ink',
  inline: 'h-7 pl-1 pr-[22px] text-[16px] bg-transparent border-0 lg:text-[20px]',
}

/** Native `<select>` styled to match the wireframe dropdowns. */
function Select({
  options,
  variant = 'box',
  ariaLabel,
  className,
  ...rest
}: SelectProps) {
  const classes = [
    'relative inline-flex items-center',
    variant === 'box' ? 'min-w-[120px]' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <select
        className={`${controlBase} ${controlByVariant[variant]}`}
        aria-label={ariaLabel}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        size={variant === 'inline' ? 16 : 18}
        className={`absolute pointer-events-none ${variant === 'inline' ? 'right-0' : 'right-3'}`}
      />
    </div>
  )
}

export default Select
