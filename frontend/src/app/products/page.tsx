// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import { productService } from "@/services/productService"
// import { categoryService } from "@/services/categoryService"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

// export default function ProductsListing() {
//   const params = useSearchParams()
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [products, setProducts] = useState<any[]>([])
//   const [categories, setCategories] = useState<any[]>([])

//   // 🧠 Build query object
//   const query = useMemo(() => {
//     const q: Record<string, string> = {}
//     const search = params.get("search")
//     const category = params.get("category")
//     const sort = params.get("sort")
//     if (search) q.search = search
//     if (category) q.category = category
//     if (sort) q.sort = sort
//     return q
//   }, [params])

//   // 🧠 Fetch categories
//   useEffect(() => {
//     categoryService.getAll().then((res) => setCategories(res.data?.categories || res.data || []))
//   }, [])

//   // 🧠 Fetch products
//   useEffect(() => {
//     setLoading(true)
//     productService
//       .getAll(query)
//       .then((res) =>
//         setProducts(res.data?.items || res.data?.products || res.data || [])
//       )
//       .finally(() => setLoading(false))
//   }, [JSON.stringify(query)])

//   // 🧠 Handle filter
//   const handleFilter = (key: string, value?: string) => {
//     const newQuery = new URLSearchParams(query)
//     if (value) newQuery.set(key, value)
//     else newQuery.delete(key)
//     router.push(`/products?${newQuery.toString()}`)
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
//       {/* =============== Sidebar =============== */}
//       <aside className="space-y-6">
//         {/* Categories */}
//         <div className="rounded-xl border p-4 bg-card shadow-sm">
//           <div className="font-semibold mb-3 text-lg">Categories</div>
//           <div className="space-y-2">
//             <button
//               onClick={() => handleFilter("category")}
//               className={cn(
//                 "block w-full text-left text-sm transition hover:text-primary",
//                 !query.category && "font-semibold text-primary"
//               )}
//             >
//               All
//             </button>
//             {categories.map((c) => (
//               <button
//                 key={c._id || c.name}
//                 onClick={() => handleFilter("category", c._id || c.name)}
//                 className={cn(
//                   "block w-full text-left text-sm transition hover:text-primary",
//                   query.category === (c._id || c.name) &&
//                     "font-semibold text-primary"
//                 )}
//               >
//                 {c.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Sort */}
//         <div className="rounded-xl border p-4 bg-card shadow-sm">
//           <div className="font-semibold mb-3 text-lg">Sort By</div>
//           <div className="space-y-2 text-sm">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleFilter("sort", "price-asc")}
//               className={cn(
//                 "justify-start w-full",
//                 query.sort === "price-asc" && "bg-primary/10 text-primary"
//               )}
//             >
//               💰 Price: Low → High
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleFilter("sort", "price-desc")}
//               className={cn(
//                 "justify-start w-full",
//                 query.sort === "price-desc" && "bg-primary/10 text-primary"
//               )}
//             >
//               💸 Price: High → Low
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handleFilter("sort", "newest")}
//               className={cn(
//                 "justify-start w-full",
//                 query.sort === "newest" && "bg-primary/10 text-primary"
//               )}
//             >
//               🆕 Newest
//             </Button>
//           </div>
//         </div>
//       </aside>

