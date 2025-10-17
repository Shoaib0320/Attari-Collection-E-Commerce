// import { http } from "@/lib/http"

// export type ProductPayload = {
//     title: string
//     slug?: string
//     description?: string
//     price: number
//     category?: string
//     subcategory?: string
//     featured?: boolean
//     trending?: boolean
//     hidden?: boolean
// }

// export const productService = {
//     getAll(params?: Record<string, any>) {
//         return http.get("/products", { params })
//     },
//     getById(id: string) {
//         return http.get(`/products/${id}`)
//     },
//     create(data: ProductPayload) {
//         return http.post("/products/create", data)
//     },
//     update(id: string, data: Partial<ProductPayload>) {
//         return http.patch(`/products/${id}`, data)
//     },
//     remove(id: string) {
//         return http.delete(`/products/${id}`)
//     },
//     upload(file: File) {
//         const formData = new FormData()
//         formData.append('file', file)
//         return http.post("/products/upload", formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         })
//     },
//     // ✅ NEW: Get related products (by category or subcategory)
//     getRelated(id: string, params?: Record<string, any>) {
//         return http.get(`/products/${id}/related`, { params })
//     },
// }








import { http } from "@/lib/http"

export type ProductPayload = {
  // Basic Information
  title: string
  slug?: string
  description?: string
  shortDescription?: string
  longDescription?: string
  
  // Pricing
  price: number
  originalPrice?: number
  discountPercent?: number
  isOnSale?: boolean
  saleStartDate?: string
  saleEndDate?: string
  costPrice?: number
  
  // Inventory
  sku?: string
  barcode?: string
  stock?: number
  lowStockAlert?: number
  trackQuantity?: boolean
  allowBackorder?: boolean
  
  // Categories & Organization
  category: string
  subcategory?: string
  tags?: string[]
  brand?: string
  
  // Media
  images?: Array<{
    url: string
    publicId?: string
    alt?: string
    isPrimary?: boolean
    sortOrder?: number
  }>
  video?: {
    url: string
    publicId?: string
    thumbnail?: string
  }
  thumbnail?: string
  
  // Variants
  variants?: Array<{
    color?: string
    size?: string
    stock: number
    sku?: string
    price?: number
    image?: {
      url: string
      publicId?: string
      alt?: string
    }
    barcode?: string
    weight?: number
    dimensions?: {
      length?: number
      width?: number
      height?: number
    }
  }>
  
  // Shipping
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  shippingClass?: string
  freeShipping?: boolean
  
  // Status & Visibility
  status?: 'active' | 'inactive' | 'draft' | 'archived'
  featured?: boolean
  trending?: boolean
  newArrival?: boolean
  bestSeller?: boolean
  hidden?: boolean
  
  // SEO
  seo?: {
    title?: string
    keywords?: string[]
    metaDescription?: string
    canonicalUrl?: string
    ogImage?: string
  }
  
  // Additional Information
  manufacturer?: string
  model?: string
  warranty?: string
  returnPolicy?: string
  
  // Digital Product
  isDigital?: boolean
  downloadLink?: string
  fileSize?: string
  
  // Bundle Product
  isBundle?: boolean
  bundleProducts?: Array<{
    product: string
    quantity: number
  }>
  
  // Related Products
  relatedProducts?: string[]
}

export type ProductFilters = {
  page?: number
  limit?: number
  q?: string
  category?: string
  brand?: string
  min?: number
  max?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name_asc' | 'name_desc' | 'featured' | 'bestselling'
  featured?: boolean
  trending?: boolean
  newArrival?: boolean
  bestSeller?: boolean
  isOnSale?: boolean
  status?: string
  tags?: string
  hasVariants?: boolean
}

export const productService = {
  // Get all products with filters
  getAll(params?: ProductFilters) {
    return http.get("/products/all", { params })
  },

  // Get product by ID
  getById(id: string) {
    return http.get(`/products/${id}`)
  },

  // Get product by slug
  getBySlug(slug: string) {
    return http.get(`/products/slug/${slug}`)
  },

  // Create new product
  create(data: ProductPayload) {
    return http.post("/products", data)
  },

  // Update product
  update(id: string, data: Partial<ProductPayload>) {
    return http.patch(`/products/${id}`, data)
  },

  // Delete product (soft delete - archive)
  remove(id: string) {
    return http.delete(`/products/${id}`)
  },

  // Permanent delete
  permanentDelete(id: string) {
    return http.delete(`/products/${id}/permanent`)
  },

  // Upload media file
  upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post("/products/upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Get related products
  getRelated(id: string, params?: { limit?: number }) {
    return http.get(`/products/${id}/related`, { params })
  },

  // Get featured products
  getFeatured(params?: { limit?: number }) {
    return http.get("/products/featured", { params })
  },

  // Get new arrivals
  getNewArrivals(params?: { limit?: number }) {
    return http.get("/products/new-arrivals", { params })
  },

  // Get products on sale
  getOnSale(params?: { limit?: number }) {
    return http.get("/products/sale", { params })
  },

  // Update product stock
  updateStock(id: string, data: { stock: number; variantId?: string }) {
    return http.patch(`/products/${id}/stock`, data)
  },

  // Search products
  search(query: string, params?: Omit<ProductFilters, 'q'>) {
    return http.get("/products", { params: { ...params, q: query } })
  }
}