import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
}

export default function WireFooter({ navigate }: Props) {
  const socialIcons = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/_jina_fashion',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      url: 'https://pinterest.com',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.017 0C5.396 0 0 5.396 0 12.017c0 5.082 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.397 2.967 7.397 6.93 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.27 1.029-1.002 2.319-1.492 3.111 1.124.347 2.317.534 3.554.534 6.621 0 12.017-5.396 12.017-12.017C24.034 5.396 18.638 0 12.017 0z"></path>
        </svg>
      ),
    },
  ]

  const handleLinkClick = (item: string) => {
    if (item === 'Home') navigate('home')
    else if (item === 'About Us' || item === 'About') navigate('about')
    else if (item === 'Collections' || item === 'Cord Sets' || item === 'Dupatta Set' || item === 'Kurties' || item === 'Pant/Plazzo set' || item === 'Short Tops') navigate('collections')
    else if (item === 'Contact' || item === 'WhatsApp') navigate('contact')
    else if (item === 'Admin Portal') navigate('admin')
  }

  return (
    <footer className="border-t border-border-custom bg-secondary-bg">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 pb-8">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-16">
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start select-none">
              <img
                src="/JINA Logo.png"
                alt="Jina Fashion Logo"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-body-custom leading-relaxed font-sans max-w-xs">
              Luxury Within Reach. Prominent manufacturer and wholesale distributor of premium women's ethnic clothing serving retail clients & boutiques worldwide.
            </p>
            <div className="flex gap-2.5 pt-1">
              {socialIcons.map(soc => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 border border-border-custom bg-surface rounded-[8px] flex items-center justify-center text-body-custom hover:text-brand-accent hover:border-brand-accent transition-all duration-300 shadow-xs hover:shadow"
                  aria-label={soc.name}
                >
                  {soc.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Collections Row on Mobile (2-column side-by-side) */}
          <div className="grid grid-cols-2 gap-6 sm:contents">
            {/* Quick Links Column */}
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-3 sm:mb-4 border-b border-border-custom pb-2">Quick Links</div>
              <ul className="space-y-2.5 sm:space-y-3">
                {['Home', 'About Us', 'Collections', 'Contact', 'Admin Portal'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => handleLinkClick(item)}
                      className="text-xs text-body-custom hover:text-brand-accent tracking-wide transition-colors cursor-pointer text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections Column */}
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-3 sm:mb-4 border-b border-border-custom pb-2">Collections</div>
              <ul className="space-y-2.5 sm:space-y-3">
                {['Cord Sets', 'Dupatta Set', 'Kurties', 'Pant/Plazzo set', 'Short Tops'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => handleLinkClick(item)}
                      className="text-xs text-body-custom hover:text-brand-accent tracking-wide transition-colors cursor-pointer text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-3 sm:mb-4 border-b border-border-custom pb-2">Contact</div>
            <ul className="space-y-2.5 sm:space-y-3 font-sans text-xs text-body-custom">
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">HQ:</span>
                <span>Room No.30, Bldg 2, Fruitwala Bldg Delisle Rd, NM Joshi Marg, Mumbai 400013</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">Tel:</span>
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+919967998080" className="hover:text-brand-accent transition-colors">+91 99679 98080</a>
                  <a href="tel:+919892028161" className="hover:text-brand-accent transition-colors">+91 98920 28161</a>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">Mail:</span>
                <a href="mailto:order.jinafashion@gmail.com" className="hover:text-brand-accent transition-colors truncate">order.jinafashion@gmail.com</a>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">WA:</span>
                <a href="https://wa.me/919967998080" target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors underline decoration-brand-accent underline-offset-4 font-medium">+91 99679 98080</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-border-custom pt-6 sm:pt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-center sm:text-left">
          <span className="text-[11px] text-muted-custom">© 2026 Jina Fashion. All rights reserved.</span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use'].map(l => (
              <a key={l} href="#" className="text-[11px] text-muted-custom hover:text-brand-accent transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

