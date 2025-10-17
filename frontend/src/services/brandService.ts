import { http } from "@/lib/http"

export type BrandPayload = {
  name: string
  slug?: string
  logo?: {
    url: string
    publicId?: string
    alt?: string
  }
  description?: string
  website?: string
  featured?: boolean
  sortOrder?: number
  seo?: {
    title?: string
    keywords?: string[]
    metaDescription?: string
  }
  status?: 'active' | 'inactive' | 'archived'
}

export type BrandFilters = {
  featured?: boolean
  status?: string
  includeProductCount?: boolean
  sort?: string
  limit?: number
}

export const brandService = {
  // Get all brands
  getAll(params?: BrandFilters) {
    return http.get("/brands", { params })
  },

  // Get brand by ID or slug
  getById(id: string) {
    return http.get(`/brands/${id}`)
  },

  // Create new brand
  create(data: BrandPayload) {
    return http.post("/brands", data)
  },

  // Update brand
  update(id: string, data: Partial<BrandPayload>) {
    return http.patch(`/brands/${id}`, data)
  },

  // Update brand logo
  updateLogo(id: string, logoUrl: string, publicId?: string) {
    return http.patch(`/brands/${id}/logo`, { logoUrl, publicId })
  },

  // Delete brand
  remove(id: string) {
    return http.delete(`/brands/${id}`)
  },

  // Get brand products
  getProducts(brandId: string, params?: {
    page?: number
    limit?: number
    sort?: string
    min?: number
    max?: number
  }) {
    return http.get(`/brands/${brandId}/products`, { params })
  },

  // Get featured brands
  getFeatured() {
    return http.get("/brands/featured")
  },

  // Search brands
  search(query: string, params?: Omit<BrandFilters, 'q'>) {
    return this.getAll({ ...params, q: query })
  }
}