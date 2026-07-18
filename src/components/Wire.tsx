import React from 'react'

/** Premium visual Atoms derived from low-fi counterparts */

export function ImgBox({
  className = '',
  label = 'IMAGE',
  aspect,
  src,
  alt,
  objectFit = 'cover',
  bgTransparent = false,
  noHover = false,
}: {
  className?: string
  label?: string
  aspect?: string
  src?: string
  alt?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down'
  bgTransparent?: boolean
  noHover?: boolean
}) {
  if (src) {
    const scaleClass = noHover ? "" : "group-hover:scale-105"
    const overlayClass = noHover ? "hidden" : "absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    const bgClass = bgTransparent ? "bg-transparent" : "bg-secondary-bg"
    const fitClass = 
      objectFit === 'contain' ? 'object-contain' : 
      objectFit === 'fill' ? 'object-fill' : 
      objectFit === 'scale-down' ? 'object-scale-down' : 
      'object-cover'

    return (
      <div
        className={`relative overflow-hidden group rounded-[12px] ${bgClass} ${className}`}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <img
          src={src}
          alt={alt || label}
          loading="lazy"
          className={`w-full h-full ${fitClass} transition-transform duration-700 ease-out ${scaleClass}`}
        />
        <div className={overlayClass} />
      </div>
    )
  }

  return (
    <div
      className={`relative bg-secondary-bg border border-border-custom overflow-hidden flex items-center justify-center rounded-[12px] ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {/* Subtle background lines for premium minimal look instead of diagonal crosses */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px]" />
      <span className="relative text-[10px] tracking-[0.2em] font-sans uppercase text-muted-custom bg-surface px-3 py-1 rounded shadow-sm border border-border-custom">
        {label}
      </span>
    </div>
  )
}

export function WireBtn({
  label,
  variant = 'solid',
  className = '',
  onClick,
}: {
  label: string
  variant?: 'solid' | 'outline'
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-8 py-3.5 text-xs font-sans tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[12px] font-semibold border ${
        variant === 'solid'
          ? 'bg-primary text-surface border-primary hover:bg-primary-hover hover:border-primary-hover shadow-sm hover:shadow'
          : 'border-border-custom text-primary bg-surface hover:bg-primary hover:text-surface hover:border-primary'
      } ${className}`}
    >
      {label}
    </button>
  )
}

export function SectionLabel({ text: _text }: { text: string }) {
  // Return null or minimal styled header to maintain structural clean-look
  return null
}

export function TextLines({
  lines = 3,
  widths,
}: {
  lines?: number
  widths?: string[]
}) {
  // Keep as simple utility if needed, but styled elegantly as light bone placeholders
  const defaultWidths = ['100%', '90%', '75%', '60%', '85%']
  return (
    <div className="space-y-2 opacity-50">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-2 bg-neutral-200 rounded-full"
          style={{ width: widths ? widths[i] : defaultWidths[i % defaultWidths.length] }}
        />
      ))}
    </div>
  )
}

export function HeadingBlock({
  size = 'lg',
  centered = false,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  centered?: boolean
}) {
  // Keep clean placeholder logic as fallback
  const heights: Record<string, string> = { sm: 'h-4', md: 'h-6', lg: 'h-7', xl: 'h-10' }
  const widths: Record<string, string> = { sm: '55%', md: '60%', lg: '65%', xl: '70%' }
  return (
    <div className={centered ? 'flex flex-col items-center gap-2 opacity-40' : 'space-y-2 opacity-40'}>
      <div
        className={`${heights[size]} bg-neutral-300 rounded-sm`}
        style={{ width: widths[size] }}
      />
      <div
        className="h-4 bg-neutral-300 rounded-sm"
        style={{ width: size === 'xl' ? '50%' : '45%' }}
      />
    </div>
  )
}

export function Annotation({ text: _text }: { text: string }) {
  return null // Clean editorial style: no annotations
}

export function SectionWrapper({
  children,
  label: _label,
  className = '',
}: {
  children: React.ReactNode
  label: string
  className?: string
}) {
  // Return clean semantic section
  return (
    <section className={`relative ${className}`}>
      {children}
    </section>
  )
}

