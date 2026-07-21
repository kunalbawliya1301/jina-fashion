import type { Page } from '../../App'
import { ImgBox } from '../Wire'

type Props = {
  navigate: (page: Page) => void
}

function HeroButton({ children, onClick, solid = false }: { children: React.ReactNode; onClick: () => void; solid?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[48px] px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 rounded-[12px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        solid
          ? 'bg-primary text-surface hover:bg-primary-hover shadow-sm hover:shadow'
          : 'border border-border-custom bg-surface text-primary hover:bg-secondary-bg'
      }`}
    >
      {children}
    </button>
  )
}

export default function HeroWireframe({ navigate }: Props) {
  return (
    <section className="relative h-auto lg:h-[calc(100svh-5rem)] lg:min-h-[620px] overflow-hidden bg-custom-bg animate-fade-in" aria-label="Jina Fashion hero">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-6">
        <div className="grid w-full h-full grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0 items-center">
          
          {/* Image Section (Top on Mobile order-1, Right on Desktop lg:order-2) */}
          <div className="relative order-1 lg:order-2 lg:col-span-7 lg:col-start-6 lg:row-start-1 h-full flex items-center justify-center">
            <div className="grid grid-cols-12 gap-2.5 sm:gap-4 w-full h-full lg:max-h-[calc(100svh-10rem)]">
              {/* Main Hero Image */}
              <div className="col-span-12 lg:col-span-7 lg:row-span-2 min-h-[260px] sm:min-h-[360px] lg:min-h-0 flex items-center justify-center">
                <ImgBox 
                  className="h-full w-full max-h-[360px] sm:max-h-[420px] lg:max-h-none object-contain" 
                  src="/Home Page/Main.png" 
                  label="HERO LOOK 01" 
                  alt="Indian Ethnic Saree model photoshoot"
                  noHover
                  bgTransparent
                  objectFit="contain"
                />
              </div>

              {/* Side Images (Hidden on Mobile, visible on Desktop) */}
              <div className="hidden lg:block lg:col-span-5 lg:min-h-0">
                <ImgBox 
                  className="h-full w-full shadow-md" 
                  src="/Home Page/Top.png" 
                  label="DETAIL 02" 
                  alt="Zari embroidery work close-up detailed"
                />
              </div>
              <div className="hidden lg:block lg:col-span-5 lg:min-h-0">
                <ImgBox 
                  className="h-full w-full shadow-md" 
                  src="/Home Page/Bottom.png" 
                  label="LOOK 03" 
                  alt="Traditional Indian lehenga bridal wear"
                />
              </div>
            </div>
          </div>

          {/* Text Content Details (Bottom on Mobile order-2, Left on Desktop lg:order-1) */}
          <div className="relative z-10 order-2 lg:order-1 flex flex-col justify-center gap-4 lg:gap-6 lg:col-span-5 h-full py-2">
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 lg:pt-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-brand-accent" />
                <span className="text-[10px] tracking-[0.2em] font-semibold text-brand-accent uppercase">Wholesale Ethnic Wear</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-primary tracking-wide leading-tight">
                  Luxury <br className="hidden sm:inline" />
                  <span className="text-brand-accent italic font-normal">Within Reach</span>
                </h1>
                <p className="font-sans text-sm sm:text-base text-body-custom max-w-lg leading-relaxed pt-1">
                  India's trusted women's ethnic wear manufacturer & wholesaler, bringing premium quality directly to your store.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md pt-0">
                <div className="border-l-2 border-brand-accent pl-3">
                  <div className="text-[10px] tracking-[0.2em] text-primary uppercase font-bold">Premium Quality</div>
                  <p className="text-xs text-body-custom mt-1 leading-snug">Pure georgettes, rich silks, and exquisite handlooms.</p>
                </div>
                <div className="border-l-2 border-secondary-accent pl-3">
                  <div className="text-[10px] tracking-[0.2em] text-primary uppercase font-bold">Wholesale Direct</div>
                  <p className="text-xs text-body-custom mt-1 leading-snug">Unbeatable manufacturer pricing with solid MOQs.</p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center pt-1">
                <HeroButton solid onClick={() => navigate('collections')}>View the collection</HeroButton>
                <HeroButton onClick={() => navigate('contact')}>Start a wholesale inquiry</HeroButton>
              </div>
            </div>

            {/* Stats section */}
            <div className="mt-2 grid grid-cols-3 py-2">
              {[
                ['01', 'Made for', 'Retail', 'MOQs tailored for independent boutiques.'],
                ['02', 'Weekly', 'Drops', 'New designer drops added every week.'],
                ['03', 'Pan India', 'Shipping', 'Fast, secure wholesale shipping across India.'],
              ].map(([number, line1, line2, desc], index) => (
                <div key={number} className={`px-2 sm:px-4 ${index > 0 ? 'border-l border-border-custom' : ''}`}>
                  <div className="text-[10px] font-bold tracking-widest text-brand-accent mb-1">{number}</div>
                  <div className="font-semibold text-[11px] sm:text-xs text-primary tracking-wide font-sans leading-tight">
                    {line1} <br className="sm:hidden" />{line2}
                  </div>
                  <div className="text-[9px] text-muted-custom mt-1 hidden sm:block leading-snug">{desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

