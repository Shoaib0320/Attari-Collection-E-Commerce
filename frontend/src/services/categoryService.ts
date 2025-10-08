import { http } from "@/lib/http"

export type CategoryPayload = { name: string; description?: string }

export const categoryService = {
  getAll() {
    return http.get("/categories")
  },
  create(data: CategoryPayload) {
    return http.post("/categories", data)
  },
  update(id: string, data: Partial<CategoryPayload>) {
    return http.put(`/categories/${id}`, data)
  },
  remove(id: string) {
    return http.delete(`/categories/${id}`)
  },
}


