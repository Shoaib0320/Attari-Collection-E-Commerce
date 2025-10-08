import { http } from "@/lib/http"

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = { name: string; email: string; password: string }

export const authService = {
  login(data: LoginPayload) {
    return http.post("/auth/login", data)
  },
  register(data: RegisterPayload) {
    return http.post("/auth/register", data)
  },
  me() {
    return http.get("/auth/profile")
  },
  logout() {
    return http.post("/auth/logout")
  },
}


