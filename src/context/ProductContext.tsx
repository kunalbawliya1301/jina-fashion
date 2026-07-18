import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  category: string
  fabric: string
  moq: string
  src: string
  wholesalePrice?: string
  description?: string
  status?: 'In Stock' | 'Pre-Order' | 'Low Stock' | 'Out of Stock'
  featured?: boolean
  dateAdded?: string
  cloudinaryPublicId?: string
}

interface PaginatedResponse {
  success: boolean
  total: number
  page: number
  pages: number
  products: Product[]
}

interface ProductContextType {
  products: Product[]
  total: number
  loading: boolean
  error: string | null
  fetchProducts: (params?: FetchParams) => Promise<void>
  addProduct: (data: Omit<Product, 'id'>, token: string) => Promise<Product>
  updateProduct: (id: string, data: Partial<Product>, token: string) => Promise<void>
  deleteProduct: (id: string, token: string) => Promise<void>
  toggleFeatured: (id: string, token: string) => Promise<void>
}

export interface FetchParams {
  page?: number
  limit?: number
  category?: string
  status?: string
  featured?: boolean
  search?: string
  sort?: string
}

// ── API Base URL ──────────────────────────────────────────────────────────────
// In development: Vite proxies /api to http://localhost:5000/api
// In production: set VITE_API_URL in your .env
const API_BASE = import.meta.env.VITE_API_URL || '/api'

// ── Context ───────────────────────────────────────────────────────────────────
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// ── Provider ──────────────────────────────────────────────────────────────────
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Auth headers ──────────────────────────────────────────────────────────
  const authHeaders = (token: string): HeadersInit => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  // ── Fetch products (public) ───────────────────────────────────────────────
  const fetchProducts = useCallback(async (params: FetchParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const qs = new URLSearchParams()
      if (params.page)     qs.set('page', String(params.page))
      if (params.limit)    qs.set('limit', String(params.limit))
      if (params.category) qs.set('category', params.category)
      if (params.status)   qs.set('status', params.status)
      if (params.featured) qs.set('featured', 'true')
      if (params.search)   qs.set('search', params.search)
      if (params.sort)     qs.set('sort', params.sort)

      const res = await fetch(`${API_BASE}/products?${qs.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
        // Cache public product list for 30 seconds
        cache: 'default',
      })

      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`)
      }

      const data: PaginatedResponse = await res.json()
      setProducts(data.products)
      setTotal(data.total)
    } catch (err) {
      const msg = (err as Error).message
      setError(msg)
      console.error('[ProductContext] fetchProducts:', msg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load products on mount
  useEffect(() => {
    fetchProducts({ limit: 100 })
  }, [fetchProducts])

  // ── Add product (admin) ───────────────────────────────────────────────────
  const addProduct = async (data: Omit<Product, 'id'>, token: string): Promise<Product> => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to add product')
    }

    const newProduct: Product = { ...json.product, id: json.product._id ?? json.product.id }
    setProducts(prev => [newProduct, ...prev])
    setTotal(prev => prev + 1)
    return newProduct
  }

  // ── Update product (admin) ────────────────────────────────────────────────
  const updateProduct = async (id: string, data: Partial<Product>, token: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update product')
    }

    const updated: Product = { ...json.product, id: json.product._id ?? json.product.id }
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)))
  }

  // ── Delete product (admin) ────────────────────────────────────────────────
  const deleteProduct = async (id: string, token: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to delete product')
    }

    setProducts(prev => prev.filter(p => p.id !== id))
    setTotal(prev => prev - 1)
  }

  // ── Toggle featured (admin) ───────────────────────────────────────────────
  const toggleFeatured = async (id: string, token: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/products/${id}/toggle-featured`, {
      method: 'PATCH',
      headers: authHeaders(token),
    })

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || 'Failed to toggle featured')
    }

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, featured: json.featured } : p))
    )
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        total,
        loading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
