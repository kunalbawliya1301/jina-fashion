import { useState, useRef } from 'react'
import type { Page } from '../App'
import { ImgBox, SectionWrapper } from '../components/Wire'
import SocialSection from '../components/SocialSection'
import { useProducts } from '../context/ProductContext'

interface Props {
  navigate: (p: Page) => void
}

const PRODUCTS_PER_PAGE = 12

export default function Collections({ navigate }: Props) {
  const { products: allProducts } = useProducts()
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Featured')
  const [currentPage, setCurrentPage] = useState(1)
  const galleryRef = useRef<HTMLDivElement>(null)

  const cordSetsCount = allProducts.filter(p => p.category === 'Cord Sets').length
  const dupattaSetsCount = allProducts.filter(p => p.category === 'Dupatta Set').length
  const kurtiesCount = allProducts.filter(p => p.category === 'Kurties' || p.category === 'Kurtas').length
  const pantPlazzoCount = allProducts.filter(p => p.category === 'Pant/Plazzo set').length
  const shortTopsCount = allProducts.filter(p => p.category === 'Short Tops').length

  const categories = [
    { label: 'Cord Sets', count: `${cordSetsCount}+ Designs`, src: '/Category/Cord Sets.png' },
    { label: 'Dupatta Set', count: `${dupattaSetsCount}+ Designs`, src: '/Category/Dupatta Set.png' },
    { label: 'Kurties', count: `${kurtiesCount}+ Designs`, src: '/Category/Kurties.png' },
    { label: 'Pant/Plazzo set', count: `${pantPlazzoCount}+ Designs`, src: '/Category/Pant Palazzo Set.png' },
    { label: 'Short Tops', count: `${shortTopsCount}+ Designs`, src: '/Category/Short Tops.png' },
  ]

  const handleFilter = (category: string) => {
    setSelectedFilter(category)
    setCurrentPage(1)
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Filter items matching state
  const filteredProducts = selectedFilter === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === selectedFilter)

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="space-y-0 animate-fade-in">
      {/* ── HERO BANNER ── */}
      <SectionWrapper label="COLLECTIONS HERO BANNER">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="/Hero Sections/Collection Page.png"
            alt="Collections Hero Banner"
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
          
          {/* Desktop/Laptop View: Original Category Cards Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(({ label, count, src }, i) => {
              const catKey = label === 'Salwar Suits' ? 'Suits' : label
              return (
                <div
                  key={i}
                  onClick={() => handleFilter(catKey)}
                  className={`group border border-border-custom bg-surface rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer ${
                    i === 4 ? 'col-span-1 md:col-span-1' : ''
                  }`}
                >
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                      src={src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
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
              )
            })}
          </div>

          {/* Mobile Only View: Horizontal Scroll Category Cards (Matching Reference Screenshot) */}
          <div className="flex md:hidden overflow-x-auto no-scrollbar gap-3.5 pb-4 pt-1 justify-start px-2 snap-x snap-mandatory">
            {categories.map(({ label, count, src }, i) => {
              const catKey = label === 'Salwar Suits' ? 'Suits' : label
              const isSelected = selectedFilter === catKey

              return (
                <div
                  key={i}
                  onClick={() => handleFilter(catKey)}
                  className={`shrink-0 w-[165px] snap-center bg-surface border rounded-[18px] p-3 shadow-xs space-y-2.5 cursor-pointer transition-all duration-300 active:scale-95 ${
                    isSelected ? 'border-brand-accent ring-2 ring-brand-accent/20' : 'border-border-custom'
                  }`}
                >
                  {/* Category Name above image */}
                  <h3 className="font-sans text-sm font-bold text-primary text-center truncate">
                    {label}
                  </h3>

                  {/* Image container with gradient overlay & text badge */}
                  <div className="aspect-[3/4] rounded-[14px] overflow-hidden relative shadow-xs">
                    <img
                      src={src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent flex items-end justify-center pb-2.5">
                      <span className="text-xs font-bold text-surface tracking-wide drop-shadow-sm">
                        Wholesale Rates
                      </span>
                    </div>
                  </div>

                  {/* Bottom info badge */}
                  <div className="bg-secondary-bg/80 rounded-lg py-1 px-2 text-center">
                    <span className="text-[10px] font-semibold text-brand-accent tracking-wider uppercase">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* ── PRODUCT GALLERY ── */}
      <SectionWrapper label="PRODUCT GALLERY">
        <div ref={galleryRef} className="bg-secondary-bg py-16 sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 max-w-xl mx-auto space-y-3">
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Explore Wholesale Catalogues</h2>
              <p className="text-sm text-body-custom leading-relaxed font-sans">
                Browse our premium manufacturing runs. Use the filters below to browse specific ranges and request custom catalogues.
              </p>
            </div>

            {/* Filter bar */}
            <div className="border border-border-custom bg-surface px-4 sm:px-6 py-3.5 rounded-[14px] mb-8 shadow-xs">
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-primary shrink-0 mr-2">Filter:</span>
                {['All', 'Cord Sets', 'Dupatta Set', 'Kurties', 'Pant/Plazzo set', 'Short Tops'].map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFilter(f)}
                    className={`px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full cursor-pointer transition-all duration-300 shrink-0 ${
                      selectedFilter === f
                        ? 'bg-primary text-surface shadow-xs scale-105'
                        : 'border border-border-custom text-body-custom bg-surface hover:border-brand-accent/60 hover:text-brand-accent'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {paginatedProducts.map((p) => (
                <div key={p.id} className="group bg-surface border border-border-custom rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <ImgBox className="w-full max-h-[380px] rounded-b-none" aspect="3/4" src={p.src} label={p.name} alt={p.name} />
                    <div className="p-3.5 sm:p-4 space-y-1 sm:space-y-1.5">
                      <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-brand-accent">{p.category}</span>
                      <h4 className="font-display text-sm sm:text-base text-primary font-normal leading-snug truncate">{p.name}</h4>
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4 pt-0">
                    <button
                      onClick={() => navigate('contact')}
                      className="w-full border border-primary text-center py-2 text-[9px] sm:text-[10px] tracking-widest uppercase text-primary font-bold rounded-[8px] bg-transparent hover:bg-primary hover:text-surface transition-all duration-300 cursor-pointer"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3.5 h-9 flex items-center justify-center text-xs font-semibold rounded-[8px] border border-border-custom text-body-custom bg-surface hover:bg-secondary-bg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-[8px] border transition-all duration-300 cursor-pointer ${
                      currentPage === p
                        ? 'bg-primary text-surface border-primary shadow-xs font-bold scale-105'
                        : 'border-border-custom text-body-custom bg-surface hover:bg-secondary-bg'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3.5 h-9 flex items-center justify-center text-xs font-semibold rounded-[8px] border border-border-custom text-body-custom bg-surface hover:bg-secondary-bg disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
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
      <SocialSection />
    </div>
  )
}

