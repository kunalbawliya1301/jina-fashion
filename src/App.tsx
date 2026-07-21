import { useState, useEffect } from 'react'
import WireNav from './components/WireNav'
import WireFooter from './components/WireFooter'
import Home from './pages/Home'
import About from './pages/About'
import Collections from './pages/Collections'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { ProductProvider } from './context/ProductContext'
import { SocialProvider } from './context/SocialContext'
import { WhatsAppCTA } from './components/ui/WhatsAppCTA'
import { AIChatbot } from './components/ui/AIChatbot'

export type Page = 'home' | 'about' | 'collections' | 'contact' | 'admin'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [page])

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home navigate={setPage} />
      case 'about': return <About navigate={setPage} />
      case 'collections': return <Collections navigate={setPage} />
      case 'contact': return <Contact />
      case 'admin': return <Admin navigate={setPage} />
    }
  }

  return (
    <ProductProvider>
      <SocialProvider>
        <div className="min-h-screen flex flex-col bg-surface text-primary antialiased font-sans transition-colors duration-300">
          <WireNav current={page} navigate={setPage} />
          <main className="flex-grow">
            {renderPage()}
          </main>
          <WireFooter navigate={setPage} />
          <WhatsAppCTA />
          <AIChatbot />
        </div>
      </SocialProvider>
    </ProductProvider>
  )
}
