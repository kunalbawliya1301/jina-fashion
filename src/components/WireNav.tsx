import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  current: Page
  navigate: (p: Page) => void
}

export default function WireNav({ current, navigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Collections', page: 'collections' },
    { label: 'Contact', page: 'contact' },
  ]

  const handleNav = (page: Page) => {
    navigate(page)
    setMenuOpen(false)
  }

  return (
    <header className="border-b border-border-custom bg-surface sticky top-0 z-50 shadow-sm backdrop-blur-md bg-surface/95">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Elegant Brand Logo */}
        <button 
          onClick={() => handleNav('home')} 
          className="cursor-pointer group shrink-0"
        >
          <img
            src="/JINA Logo.png"
            alt="Jina Fashion Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => handleNav(page)}
              className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer font-medium relative py-1.5 ${
                current === page
                  ? 'text-brand-accent font-bold'
                  : 'text-body-custom hover:text-brand-accent'
              }`}
            >
              {label}
              {current === page && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full animate-fade-in" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <button
            onClick={() => handleNav('contact')}
            className="hidden lg:block border border-primary px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase text-surface bg-primary hover:bg-primary-hover transition-all duration-300 rounded-[12px] cursor-pointer"
          >
            Get a Quote
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-secondary-bg transition-colors"
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-5 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border-custom bg-surface shadow-lg animate-fade-in">
          <nav className="flex flex-col p-2 space-y-1">
            {links.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`px-4 py-3.5 text-left text-xs tracking-[0.2em] uppercase font-semibold rounded-[12px] transition-all duration-200 cursor-pointer ${
                  current === page ? 'text-brand-accent bg-secondary-bg' : 'text-body-custom hover:text-brand-accent hover:bg-secondary-bg'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => handleNav('contact')}
              className="mx-4 my-3 bg-primary hover:bg-primary-hover text-surface py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-[12px] text-center cursor-pointer transition-colors"
            >
              Get a Quote
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

