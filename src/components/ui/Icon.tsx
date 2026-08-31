type IconName =
  | 'bell'
  | 'user'
  | 'search'
  | 'chevron-down'
  | 'settings'

interface IconProps {
  name: IconName
  /** Pixel size of the square icon box. */
  size?: number
  /** Accessible label. Omit for purely decorative icons. */
  label?: string
  className?: string
}

/**
 * Renders a single glyph from the `public/icons.svg` sprite.
 * Decorative by default; pass `label` when the icon carries meaning.
 */
function Icon({ name, size = 24, label, className }: IconProps) {
  const decorative = label == null
  return (
    <svg
      className={['inline-block shrink-0 align-middle text-w-ink', className]
        .filter(Boolean)
        .join(' ')}
      style={{ width: size, height: size }}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={label}
    >
      <use href={`/icons.svg#${name}-icon`} />
    </svg>
  )
}

export default Icon
