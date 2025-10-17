"use client"

import { useWishlist } from "@/context/Wishlist"
import { useCart } from "@/context/CartContext"
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist, getWishlistCount } = useWishlist()
  const { addToCart } = useCart()
  const router = useRouter()

  const handleMoveToCart = (productId: string) => {
    moveToCart(productId, { addToCart })
    alert("Product moved to cart! 🛒")
  }

  const handleRemoveItem = (productId: string, productTitle: string) => {
    if (confirm(`Remove ${productTitle} from wishlist?`)) {
      removeFromWishlist(productId)
    }
  }

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return
    
    if (confirm("Clear entire wishlist?")) {
      clearWishlist()
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              You haven't added any products to your wishlist yet. Start exploring our collection and add your favorite items!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Browse Products
              </Link>
              <button 
                onClick={() => router.push('/')}
                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button 
                onClick={handleClearWishlist}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Clear All
              </button>
              <Link 
                href="/products"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors font-medium flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid gap-6">
          {wishlistItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 flex flex-col sm:flex-row items-start gap-6">
                {/* Product Image */}
                <div 
                  className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0"
                  onClick={() => router.push(`/products/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => router.push(`/products/${item.id}`)}
                      >
                        {item.title}
                      </h3>
                      
                      {item.category && (
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-3">
                          {item.category}
                        </span>
                      )}
                      
                      {/* Rating (Placeholder - you can fetch actual ratings if available) */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.5)</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${item.price}</p>
                      <p className="text-sm text-gray-500">In Stock</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleMoveToCart(item.id)}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-secondary hover:text-secondary-foreground transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Move to Cart
                    </button>
                    
                    <button
                      onClick={() => router.push(`/products/${item.id}`)}
                      className="border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
                    >
                      View Details
                    </button>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id, item.title)}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  wishlistItems.forEach(item => handleMoveToCart(item.id))
                  alert("All items moved to cart! 🛒")
                }}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Move All to Cart
              </button>
              
              <Link 
                href="/cart"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
              >
                View Cart
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{getWishlistCount()}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {wishlistItems.length}
              </div>
              <div className="text-sm text-gray-600">Ready to Cart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}