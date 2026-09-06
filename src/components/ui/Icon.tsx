type IconName = 'bell' | 'user' | 'search' | 'chevron-down' | 'settings'

interface IconProps {
  name: IconName
  /** Pixel size of the square icon box. */
  size?: number
  /** Accessible label. Omit for purely decorative icons. */
  label?: string
  className?: string
}

/**
 * Renders one glyph from the `public/icons.svg` sprite.
 *
 * The sprite strokes with `currentColor`, so color comes from the surrounding
 * text token (`text-body`, `text-muted`, …) rather than being pinned here.
 */
function Icon({ name, size = 24, label, className }: IconProps) {
  const decorative = label == null
  return (
    <svg
      className={['inline-block shrink-0 align-middle', className].filter(Boolean).join(' ')}
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
