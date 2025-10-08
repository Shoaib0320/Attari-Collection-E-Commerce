import axios from "axios"
import { BASE_URL } from "@/config/api"

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  // Attach auth token if present
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token")
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as any)["Authorization"] = `Bearer ${token}`
    }
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error)
  }
)


