"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistItem {
  id: string
  title: string
  price: number
  image: string
  category?: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (product: any) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  moveToCart: (productId: string, cartContext: any) => void
  clearWishlist: () => void
  getWishlistCount: () => number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error parsing wishlist:', error)
        setWishlistItems([])
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product: any) => {
    setWishlistItems(prevItems => {
      // Check if product already exists in wishlist
      if (prevItems.find(item => item.id === product._id)) {
        return prevItems
      }
      
      const newItem: WishlistItem = {
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.url || '',
        category: product.category?.name
      }
      
      return [...prevItems, newItem]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => {
      return prevItems.filter(item => item.id !== productId)
    })
  }

  const moveToCart = (productId: string, cartContext: any) => {
    const item = wishlistItems.find(item => item.id === productId)
    if (item && cartContext) {
      // Add to cart
      const product = {
        _id: item.id,
        title: item.title,
        price: item.price,
        images: [{ url: item.image }],
        category: { name: item.category }
      }
      cartContext.addToCart(product)
      
      // Remove from wishlist
      removeFromWishlist(productId)
    }
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      moveToCart,
      clearWishlist,
      getWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}