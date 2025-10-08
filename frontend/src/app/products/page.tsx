"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"

export default function ProductsListing() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

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

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data || res.data?.categories || [])).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    productService.getAll(query).then((res) => setProducts(res.data || res.data?.products || [])).finally(() => setLoading(false))
  }, [JSON.stringify(query)])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="rounded border p-3 bg-card">
          <div className="font-medium mb-2">Categories</div>
          <div className="space-y-1">
            <a className="block text-sm hover:underline" href="/products">All</a>
            {categories.map((c) => (
              <a key={c._id || c.name} className="block text-sm hover:underline" href={`/products?category=${encodeURIComponent(c._id || c.name)}`}>{c.name}</a>
            ))}
          </div>
        </div>
        <div className="rounded border p-3 bg-card">
          <div className="font-medium mb-2">Sort</div>
          <div className="space-y-1 text-sm">
            <button onClick={() => router.push(`/products?${new URLSearchParams({ ...query, sort: "price-asc" }).toString()}`)} className="hover:underline">Price: Low to High</button>
            <button onClick={() => router.push(`/products?${new URLSearchParams({ ...query, sort: "price-desc" }).toString()}`)} className="hover:underline">Price: High to Low</button>
            <button onClick={() => router.push(`/products?${new URLSearchParams({ ...query, sort: "newest" }).toString()}`)} className="hover:underline">Newest</button>
          </div>
        </div>
      </aside>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">All Products</h1>
          <div className="text-sm text-muted-foreground">{products.length} items</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />)
        ) : products.length === 0 ? (
          <div className="col-span-full text-muted-foreground">No products</div>
        ) : (
          products.map((p: any) => (
            <a key={p._id} href={`/products/${p._id}`} className="group rounded-xl border overflow-hidden bg-card">
              <div className="aspect-square bg-muted" />
              <div className="p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.category?.name ?? 'Category'}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-semibold">${p.price}</div>
                  <span className="text-xs text-muted-foreground">View</span>
                </div>
              </div>
            </a>
          ))
        )}
        </div>
      </div>
    </div>
  )
}


