"use client"

import { useEffect, useState } from "react"
import { productService } from "@/services/productService"

export default function AdminProducts() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    productService.getAll().then((res) => setProducts(res.data || res.data?.products || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <a className="bg-primary text-primary-foreground rounded px-4 py-2" href="/admin/products/new">Add Product</a>
      </div>
      <div className="rounded border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No products</td></tr>
            ) : (
              products.map((p: any) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.stock ?? '-'}</td>
                  <td className="p-3 space-x-2">
                    <a className="underline text-primary" href={`/admin/products/${p._id}`}>Edit</a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


