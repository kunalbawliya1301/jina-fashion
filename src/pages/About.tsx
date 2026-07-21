import type { Page } from '../App'
import { ImgBox, SectionWrapper } from '../components/Wire'
import SocialSection from '../components/SocialSection'

interface Props {
  navigate: (p: Page) => void
}

export default function About({ navigate }: Props) {

  return (
    <div className="space-y-0 animate-fade-in">
      {/* ── HERO BANNER ── */}
      <SectionWrapper label="ABOUT HERO BANNER">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="/Hero Sections/About Us Page.png"
            alt="About Us Hero Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]" />
          <div className="relative z-10 text-center space-y-4 px-4">
            <div className="flex items-center justify-center gap-2 text-surface/80">
              <button onClick={() => navigate('home')} className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-brand-accent transition-colors cursor-pointer">Home</button>
              <span className="text-[10px]">/</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent">About Us</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-surface font-normal">Our Legacy</h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans tracking-[0.1em] uppercase">Luxury Within Reach Since 2010</p>
          </div>
        </div>
      </SectionWrapper>

      {/* ── COMPANY OVERVIEW ── */}
      <SectionWrapper label="COMPANY OVERVIEW">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Text details */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-brand-accent" />
                <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-accent">Who We Are</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal leading-tight">
                A Century-Old Family Legacy In <br className="hidden sm:inline" />
                Ladies Ethnic Wear Manufacturing
              </h2>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                Established in 2021 in the vibrant textile hub of Kalbadevi, Mumbai, <strong>JINA Fashion</strong> is a manufacturer of premium ladies ethnic wear, dedicated to creating elegant designs that celebrate tradition with a contemporary touch.
              </p>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                Founded by a third-generation entrepreneur, JINA Fashion proudly carries forward a family legacy that spans over a century. The journey began more than 100 years ago with a small retail store established by his grandfather in Lower Parel, Mumbai. Over the years, the family expanded its presence into the wholesale garment business under the leadership of his father and brother, building a strong reputation for quality, trust, and customer relationships.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-custom">
                {[
                  ['100+ Yrs', 'Family Legacy'],
                  ['2021', 'Kalbadevi Studio'],
                  ['Mumbai', 'HQ Manufacturing'],
                ].map(([val, label]) => (
                  <div key={label} className="space-y-1">
                    <div className="font-display text-xl sm:text-2xl font-semibold text-brand-accent">{val}</div>
                    <div className="text-[10px] sm:text-xs tracking-wider text-muted-custom uppercase font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Single Showcase Image */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <ImgBox 
                className="w-full max-w-xs sm:max-w-sm lg:max-w-[360px] shadow-md rounded-[16px]" 
                aspect="3/4" 
                src="/About Us Page/Who We Are.png" 
                label="HERITAGE SHOWROOM" 
                alt="Jina Fashion designer boutique showroom"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── BRAND STORY ── */}
      <SectionWrapper label="BRAND STORY">
        <div className="bg-secondary-bg py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 sm:w-12 h-px bg-border-custom" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Our Heritage</span>
                <div className="w-10 sm:w-12 h-px bg-border-custom" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-primary font-normal">Centuries of Craftsmanship & Modern Vision</h2>
              <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans text-left sm:text-center mt-4">
                Inspired by this rich heritage, JINA Fashion combines decades of industry knowledge with modern design sensibilities to manufacture daily & casual wear, festive wear, and fusion wear for ladies ethnic wear. Every garment is created with a commitment to excellence, ensuring our customers receive products that embody elegance, comfort, and value.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: 'Heritage Weaving',
                  src: '/About Us Page/OH-1.png',
                  desc: 'Handloom clusters from Varanasi and Chanderi.'
                },
                {
                  title: 'Artisanal Detailing',
                  src: '/About Us Page/OH-2.png',
                  desc: 'Genuine zari cords and hand-tied zardosi embroidery.'
                },
                {
                  title: 'Modern Tailoring',
                  src: '/About Us Page/OH-3.png',
                  desc: 'Industrial quality control checks before bulk packing.'
                }
              ].map((item, i) => (
                <div key={i} className="group space-y-3 bg-surface p-4 rounded-[12px] border border-border-custom shadow-sm hover:shadow transition-shadow">
                  <ImgBox className="w-full h-48 sm:h-60" src={item.src} label={item.title} alt={item.title} />
                  <div className="pt-2">
                    <h3 className="font-display text-lg text-primary font-normal">{item.title}</h3>
                    <p className="text-xs text-muted-custom mt-1 font-sans">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── MISSION & VISION ── */}
      <SectionWrapper label="MISSION & VISION">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission */}
            <div className="border border-border-custom p-8 sm:p-12 rounded-[12px] bg-surface shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[8px] bg-secondary-bg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.649 8.36A6 6 0 004 14.37a4.91 4.91 0 001.09 3.09L9.65 14.37z"></path>
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-primary font-normal">Our Mission</h3>
                </div>
                <div className="border-b border-border-custom" />
                <p className="text-sm sm:text-base text-body-custom leading-relaxed font-sans">
                  To create premium ethnic wear while delivering exceptional quality, value, and customer satisfaction.
                </p>
                <ul className="space-y-3 pt-2 text-xs text-body-custom font-sans">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>Eliminating trade brokers to ensure honest manufacturer pricing.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>Using environment-certified non-hazardous fabric dyes.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>Honoring traditional handloom clusters with fair weaver wages.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Vision */}
            <div className="bg-primary p-8 sm:p-12 rounded-[12px] shadow-lg text-surface space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[8px] bg-neutral-800 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-surface font-normal">Our Vision</h3>
                </div>
                <div className="border-b border-neutral-800" />
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                  To establish Jina Fashion as the globally preferred wholesale manufacturing partner for women's ethnic wear, celebrated for transparency, modern designs, and dependable logistics.
                </p>
                <ul className="space-y-3 pt-2 text-xs text-neutral-300 font-sans">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>Expanding distribution channels to international boutiques.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>Digitalizing wholesale order placements and dispatch trackers.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                    <span>Leading wholesale catalogs with sustainable organic yarns.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── INSTAGRAM PREVIEW ── */}
      <SocialSection />
    </div>
  )
}

