import { useState } from 'react'

export function WhatsAppCTA() {
  const [isHovered, setIsHovered] = useState(false)
  const rawNumber = '+919967998080'
  const formattedNumber = rawNumber.replace(/[^0-9]/g, '')
  const rawMessage = "Hello! I am interested in Jina Fashion wholesale ethnic wear collections."
  const encodedMessage = encodeURIComponent(rawMessage)
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`

  return (
    <div 
      className="fixed bottom-6 left-6 z-[999] select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-start bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] border border-[#25D366]/20 rounded-full h-12 w-12 md:h-14 md:w-14 px-3 md:px-[14px] transition-[width] duration-300 ease-out overflow-hidden group select-none ${
          isHovered ? 'w-[135px] md:w-[160px]' : ''
        }`}
        style={{ borderRadius: '999px' }}
        aria-label="Chat on WhatsApp"
      >
        <div className="flex items-center gap-2 md:gap-3 w-full shrink-0">
          {/* WhatsApp SVG Icon */}
          <svg
            className="w-6 h-6 md:w-7 md:h-7 shrink-0"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="#FFFFFF" fillRule="evenodd" clipRule="evenodd" d="M82.773,17.048c-38.434-37.321-98.728,8.848-72.606,55.645c-0.001,0-6.545,23.896-6.545,23.896 l24.455-6.412C74.864,114.914,119.655,54.965,82.773,17.048z"/>
            <path fill="#25D366" fillRule="evenodd" clipRule="evenodd" d="M50.143,88.745c-7.593,0.027-14.974-2.253-21.34-6.295c0,0-14.796,3.879-14.796,3.879l3.95-14.421 c-4.438-6.577-6.941-14.291-6.907-22.275C10.98,15.084,53.475-2.531,77.796,22.018C102.312,46.358,84.702,88.821,50.143,88.745z"/>
            <path fill="#FFFFFF" fillRule="evenodd" clipRule="evenodd" d="M71.585,59.476c-1.175-0.588-6.953-3.431-8.03-3.823c-1.077-0.392-1.861-0.588-2.644,0.589 c-0.784,1.176-3.034,3.822-3.72,4.605c-0.685,0.785-1.371,0.883-2.546,0.295c-2.539,0.339-15.564-10.676-15.988-13.97 c-0.685-1.175-0.073-1.812,0.516-2.398c1.023-1.123,2.318-2.535,2.937-4.018c0.392-0.785,0.196-1.471-0.098-2.059 c-0.294-0.588-2.578-6.4-3.623-8.723c-0.88-1.957-1.807-1.996-2.644-2.031c-1.983,0.031-3.518-0.484-5.386,1.443 c-7.004,6.741-3.792,16.214,0.685,21.955c0.587,0.784,8.13,13.028,20.075,17.738c9.927,3.915,11.947,3.136,14.102,2.94 c2.155-0.196,6.953-2.842,7.932-5.586c0.979-2.744,0.979-5.096,0.686-5.587C73.544,60.358,72.76,60.064,71.585,59.476z"/>
          </svg>
          
          <span 
            className={`font-sans text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap text-white transition-opacity duration-200 ${
              isHovered ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            Chat with us
          </span>
        </div>
      </a>
    </div>
  )
}
