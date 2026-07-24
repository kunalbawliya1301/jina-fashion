import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface SocialItem {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  link?: string
}

const DEFAULT_SOCIAL_ITEMS: SocialItem[] = [
  {
    id: 'social-1',
    type: 'image',
    src: '/Category/Cord Sets.png',
    title: 'Silk Sarees Campaign Reel',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    id: 'social-2',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Bridal Lehenga Lookbook Reel',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    id: 'social-3',
    type: 'image',
    src: '/Category/Dupatta Set.png',
    title: 'Festive Dupatta Drop',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    id: 'social-4',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'Summer Cord Sets Showcase',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    id: 'social-5',
    type: 'image',
    src: '/Category/Kurties.png',
    title: 'Designer Kurti Edit',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    id: 'social-6',
    type: 'image',
    src: '/Category/Short Tops.png',
    title: 'Royal Ethnic Showcase',
    link: 'https://www.instagram.com/_jina_fashion',
  },
]

const STORAGE_KEY = 'jina_social_campaign_items_v2'
const API_BASE = import.meta.env.VITE_API_URL || '/api'

interface SocialContextType {
  items: SocialItem[]
  loading: boolean
  addItem: (item: Omit<SocialItem, 'id'>, token?: string | null) => Promise<void>
  updateItem: (id: string, item: Partial<SocialItem>, token?: string | null) => Promise<void>
  deleteItem: (id: string, token?: string | null) => Promise<void>
  resetToDefaults: () => void
  fetchSocialItems: () => Promise<void>
}

const SocialContext = createContext<SocialContextType | undefined>(undefined)

export function SocialProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SocialItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        let parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Replace legacy mixkit URLs with reliable video CDN URLs instead of filtering them out
          parsed = parsed.map((item: SocialItem) => {
            if (item.src?.includes('mixkit.co')) {
              return {
                ...item,
                type: 'video',
                src: item.id === 'social-2'
                  ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                  : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              }
            }
            return item
          })
          return parsed
        }
      }
    } catch (e) {
      console.error('Failed to load social items from localStorage', e)
    }
    return DEFAULT_SOCIAL_ITEMS
  })
  const [loading, setLoading] = useState(false)

  // ── Fetch from API ────────────────────────────────────────────────────────
  const fetchSocialItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/social`, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          const serverItems: SocialItem[] = data.items.map((item: SocialItem) => {
            if (item.src?.includes('mixkit.co')) {
              return {
                ...item,
                type: 'video',
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              }
            }
            return item
          })

          setItems(prevLocal => {
            // Keep local custom uploads that are not on the server
            const localCustom = prevLocal.filter(l =>
              !serverItems.some(s => s.id === l.id || s.src === l.src)
            )
            const combined = [...localCustom, ...serverItems]
            const finalItems = combined.length > 0 ? combined : DEFAULT_SOCIAL_ITEMS
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalItems))
            return finalItems
          })
        }
      }
    } catch (err) {
      console.warn('Could not fetch social items from server API, using local cache:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSocialItems()
  }, [fetchSocialItems])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save social items to localStorage', e)
    }
  }, [items])

  // ── Add Item ──────────────────────────────────────────────────────────────
  const addItem = async (newItem: Omit<SocialItem, 'id'>, customToken?: string | null) => {
    const tempId = `social-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const optimisticItem: SocialItem = { ...newItem, id: tempId }
    setItems(prev => [optimisticItem, ...prev])

    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (token) {
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
            setItems(prev => prev.map(i => (i.id === tempId ? data.item : i)))
          }
        }
      } catch (err) {
        console.warn('Failed to sync added social item to server:', err)
      }
    }
  }

  // ── Update Item ───────────────────────────────────────────────────────────
  const updateItem = async (id: string, updated: Partial<SocialItem>, customToken?: string | null) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)))

    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (token && !id.startsWith('social-')) {
      try {
        await fetch(`${API_BASE}/social/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        })
      } catch (err) {
        console.warn('Failed to sync updated social item to server:', err)
      }
    }
  }

  // ── Delete Item ───────────────────────────────────────────────────────────
  const deleteItem = async (id: string, customToken?: string | null) => {
    setItems(prev => prev.filter(item => item.id !== id))

    const token = customToken || sessionStorage.getItem('jina_admin_token')
    if (token && !id.startsWith('social-')) {
      try {
        await fetch(`${API_BASE}/social/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        console.warn('Failed to sync deleted social item to server:', err)
      }
    }
  }

  const resetToDefaults = () => {
    setItems(DEFAULT_SOCIAL_ITEMS)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SOCIAL_ITEMS))
    } catch (_e) { /* silent */ }
  }

  return (
    <SocialContext.Provider value={{ items, loading, addItem, updateItem, deleteItem, resetToDefaults, fetchSocialItems }}>
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
