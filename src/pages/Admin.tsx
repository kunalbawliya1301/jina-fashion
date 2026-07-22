import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Page } from '../App'
import { useProducts, Product } from '../context/ProductContext'
import { useSocial } from '../context/SocialContext'
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
  timestamp?: number
  folder?: string
  uploadPreset?: string
  cloudName: string
  apiKey: string
  paramsToSign?: Record<string, string | number>
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
    formData.append('api_key', sig.apiKey)
    formData.append('signature', sig.signature)

    if (sig.paramsToSign) {
      for (const [key, value] of Object.entries(sig.paramsToSign)) {
        formData.append(key, String(value))
      }
    } else {
      if (sig.timestamp) formData.append('timestamp', String(sig.timestamp))
      if (sig.folder) formData.append('folder', sig.folder)
      if (sig.uploadPreset) formData.append('upload_preset', sig.uploadPreset)
      formData.append('transformation', 'q_auto,f_auto')
    }

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

  // ── Social Media / Reels Context Hook ───────────────────────────────────────
  const { items: socialItems, addItem: addSocialItem, deleteItem: deleteSocialItem, resetToDefaults: resetSocialItems } = useSocial()
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false)
  const [socialForm, setSocialForm] = useState<{
    type: 'image' | 'video'
    src: string
    title: string
    link: string
  }>({
    type: 'video',
    src: '',
    title: '',
    link: 'https://instagram.com',
  })

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
    name: '',
    category: 'Cord Sets',
    fabric: '',
    moq: '4 Pcs',
    wholesalePrice: 'Quote on Request',
    description: '',
    status: 'In Stock' as const,
    featured: false,
    src: '',
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
      fabric: p.fabric || '',
      moq: p.moq || '4 Pcs',
      wholesalePrice: p.wholesalePrice || '',
      description: '',
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

  const cordSetsCount   = products.filter(p => p.category === 'Cord Sets').length
  const dupattaSetCount = products.filter(p => p.category === 'Dupatta Set').length
  const kurtiesCount    = products.filter(p => p.category === 'Kurties' || p.category === 'Kurtas').length
  const pantPlazzoCount = products.filter(p => p.category === 'Pant/Plazzo set').length
  const shortTopsCount  = products.filter(p => p.category === 'Short Tops').length
  const featuredCount   = products.filter(p => p.featured).length

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
              { label: 'Cord Sets', value: cordSetsCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Dupatta Set', value: dupattaSetCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Kurties', value: kurtiesCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Pant/Plazzo set', value: pantPlazzoCount, sub: 'Designs', color: 'text-primary' },
              { label: 'Short Tops', value: shortTopsCount, sub: 'Designs', color: 'text-primary' },
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
                  <option value="Cord Sets">Cord Sets</option>
                  <option value="Dupatta Set">Dupatta Set</option>
                  <option value="Kurties">Kurties</option>
                  <option value="Pant/Plazzo set">Pant/Plazzo set</option>
                  <option value="Short Tops">Short Tops</option>
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
                              <img src={product.src} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-medium text-primary text-xs sm:text-sm leading-snug">{product.name}</div>
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

      {/* ── Social Campaign & Instagram Reels Manager ── */}
      <SectionWrapper label="ADMIN SOCIAL CAMPAIGN REELS">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-surface border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-custom pb-6">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-accent block mb-1">Live Home Spreads</span>
                <h2 className="font-display text-2xl font-semibold text-primary">Campaign Spreads on Socials (Reels & Images)</h2>
                <p className="text-xs text-body-custom mt-1">Manage portrait (9:16) video reels and image spreads displayed on the Home page.</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setSocialForm({ type: 'video', src: '', title: '', link: 'https://instagram.com' })
                    setIsSocialModalOpen(true)
                  }}
                  className="bg-brand-accent hover:bg-accent-hover text-surface px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Reel / Media
                </button>
                <button
                  onClick={() => {
                    resetSocialItems()
                    showToast('Reset campaign spreads to default reels & images')
                  }}
                  className="border border-border-custom bg-secondary-bg hover:bg-border-custom text-primary px-3.5 py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Grid of Active Social Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {socialItems.map((item) => (
                <div key={item.id} className="group relative border border-border-custom rounded-2xl overflow-hidden bg-secondary-bg/40 aspect-[9/16] shadow-xs flex flex-col justify-between">
                  {item.type === 'video' ? (
                    <video src={item.src} autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  )}

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-surface text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.type === 'video' ? '🎬 Video Reel' : '🖼️ Image'}
                  </div>

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between text-surface">
                    <div className="text-right">
                      <button
                        onClick={() => {
                          deleteSocialItem(item.id)
                          showToast('Item deleted from campaign spreads')
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-surface p-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Delete item"
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold line-clamp-2">{item.title || 'Untitled Spread'}</p>
                      <a href={item.link || '#'} target="_blank" rel="noreferrer" className="text-[9px] text-brand-accent tracking-widest uppercase font-bold mt-1 block truncate">
                        Link →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 pb-28 sm:pb-6 bg-primary/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-border-custom shadow-2xl max-w-md sm:max-w-lg w-full flex flex-col max-h-[85vh] sm:max-h-[88vh] my-auto overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-border-custom bg-surface shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase block">
                  {editingProduct ? 'Catalogue Management' : 'New Catalogue Item'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-primary mt-0.5">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary-bg hover:bg-border-custom flex items-center justify-center text-muted-custom hover:text-primary transition-colors cursor-pointer text-sm font-semibold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitForm} className="flex flex-col overflow-hidden flex-1">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">

                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Product Name <span className="text-brand-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Chanderi Silk Saree"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-secondary-bg/50 border border-border-custom rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-brand-accent focus:bg-surface focus:ring-2 focus:ring-brand-accent/10 transition-all placeholder:text-muted-custom/50 font-medium"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Category <span className="text-brand-accent">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-secondary-bg/50 border border-border-custom rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-brand-accent focus:bg-surface transition-all cursor-pointer font-medium"
                  >
                    {['Cord Sets', 'Dupatta Set', 'Kurties', 'Pant/Plazzo set', 'Short Tops'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* ── Product Image Upload & Link Section ── */}
                <div className="space-y-3 pt-3 border-t border-border-custom/80">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Product Image
                    </label>
                    <span className="text-[10px] text-muted-custom">Upload file or paste direct URL</span>
                  </div>

                  {/* Clean Upload Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-border-custom hover:border-brand-accent/70 rounded-2xl p-4 text-center cursor-pointer transition-all bg-secondary-bg/20 hover:bg-secondary-bg/50 relative flex flex-col items-center justify-center min-h-[120px]"
                  >
                    {uploadPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative group/img">
                          <img src={uploadPreview} alt="Upload preview" className="h-24 w-20 object-cover rounded-xl shadow-md border border-border-custom" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setUploadFile(null)
                              setUploadPreview(null)
                            }}
                            className="absolute -top-2 -right-2 bg-rose-500 text-surface rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-600 transition-colors"
                            title="Remove selected file"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-[11px] text-brand-accent font-semibold truncate max-w-[200px]">
                          Selected: {uploadFile?.name}
                        </p>
                      </div>
                    ) : (
                      <div className="py-2 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-2xl bg-surface border border-border-custom flex items-center justify-center text-muted-custom group-hover:text-brand-accent group-hover:border-brand-accent/40 shadow-xs transition-colors mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        </div>
                        <p className="text-xs text-primary font-semibold">
                          Click to upload image
                        </p>
                        <p className="text-[11px] text-muted-custom mt-0.5">
                          JPG, PNG, WebP, AVIF — max 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Upload Progress Bar */}
                  {isUploading && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-body-custom font-medium">
                        <span>Uploading to Cloudinary...</span>
                        <span className="font-mono text-brand-accent font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-secondary-bg rounded-full overflow-hidden border border-border-custom/50">
                        <div className="h-full bg-brand-accent transition-all duration-200 rounded-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Image URL Input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-muted-custom uppercase tracking-wider">
                      Or direct Image URL:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.src}
                        onChange={e => {
                          setFormData({ ...formData, src: e.target.value })
                          setUploadFile(null)
                          setUploadPreview(null)
                        }}
                        className="flex-1 bg-secondary-bg/50 border border-border-custom rounded-xl px-3.5 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent transition-all"
                      />
                      {formData.src && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, src: '' })}
                          className="px-2.5 py-2 text-[11px] font-semibold text-muted-custom hover:text-rose-500 bg-secondary-bg rounded-xl border border-border-custom transition-colors cursor-pointer shrink-0"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Product Image Preview (if image URL exists and no file chosen) */}
                  {formData.src && !uploadPreview && (
                    <div className="flex items-center gap-3 p-2.5 bg-secondary-bg/30 border border-border-custom rounded-2xl">
                      <img
                        src={formData.src}
                        alt="Product thumbnail"
                        className="w-12 h-14 object-cover rounded-xl border border-border-custom shrink-0 shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent block">
                          Active Image Preview
                        </span>
                        <p className="text-[11px] text-body-custom font-mono truncate mt-0.5">
                          {formData.src}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Sticky Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-custom bg-surface shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-secondary-bg hover:bg-border-custom text-primary text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-brand-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-surface text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {formLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-surface/40 border-t-surface rounded-full animate-spin" />
                  )}
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pb-24 sm:pb-4 bg-primary/80 backdrop-blur-sm animate-fade-in">
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
        </div>,
        document.body
      )}

      {/* ── Add Social Media Reel / Image Modal ── */}
      {isSocialModalOpen && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 pb-28 sm:pb-6 bg-primary/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-border-custom shadow-2xl max-w-md w-full p-6 sm:p-7 my-auto space-y-6">
            <div className="flex items-start justify-between border-b border-border-custom pb-4">
              <div>
                <span className="text-[10px] font-bold tracking-[0.18em] text-brand-accent uppercase block">
                  Campaign Spread Media
                </span>
                <h3 className="font-display text-2xl font-semibold text-primary mt-0.5">
                  Add Social Reel / Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSocialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary-bg hover:bg-border-custom flex items-center justify-center text-muted-custom hover:text-primary transition-colors cursor-pointer text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!socialForm.src) return
                addSocialItem({
                  type: socialForm.type,
                  src: socialForm.src,
                  title: socialForm.title || 'Campaign Spread',
                  link: socialForm.link || 'https://instagram.com',
                })
                setIsSocialModalOpen(false)
                showToast('New social campaign spread added!')
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Media Type <span className="text-brand-accent">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSocialForm({ ...socialForm, type: 'video' })}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      socialForm.type === 'video'
                        ? 'bg-primary text-surface border-primary shadow-xs'
                        : 'bg-secondary-bg border-border-custom text-body-custom hover:border-brand-accent'
                    }`}
                  >
                    🎬 Video Reel (MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialForm({ ...socialForm, type: 'image' })}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      socialForm.type === 'image'
                        ? 'bg-primary text-surface border-primary shadow-xs'
                        : 'bg-secondary-bg border-border-custom text-body-custom hover:border-brand-accent'
                    }`}
                  >
                    🖼️ Image Spread
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Media Source URL (.mp4 / .png / .jpg) <span className="text-brand-accent">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder={socialForm.type === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.png'}
                  value={socialForm.src}
                  onChange={(e) => setSocialForm({ ...socialForm, src: e.target.value })}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent"
                />
                <p className="text-[10px] text-muted-custom">
                  {socialForm.type === 'video'
                    ? 'Provide a fast-loading MP4 URL (Cloudinary video URL or direct CDN link).'
                    : 'Provide an image URL or Cloudinary path.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Title / Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silk Sarees Lookbook Reel"
                  value={socialForm.title}
                  onChange={(e) => setSocialForm({ ...socialForm, title: e.target.value })}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Instagram Link
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/_jina_fashion"
                  value={socialForm.link}
                  onChange={(e) => setSocialForm({ ...socialForm, link: e.target.value })}
                  className="w-full bg-secondary-bg/60 border border-border-custom rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-custom">
                <button
                  type="button"
                  onClick={() => setIsSocialModalOpen(false)}
                  className="px-5 py-2.5 bg-secondary-bg hover:bg-border-custom text-primary text-xs font-bold uppercase rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-accent hover:bg-accent-hover text-surface text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md"
                >
                  Save to Campaign
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
