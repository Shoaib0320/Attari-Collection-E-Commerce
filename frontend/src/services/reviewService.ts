import { http } from "@/lib/http"

export type ReviewPayload = { rating: number; comment?: string }

export const reviewService = {
  getProductReviews(productId: string) {
    return http.get(`/reviews/product/${productId}`)
  },
  create(productId: string, data: ReviewPayload) {
    return http.post(`/reviews/products/${productId}/reviews`, data)
  },
  remove(productId: string, reviewId: string) {
    return http.delete(`/reviews/products/${productId}/reviews/${reviewId}`)
  },
}


