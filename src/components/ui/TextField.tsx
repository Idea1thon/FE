import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** `inline` puts the label to the left of the field; `stacked` puts it above. */
  layout?: 'inline' | 'stacked'
  /** Visual size of the input box. */
  inputSize?: 'md' | 'lg'
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean
}

const inputBase =
  'flex-auto min-w-0 w-full [font:inherit] [letter-spacing:inherit] text-w-ink bg-w-field border border-w-line placeholder:text-w-placeholder focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-w-ink'

const inputBySize = {
  md: 'h-10 px-3 rounded-md text-[16px]',
  lg: 'h-[54px] px-4 rounded-[10px]',
}

function TextField({
  label,
  layout = 'inline',
  inputSize = 'md',
  hideLabel = false,
  id,
  className,
  ...rest
}: TextFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  const classes = [
    'flex',
    layout === 'inline' ? 'items-center gap-4' : 'flex-col gap-1.5',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const labelClasses = [
    'text-w-ink whitespace-nowrap',
    // Fixed label column so every inline field lines up to the same input width.
    layout === 'inline' ? 'flex-none w-12' : '',
    inputSize === 'lg' ? 'text-[20px]' : '',
    hideLabel ? 'sr-only' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label htmlFor={fieldId} className={labelClasses}>
        {label}
      </label>
      <input id={fieldId} className={`${inputBase} ${inputBySize[inputSize]}`} {...rest} />
    </div>
  )
}

export default TextField
