import { http } from "@/lib/http"

export type ProductPayload = {
    title: string
    slug?: string
    description?: string
    price: number
    category?: string
    subcategory?: string
    featured?: boolean
    trending?: boolean
    hidden?: boolean
}

export const productService = {
    getAll(params?: Record<string, any>) {
        return http.get("/products", { params })
    },
    getById(id: string) {
        return http.get(`/products/${id}`)
    },
    create(data: ProductPayload) {
        return http.post("/products/create", data)
    },
    update(id: string, data: Partial<ProductPayload>) {
        return http.patch(`/products/${id}`, data)
    },
    remove(id: string) {
        return http.delete(`/products/${id}`)
    },
    upload(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        return http.post("/products/upload", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    // ✅ NEW: Get related products (by category or subcategory)
    getRelated(id: string, params?: Record<string, any>) {
        return http.get(`/products/${id}/related`, { params })
    },
}


