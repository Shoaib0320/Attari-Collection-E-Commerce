import { http } from "@/lib/http"

export type OrderPayload = {
  items: Array<{ product: string; quantity: number }>
  addressId: string
  paymentMethod: string
}

export const orderService = {
  getAll(params?: Record<string, any>) {
    return http.get("/orders", { params })
  },
  getById(id: string) {
    return http.get(`/orders/${id}`)
  },
  create(data: OrderPayload) {
    return http.post("/orders", data)
  },
  updateStatus(id: string, status: string) {
    return http.put(`/orders/${id}/status`, { status })
  },
}


