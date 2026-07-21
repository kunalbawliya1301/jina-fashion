import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    src: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-black-dress-41133-large.mp4',
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
    src: 'https://assets.mixkit.co/videos/preview/mixkit-model-catwalking-in-a-fashion-show-41050-large.mp4',
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

interface SocialContextType {
  items: SocialItem[]
  addItem: (item: Omit<SocialItem, 'id'>) => void
  updateItem: (id: string, item: Partial<SocialItem>) => void
  deleteItem: (id: string) => void
  resetToDefaults: () => void
}

const SocialContext = createContext<SocialContextType | undefined>(undefined)

export function SocialProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SocialItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.error('Failed to load social items from localStorage', e)
    }
    return DEFAULT_SOCIAL_ITEMS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save social items to localStorage', e)
    }
  }, [items])

  const addItem = (newItem: Omit<SocialItem, 'id'>) => {
    const item: SocialItem = {
      ...newItem,
      id: `social-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    }
    setItems(prev => [item, ...prev])
  }

  const updateItem = (id: string, updated: Partial<SocialItem>) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)))
  }

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const resetToDefaults = () => {
    setItems(DEFAULT_SOCIAL_ITEMS)
  }

  return (
    <SocialContext.Provider value={{ items, addItem, updateItem, deleteItem, resetToDefaults }}>
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
