import { http } from "@/lib/http"

export type ProductPayload = {
  name: string
  description?: string
  price: number
  category?: string
  images?: string[]
  stock?: number
}

export const productService = {
  getAll(params?: Record<string, any>) {
    return http.get("/products", { params })
  },
  getById(id: string) {
    return http.get(`/products/${id}`)
  },
  create(data: ProductPayload) {
    return http.post("/products", data)
  },
  update(id: string, data: Partial<ProductPayload>) {
    return http.put(`/products/${id}`, data)
  },
  remove(id: string) {
    return http.delete(`/products/${id}`)
  },
}


