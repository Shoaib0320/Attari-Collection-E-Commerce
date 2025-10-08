import { http } from "@/lib/http"

export type ReviewPayload = { rating: number; comment?: string }

export const reviewService = {
  getProductReviews(productId: string) {
    return http.get(`/products/${productId}/reviews`)
  },
  create(productId: string, data: ReviewPayload) {
    return http.post(`/products/${productId}/reviews`, data)
  },
  remove(productId: string, reviewId: string) {
    return http.delete(`/products/${productId}/reviews/${reviewId}`)
  },
}


