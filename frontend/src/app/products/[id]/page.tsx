// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { productService } from "@/services/productService"
// import { reviewService } from "@/services/reviewService"
// import { 
//   Star, 
//   ShoppingCart, 
//   Heart, 
//   Share2, 
//   Truck, 
//   Shield, 
//   RotateCcw,
//   ChevronLeft,
//   ChevronRight,
//   Minus,
//   Plus
// } from "lucide-react"
// import { useCart } from "@/context/CartContext"
// import { useWishlist } from "@/context/Wishlist"

// export default function ProductDetails() {
//   const { id } = useParams<{ id: string }>()
//   const router = useRouter()
//   const { addToCart, getCartItemsCount } = useCart()
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
//   const [product, setProduct] = useState<any>(null)
//   const [reviews, setReviews] = useState<any[]>([])
//   const [related, setRelated] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [mainImage, setMainImage] = useState<string>("")
//   const [zoom, setZoom] = useState(false)
//   const [quantity, setQuantity] = useState(1)
//   const [activeTab, setActiveTab] = useState("description")
//   const [currentImageIndex, setCurrentImageIndex] = useState(0)
//   const [imageLoading, setImageLoading] = useState(true)

//   useEffect(() => {
//     if (!id) return
    
//     const fetchProductData = async () => {
//       setLoading(true)
//       try {
//         const [productRes, reviewsRes, relatedRes] = await Promise.all([
//           productService.getById(id),
//           reviewService.getProductReviews(id),
//           productService.getRelated(id),
//         ])

//         const productData = productRes.data?.item
//         setProduct(productData)
//         setMainImage(productData?.images?.[0]?.url || "")
//         setReviews(reviewsRes.data?.reviews || [])
//         setRelated(relatedRes.data?.items || [])
//       } catch (error) {
//         console.error('Error fetching product data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProductData()
//   }, [id])

//   // Calculate average rating
//   const avgRating = reviews.length > 0
//     ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
//     : "0.0"

//   // Handle image navigation
//   const nextImage = () => {
//     if (!product?.images) return
//     setCurrentImageIndex((prev) => 
//       prev === product.images.length - 1 ? 0 : prev + 1
//     )
//     setMainImage(product.images[currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1].url)
//   }

//   const prevImage = () => {
//     if (!product?.images) return
//     setCurrentImageIndex((prev) => 
//       prev === 0 ? product.images.length - 1 : prev - 1
//     )
//     setMainImage(product.images[currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1].url)
//   }

//   // Cart functions
//   const handleAddToCart = () => {
//     if (product) {
//       for (let i = 0; i < quantity; i++) {
//         addToCart(product)
//       }
//       // Show success message
//       alert(`🎉 ${quantity} ${product.title} added to cart!`)
//     }
//   }

//   const handleBuyNow = () => {
//     if (product) {
//       for (let i = 0; i < quantity; i++) {
//         addToCart(product)
//       }
//       // Redirect to cart page
//       router.push("/cart")
//     }
//   }

//   // Wishlist functions
//   const handleWishlistToggle = () => {
//     if (!product) return
    
//     if (isInWishlist(product._id)) {
//       removeFromWishlist(product._id)
//     } else {
//       addToWishlist(product)
//     }
//   }

//   // Share product
//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: product.title,
//           text: product.description,
//           url: window.location.href,
//         })
//       } catch (error) {
//         console.log('Error sharing:', error)
//       }
//     } else {
//       // Fallback: copy to clipboard
//       navigator.clipboard.writeText(window.location.href)
//       alert('Product link copied to clipboard! 📋')
//     }
//   }

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-600 text-lg">Loading product details...</p>
//         </div>
//       </div>
//     )
//   }

