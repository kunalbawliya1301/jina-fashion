import { useState } from 'react'
import type { Page } from '../App'
import { ImgBox, SectionWrapper } from '../components/Wire'
import { useProducts } from '../context/ProductContext'

interface Props {
  navigate: (p: Page) => void
}

export default function Collections({ navigate }: Props) {
  const { products: allProducts } = useProducts()
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Featured')

  const sareesCount = allProducts.filter(p => p.category === 'Sarees').length
  const lehengasCount = allProducts.filter(p => p.category === 'Lehengas').length
  const suitsCount = allProducts.filter(p => p.category === 'Suits' || p.category === 'Salwar Suits').length
  const kurtasCount = allProducts.filter(p => p.category === 'Kurtas').length
  const dupattasCount = allProducts.filter(p => p.category === 'Dupattas').length

  const categories = [
    { label: 'Sarees', count: `${sareesCount}+ Designs`, src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600' },
    { label: 'Lehengas', count: `${lehengasCount}+ Designs`, src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600' },
    { label: 'Salwar Suits', count: `${suitsCount}+ Designs`, src: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=600' },
    { label: 'Kurtas', count: `${kurtasCount}+ Designs`, src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600' },
    { label: 'Dupattas', count: `${dupattasCount}+ Designs`, src: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=600' },
  ]

  const handleFilter = (category: string) => {
    setSelectedFilter(category)
  }

  // Filter items matching state
  const filteredProducts = selectedFilter === 'All'
    ? allProducts
    : allProducts.filter(p => {
        if (selectedFilter === 'Sarees') return p.category === 'Sarees'
        if (selectedFilter === 'Lehengas') return p.category === 'Lehengas'
        if (selectedFilter === 'Suits') return p.category === 'Suits' || p.category === 'Salwar Suits'
        if (selectedFilter === 'Kurtas') return p.category === 'Kurtas'
        if (selectedFilter === 'Dupattas') return p.category === 'Dupattas'
        return true
      })

  const igImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=350',
  ]

  return (
    <div className="space-y-0 animate-fade-in">
      {/* ── HERO BANNER ── */}
      <SectionWrapper label="COLLECTIONS HERO BANNER">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=1600"
            alt="Beautiful flat lay of silk sarees"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]" />
          <div className="relative z-10 text-center space-y-4 px-4">
            <div className="flex items-center justify-center gap-2 text-surface/80">
              <button onClick={() => navigate('home')} className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-brand-accent transition-colors cursor-pointer">Home</button>
              <span className="text-[10px]">/</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent">Collections</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-surface font-normal">Our Collections</h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans tracking-[0.1em] uppercase">Premium Wholesale Catalogue 2026</p>
          </div>
        </div>
      </SectionWrapper>

      {/* ── COLLECTION CATEGORIES ── */}
      <SectionWrapper label="COLLECTION CATEGORIES">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-10 sm:mb-14 max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-10 h-px bg-border-custom" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Browse by Category</span>
              <div className="w-8 sm:w-10 h-px bg-border-custom" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-primary font-normal">Artisanal Specialities</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(({ label, count, src }, i) => (
              <div
                key={i}
                onClick={() => {
                  if (label === 'Salwar Suits') handleFilter('Suits')
                  else handleFilter(label)
                }}
                className={`group border border-border-custom bg-surface rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer ${
                  i === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="aspect-[2/3] overflow-hidden relative">
                  <img
                    src={src}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display text-base sm:text-lg text-primary font-normal group-hover:text-brand-accent transition-colors">{label}</h3>
                  <span className="inline-block px-2.5 py-0.5 text-[9px] font-semibold tracking-wider bg-secondary-bg text-brand-accent rounded">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── PRODUCT GALLERY ── */}
      <SectionWrapper label="PRODUCT GALLERY">
        <div className="bg-secondary-bg py-16 sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 max-w-xl mx-auto space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Explore Wholesale Catalogues</h2>
              <p className="text-sm text-body-custom leading-relaxed font-sans">
                Browse our premium manufacturing runs. Use the filters below to browse specific ranges and request custom catalogues.
              </p>
            </div>

            {/* Filter/sort bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-border-custom bg-surface px-4 sm:px-6 py-4 rounded-[12px] mb-8 gap-4 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary shrink-0 mr-2">Filter:</span>
                {['All', 'Sarees', 'Lehengas', 'Suits', 'Kurtas'].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilter(f)}
                    className={`px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 ${
                      selectedFilter === f
                        ? 'bg-primary text-surface shadow'
                        : 'border border-border-custom text-body-custom bg-surface hover:bg-secondary-bg'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <label htmlFor="sort-dropdown" className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary">Sort By:</label>
                <select
                  id="sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-surface border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom font-semibold cursor-pointer shadow-sm"
                >
                  <option>Featured</option>
                  <option>New Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="group bg-surface border border-border-custom rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <ImgBox className="w-full" aspect="3/4" src={p.src} label={p.name} alt={p.name} />
                    <div className="p-4 space-y-1.5">
                      <span className="text-[9px] tracking-widest uppercase font-semibold text-brand-accent">{p.category}</span>
                      <h4 className="font-display text-base text-primary font-normal leading-snug truncate">{p.name}</h4>
                      <p className="text-[10px] text-muted-custom font-medium truncate font-sans">{p.fabric}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-0 space-y-3">
                    <div className="text-[9px] text-body-custom font-semibold bg-secondary-bg px-2.5 py-0.5 rounded inline-block">
                      MOQ: {p.moq}
                    </div>
                    <button
                      onClick={() => navigate('contact')}
                      className="w-full border border-primary text-center py-2 text-[9px] tracking-widest uppercase text-primary font-bold rounded-[8px] bg-transparent hover:bg-primary hover:text-surface transition-all duration-300 cursor-pointer"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {[1, 2, 3, '…', 8].map((p, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-[8px] border transition-all duration-300 cursor-pointer ${
                    p === 1
                      ? 'bg-primary text-surface border-primary shadow'
                      : 'border-border-custom text-body-custom bg-surface hover:bg-secondary-bg'
                  }`}
                  disabled={typeof p !== 'number'}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── INQUIRY CTA ── */}
      <SectionWrapper label="INQUIRY CTA">
        <div className="bg-primary py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-2xl">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-px bg-neutral-600" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-secondary-accent font-bold">Wholesale Inquiries</span>
              <div className="w-8 sm:w-12 h-px bg-neutral-600" />
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl text-surface font-normal leading-tight">
              Request Our Bulk Price Catalogue
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-xl mx-auto font-sans">
              Enter your wholesale details or message us on WhatsApp with your firm credentials to get immediate access to catalog volume rates, custom fabric availability, and delivery lead times.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
              <button
                onClick={() => navigate('contact')}
                className="w-full sm:w-auto bg-surface hover:bg-neutral-100 text-primary px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[12px] transition-colors cursor-pointer shadow"
              >
                Request Catalogue
              </button>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto border border-neutral-600 hover:border-surface text-surface px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[12px] text-center transition-colors cursor-pointer"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── INSTAGRAM PREVIEW ── */}
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
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mb-8">
              {igImages.map((src, i) => (
                <div key={i} className="group relative overflow-hidden rounded-[12px] shadow-sm">
                  <ImgBox 
                    className="w-full h-full" 
                    aspect="1/1" 
                    src={src} 
                    label={`IG LOOK ${i + 1}`} 
                    alt={`Saree styling photography IG look ${i + 1}`} 
                  />
                </div>
              ))}
            </div>
            <div className="text-center">
              <a 
                href="https://instagram.com" 
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
    </div>
  )
}

