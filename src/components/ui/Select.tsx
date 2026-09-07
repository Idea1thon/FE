import { useId } from 'react'
import type { SelectHTMLAttributes, ReactNode } from 'react'
import Icon from './Icon'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  /** `box` matches the text field; `inline` is a quiet text + chevron trigger. */
  variant?: 'box' | 'inline'
  /** Accessible label. Rendered visibly when `label` is passed instead. */
  ariaLabel: string
  /** Visible label above a `box` select. */
  label?: ReactNode
  error?: ReactNode
}

/**
 * Native `<select>` styled to sit beside the TDS text field.
 *
 * LOCAL EXTENSION — DESIGN.md documents a text field but no select. Geometry is
 * therefore borrowed from the verified field/button values (48px box height,
 * 10px radius) rather than from a generic dropdown pattern. A native control is
 * kept on purpose: it gives correct mobile behaviour and keyboard support for
 * free, which the verified state contract asks for.
 */
function Select({
  options,
  variant = 'box',
  ariaLabel,
  label,
  error,
  className,
  disabled,
  id,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  const control =
    variant === 'box'
      ? [
          'h-12 w-full pl-4 pr-10 rounded-ctl-md text-body bg-canvas text-fg',
          'border transition-colors duration-150 focus:outline-none',
          error
            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
            : 'border-line focus:border-primary focus:ring-2 focus:ring-primary/20',
          disabled ? 'bg-surface text-muted cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')
      : [
          'h-8 pl-2 pr-7 rounded-ctl-sm text-bodysm font-medium bg-transparent text-body',
          'border border-transparent transition-colors duration-150',
          'hover:bg-surface focus:outline-none focus-visible:outline-2',
          'focus-visible:outline-offset-2 focus-visible:outline-primary',
          disabled ? 'text-muted cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')

  return (
    <div className={['flex flex-col gap-2', className ?? ''].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={fieldId} className="text-bodysm font-medium text-body">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={fieldId}
          className={`appearance-none ${control}`}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
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
          size={variant === 'inline' ? 14 : 18}
          className={[
            'absolute pointer-events-none',
            variant === 'inline' ? 'right-2 text-muted' : 'right-3.5 text-muted',
          ].join(' ')}
        />
      </div>
      {error && (
        <p role="alert" className="text-bodysm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
