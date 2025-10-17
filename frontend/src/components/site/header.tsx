
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/providers/auth-provider"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  ChevronDown,
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ShoppingBag,
  Settings
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/CartContext"

export default function SiteHeader() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-9 items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>📞 +92 300 1234567</span>
              <span className="hidden sm:inline">✉️ info@attaricollection.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Free Shipping on Orders Over Rs. 2000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              A
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight">Attari Collection</div>
              <div className="text-xs text-muted-foreground">Premium Fashion</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>

            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>

            {!loading && categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                    Categories <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[240px]">
                  {categories.slice(0, 10).map((category) => (
                    <DropdownMenuItem key={category._id || category.name} asChild>
                      <Link
                        href={`/products?category=${encodeURIComponent(category._id || category.name)}`}
                        className="cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem asChild>
                    <Link href="/products" className="cursor-pointer font-medium">
                      View All Categories →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 pr-4 h-10 bg-muted/50 border-muted-foreground/20 focus:bg-background"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                  0
                </Badge>
              </Button>
            </Link>


            <Link href="/cart">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden lg:inline-flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden lg:inline-flex">
                <Button size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}

            <ThemeToggle />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <div className="flex h-16 items-center px-6 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                      A
                    </div>
                    <span className="font-bold">Attari Collection</span>
                  </Link>
                </div>

                {/* Mobile Search */}
                <div className="p-4 border-b">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </form>
                </div>

                <nav className="flex flex-col p-4 space-y-1">
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium"
                  >
                    Products
                  </Link>

                  {!loading && categories.length > 0 && (
                    <div className="pt-2">
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Categories
                      </div>
                      {categories.slice(0, 8).map((c) => (
                        <Link
                          key={c._id || c.name}
                          href={`/products?category=${encodeURIComponent(c._id || c.name)}`}
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                        >
                          {c.name}
                        </Link>
                      ))}
                      <Link
                        href="/products"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-primary"
                      >
                        View All →
                      </Link>
                    </div>
                  )}

                  <Link
                    href="/contact"
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors font-medium"
                  >
                    Contact
                  </Link>

                  <div className="pt-4 mt-4 border-t space-y-1">
                    <Link
                      href="/wishlist"
                      className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Heart className="mr-3 h-4 w-4" />
                      Wishlist
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                    >
                      <ShoppingCart className="mr-3 h-4 w-4" />
                      Cart
                    </Link>
                  </div>

                  {user ? (
                    <div className="pt-4 mt-4 border-t space-y-1">
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                        {user.name || 'User'}
                      </div>
                      <Link
                        href="/orders"
                        className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                      >
                        <ShoppingBag className="mr-3 h-4 w-4" />
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-destructive"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 mt-4 border-t">
                      <Link href="/login">
                        <Button className="w-full">
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}