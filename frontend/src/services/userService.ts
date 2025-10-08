import { http } from "@/lib/http"

export type UpdateProfilePayload = { name?: string; email?: string; password?: string }

export const userService = {
  getAll(params?: Record<string, any>) {
    return http.get("/users", { params })
  },
  getById(id: string) {
    return http.get(`/users/${id}`)
  },
  updateProfile(data: UpdateProfilePayload) {
    return http.put("/users/me", data)
  },
  toggleBlock(id: string, blocked: boolean) {
    return http.put(`/users/${id}/block`, { blocked })
  },
}


