import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface SocialItem {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  link?: string
}

const STORAGE_KEY = 'jina_social_v3'
const LEGACY_STORAGE_KEY = 'jina_social_campaign_items_v2'
const API_BASE = import.meta.env.VITE_API_URL || '/api'

interface SocialContextType {
  items: SocialItem[]
  loading: boolean
  addItem: (item: Omit<SocialItem, 'id'>, token?: string | null) => Promise<void>
  updateItem: (id: string, item: Partial<SocialItem>, token?: string | null) => Promise<void>
  deleteItem: (id: string, token?: string | null) => Promise<void>
  clearAllItems: (token?: string | null) => Promise<void>
  fetchSocialItems: () => Promise<void>
}

const SocialContext = createContext<SocialContextType | undefined>(undefined)

export function SocialProvider({ children }: { children: ReactNode }) {
  // Start empty — API is the single source of truth
  const [items, setItems] = useState<SocialItem[]>([])
  const [loading, setLoading] = useState(true)

  // Clear legacy cached key on initialization once
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch (_e) { /* silent */ }
  }, [])

  // ── Fetch from MongoDB (always authoritative) ─────────────────────────────
  const fetchSocialItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/social`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',  // Never use browser cache — always get fresh data
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items)
          // Sync localStorage as a cache for offline/slow loads
          if (data.items.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items))
          } else {
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(LEGACY_STORAGE_KEY)
          }
          return  // API succeeded — done
        }
      }
    } catch (err) {
      console.warn('[SocialContext] API unreachable, falling back to localStorage:', err)
      // Only use localStorage as last-resort fallback when API is completely down
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) setItems(parsed)
        }
      } catch (_e) { /* silent */ }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount — this replaces any stale localStorage state
  useEffect(() => {
    fetchSocialItems()
  }, [fetchSocialItems])

  // ── Add Item ──────────────────────────────────────────────────────────────
  const addItem = async (newItem: Omit<SocialItem, 'id'>, customToken?: string | null) => {
    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (!token) return

    try {
      const res = await fetch(`${API_BASE}/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.item) {
          setItems(prev => {
            const next = [data.item, ...prev]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            return next
          })
        }
      } else {
        console.error('[SocialContext] Failed to add item:', res.status)
      }
    } catch (err) {
      console.error('[SocialContext] Error adding item:', err)
    }
  }

  // ── Update Item ───────────────────────────────────────────────────────────
  const updateItem = async (id: string, updated: Partial<SocialItem>, customToken?: string | null) => {
    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (!token) return

    try {
      const res = await fetch(`${API_BASE}/social/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        setItems(prev => {
          const next = prev.map(item => (item.id === id ? { ...item, ...updated } : item))
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          return next
        })
      }
    } catch (err) {
      console.error('[SocialContext] Error updating item:', err)
    }
  }

  // ── Delete Item ───────────────────────────────────────────────────────────
  const deleteItem = async (id: string, customToken?: string | null) => {
    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (!token) return

    try {
      const res = await fetch(`${API_BASE}/social/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setItems(prev => {
          const next = prev.filter(item => item.id !== id)
          if (next.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          } else {
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(LEGACY_STORAGE_KEY)
          }
          return next
        })
      }
    } catch (err) {
      console.error('[SocialContext] Error deleting item:', err)
    }
  }

  // ── Clear All Items ───────────────────────────────────────────────────────
  const clearAllItems = async (customToken?: string | null) => {
    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (!token) return

    try {
      const res = await fetch(`${API_BASE}/social`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setItems([])
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
      } else {
        console.error('[SocialContext] Clear all failed:', res.status)
      }
    } catch (err) {
      console.error('[SocialContext] Error clearing all items:', err)
    }
  }

  return (
    <SocialContext.Provider value={{ items, loading, addItem, updateItem, deleteItem, clearAllItems, fetchSocialItems }}>
      {children}
    </SocialContext.Provider>
  )
}

export function useSocial() {
  const context = useContext(SocialContext)
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider')
  }
  return context
}