//   // Product not found state
//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md mx-auto p-8">
//           <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <span className="text-4xl">😞</span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
//           <p className="text-gray-600 mb-8 text-lg">
//             The product you're looking for doesn't exist or has been removed.
//           </p>
//           <button
//             onClick={() => router.push('/products')}
//             className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
//           >
//             Browse Products
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
//         {/* Breadcrumb */}
//         <nav className="flex items-center gap-2 text-sm text-gray-600">
//           <button 
//             onClick={() => router.push('/')}
//             className="hover:text-primary transition-colors"
//           >
//             Home
//           </button>
//           <span>/</span>
//           <button 
//             onClick={() => router.push('/products')}
//             className="hover:text-primary transition-colors"
//           >
//             Products
//           </button>
//           <span>/</span>
//           {product.category && (
//             <>
//               <button 
//                 onClick={() => router.push(`/products?category=${product.category._id}`)}
//                 className="hover:text-primary transition-colors"
//               >
//                 {product.category.name}
//               </button>
//               <span>/</span>
//             </>
//           )}
//           <span className="text-gray-900 font-medium truncate max-w-xs">
//             {product.title}
//           </span>
//         </nav>

//         {/* Main Product Section */}
//         <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm p-8">
//           {/* Left: Image Gallery */}
//           <div className="space-y-6">
//             {/* Main Image with Zoom */}
//             <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center group">
//               {imageLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//                 </div>
//               )}
              
//               <img
//                 src={mainImage}
//                 alt={product.title}
//                 className={`object-contain max-h-full max-w-full transition-transform duration-700 ${
//                   zoom ? "scale-125" : "scale-100"
//                 } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
//                 onLoad={() => setImageLoading(false)}
//                 onError={() => setImageLoading(false)}
//               />
              
//               {/* Image Navigation Arrows */}
//               {product.images?.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                   >
//                     <ChevronLeft className="w-6 h-6 text-gray-700" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
//                   >
//                     <ChevronRight className="w-6 h-6 text-gray-700" />
//                   </button>
//                 </>
//               )}
              
//               {/* Action Buttons Overlay */}
//               <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button 
//                   onClick={handleShare}
//                   className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110"
//                   title="Share product"
//                 >
//                   <Share2 className="w-5 h-5 text-gray-700" />
//                 </button>
                
//                 <button
//                   onClick={handleWishlistToggle}
//                   className={`p-3 rounded-full shadow-md transition-all hover:scale-110 ${
//                     isInWishlist(product._id)
//                       ? "bg-red-500 text-white"
//                       : "bg-white text-gray-700 hover:bg-gray-100"
//                   }`}
//                   title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
//                 </button>
//               </div>

//               {/* Zoom Hint */}
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
//                 Hover to zoom
//               </div>
//             </div>

//             {/* Thumbnail Slider */}
//             {product.images?.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto pb-2">
//                 {product.images.map((img: any, index: number) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setMainImage(img.url)
//                       setCurrentImageIndex(index)
//                     }}
//                     className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
//                       mainImage === img.url
//                         ? "border-primary opacity-100 scale-105"
//                         : "border-transparent opacity-60 hover:opacity-100"
//                     }`}
//                   >
//                     <img
//                       src={img.url}
//                       alt={`${product.title} - Image ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right: Product Info */}
//           <div className="space-y-6">
//             {/* Product Title and Rating */}
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
//                 {product.title}
//               </h1>
              
