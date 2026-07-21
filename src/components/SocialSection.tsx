import { useState, useRef } from 'react'
import { SectionWrapper } from './Wire'
import { useSocial } from '../context/SocialContext'

export default function SocialSection() {
  const { items: socialItems } = useSocial()
  const socialRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Calculate total dot pages (2 cards visible per page view)
  const totalPages = Math.ceil(socialItems.length / 2)

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return
    if (socialRef.current) {
      const scrollLeft = socialRef.current.scrollLeft
      const width = socialRef.current.clientWidth
      if (width > 0) {
        const index = Math.round(scrollLeft / width)
        const clamped = Math.min(totalPages - 1, Math.max(0, index))
        setActiveIndex(clamped)
      }
    }
  }

  const scrollToIndex = (index: number) => {
    if (socialRef.current) {
      const width = socialRef.current.clientWidth
      isProgrammaticScroll.current = true
      setActiveIndex(index)

      socialRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth',
      })

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 450)
    }
  }

  return (
    <SectionWrapper label="INSTAGRAM PREVIEW">
      <div className="bg-secondary-bg py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-border-custom" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Follow @jinafashion</span>
              <div className="w-8 h-px bg-border-custom" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-primary font-normal">Campaign Spreads on Socials</h2>
          </div>
          
          <div
            ref={socialRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:overflow-visible mb-6 pb-1"
          >
            {socialItems.map((item) => (
              <a
                key={item.id}
                href={item.link || 'https://www.instagram.com/_jina_fashion'}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 w-[calc(50%-6px)] sm:w-auto snap-start group relative overflow-hidden rounded-[16px] shadow-sm border border-border-custom bg-surface block aspect-[9/16] transition-all duration-300 hover:shadow-lg hover:border-brand-accent/60"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title || 'Campaign Look'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Top Badge: Video Reel / Image indicator */}
                <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-xs text-surface text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium z-10">
                  {item.type === 'video' ? (
                    <>
                      <svg className="w-3 h-3 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                      <span>REEL</span>
                    </>
                  ) : (
                    <svg className="w-3 h-3 text-surface/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  )}
                </div>

                {/* Gradient Overlay & Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-surface">
                  <p className="text-[11px] font-semibold tracking-wide leading-tight drop-shadow-sm">
                    {item.title}
                  </p>
                  <span className="text-[9px] text-brand-accent tracking-widest uppercase font-bold mt-1">
                    View on IG →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Navigation Dots (Mobile Only) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8 sm:hidden">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                    i === activeIndex
                      ? 'w-5 bg-brand-accent'
                      : 'w-2 bg-border-custom hover:bg-muted-custom'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <a 
              href="https://www.instagram.com/_jina_fashion" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-block border border-primary px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-primary hover:bg-primary hover:text-surface transition-all duration-300 rounded-[12px] bg-surface cursor-pointer shadow-sm hover:shadow"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
