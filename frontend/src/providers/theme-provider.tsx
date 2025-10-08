'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Theme } from '@/lib/theme'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system', 
  storageKey = 'attari-theme' 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setTheme(stored)
    }
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark')
    
    // Determine actual theme
    let resolvedTheme: 'light' | 'dark'
    
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      resolvedTheme = theme
    }
    
    setActualTheme(resolvedTheme)
    
    // Apply theme
    root.classList.add(resolvedTheme)
    root.setAttribute('data-theme', resolvedTheme)
    
    // Set color scheme meta tag
    const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]')
    if (colorSchemeMeta) {
      colorSchemeMeta.setAttribute('content', resolvedTheme)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'color-scheme'
      meta.content = resolvedTheme
      document.head.appendChild(meta)
    }
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement
        const resolvedTheme = mediaQuery.matches ? 'dark' : 'light'
        
        root.classList.remove('light', 'dark')
        root.classList.add(resolvedTheme)
        root.setAttribute('data-theme', resolvedTheme)
        setActualTheme(resolvedTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}