//               {/* Rating and Reviews */}
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-6 h-6 ${
//                         i < Math.floor(Number(avgRating))
//                           ? "fill-yellow-400 text-yellow-400"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-xl font-semibold text-gray-700">{avgRating}</span>
//                 <span className="text-gray-500 text-lg">({reviews.length} reviews)</span>
//                 <span className="text-green-600 font-semibold text-lg">• In Stock</span>
//               </div>

//               {/* Price */}
//               <div className="flex items-baseline gap-3 mb-6">
//                 <span className="text-4xl font-bold text-primary">${product.price}</span>
//                 {product.originalPrice && product.originalPrice > product.price && (
//                   <>
//                     <span className="text-2xl text-gray-400 line-through">
//                       ${product.originalPrice}
//                     </span>
//                     <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
//                       Save ${(product.originalPrice - product.price).toFixed(2)}
//                     </span>
//                   </>
//                 )}
//               </div>

//               {/* Category and Tags */}
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {product.category && (
//                   <span className="inline-block px-3 py-1 bg-blue-100 text-primary rounded-full text-sm font-medium">
//                     {product.category.name}
//                   </span>
//                 )}
//                 <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//                   Free Shipping
//                 </span>
//                 <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
//                   Easy Returns
//                 </span>
//               </div>
//             </div>

//             {/* Short Description */}
//             <p className="text-gray-600 leading-relaxed text-lg border-l-4 border-primary pl-4 py-2 bg-blue-50 rounded-r-lg">
//               {product.description}
//             </p>

//             {/* Quantity Selector */}
//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//               <span className="text-gray-700 font-semibold text-lg">Quantity:</span>
//               <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
//                 <button
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg font-bold"
//                   disabled={quantity <= 1}
//                 >
//                   <Minus className="w-5 h-5" />
//                 </button>
//                 <span className="px-6 py-3 border-x border-gray-300 font-bold text-lg min-w-[60px] text-center">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg font-bold"
//                 >
//                   <Plus className="w-5 h-5" />
//                 </button>
//               </div>
//               <span className="text-gray-500 text-sm">
//                 {quantity} × ${product.price} = <strong>${(quantity * product.price).toFixed(2)}</strong>
//               </span>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-2">
//               <button 
//                 onClick={handleBuyNow}
//                 className="flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-secondary hover:text-secondary-foreground transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
//               >
//                 <ShoppingCart className="w-6 h-6" />
//                 Buy Now
//               </button>
              
//               <button 
//                 onClick={handleAddToCart}
//                 className="flex-1 bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
//               >
//                 <ShoppingCart className="w-6 h-6" />
//                 Add to Cart
//               </button>
//             </div>

//             {/* Additional Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleWishlistToggle}
//                 className={`flex-1 py-3 rounded-xl border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
//                   isInWishlist(product._id)
//                     ? "bg-red-50 border-red-500 text-red-500 hover:bg-red-100"
//                     : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
//                 }`}
//               >
//                 <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
//                 {isInWishlist(product._id) ? "In Wishlist" : "Add to Wishlist"}
//               </button>
              
//               <button
//                 onClick={handleShare}
//                 className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-primary hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
//               >
//                 <Share2 className="w-5 h-5" />
//                 Share
//               </button>
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
//               <div className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="p-3 bg-blue-50 rounded-full">
//                   <Truck className="w-6 h-6 text-primary" />
//                 </div>
//                 <span className="text-sm font-semibold text-gray-700">Free Delivery</span>
//                 <span className="text-xs text-gray-500">On orders over $50</span>
//               </div>
//               <div className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="p-3 bg-green-50 rounded-full">
//                   <Shield className="w-6 h-6 text-green-600" />
//                 </div>
//                 <span className="text-sm font-semibold text-gray-700">Secure Payment</span>
//                 <span className="text-xs text-gray-500">100% protected</span>
//               </div>
//               <div className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                 <div className="p-3 bg-purple-50 rounded-full">
//                   <RotateCcw className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <span className="text-sm font-semibold text-gray-700">Easy Returns</span>
//                 <span className="text-xs text-gray-500">30-day policy</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//           {/* Tab Headers */}
//           <div className="flex border-b border-gray-200">
//             {['description', 'reviews', 'shipping'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-8 py-4 font-semibold transition-all border-b-2 ${
//                   activeTab === tab
//                     ? "text-primary border-primary"
//                     : "text-gray-500 hover:text-gray-700 border-transparent"
//                 }`}
//               >
//                 {tab === 'description' && 'Product Description'}
//                 {tab === 'reviews' && `Reviews (${reviews.length})`}
//                 {tab === 'shipping' && 'Shipping Info'}
//               </button>
//             ))}
//           </div>

//           {/* Tab Content */}
//           <div className="p-8">
//             {activeTab === "description" && (
//               <div className="prose max-w-none">
//                 <div
//                   className="text-gray-700 leading-relaxed text-lg"
//                   dangerouslySetInnerHTML={{ 
//                     __html: product.longDescription || 
//                     `<p>${product.description}</p><p>No additional description available.</p>` 
//                   }}
//                 />
//               </div>
//             )}

//             {activeTab === "reviews" && (
//               <div className="space-y-6">
//                 {/* Reviews Summary */}
//                 <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl">
//                   <div className="text-center">
//                     <div className="text-4xl font-bold text-gray-900">{avgRating}</div>
//                     <div className="flex items-center gap-1 mt-1">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-4 h-4 ${
//                             i < Math.floor(Number(avgRating))
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
//                   </div>
                  
//                   <div className="flex-1">
//                     {[5,4,3,2,1].map((star) => {
//                       const count = reviews.filter(r => r.rating === star).length
//                       const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
//                       return (
//                         <div key={star} className="flex items-center gap-2 text-sm">
//                           <span className="w-4 text-gray-600">{star}</span>
//                           <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                           <div className="flex-1 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-yellow-400 h-2 rounded-full" 
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                           <span className="w-8 text-gray-600 text-right">{count}</span>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>

//                 {/* Reviews List */}
//                 {reviews.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Star className="w-8 h-8 text-gray-400" />
//                     </div>
//                     <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
//                     <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors">
//                       Write a Review
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {reviews.map((review) => (
//                       <div key={review._id} className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white">
//                         <div className="flex items-start justify-between mb-3">
//                           <div>
//                             <p className="font-semibold text-gray-900 text-lg">{review.user?.name || 'Anonymous'}</p>
//                             <div className="flex items-center gap-1 mt-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   className={`w-4 h-4 ${
//                                     i < review.rating
//                                       ? "fill-yellow-400 text-yellow-400"
//                                       : "text-gray-300"
//                                   }`}
//                                 />
//                               ))}
//                               <span className="text-sm text-gray-500 ml-2">
//                                 {review.rating}.0
//                               </span>
//                             </div>
//                           </div>
//                           <span className="text-sm text-gray-500">
//                             {new Date(review.createdAt).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </span>
//                         </div>
//                         <p className="text-gray-700 leading-relaxed">{review.comment}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "shipping" && (
//               <div className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="p-6 bg-blue-50 rounded-xl">
//                     <h3 className="font-semibold text-lg mb-3">🚚 Delivery Information</h3>
//                     <ul className="space-y-2 text-gray-700">
//                       <li>• Free shipping on orders over $50</li>
//                       <li>• Standard delivery: 3-5 business days</li>
//                       <li>• Express delivery: 1-2 business days</li>
//                       <li>• Same-day delivery available in select areas</li>
//                     </ul>
//                   </div>
                  
//                   <div className="p-6 bg-green-50 rounded-xl">
//                     <h3 className="font-semibold text-lg mb-3">📦 Return Policy</h3>
//                     <ul className="space-y-2 text-gray-700">
//                       <li>• 30-day easy return policy</li>
//                       <li>• Free returns for all items</li>
//                       <li>• Refund processed within 5-7 business days</li>
//                       <li>• Items must be in original condition</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Related Products */}
//         {related.length > 0 && (
//           <section className="bg-white rounded-2xl shadow-sm p-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {related.map((relatedProduct) => (
//                 <div
//                   key={relatedProduct._id}
//                   className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
//                   onClick={() => router.push(`/products/${relatedProduct._id}`)}
//                 >
//                   <div className="relative aspect-square overflow-hidden bg-white">
//                     <img
//                       src={relatedProduct.images?.[0]?.url || "/placeholder.png"}
//                       alt={relatedProduct.title}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
//                         <Heart className="w-4 h-4 text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
//                       {relatedProduct.title}
//                     </h3>
//                     <div className="flex items-center justify-between">
//                       <p className="text-xl font-bold text-blue-600">${relatedProduct.price}</p>
//                       {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
//                         <p className="text-sm text-gray-500 line-through">${relatedProduct.originalPrice}</p>
//                       )}
//                     </div>
//                     <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   )
// }






"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { productService } from "@/services/productService"
import { reviewService } from "@/services/reviewService"
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Edit3,
  X,
  Send
} from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/Wishlist"
import { useAuth } from "@/providers/auth-provider"

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  
  const [product, setProduct] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string>("")
  const [zoom, setZoom] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  
  // Review States
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)
  const [userReview, setUserReview] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    
    const fetchProductData = async () => {
      setLoading(true)
      try {
        const [productRes, reviewsRes, relatedRes] = await Promise.all([
          productService.getById(id),
          reviewService.getProductReviews(id),
          productService.getRelated(id),
        ])

        const productData = productRes.data?.item
        setProduct(productData)
        setMainImage(productData?.images?.[0]?.url || "")
        const reviewsData = reviewsRes.data?.reviews || []
        setReviews(reviewsData)
        setRelated(relatedRes.data?.items || [])
        
        // Check if user has already reviewed this product
        if (user) {
          const existingReview = reviewsData.find((r: any) => r.user?._id === user.id)
          setUserReview(existingReview)
        }
      } catch (error) {
        console.error('Error fetching product data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id, user])

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  // Handle image navigation
  const nextImage = () => {
    if (!product?.images) return
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
    setMainImage(product.images[currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1].url)
  }

  const prevImage = () => {
    if (!product?.images) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
    setMainImage(product.images[currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1].url)
  }

  // Cart functions
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      alert(`🎉 ${quantity} ${product.title} added to cart!`)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      router.push("/cart")
    }
  }

  // Wishlist functions
  const handleWishlistToggle = () => {
    if (!product) return
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  // Share product
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Product link copied to clipboard! 📋')
    }
  }

  // Review functions
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert("Please login to submit a review")
      router.push("/login")
      return
    }
    
    if (reviewRating === 0) {
      alert("Please select a rating")
      return
    }

    setReviewLoading(true)
    try {
      const response = await reviewService.create({
        product: product._id,
        rating: reviewRating,
        comment: reviewComment
      })

      if (response.data) {
        // Refresh reviews
        const reviewsRes = await reviewService.getProductReviews(product._id)
        setReviews(reviewsRes.data?.reviews || [])
        
        // Reset form
        setReviewRating(0)
        setReviewComment("")
        setShowReviewForm(false)
        setUserReview(response.data.review)
        
        alert("Review submitted successfully! ✅")
      }
    } catch (error: any) {
      console.error('Error submitting review:', error)
      alert(error.response?.data?.message || "Failed to submit review")
    } finally {
      setReviewLoading(false)
    }
  }

  const handleEditReview = () => {
    if (userReview) {
      setReviewRating(userReview.rating)
      setReviewComment(userReview.comment || "")
      setShowReviewForm(true)
    }
  }

  const handleCancelReview = () => {
    setReviewRating(0)
    setReviewComment("")
    setShowReviewForm(false)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  // Product not found state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😞</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button 
            onClick={() => router.push('/products')}
            className="hover:text-primary transition-colors"
          >
            Products
          </button>
          <span>/</span>
          {product.category && (
            <>
              <button 
                onClick={() => router.push(`/products?category=${product.category._id}`)}
                className="hover:text-primary transition-colors"
              >
                {product.category.name}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        {/* Main Product Section - Same as before */}
        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm p-8">
          {/* Left: Image Gallery - Same as before */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center group">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <img
                src={mainImage}
                alt={product.title}
                className={`object-contain max-h-full max-w-full transition-transform duration-700 ${
                  zoom ? "scale-125" : "scale-100"
                } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              
              {/* Image Navigation Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={handleShare}
                  className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:scale-110"
                  title="Share product"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-full shadow-md transition-all hover:scale-110 ${
                    isInWishlist(product._id)
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Zoom Hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Hover to zoom
              </div>
            </div>

            {/* Thumbnail Slider */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMainImage(img.url)
                      setCurrentImageIndex(index)
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                      mainImage === img.url
                        ? "border-primary opacity-100 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info - Same as before */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {product.title}
              </h1>
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(Number(avgRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold text-gray-700">{avgRating}</span>
                <span className="text-gray-500 text-lg">({reviews.length} reviews)</span>
                <span className="text-green-600 font-semibold text-lg">• In Stock</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Category and Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-primary rounded-full text-sm font-medium">
                    {product.category.name}
                  </span>
                )}
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Free Shipping
                </span>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Easy Returns
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 leading-relaxed text-lg border-l-4 border-primary pl-4 py-2 bg-blue-50 rounded-r-lg">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-semibold text-lg">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg font-bold"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 border-x border-gray-300 font-bold text-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors text-lg font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <span className="text-gray-500 text-sm">
                {quantity} × ${product.price} = <strong>${(quantity * product.price).toFixed(2)}</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                Buy Now
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>

            {/* Additional Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 rounded-xl border-2 transition-all font-semibold flex items-center justify-center gap-2 ${
                  isInWishlist(product._id)
                    ? "bg-red-50 border-red-500 text-red-500 hover:bg-red-100"
                    : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
                {isInWishlist(product._id) ? "In Wishlist" : "Add to Wishlist"}
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Free Delivery</span>
                <span className="text-xs text-gray-500">On orders over $50</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-3 bg-green-50 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Secure Payment</span>
                <span className="text-xs text-gray-500">100% protected</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-3 bg-purple-50 rounded-full">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Easy Returns</span>
                <span className="text-xs text-gray-500">30-day policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-semibold transition-all border-b-2 ${
                  activeTab === tab
                    ? "text-primary border-primary"
                    : "text-gray-500 hover:text-gray-700 border-transparent"
                }`}
              >
                {tab === 'description' && 'Product Description'}
                {tab === 'reviews' && `Reviews (${reviews.length})`}
                {tab === 'shipping' && 'Shipping Info'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: product.longDescription || 
                    `<p>${product.description}</p><p>No additional description available.</p>` 
                  }}
                />
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Reviews Summary */}
                <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{avgRating}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(Number(avgRating))
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
                  </div>
                  
                  <div className="flex-1">
                    {[5,4,3,2,1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-4 text-gray-600">{star}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-8 text-gray-600 text-right">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Write Review Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {userReview ? 'Your Review' : 'Write a Review'}
                    </h3>
                    
                    {userReview && !showReviewForm && (
                      <button
                        onClick={handleEditReview}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Review
                      </button>
                    )}
                  </div>

                  {userReview && !showReviewForm ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < userReview.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-semibold">{userReview.rating}.0</span>
                      </div>
                      {userReview.comment && (
                        <p className="text-gray-700 leading-relaxed">{userReview.comment}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Reviewed on {new Date(userReview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Rating Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating *
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= reviewRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-lg font-semibold">
                            {reviewRating > 0 ? `${reviewRating}.0` : 'Select rating'}
                          </span>
                        </div>
                      </div>

                      {/* Comment Input */}
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review (Optional)
                        </label>
                        <textarea
                          id="comment"
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          placeholder="Share your experience with this product..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={reviewRating === 0 || reviewLoading}
                          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          {reviewLoading ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                        </button>
                        
                        {(showReviewForm || userReview) && (
                          <button
                            type="button"
                            onClick={handleCancelReview}
                            disabled={reviewLoading}
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>

                      {!user && (
                        <p className="text-sm text-gray-500">
                          Please <button type="button" onClick={() => router.push('/login')} className="text-primary hover:underline">login</button> to submit a review.
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews
                      .filter(review => !user || review.user?._id !== user.id) // Don't show user's own review in list if they have one
                      .map((review) => (
                      <div key={review._id} className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 transition-all bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-500 ml-2">
                                {review.rating}.0
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-lg mb-3">🚚 Delivery Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Free shipping on orders over $50</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                      <li>• Same-day delivery available in select areas</li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-green-50 rounded-xl">
                    <h3 className="font-semibold text-lg mb-3">📦 Return Policy</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 30-day easy return policy</li>
                      <li>• Free returns for all items</li>
                      <li>• Refund processed within 5-7 business days</li>
                      <li>• Items must be in original condition</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products - Same as before */}
        {related.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => router.push(`/products/${relatedProduct._id}`)}
                >
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <img
                      src={relatedProduct.images?.[0]?.url || "/placeholder.png"}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
                      {relatedProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-blue-600">${relatedProduct.price}</p>
                      {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                        <p className="text-sm text-gray-500 line-through">${relatedProduct.originalPrice}</p>
                      )}
                    </div>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                      Add to Cart
                    </button>
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