import type { Page } from '../App'
import { ImgBox, WireBtn, SectionWrapper } from '../components/Wire'
import HeroWireframe from '../components/home/HeroWireframe'
import { useProducts } from '../context/ProductContext'

interface Props {
  navigate: (p: Page) => void
}

export default function Home({ navigate }: Props) {
  const { products: allProducts } = useProducts()

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

  const igImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=350',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=350',
  ]

  return (
    <div className="space-y-0">
      <HeroWireframe navigate={navigate} />

      {/* ── ABOUT PREVIEW ── */}
      <SectionWrapper label="ABOUT PREVIEW">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-5">
              <ImgBox 
                className="w-full max-w-md mx-auto lg:max-w-none shadow-md" 
                aspect="3/4" 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800" 
                label="Craftsman Loom" 
                alt="Artisanal loom and thread craft styling"
              />
            </div>
            {/* Text details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-brand-accent" />
                <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-accent">About Jina Fashion</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal leading-tight">
                Heritage Indian Craftsmanship <br className="hidden sm:inline" />
                For Modern Boutiques & Retailers
              </h2>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                For over fifteen years, Jina Fashion has stood at the intersection of traditional handloom artistry and contemporary silhouettes. Headquartered in Mumbai, we manufacture women's ethnic wear that honors age-old craftsmanship while catering to the fast-paced demand of retail stores globally.
              </p>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                We work directly with artisanal weavers across major textile centers, bringing you pure georgettes, fine Chanderis, and rich silk brocades that ensure premium drape, absolute comfort, and distinct colors.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <div key={i} className="group relative bg-surface border border-border-custom rounded-[12px] overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <ImgBox className="w-full" aspect="3/4" src={p.src} label={p.name} alt={p.name} />
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-accent">{p.category}</span>
                    <h3 className="font-display text-lg text-primary font-normal">{p.name}</h3>
                    <p className="text-xs text-muted-custom leading-normal font-sans truncate">{p.description || p.fabric}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0 space-y-3">
                  <div className="text-[10px] text-body-custom font-semibold bg-secondary-bg px-2.5 py-1 rounded inline-block">
                    MOQ: {p.moq}
                  </div>
                  <button
                    onClick={() => navigate('contact')}
                    className="w-full border border-primary text-center py-2.5 text-[10px] tracking-widest uppercase text-primary font-bold rounded-[8px] bg-transparent hover:bg-primary hover:text-surface transition-all duration-300 cursor-pointer"
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
            <div className="text-center mb-12 sm:mb-16 max-w-xl mx-auto space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Our Value Proposition</span>
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Why Partner With Jina Fashion</h2>
              <p className="text-body-custom font-sans text-sm leading-relaxed">
                We empower retail stores and independent boutiques by providing seamless manufacturing, strict quality checks, and fair rates.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feat, i) => (
                <div key={i} className="bg-surface border border-border-custom p-8 rounded-[12px] hover:shadow-md transition-all duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-[8px] bg-secondary-bg flex items-center justify-center">
                    {feat.svg}
                  </div>
                  <h3 className="font-display text-lg text-primary font-normal">{feat.title}</h3>
                  <p className="text-sm text-body-custom leading-relaxed font-sans">{feat.desc}</p>
                </div>
              ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-border-custom p-8 rounded-[12px] bg-surface hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-5xl text-brand-accent/30 font-display leading-none select-none">“</div>
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
              Grow Your Retail Business With <br />
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

