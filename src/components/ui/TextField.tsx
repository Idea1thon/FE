import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

/**
 * TDS Mobile Text Field (DESIGN.md §4).
 *
 * Verified variants — box, line, big, hero. Verified states — focus, error,
 * disabled, read-only. `box` and `big` are implemented here because those are
 * the two this product needs; `line` and `hero` are intentionally absent rather
 * than approximated.
 *
 * DESIGN.md warns not to transfer page-chrome colors into the field token, so
 * the field only uses canvas / line / muted / primary / danger.
 */

export type TextFieldVariant = 'box' | 'big'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** Hide the label visually but keep it for assistive tech. */
  hideLabel?: boolean
  variant?: TextFieldVariant
  /** Quiet guidance under the field. Replaced by `error` when present. */
  help?: ReactNode
  /** Error text. Also switches the field into its error state. */
  error?: ReactNode
  /** Optional trailing adornment (unit, button, icon). */
  suffix?: ReactNode
}

const sizes: Record<TextFieldVariant, string> = {
  box: 'h-12 px-4 text-body rounded-ctl-md',
  big: 'h-14 px-4 text-[17px] rounded-ctl-lg',
}

function TextField({
  label,
  hideLabel = false,
  variant = 'box',
  help,
  error,
  suffix,
  id,
  className,
  disabled,
  readOnly,
  ...rest
}: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  const message = error ?? help

  const control = [
    'w-full min-w-0 bg-canvas text-fg',
    'border transition-colors duration-150',
    'placeholder:text-muted',
    'focus:outline-none',
    sizes[variant],
    error
      ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
      : 'border-line focus:border-primary focus:ring-2 focus:ring-primary/20',
    // Read-only stays legible but visibly inert; disabled reads as unavailable.
    readOnly ? 'bg-surface text-body cursor-default' : '',
    disabled ? 'bg-surface text-muted cursor-not-allowed' : '',
    suffix ? 'pr-12' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={['flex flex-col gap-2', className ?? ''].filter(Boolean).join(' ')}>
      <label
        htmlFor={fieldId}
        className={hideLabel ? 'sr-only' : 'text-bodysm font-medium text-body'}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={fieldId}
          className={control}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {suffix && (
          <span className="absolute right-4 flex items-center text-muted">{suffix}</span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={['text-bodysm', error ? 'text-danger' : 'text-muted'].join(' ')}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export default TextField
