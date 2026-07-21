import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const MAYA_AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm **Maya**, your AI assistant at **Jina Fashion**! 🌟 How can I help you today? Ask me about our wholesale saree catalogs, MOQs, bulk ordering, or custom manufacturing!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showScrollTooltip, setShowScrollTooltip] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Show tooltip when user is near the top of the page
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTooltip(window.scrollY < 150)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Focus input field when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg = text.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I encountered an issue. Please try again.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Sorry, I could not connect to the AI service right now. Please try again later.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const parseLinks = (text: string) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      const linkText = match[1]
      const linkUrl = match[2]
      parts.push(
        <a 
          key={match.index} 
          href={linkUrl} 
          className="text-brand-accent underline font-semibold hover:text-white transition-colors"
          target={linkUrl.startsWith('http') ? '_blank' : undefined}
          rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {linkText}
        </a>
      )
      lastIndex = linkRegex.lastIndex
    }

    if (lastIndex < text.length) parts.push(text.substring(lastIndex))
    return parts.length > 0 ? parts : [text]
  }

  const parseInlineMarkdown = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...parseLinks(text.substring(lastIndex, match.index)))
      }
      parts.push(<strong key={match.index} className="font-semibold text-white">{match[1]}</strong>)
      lastIndex = boldRegex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(...parseLinks(text.substring(lastIndex)))
    }
    return parts.length > 0 ? parts : parseLinks(text)
  }

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-white/80 my-0.5 text-xs sm:text-sm break-words">
            {parseInlineMarkdown(trimmed.substring(2))}
          </li>
        )
      }
      if (!trimmed) return <div key={idx} className="h-1.5" />
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-0.5 text-white/90 break-words">
          {parseInlineMarkdown(line)}
        </p>
      )
    })
  }

  const suggestions = [
    "What wholesale categories do you offer?",
    "What are your MOQs and manufacturing rates?",
    "How can I contact your sales team?",
  ]

  return (
    <>
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-[1000] flex flex-col w-[280px] min-[360px]:w-[320px] sm:w-[380px] max-w-[calc(100vw-2rem)] h-[380px] min-[360px]:h-[450px] sm:h-[580px] max-h-[75vh] rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-[#121015]/95 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
                  <img 
                    src={MAYA_AVATAR} 
                    alt="Maya AI Assistant" 
                    className="h-10 w-10 rounded-full object-cover border border-brand-accent/40 shadow-xs" 
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white font-display">Maya | AI Assistant</h3>
                  <span className="text-[10px] text-white/50 tracking-wider uppercase font-medium">Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message History */}
            <div className="flex-grow overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4 select-text">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 sm:gap-3 max-w-[88%] min-w-0 ${
                    msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 select-none items-center justify-center rounded-full border bg-[#9B486F] border-brand-accent text-white">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  ) : (
                    <img 
                      src={MAYA_AVATAR} 
                      alt="Maya" 
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-brand-accent/40 shrink-0 select-none shadow-xs" 
                    />
                  )}
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-[1rem] sm:rounded-[1.25rem] shadow-sm select-text min-w-0 break-words ${
                      msg.role === 'user'
                        ? 'bg-[#9B486F] text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                    }`}
                  >
                    {formatMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 sm:gap-3 max-w-[85%] self-start">
                  <img 
                    src={MAYA_AVATAR} 
                    alt="Maya" 
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border border-brand-accent/40 shrink-0 select-none" 
                  />
                  <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-[1rem] rounded-tl-none">
                    <div className="flex gap-1.5 items-center justify-center h-4 w-12">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="flex flex-col gap-1.5 mt-2 border-t border-white/10 pt-3 shrink-0">
                  <span className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest font-semibold">Suggested Questions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="px-2.5 py-1.5 text-left rounded-xl bg-white/[0.04] border border-white/10 text-white/80 hover:bg-brand-accent/20 hover:border-brand-accent/40 hover:text-white transition-all duration-300 text-[10px] sm:text-xs cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
              className="p-3 sm:p-4 bg-white/[0.02] border-t border-white/10 flex gap-1.5 sm:gap-2 items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about catalogs, MOQs, rates..."
                disabled={isLoading}
                className="flex-grow h-9 sm:h-11 px-3 sm:px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-brand-accent/60 transition-all text-xs sm:text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#9B486F] text-white hover:bg-brand-accent disabled:opacity-40 transition-all shrink-0 cursor-pointer shadow-sm"
                aria-label="Send Message"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div 
        className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 select-none pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {((showScrollTooltip && !isOpen) || (isHovered && !isOpen)) && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="px-4 py-2 rounded-xl bg-[#9B486F] text-white text-xs md:text-sm font-semibold tracking-wide shadow-xl flex items-center gap-1.5 relative border border-brand-accent/30 mr-1 whitespace-nowrap"
            >
              Ask Maya 🌟
              <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#9B486F]" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-tr from-[#9B486F] to-brand-accent text-white shadow-[0_4px_24px_rgba(201,106,148,0.4)] transition-all duration-300 group cursor-pointer"
          aria-label="Toggle AI Assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  )
}
