"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { productService } from "@/services/productService"
import { reviewService } from "@/services/reviewService"

export default function ProductDetails() {
  const params = useParams<{ id: string }>()
  const id = params?.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      productService.getById(id),
      reviewService.getProductReviews(id),
    ])
      .then(([p, r]) => {
        setProduct(p.data || p.data?.product || null)
        setReviews(r.data || r.data?.reviews || [])
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading || !product) return <div className="mx-auto max-w-7xl px-4 py-10">Loading...</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-2 gap-8">
      <div className="aspect-square rounded-xl bg-muted" />
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="text-2xl font-bold">${product.price}</div>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="flex gap-3">
          <button className="bg-primary text-primary-foreground rounded px-5 py-2">Add to cart</button>
          <button className="border rounded px-5 py-2">Wishlist</button>
        </div>
        <div className="pt-6">
          <h2 className="font-semibold mb-2">Reviews</h2>
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <div className="text-sm text-muted-foreground">No reviews yet</div>
            ) : (
              reviews.map((rv: any) => (
                <div key={rv._id} className="rounded border p-3">
                  <div className="font-medium">{rv.user?.name ?? 'User'}</div>
                  <div className="text-sm">Rating: {rv.rating}/5</div>
                  <div className="text-sm text-muted-foreground">{rv.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


