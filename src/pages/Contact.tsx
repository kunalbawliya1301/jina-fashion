import { useState } from 'react'
import { SectionWrapper } from '../components/Wire'

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    email: '',
    city: '',
    interest: 'Sarees',
    message: '',
    quantity: '100 - 500 Pcs',
    updates: true
  })

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ)?',
      a: 'Our standard MOQ is 4 pieces per design (one full color catalogue pack) or a minimum first order value of ₹25,000 for wholesale trade registration.'
    },
    {
      q: 'Do you ship outside of India?',
      a: 'Yes, we ship to retail partners globally including the USA, UK, Canada, Australia, and the UAE. We use trusted custom cargo agents and air freight like DHL/FedEx.'
    },
    {
      q: 'Can I request fabric swatches or samples?',
      a: 'Yes, digital catalog swatches are free. Physical fabric swatches and color books can be dispatched upon verifying your boutique or business license credentials.'
    },
    {
      q: 'Do you accept bespoke manufacturing orders?',
      a: 'Absolutely. We offer custom weaving, specialized block printing, and custom sizing runs for orders starting at 100 pieces per design block.'
    },
    {
      q: 'What is the return/exchange policy for wholesale?',
      a: 'Due to low manufacturer pricing, returns are only accepted within 7 days of delivery for verified manufacturing weaving flaws or transit damage.'
    }
  ]

  const contactItems = [
    {
      label: 'ADDRESS',
      value: '402, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra, India - 400013',
      svg: (
        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
        </svg>
      )
    },
    {
      label: 'PHONE',
      value: '+91 98765 43210 / +91 22 8765 4321',
      svg: (
        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.122-4.1-6.924-6.924l1.293-.97a1.125 1.125 0 00.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H3.75A2.25 2.25 0 001.5 4.5v2.25z"></path>
        </svg>
      )
    },
    {
      label: 'EMAIL',
      value: 'wholesale@jinafashion.com / support@jinafashion.com',
      svg: (
        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
        </svg>
      )
    },
    {
      label: 'HOURS',
      value: 'Monday to Saturday: 10:00 AM — 7:00 PM (IST)',
      svg: (
        <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  ]

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit inquiry')
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          business: '',
          phone: '',
          email: '',
          city: '',
          interest: 'Sarees',
          message: '',
          quantity: '100 - 500 Pcs',
          updates: true,
        })
      }, 5000)
    } catch (err) {
      setErrorMessage((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-0 animate-fade-in">
      {/* ── HERO BANNER ── */}
      <SectionWrapper label="CONTACT HERO BANNER">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=1600"
            alt="Beautiful apparel rack showroom"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]" />
          <div className="relative z-10 text-center space-y-4 px-4">
            <div className="flex items-center justify-center gap-2 text-surface/80">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-surface">Home</span>
              <span className="text-[10px]">/</span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent">Contact</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-surface font-normal">Contact Us</h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans tracking-[0.1em] uppercase">Connect With Mumbai HQ Team</p>
          </div>
        </div>
      </SectionWrapper>

      {/* ── CONTACT INFO + FORM ── */}
      <SectionWrapper label="CONTACT INFO + INQUIRY FORM">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left: contact info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-brand-accent" />
                  <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-brand-accent">Get In Touch</span>
                </div>
                <h2 className="font-display text-3xl text-primary font-normal leading-tight">
                  Discuss Wholesale & Custom Contracts
                </h2>
                <p className="text-sm text-body-custom mt-3 leading-relaxed font-sans">
                  Whether you wish to place a sample order, request fabric swatches, or configure an custom garment tailoring contract, our sales managers are here to assist.
                </p>
              </div>

              {/* Contact detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactItems.map(({ label, value, svg }) => (
                  <div key={label} className="flex gap-4 p-5 border border-border-custom bg-surface rounded-[12px] shadow-sm hover:shadow transition-shadow">
                    <div className="w-10 h-10 rounded-[8px] bg-secondary-bg flex items-center justify-center shrink-0">
                      {svg}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] tracking-[0.15em] font-bold text-muted-custom uppercase mb-1">{label}</div>
                      <div className="text-xs text-body-custom font-sans leading-relaxed break-words">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp card */}
              <div className="bg-primary text-surface p-6 sm:p-8 rounded-[12px] shadow-md space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[8px] bg-neutral-800 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-brand-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.994 9.994 0 004.778 1.205h.004c5.505 0 9.989-4.478 9.99-9.984a9.965 9.965 0 00-2.92-7.063A9.966 9.966 0 0012.012 2zm5.835 14.165c-.32.9-1.845 1.637-2.536 1.742-.69.105-1.547.19-4.577-.962-3.882-1.478-6.393-5.398-6.586-5.653-.193-.255-1.547-2.037-1.547-3.878 0-1.84.965-2.747 1.31-3.1.345-.353.9-.51 1.39-.51.162 0 .307.009.434.017.373.024.56.04.805.586.255.57.87 2.115.945 2.27.076.155.127.336.026.544-.1.21-.2.34-.396.574-.197.234-.413.527-.588.707-.197.202-.405.422-.172.825.233.402.936 1.54 2.01 2.49 1.385 1.226 2.55 1.607 2.915 1.76.365.153.58.127.794-.12.214-.247.925-1.077 1.173-1.448.247-.37.495-.31.833-.185.337.125 2.146 1.01 2.507 1.19.362.18.6.27.69.424.09.155.09 1.025-.23 1.925z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-normal text-surface">Instant Support via WhatsApp</h3>
                    <p className="text-[10px] text-neutral-300 font-sans mt-0.5 tracking-wider uppercase">Direct connection to Trade desk</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  Have a quick catalog detail or order question? Click below to chat directly with our trade managers on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center w-full bg-surface hover:bg-neutral-100 text-primary py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-[12px] transition-colors cursor-pointer"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Right: inquiry form */}
            <div className="lg:col-span-7">
              <div className="border border-border-custom p-6 sm:p-10 bg-surface rounded-[12px] shadow-sm space-y-6">
                <div>
                  <h3 className="font-display text-2xl text-primary font-normal">Wholesale Inquiry Form</h3>
                  <p className="text-xs text-muted-custom font-sans mt-1">Please provide your trade details for catalogue rates verification.</p>
                </div>

                {submitted ? (
                  <div className="bg-secondary-bg border border-brand-accent p-8 rounded-[12px] text-center space-y-4 animate-fade-in">
                    <div className="w-12 h-12 bg-brand-accent text-surface rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                      </svg>
                    </div>
                    <h4 className="font-display text-lg text-primary font-normal">Thank You for Reaching Out!</h4>
                    <p className="text-xs text-body-custom font-sans leading-relaxed max-w-sm mx-auto">
                      Your inquiry has been successfully transmitted. Our trade representative will review your credentials and contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Priya Sharma"
                          className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Business Name</label>
                        <input
                          type="text"
                          required
                          value={formData.business}
                          onChange={(e) => setFormData({...formData, business: e.target.value})}
                          placeholder="e.g. Elegance Boutique"
                          className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="e.g. wholesale@boutique.com"
                          className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-primary uppercase">City</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="e.g. Jaipur"
                          className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Category Interest</label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({...formData, interest: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all cursor-pointer font-semibold shadow-sm"
                        >
                          <option value="Sarees">Sarees Range</option>
                          <option value="Lehengas">Lehengas Range</option>
                          <option value="Suits">Salwar Suits Range</option>
                          <option value="Kurtas">Kurtas Range</option>
                          <option value="Dupattas">Dupattas & Others</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Quantity Requirement / Description</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Detail your fabrics, colors, styles preference, or request catalog packs..."
                        className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-primary uppercase">Estimated Monthly Order Volume</label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="w-full px-4 py-2.5 text-sm bg-custom-bg border border-border-custom rounded-[8px] focus:outline-none focus:border-brand-accent text-body-custom transition-all cursor-pointer font-semibold shadow-sm"
                      >
                        <option value="Under 100 Pcs">Under 100 Pieces / Month</option>
                        <option value="100 - 500 Pcs">100 to 500 Pieces / Month</option>
                        <option value="500 - 1000 Pcs">500 to 1,000 Pieces / Month</option>
                        <option value="Above 1000 Pcs">Above 1,000 Pieces / Month</option>
                      </select>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        id="updates"
                        type="checkbox"
                        checked={formData.updates}
                        onChange={(e) => setFormData({...formData, updates: e.target.checked})}
                        className="w-4.5 h-4.5 border-border-custom text-brand-accent focus:ring-brand-accent rounded mt-0.5 cursor-pointer accent-brand-accent"
                      />
                      <label htmlFor="updates" className="text-xs text-body-custom leading-tight cursor-pointer select-none">
                        I agree to receive new catalog drops, stock alerts, and wholesale price sheets on WhatsApp.
                      </label>
                    </div>

                    {errorMessage && (
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-surface text-center py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-[12px] cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        {loading && <div className="w-4 h-4 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />}
                        {loading ? 'Dispatching Inquiry…' : 'Submit Inquiry'}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 justify-center text-[10px] text-muted-custom font-medium mt-2">
                      <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
                      </svg>
                      <span>Secure 256-bit SSL encrypted trade verification.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── GOOGLE MAPS ── */}
      <SectionWrapper label="GOOGLE MAPS PLACEHOLDER">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=1600"
            alt="HQ location mockup"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-primary/45" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-primary/50 to-primary/80" />
          
          <div className="relative z-10 bg-surface border border-border-custom p-6 sm:p-8 rounded-[12px] shadow-lg max-w-sm mx-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary-bg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.688A1.125 1.125 0 003 6.694v11.215c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"></path>
              </svg>
            </div>
            <div>
              <h4 className="font-display text-lg text-primary font-normal">Visit Our Mumbai HQ</h4>
              <p className="text-xs text-body-custom font-sans mt-1">402, Senapati Bapat Marg, Lower Parel, MH - 400013</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-primary hover:bg-primary-hover text-surface px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-[8px] transition-colors cursor-pointer"
            >
              Get Directions
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── FAQ ACCORDION ── */}
      <SectionWrapper label="FAQ ACCORDION">
        <div className="bg-secondary-bg py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14 max-w-xl mx-auto space-y-3">
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-accent font-semibold">Support Desk</span>
              <h2 className="font-display text-3xl text-primary font-normal">Frequently Asked Questions</h2>
              <p className="text-sm text-body-custom leading-relaxed font-sans">
                Quick answers concerning retail accounts registrations, custom order runs, and delivery logistics.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border-custom bg-surface rounded-[12px] overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 text-left cursor-pointer focus:outline-none"
                  >
                    <span className="font-display text-base sm:text-lg text-primary font-normal pr-4">{faq.q}</span>
                    <span className="text-lg font-bold text-brand-accent shrink-0">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 sm:px-8 pb-5 sm:pb-6 border-t border-border-custom pt-4 font-sans text-sm text-body-custom leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}

