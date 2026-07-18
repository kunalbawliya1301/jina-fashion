import { useState } from 'react'
import WireNav from './components/WireNav'
import WireFooter from './components/WireFooter'
import Home from './pages/Home'
import About from './pages/About'
import Collections from './pages/Collections'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { ProductProvider } from './context/ProductContext'

export type Page = 'home' | 'about' | 'collections' | 'contact' | 'admin'

export default function App() {
  const [page, setPage] = useState<Page>('home')

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
      <div className="min-h-screen bg-custom-bg font-sans text-body-custom">
        <WireNav current={page} navigate={setPage} />
        <main>{renderPage()}</main>
        <WireFooter navigate={setPage} />
      </div>
    </ProductProvider>
  )
}
