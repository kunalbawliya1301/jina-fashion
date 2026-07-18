import type { Page } from '../App'

interface Props {
  navigate: (p: Page) => void
}

export default function WireFooter({ navigate }: Props) {
  const socialIcons = [
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      svg: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/919876543210',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.994 9.994 0 004.778 1.205h.004c5.505 0 9.989-4.478 9.99-9.984a9.965 9.965 0 00-2.92-7.063A9.966 9.966 0 0012.012 2zm5.835 14.165c-.32.9-1.845 1.637-2.536 1.742-.69.105-1.547.19-4.577-.962-3.882-1.478-6.393-5.398-6.586-5.653-.193-.255-1.547-2.037-1.547-3.878 0-1.84.965-2.747 1.31-3.1.345-.353.9-.51 1.39-.51.162 0 .307.009.434.017.373.024.56.04.805.586.255.57.87 2.115.945 2.27.076.155.127.336.026.544-.1.21-.2.34-.396.574-.197.234-.413.527-.588.707-.197.202-.405.422-.172.825.233.402.936 1.54 2.01 2.49 1.385 1.226 2.55 1.607 2.915 1.76.365.153.58.127.794-.12.214-.247.925-1.077 1.173-1.448.247-.37.495-.31.833-.185.337.125 2.146 1.01 2.507 1.19.362.18.6.27.69.424.09.155.09 1.025-.23 1.925z"></path>
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
    else if (item === 'Collections' || item === 'Sarees' || item === 'Lehengas' || item === 'Salwar Suits' || item === 'Kurtas' || item === 'Dupattas') navigate('collections')
    else if (item === 'Contact' || item === 'WhatsApp') navigate('contact')
    else if (item === 'Admin Portal') navigate('admin')
  }

  return (
    <footer className="border-t border-border-custom bg-secondary-bg">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-start select-none">
              <img
                src="/JINA Logo.png"
                alt="Jina Fashion Logo"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-body-custom leading-relaxed font-sans max-w-xs">
              Luxury Within Reach. Prominent manufacturer and wholesale distributor of premium women's ethnic clothing. Serving retail clients and boutiques worldwide.
            </p>
            <div className="flex gap-3 pt-2">
              {socialIcons.map(soc => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 border border-border-custom bg-surface rounded-[8px] flex items-center justify-center text-body-custom hover:text-brand-accent hover:border-brand-accent transition-all duration-300 shadow-sm hover:shadow"
                  aria-label={soc.name}
                >
                  {soc.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-4 border-b border-border-custom pb-2">Quick Links</div>
            <ul className="space-y-3">
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
            <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-4 border-b border-border-custom pb-2">Collections</div>
            <ul className="space-y-3">
              {['Sarees', 'Lehengas', 'Salwar Suits', 'Kurtas', 'Dupattas'].map(item => (
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

          {/* Contact Column */}
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold mb-4 border-b border-border-custom pb-2">Contact</div>
            <ul className="space-y-3 font-sans text-xs text-body-custom">
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">HQ:</span>
                <span>402, Senapati Bapat Marg, Lower Parel, Mumbai, MH - 400013</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">Tel:</span>
                <a href="tel:+919876543210" className="hover:text-brand-accent transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">Mail:</span>
                <a href="mailto:wholesale@jinafashion.com" className="hover:text-brand-accent transition-colors">wholesale@jinafashion.com</a>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary-accent font-semibold select-none shrink-0">WA:</span>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors underline decoration-brand-accent underline-offset-4">Chat on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-border-custom pt-6 sm:pt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
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

