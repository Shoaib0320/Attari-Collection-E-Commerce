"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { productService } from "@/services/productService"
import { reviewService } from "@/services/reviewService"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>("")
  const [zoom, setZoom] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      productService.getById(id),
      reviewService.getProductReviews(id),
      productService.getRelated(id),
    ])
      .then(([p, r, rel]) => {
        const data = p.data?.item
        setProduct(data)
        setMainImage(data?.images?.[0]?.url || "")
        setReviews(r.data?.reviews || [])
        setRelated(rel.data?.items || [])
      })
      .finally(() => setLoading(false))
  }, [id])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800 mb-2">Product not found</p>
          <p className="text-gray-500">The product you're looking for doesn't exist</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <span>Home</span>
          <span>/</span>
          <span>{product.category?.name || "Products"}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm p-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div
              className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center group"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={mainImage}
                alt={product.title}
                className={`object-contain max-h-full max-w-full transition-transform duration-700 ${
                  zoom ? "scale-125" : "scale-100"
                }`}
              />
              
              {/* Share button */}
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100">
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Thumbnail Slider */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img.url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                      mainImage === img.url
                        ? "ring-2 ring-primary ring-offset-2 opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(Number(avgRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{avgRating}</span>
                <span className="text-gray-400">({reviews.length} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Category Badge */}
              {product.category && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {product.category?.name}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isWishlisted
                    ? "bg-red-50 border-red-500 text-red-500"
                    : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-green-50 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-purple-50 rounded-full">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600 font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-8 py-4 font-semibold transition-all ${
                activeTab === "description"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-8 py-4 font-semibold transition-all ${
                activeTab === "reviews"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
                />
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rv) => (
                      <div key={rv._id} className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{rv.user?.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rv.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(rv.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{rv.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={p.images?.[0]?.url || "/placeholder.png"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xl font-bold text-primary">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}