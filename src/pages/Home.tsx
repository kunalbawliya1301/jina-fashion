import { useState, useRef } from 'react'
import type { Page } from '../App'
import { ImgBox, WireBtn, SectionWrapper } from '../components/Wire'
import HeroWireframe from '../components/home/HeroWireframe'
import SocialSection from '../components/SocialSection'
import { useProducts } from '../context/ProductContext'

interface Props {
  navigate: (p: Page) => void
}

export default function Home({ navigate }: Props) {
  const { products: allProducts } = useProducts()
  const tickerRef = useRef<HTMLDivElement>(null)
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFeatureScroll = () => {
    if (isProgrammaticScroll.current) return
    if (tickerRef.current) {
      const scrollLeft = tickerRef.current.scrollLeft
      const width = tickerRef.current.clientWidth
      if (width > 0) {
        const index = Math.round(scrollLeft / width)
        const clamped = Math.min(5, Math.max(0, index))
        setActiveFeatureIndex(clamped)
      }
    }
  }

  const scrollToIndex = (index: number) => {
    if (tickerRef.current) {
      const width = tickerRef.current.clientWidth
      isProgrammaticScroll.current = true
      setActiveFeatureIndex(index)

      tickerRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth',
      })

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false
      }, 450)
    }
  }

  const scrollTicker = (direction: 'left' | 'right') => {
    const nextIndex = direction === 'left'
      ? Math.max(0, activeFeatureIndex - 1)
      : Math.min(5, activeFeatureIndex + 1)
    scrollToIndex(nextIndex)
  }

  // ── Testimonial Carousel State & Handlers ──
  const testimonialRef = useRef<HTMLDivElement>(null)
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)
  const isTestimonialScroll = useRef(false)
  const testimonialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTestimonialScroll = () => {
    if (isTestimonialScroll.current) return
    if (testimonialRef.current) {
      const scrollLeft = testimonialRef.current.scrollLeft
      const width = testimonialRef.current.clientWidth
      if (width > 0) {
        const index = Math.round(scrollLeft / width)
        const clamped = Math.min(2, Math.max(0, index))
        setActiveTestimonialIndex(clamped)
      }
    }
  }

  const scrollTestimonialToIndex = (index: number) => {
    if (testimonialRef.current) {
      const width = testimonialRef.current.clientWidth
      isTestimonialScroll.current = true
      setActiveTestimonialIndex(index)

      testimonialRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth',
      })

      if (testimonialTimeoutRef.current) clearTimeout(testimonialTimeoutRef.current)
      testimonialTimeoutRef.current = setTimeout(() => {
        isTestimonialScroll.current = false
      }, 450)
    }
  }

  const scrollTestimonial = (direction: 'left' | 'right') => {
    const nextIndex = direction === 'left'
      ? Math.max(0, activeTestimonialIndex - 1)
      : Math.min(2, activeTestimonialIndex + 1)
    scrollTestimonialToIndex(nextIndex)
  }

  // Pick featured items or top 4 products
  const featuredList = allProducts.filter(p => p.featured)
  const products = featuredList.length > 0 ? featuredList.slice(0, 4) : allProducts.slice(0, 4)

  const features = [
    {
      title: 'Premium Fabrics Only',
      desc: 'We source pure silks, fine georgettes, and luxury crepes directly from trusted handloom clusters across India.',
      svg: (
        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-5.096M9.813 15.904a4.5 4.5 0 01-6.364-6.364l5.303-5.303a4.5 4.5 0 016.364 6.364l-5.303 5.303zm.893-1.879l5.303-5.303m-5.303 5.303a2.25 2.25 0 01-3.182-3.182l5.303-5.303a2.25 2.25 0 013.182 3.182L9.83 14.025z"></path>
        </svg>
      ),
    },
    {
      title: 'Modern and Classic Styles',
      desc: 'With over 500 active catalog designs, we regularly launch collections matching the latest ethnic styling.',
      svg: (
        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.078 0L3.75 17.5a.75.75 0 00-.375.649v1.602c0 .414.336.75.75.75h15.75a.75.75 0 00.75-.75v-1.602a.75.75 0 00-.375-.649l-2.702-1.378a3 3 0 00-3.078 0L9.53 16.122z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a4.25 4.25 0 100-8.5 4.25 4.25 0 000 8.5z"></path>
        </svg>
      ),
    },
    {
      title: 'Wholesale Pricing',
      desc: 'By manufacturing directly, we bypass agents and distributors to pass manufacturing savings straight to your store.',
      svg: (
        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-1.938-.659-.976-.879-.976-2.303 0-3.182 1.172-.879 3.07-.879 4.242 0L15 9M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0z"></path>
        </svg>
      ),
    },
    {
      title: 'Custom Fabric Orders',
      desc: 'Need design adaptations or custom coloring? We support custom weaving and bulk orders for big retail brands.',
      svg: (
        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"></path>
        </svg>
      ),
    },
    {
      title: 'Pan India Delivery',
      desc: 'Through reliable wholesale shipping lines, we deliver secure, insured bulk packaging directly to your outlet.',
      svg: (
        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.317-5.077a1.125 1.125 0 00-.512-.767l-3.47-2.167a1.125 1.125 0 00-1.026-.03l-1.378.689c-.6.3-1.125.753-1.517 1.302L12.75 13.5M3 14.25h16.5M3 14.25V7.5A2.25 2.25 0 015.25 5.25h9a2.25 2.25 0 012.25 2.25v6.75"></path>
        </svg>
      ),
    },
    {
      title: 'Dedicated Client Support',
      desc: 'Our experienced Mumbai sales managers help you choose collections, track orders, and coordinate customized drops.',
      svg: (
        <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.074-.765 11.91 11.91 0 001.8-3.807C3.029 15.042 1.5 13.623 1.5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"></path>
        </svg>
      ),
    },
  ]

  const testimonials = [
    {
      quote: "Jina Fashion has completely transformed our boutique's inventory. Their sarees feature unparalleled fabric quality and modern designer motifs that our luxury clients snap up immediately. Order delivery is fast and secure.",
      author: "Anjali Gupta",
      role: "Founder, Srishti Boutique",
      city: "New Delhi",
      avatarText: "AG",
    },
    {
      quote: "Finding consistent high-quality wholesale ethnic wear makers is hard, but Jina makes it simple. Their support team is incredibly prompt and custom orders are sorted in record time. Highly profitable catalog collections.",
      author: "Pooja Mehta",
      role: "Procurement Lead, Ethnic Trendz",
      city: "Ahmedabad",
      avatarText: "PM",
    },
    {
      quote: "We ordered a custom cotton print Kurta run, and the fabric selection and finishing were beautiful. Jina Fashion's design consistency and factory rates make them our primary manufacturing partner for ethnic wear.",
      author: "Rohan Desai",
      role: "Co-Founder, Zari & Threads",
      city: "Bangalore",
      avatarText: "RD",
    },
  ]

  return (
    <div className="space-y-0">
      <HeroWireframe navigate={navigate} />

      {/* ── ABOUT PREVIEW ── */}
      <SectionWrapper label="ABOUT PREVIEW">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Text details */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-brand-accent" />
                <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-accent">About Jina Fashion</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal leading-tight">
                Heritage Indian Craftsmanship <br className="hidden sm:inline" />
                For Modern Boutiques & Retailers
              </h2>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                For over fifteen years, Jina Fashion has stood at the intersection of traditional handloom artistry and contemporary silhouettes. Headquartered in Mumbai, we manufacture women's ethnic wear catering to the demand of retail stores globally.
              </p>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                We work directly with master weavers across textile centers, bringing you pure georgettes, fine Chanderis, and rich silk brocades with distinct colors and comfort.
              </p>
              <div className="pt-2">
                <WireBtn label="Learn More About Us" variant="outline" onClick={() => navigate('about')} />
              </div>
              
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-border-custom">
                {[
                  ['15+', 'Years Legacy'],
                  ['500+', 'Active Designs'],
                  ['1000+', 'Retail Partners'],
                ].map(([num, label]) => (
                  <div key={label} className="space-y-1">
                    <div className="font-display text-2xl sm:text-3xl font-semibold text-brand-accent">{num}</div>
                    <div className="text-[10px] sm:text-xs tracking-wider text-muted-custom uppercase font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Showcase Image */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <ImgBox 
                className="w-full max-w-xs sm:max-w-sm lg:max-w-[360px] shadow-md rounded-[16px]" 
                aspect="3/4" 
                src="/Home Page/About Section.png" 
                label="Craftsman Loom" 
                alt="Artisanal loom and thread craft styling"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── FEATURED PRODUCTS ── */}
      <SectionWrapper label="FEATURED PRODUCTS">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12 sm:mb-16 max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-px bg-border-custom" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Featured Collection</span>
              <div className="w-8 sm:w-12 h-px bg-border-custom" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Our Masterpiece Catalogues</h2>
            <p className="text-body-custom font-sans text-sm leading-relaxed">
              Explore our highly coveted seasonal ensembles. Designed with premium fabrics, reliable sewing quality, and tailored for wholesale retail margins.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((p, i) => (
              <div key={i} className="group relative bg-surface border border-border-custom rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <ImgBox className="w-full rounded-b-none" aspect="3/4" src={p.src} label={p.name} alt={p.name} />
                  <div className="p-3.5 sm:p-5 space-y-1 sm:space-y-1.5">
                    <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-brand-accent">{p.category}</span>
                    <h3 className="font-display text-sm sm:text-lg text-primary font-normal leading-snug truncate">{p.name}</h3>
                  </div>
                </div>
                <div className="p-3.5 sm:p-5 pt-0">
                  <button
                    onClick={() => navigate('contact')}
                    className="w-full border border-primary text-center py-2 sm:py-2.5 text-[9px] sm:text-[10px] tracking-widest uppercase text-primary font-bold rounded-[8px] bg-transparent hover:bg-primary hover:text-surface transition-all duration-300 cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <WireBtn label="View All Collections" variant="outline" onClick={() => navigate('collections')} />
          </div>
        </div>
      </SectionWrapper>

      {/* ── WHY CHOOSE US ── */}
      <SectionWrapper label="WHY CHOOSE US">
        <div className="bg-secondary-bg py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 max-w-xl mx-auto space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Our Value Proposition</span>
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Why Partner With Jina Fashion</h2>
              <p className="text-body-custom font-sans text-sm leading-relaxed">
                We empower retail stores and independent boutiques by providing seamless manufacturing, strict quality checks, and fair rates.
              </p>
            </div>
            
            {/* Desktop View: Static 3-Column Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feat, i) => (
                <div key={i} className="bg-surface border border-border-custom p-8 rounded-[14px] hover:shadow-md transition-all duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-[8px] bg-secondary-bg flex items-center justify-center">
                    {feat.svg}
                  </div>
                  <h3 className="font-display text-lg text-primary font-normal">{feat.title}</h3>
                  <p className="text-sm text-body-custom leading-relaxed font-sans">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Mobile/Tablet View: Interactive Card Carousel with Left/Right Arrows & Dots */}
            <div className="block lg:hidden relative">
              <div className="relative flex items-center px-1">
                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollTicker('left')}
                  disabled={activeFeatureIndex === 0}
                  className="w-8 h-8 rounded-full bg-surface border border-border-custom text-primary hover:bg-brand-accent hover:text-surface shadow-md flex items-center justify-center absolute -left-2 top-1/2 -translate-y-1/2 z-20 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shrink-0"
                  aria-label="Previous card"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={() => scrollTicker('right')}
                  disabled={activeFeatureIndex === features.length - 1}
                  className="w-8 h-8 rounded-full bg-surface border border-border-custom text-primary hover:bg-brand-accent hover:text-surface shadow-md flex items-center justify-center absolute -right-2 top-1/2 -translate-y-1/2 z-20 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shrink-0"
                  aria-label="Next card"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* Scroll Container */}
                <div
                  ref={tickerRef}
                  onScroll={handleFeatureScroll}
                  className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth px-1 py-1"
                >
                  {features.map((feat, i) => (
                    <div
                      key={i}
                      className="w-full shrink-0 snap-center px-4 sm:px-6"
                    >
                      <div className="bg-surface border border-border-custom p-6 sm:p-7 rounded-[16px] space-y-3 shadow-xs h-[210px] flex flex-col justify-start">
                        <div className="w-10 h-10 rounded-[8px] bg-secondary-bg flex items-center justify-center shrink-0">
                          {feat.svg}
                        </div>
                        <h3 className="font-display text-base sm:text-lg text-primary font-normal leading-snug">{feat.title}</h3>
                        <p className="text-xs sm:text-sm text-body-custom leading-relaxed font-sans line-clamp-3">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {features.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                      i === activeFeatureIndex
                        ? 'w-5 bg-brand-accent'
                        : 'w-2 bg-border-custom hover:bg-muted-custom'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── TESTIMONIALS ── */}
      <SectionWrapper label="TESTIMONIALS">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12 sm:mb-16 max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-px bg-border-custom" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Client Testimonials</span>
              <div className="w-8 sm:w-12 h-px bg-border-custom" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Feedback From Retail Partners</h2>
          </div>

          {/* Desktop View: Static 3-Column Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-border-custom p-8 rounded-[16px] bg-surface hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-7xl sm:text-8xl text-brand-accent/40 font-display leading-none select-none -mb-3 font-serif">“</div>
                  <p className="text-sm text-body-custom leading-relaxed italic font-sans">{t.quote}</p>
                </div>
                <div className="border-t border-border-custom pt-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-bg flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-brand-accent">{t.avatarText}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-primary truncate font-sans">{t.author}</h4>
                    <p className="text-[10px] text-muted-custom truncate font-sans">{t.role}, {t.city}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5 shrink-0">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-xs text-secondary-accent font-sans">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet View: Interactive Testimonial Carousel */}
          <div className="block lg:hidden relative">
            <div className="relative flex items-center px-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => scrollTestimonial('left')}
                disabled={activeTestimonialIndex === 0}
                className="w-8 h-8 rounded-full bg-surface border border-border-custom text-primary hover:bg-brand-accent hover:text-surface shadow-md flex items-center justify-center absolute -left-2 top-1/2 -translate-y-1/2 z-20 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shrink-0"
                aria-label="Previous testimonial"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => scrollTestimonial('right')}
                disabled={activeTestimonialIndex === testimonials.length - 1}
                className="w-8 h-8 rounded-full bg-surface border border-border-custom text-primary hover:bg-brand-accent hover:text-surface shadow-md flex items-center justify-center absolute -right-2 top-1/2 -translate-y-1/2 z-20 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shrink-0"
                aria-label="Next testimonial"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Scroll Container */}
              <div
                ref={testimonialRef}
                onScroll={handleTestimonialScroll}
                className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth px-1 py-1"
              >
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="w-full shrink-0 snap-center px-4 sm:px-6"
                  >
                    <div className="border border-border-custom p-6 sm:p-8 rounded-[16px] bg-surface shadow-xs flex flex-col justify-between min-h-[290px] h-[290px]">
                      <div className="space-y-2">
                        <div className="text-7xl sm:text-8xl text-brand-accent/40 font-display leading-none select-none -mb-3 font-serif">“</div>
                        <p className="text-xs sm:text-sm text-body-custom leading-relaxed italic font-sans line-clamp-4">{t.quote}</p>
                      </div>
                      <div className="border-t border-border-custom pt-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary-bg flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-brand-accent">{t.avatarText}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-primary truncate font-sans">{t.author}</h4>
                          <p className="text-[10px] text-muted-custom truncate font-sans">{t.role}, {t.city}</p>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {[...Array(5)].map((_, s) => (
                            <span key={s} className="text-xs text-secondary-accent font-sans">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollTestimonialToIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                    i === activeTestimonialIndex
                      ? 'w-5 bg-brand-accent'
                      : 'w-2 bg-border-custom hover:bg-muted-custom'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── INSTAGRAM PREVIEW ── */}
      <SocialSection />

      {/* ── CONTACT CTA BANNER ── */}
      <SectionWrapper label="CONTACT CTA BANNER">
        <div className="bg-primary py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-2xl">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 sm:w-12 h-px bg-neutral-600" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-secondary-accent font-bold">Partner With Us</span>
              <div className="w-8 sm:w-12 h-px bg-neutral-600" />
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl text-surface font-normal leading-tight">
              Grow Your Retail <br />
              Business With <br />
              <span className="italic text-brand-accent font-normal">Premium Indian Wear</span>
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-xl mx-auto font-sans">
              Ready to stock high-margin sarees, suits, and designer kurtas in your retail shop or boutique? Request a comprehensive printed catalog or connect directly with our Mumbai trade experts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
              <button
                onClick={() => navigate('contact')}
                className="w-full sm:w-auto bg-surface hover:bg-neutral-100 text-primary px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-[12px] transition-colors cursor-pointer shadow"
              >
                Send Inquiry
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
    </div>
  )
}

