import { useState, useRef } from 'react'
import type { Page } from '../App'
import { useProducts, Product } from '../context/ProductContext'
import { SectionWrapper } from '../components/Wire'

interface Props {
  navigate: (p: Page) => void
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary Direct Upload (Option A: browser → Cloudinary)
// Server signs the request; image never passes through our backend.
// ─────────────────────────────────────────────────────────────────────────────
interface CloudinarySignature {
  signature: string
  timestamp: number
  folder: string
  uploadPreset: string
  cloudName: string
  apiKey: string
}

async function getUploadSignature(token: string): Promise<CloudinarySignature> {
  const res = await fetch(`${API_BASE}/upload/signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to get upload signature')
  return json
}

async function uploadToCloudinary(
  file: File,
  sig: CloudinarySignature,
  onProgress?: (pct: number) => void
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', sig.signature)
    formData.append('timestamp', String(sig.timestamp))
    formData.append('folder', sig.folder)
    formData.append('upload_preset', sig.uploadPreset)
    formData.append('api_key', sig.apiKey)
    formData.append('transformation', 'q_auto,f_auto')

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, publicId: data.public_id })
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err.error?.message || 'Cloudinary upload failed'))
        } catch {
          reject(new Error('Cloudinary upload failed'))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`)
    xhr.send(formData)
  })
}

