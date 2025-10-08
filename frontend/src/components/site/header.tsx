"use client"

import { useEffect, useState } from "react"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function SiteHeader() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll()
        setCategories(response.data || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Attari Collection</span>
          </a>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/"
            >
              Home
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/products"
            >
              Products
            </a>
            {!loading && categories.length > 0 && (
              <>
                {categories.slice(0, 4).map((category) => (
                  <a
                    key={category._id || category.name}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    href={`/products?category=${encodeURIComponent(category._id || category.name)}`}
                  >
                    {category.name}
                  </a>
                ))}
              </>
            )}
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/contact"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can be added here later */}
          </div>
          <nav className="flex items-center gap-2">
            <a href="/cart">
              <Button variant="ghost" size="sm">
                Cart
              </Button>
            </a>
            <a href="/wishlist">
              <Button variant="ghost" size="sm">
                Wishlist
              </Button>
            </a>
            <a href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