//       {/* =============== Products Grid =============== */}
//       <div className="space-y-6">
//         <div className="flex items-end justify-between">
//           <h1 className="text-2xl font-bold tracking-tight">
//             {query.category
//               ? categories.find((c) => c._id === query.category || c.name === query.category)?.name || "Products"
//               : "All Products"}
//           </h1>
//           <div className="text-sm text-muted-foreground">
//             {products.length} items
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {loading ? (
//             Array.from({ length: 8 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="aspect-square rounded-xl bg-muted animate-pulse"
//               />
//             ))
//           ) : products.length === 0 ? (
//             <div className="col-span-full text-center text-muted-foreground py-10">
//               No products found
//             </div>
//           ) : (
//             products.map((p) => {
//               const img =
//                 p.images?.[0]?.url ||
//                 "https://via.placeholder.com/400x400?text=No+Image"
//               return (
//                 <a
//                   key={p._id}
//                   href={`/products/${p._id}`}
//                   className="group block rounded-xl overflow-hidden border bg-card hover:shadow-md transition duration-200"
//                 >
//                   <div className="aspect-square bg-muted relative overflow-hidden">
//                     <Image
//                       src={img}
//                       alt={p.title}
//                       fill
//                       className="object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <div className="font-medium truncate">{p.title}</div>
//                     <div className="text-sm text-muted-foreground truncate">
//                       {p.category?.name ?? "Uncategorized"}
//                     </div>
//                     <div className="mt-2 flex items-center justify-between">
//                       <div className="font-semibold text-primary">
//                         ${p.price.toFixed(2)}
//                       </div>
//                       <span className="text-xs text-muted-foreground group-hover:text-primary transition">
//                         View →
//                       </span>
//                     </div>
//                   </div>
//                 </a>
//               )
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }






"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Grid3x3, List, SlidersHorizontal, X, Search, TrendingUp, DollarSign, Clock, Heart, ShoppingCart, Eye } from "lucide-react"

export default function ProductsListing() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  // 🧠 Build query object
  const query = useMemo(() => {
    const q: Record<string, string> = {}
    const search = params.get("search")
    const category = params.get("category")
    const sort = params.get("sort")
    if (search) q.search = search
    if (category) q.category = category
    if (sort) q.sort = sort
    return q
  }, [params])

  // 🧠 Fetch categories
  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data?.categories || res.data || []))
  }, [])

  // 🧠 Fetch products
  useEffect(() => {
    setLoading(true)
    productService
      .getAll(query)
      .then((res) =>
        setProducts(res.data?.items || res.data?.products || res.data || [])
      )
      .finally(() => setLoading(false))
  }, [JSON.stringify(query)])

  // Set initial search input
  useEffect(() => {
    if (query.search) setSearchInput(query.search)
  }, [query.search])

  // 🧠 Handle filter
  const handleFilter = (key: string, value?: string) => {
    const newQuery = new URLSearchParams(query)
    if (value) newQuery.set(key, value)
    else newQuery.delete(key)
    router.push(`/products?${newQuery.toString()}`)
  }

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilter("search", searchInput || undefined)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("")
    router.push("/products")
  }

  const hasActiveFilters = query.search || query.category || query.sort

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {query.category
                  ? categories.find((c) => c._id === query.category || c.name === query.category)?.name || "Products"
                  : "All Products"}
              </h1>
              <p className="text-gray-600 mt-2">
                Discover our collection of {products.length} amazing products
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded transition-all",
                  viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded transition-all",
                  viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </form>

          {/* Active Filters & Mobile Filter Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {hasActiveFilters && (
                <>
                  {query.search && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                      Search: {query.search}
                      <button onClick={() => handleFilter("search")} className="hover:bg-primary/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {query.category && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
                      {categories.find(c => (c._id || c.name) === query.category)?.name}
                      <button onClick={() => handleFilter("category")} className="hover:bg-blue-100 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {query.sort && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-2">
                      {query.sort === "price-asc" && "Low to High"}
                      {query.sort === "price-desc" && "High to Low"}
                      {query.sort === "newest" && "Newest"}
                      <button onClick={() => handleFilter("sort")} className="hover:bg-green-100 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-primary underline"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className={cn(
            "space-y-6",
            showFilters ? "block" : "hidden md:block"
          )}>
            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Grid3x3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Categories</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilter("category")}
                  className={cn(
                    "block w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                    !query.category 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id || c.name}
                    onClick={() => handleFilter("category", c._id || c.name)}
                    className={cn(
                      "block w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                      query.category === (c._id || c.name)
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Sort By</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilter("sort", "price-asc")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                    query.sort === "price-asc"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <DollarSign className="w-4 h-4" />
                  Price: Low to High
                </button>
                <button
                  onClick={() => handleFilter("sort", "price-desc")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                    query.sort === "price-desc"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <DollarSign className="w-4 h-4" />
                  Price: High to Low
                </button>
                <button
                  onClick={() => handleFilter("sort", "newest")}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium",
                    query.sort === "newest"
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Clock className="w-4 h-4" />
                  Newest First
                </button>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Special Offer!</h3>
              <p className="text-sm text-white/90 mb-4">
                Get up to 50% off on selected items
              </p>
              <button className="w-full bg-white text-primary font-semibold py-2 rounded-lg hover:bg-gray-100 transition-all">
                Shop Now
              </button>
            </div>
          </aside>

          {/* Products Grid/List */}
          <div>
            {loading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "bg-white rounded-2xl overflow-hidden shadow-sm",
                      viewMode === "list" && "flex"
                    )}
                  >
                    <div className={cn(
                      "bg-gray-200 animate-pulse",
                      viewMode === "grid" ? "aspect-square" : "w-48 h-48"
                    )} />
                    <div className="p-4 space-y-3 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {products.map((p) => {
                  const img = p.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image"
                  
                  if (viewMode === "list") {
                    return (
                      <a
                        key={p._id}
                        href={`/products/${p._id}`}
                        className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
                      >
                        <div className="relative w-48 h-48 flex-shrink-0 bg-gray-100">
                          <Image
                            src={img}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                              {p.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {p.category?.name ?? "Uncategorized"}
                            </p>
                            {p.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {p.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-2xl font-bold text-primary">
                              ${p.price.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                                <Heart className="w-5 h-5 text-gray-600" />
                              </button>
                              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </a>
                    )
                  }

                  return (
                    <a
                      key={p._id}
                      href={`/products/${p._id}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                    >
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                            <Heart className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                        {p.discount && (
                          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            -{p.discount}%
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-xs text-gray-500 mb-1">
                          {p.category?.name ?? "Uncategorized"}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {p.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-primary">
                            ${p.price.toFixed(2)}
                          </div>
                          <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}