// ── Preset sample images (fallback when no file is uploaded) ─────────────────
const IMAGE_PRESETS = [
  { label: 'Red Bridal Silk Saree', url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600' },
  { label: 'Gold Zardozi Silk', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600' },
  { label: 'Embroidered Lehenga', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600' },
  { label: 'Royal Velvet Lehenga', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600' },
  { label: 'Classic Salwar Suit', url: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=600' },
  { label: 'Chanderi Designer Suit', url: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=600' },
  { label: 'Anarkali Block Kurta', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600' },
  { label: 'Luxury Silk Dupatta', url: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=600' },
]

export default function Admin({ navigate }: Props) {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    fetchProducts,
  } = useProducts()

  // ── Auth State ─────────────────────────────────────────────────────────────
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('jina_admin_token'))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!sessionStorage.getItem('jina_admin_token'))
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [loginAttempts, setLoginAttempts] = useState(0)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      })

      const json = await res.json()

      if (!res.ok) {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        setAuthError(
          newAttempts >= 4
            ? 'Multiple failed attempts detected. Account locked for 15 minutes after 5 attempts.'
            : (json.message || 'Invalid administrator credentials.')
        )
        return
      }

      const { token: jwt } = json
      sessionStorage.setItem('jina_admin_token', jwt)
      setToken(jwt)
      setIsAuthenticated(true)
      setLoginAttempts(0)
      showToast('Welcome back, Admin! ✅')
    } catch (_err) {
      setAuthError('Connection error. Please check if the server is running.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (_err) { /* silent */ }
    sessionStorage.removeItem('jina_admin_token')
    setToken(null)
    setIsAuthenticated(false)
    setLoginPassword('')
  }

  // ── Filters & Search ───────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // ── Modal State ────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // ── Upload State ───────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg)
    setToastType(type)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  const defaultForm = {
    name: '', category: 'Sarees', fabric: '', moq: '4 Pcs',
    wholesalePrice: '₹5,000 / pc', description: '',
    status: 'In Stock' as const, featured: false, src: IMAGE_PRESETS[0].url,
    cloudinaryPublicId: '',
  }
  const [formData, setFormData] = useState(defaultForm)
  const [formLoading, setFormLoading] = useState(false)

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setFormData(defaultForm)
    setUploadFile(null)
    setUploadPreview(null)
    setUploadProgress(0)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p)
    setFormData({
      name: p.name,
      category: p.category,
      fabric: p.fabric,
      moq: p.moq || '4 Pcs',
      wholesalePrice: p.wholesalePrice || '',
      description: p.description || '',
      status: (p.status as typeof formData.status) || 'In Stock',
      featured: p.featured || false,
      src: p.src,
      cloudinaryPublicId: p.cloudinaryPublicId || '',
    })
    setUploadFile(null)
    setUploadPreview(null)
    setUploadProgress(0)
    setIsModalOpen(true)
  }

  // ── File picker handler ────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      showToast('Only JPG, PNG, WebP, or AVIF images are allowed.', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be under 10MB.', 'error')
      return
    }

    setUploadFile(file)
    setUploadPreview(URL.createObjectURL(file))
  }

  // ── Form submit (Add or Edit) ──────────────────────────────────────────────
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { showToast('Product name is required.', 'error'); return }
    if (!token) { showToast('Session expired. Please sign in again.', 'error'); handleSignOut(); return }

    setFormLoading(true)

    try {
      let finalSrc = formData.src
      let finalPublicId = formData.cloudinaryPublicId

      // Upload to Cloudinary if a new file was picked
      if (uploadFile) {
        setIsUploading(true)
        setUploadProgress(0)
        const sig = await getUploadSignature(token)
        const { url, publicId } = await uploadToCloudinary(uploadFile, sig, pct => setUploadProgress(pct))
        finalSrc = url
        finalPublicId = publicId
        setIsUploading(false)
      }

      const payload = { ...formData, src: finalSrc, cloudinaryPublicId: finalPublicId }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload, token)
        showToast(`"${formData.name}" updated successfully!`)
      } else {
        await addProduct(payload, token)
        showToast(`"${formData.name}" added to catalogue!`)
      }

      setIsModalOpen(false)
    } catch (err) {
      const msg = (err as Error).message
      if (msg.includes('expired') || msg.includes('401')) {
        showToast('Session expired. Please sign in again.', 'error')
        handleSignOut()
      } else {
        showToast(msg || 'An error occurred.', 'error')
      }
    } finally {
      setFormLoading(false)
      setIsUploading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId || !token) return
    try {
      const prod = products.find(p => p.id === deleteConfirmId)
      await deleteProduct(deleteConfirmId, token)
      showToast(`"${prod?.name || 'Product'}" removed from catalogue.`)
      setDeleteConfirmId(null)
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleToggleFeatured = async (id: string) => {
    if (!token) return
    try {
      await toggleFeatured(id, token)
    } catch (err) {
      showToast((err as Error).message, 'error')
    }
  }

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2))
    const a = document.createElement('a')
    a.setAttribute('href', dataStr)
    a.setAttribute('download', `jina_catalog_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(a)
    a.click()
    a.remove()
    showToast('Catalog exported as JSON.')
  }

  // ── Filtered products ──────────────────────────────────────────────────────
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.fabric && p.fabric.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sareesCount   = products.filter(p => p.category === 'Sarees').length
  const lehengasCount = products.filter(p => p.category === 'Lehengas').length
  const suitsCount    = products.filter(p => p.category === 'Suits' || p.category === 'Salwar Suits').length
  const kurtasCount   = products.filter(p => p.category === 'Kurtas').length
  const dupattasCount = products.filter(p => p.category === 'Dupattas').length
  const featuredCount = products.filter(p => p.featured).length

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 animate-fade-in">
        <div className="max-w-md w-full bg-surface border border-border-custom rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">

          <div className="text-center space-y-3">
            <img src="/JINA Logo.png" alt="Jina Fashion" className="h-10 w-auto object-contain mx-auto mb-4" />
            <div className="w-12 h-12 rounded-2xl bg-secondary-bg text-brand-accent flex items-center justify-center mx-auto border border-border-custom">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-primary font-semibold">Protected Admin Access</h2>
            <p className="text-xs text-body-custom leading-relaxed">
              Enter your assigned administrator credentials to access the wholesale product management portal.
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-slide-up">
              <span>⚠️</span><span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Admin Email</label>
              <input
                type="email" required autoComplete="username"
                placeholder="order.jinafashion@gmail.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Admin Passcode</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-brand-accent pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-custom hover:text-primary cursor-pointer">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={authLoading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-surface py-3.5 text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-md"
            >
              {authLoading ? 'Authenticating…' : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border-custom">
            <button onClick={() => navigate('home')}
              className="text-xs text-muted-custom hover:text-brand-accent transition-colors font-medium cursor-pointer">
              ← Back to Storefront
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN DASHBOARD (AUTHENTICATED)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-0 animate-fade-in min-h-screen">
      {/* Toast */}
      {toastMessage && (
        <div className={`fixed top-24 right-4 sm:right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border animate-slide-up text-xs sm:text-sm font-medium tracking-wide ${
          toastType === 'error'
            ? 'bg-rose-900 text-rose-100 border-rose-700'
            : 'bg-primary text-surface border-brand-accent'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${toastType === 'error' ? 'bg-rose-400' : 'bg-brand-accent'} animate-pulse`} />
          {toastMessage}
        </div>
      )}

      {/* ── Header ── */}
      <SectionWrapper label="ADMIN HEADER">
        <div className="bg-primary text-surface py-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent bg-brand-accent/15 border border-brand-accent/30 px-3 py-1 rounded-full">
                ✓ Verified Admin Session
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-normal text-surface mt-2">
                Catalogue & Product Admin
              </h1>
              <p className="text-xs text-neutral-400 max-w-xl">
                Add, edit, and manage products. All changes sync live to the Collections and Home pages.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={handleOpenAddModal}
                className="bg-brand-accent hover:bg-accent-hover text-surface px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Product
              </button>

              <button onClick={() => fetchProducts({ limit: 100 })}
                className="border border-neutral-700 hover:bg-neutral-800 text-surface px-4 py-2.5 text-xs font-medium tracking-wider uppercase rounded-xl transition-colors flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>

              <button onClick={handleExportJSON}
                className="border border-neutral-700 hover:bg-neutral-800 text-surface px-4 py-2.5 text-xs font-medium tracking-wider uppercase rounded-xl transition-colors flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export JSON
              </button>

              <button onClick={handleSignOut}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Metrics ── */}
      <SectionWrapper label="ADMIN METRICS">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {productsError && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl">
              ⚠️ Could not load products: {productsError}. Is the backend server running?
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: 'Total', value: products.length, sub: 'Live Products', color: 'text-primary' },
              { label: 'Sarees', value: sareesCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Lehengas', value: lehengasCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Suits', value: suitsCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Kurtas', value: kurtasCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Dupattas', value: dupattasCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Featured', value: featuredCount, sub: 'Home Showcase', color: 'text-brand-accent' },
            ].map(metric => (
              <div key={metric.label} className="bg-surface p-4 rounded-2xl border border-border-custom shadow-xs hover:border-brand-accent/40 transition-colors">
                <span className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${metric.color}`}>{metric.label}</span>
                <span className={`font-display text-2xl font-semibold block ${metric.color}`}>
                  {productsLoading ? '…' : metric.value}
                </span>
                <span className="text-[10px] text-body-custom mt-1 block">{metric.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Inventory Table ── */}
      <SectionWrapper label="ADMIN INVENTORY TABLE">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-surface border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 border-b border-border-custom pb-6">
              <div className="relative flex-1 max-w-md">
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-custom" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Search by name, category…"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl pl-10 pr-8 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent" />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-custom hover:text-primary">✕</button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-secondary-bg/60 border border-border-custom rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-brand-accent cursor-pointer">
                  <option value="All">All Categories</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Lehengas">Lehengas</option>
                  <option value="Suits">Suits</option>
                  <option value="Kurtas">Kurtas</option>
                  <option value="Dupattas">Dupattas</option>
                </select>

                <span className="text-xs text-muted-custom">
                  {productsLoading ? 'Loading…' : <><b>{filteredProducts.length}</b> / {products.length} products</>}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-custom text-[11px] font-bold tracking-widest text-primary uppercase">
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Featured</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/60 text-xs">
                  {productsLoading ? (
                    <tr><td colSpan={4} className="py-12 text-center text-muted-custom">Loading products from server…</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center text-muted-custom">No products match your filters.</td></tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-secondary-bg/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-13 rounded-lg bg-secondary-bg overflow-hidden shrink-0 border border-border-custom">
                              <img src={product.src} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                              <div className="font-medium text-primary text-xs sm:text-sm leading-snug">{product.name}</div>
                              {product.description && <div className="text-[10px] text-muted-custom truncate max-w-xs">{product.description}</div>}
                              <div className="text-[10px] text-muted-custom font-mono mt-0.5">ID: {String(product.id).slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-secondary-bg text-primary border border-border-custom">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button onClick={() => handleToggleFeatured(product.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${product.featured ? 'text-amber-500 bg-amber-50' : 'text-neutral-300 hover:text-neutral-400'}`}>
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEditModal(product)}
                              className="px-3 py-1.5 bg-secondary-bg hover:bg-border-custom text-primary text-[11px] font-semibold rounded-lg transition-colors cursor-pointer">
                              Edit
                            </button>
                            <button onClick={() => setDeleteConfirmId(product.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-border-custom shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 space-y-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-border-custom pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase block">
                  {editingProduct ? 'Edit Product' : 'New Product'}
                </span>
                <h3 className="font-display text-2xl font-semibold text-primary">
                  {editingProduct ? 'Update Product Details' : 'Add New Product to Catalog'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-custom hover:text-primary text-xl p-2 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Product Name *</label>
                <input type="text" required placeholder="e.g. Kanchipuram Mulberry Silk Saree"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Category *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent cursor-pointer">
                  {['Sarees','Lehengas','Suits','Kurtas','Dupattas'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Product Image</label>

                {/* File drop zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-custom hover:border-brand-accent/60 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-secondary-bg/30 relative"
                >
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="preview" className="w-20 h-24 object-cover rounded-xl mx-auto border border-border-custom" />
                  ) : formData.src ? (
                    <img src={formData.src} alt="current" className="w-20 h-24 object-cover rounded-xl mx-auto border border-border-custom opacity-70" />
                  ) : (
                    <div className="text-muted-custom">
                      <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M9 9.75h.008v.008H9V9.75zm6.75 0h.008v.008h-.008V9.75zm.75-3a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
                      </svg>
                    </div>
                  )}
                  <p className="text-[11px] text-body-custom mt-2">Click to upload image <span className="text-muted-custom">(JPG, PNG, WebP, AVIF · max 10MB)</span></p>
                  {uploadFile && <p className="text-[10px] text-brand-accent font-semibold mt-1">{uploadFile.name}</p>}
                </div>

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden" onChange={handleFileChange} />

                {/* Upload progress */}
                {isUploading && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-body-custom mb-1">
                      <span>Uploading to Cloudinary…</span><span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary-bg rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent transition-all duration-200 rounded-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* OR: Image URL field */}
                <div className="mt-3">
                  <label className="block text-[10px] font-semibold text-muted-custom uppercase tracking-wider mb-1">Or paste Image URL:</label>
                  <input type="url" placeholder="https://res.cloudinary.com/…" value={formData.src}
                    onChange={e => { setFormData({ ...formData, src: e.target.value }); setUploadFile(null); setUploadPreview(null) }}
                    className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent" />
                </div>

                {/* Preset image picker */}
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-custom uppercase">Sample Images:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {IMAGE_PRESETS.map((p, i) => (
                      <button key={i} type="button"
                        onClick={() => { setFormData({ ...formData, src: p.url }); setUploadFile(null); setUploadPreview(null) }}
                        className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${formData.src === p.url && !uploadFile ? 'bg-brand-accent text-surface border-brand-accent font-bold' : 'bg-secondary-bg text-body-custom border-border-custom hover:border-brand-accent'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Description</label>
                <textarea rows={3} placeholder="Crafted with pure Mulberry silk…"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent resize-none" />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="featuredCheck" checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-brand-accent rounded cursor-pointer" />
                <label htmlFor="featuredCheck" className="text-xs font-semibold text-primary cursor-pointer select-none">
                  Feature on Homepage
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-custom">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-secondary-bg hover:bg-border-custom text-primary text-xs font-bold tracking-wider uppercase rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="px-6 py-2.5 bg-brand-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-surface text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2">
                  {formLoading && <div className="w-3 h-3 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl border border-border-custom shadow-2xl max-w-sm w-full p-7 space-y-6 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
            <div>
              <h3 className="font-display text-xl font-semibold text-primary mb-1">Confirm Delete</h3>
              <p className="text-xs text-body-custom">This will permanently remove the product from the catalog and delete its image from Cloudinary.</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 bg-secondary-bg hover:bg-border-custom text-primary text-xs font-bold uppercase rounded-xl cursor-pointer">
                Cancel
              </button>
              <button onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-surface text-xs font-bold uppercase rounded-xl cursor-pointer shadow-md">
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
