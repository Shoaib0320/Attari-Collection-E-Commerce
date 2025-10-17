// import { http } from "@/lib/http"

// export type ReviewPayload = { 
//   rating: number; 
//   comment?: string;
//   product: string;
// }

// export const reviewService = {
//   getProductReviews(productId: string) {
//     return http.get(`/reviews/product/${productId}`)
//   },
  
//   create(data: ReviewPayload) {
//     return http.post(`/reviews/add`, data)
//   },
  
//   remove(reviewId: string) {
//     return http.delete(`/reviews/${reviewId}`)
//   },
  
//   moderate(reviewId: string, approved: boolean) {
//     return http.post(`/reviews/moderate`, { id: reviewId, approved })
//   }
// }





import { http } from "@/lib/http"

export type ReviewPayload = { 
  product: string
  rating: number
  comment?: string
  title?: string
}

export type ReviewFilters = {
  page?: number
  limit?: number
  sort?: string
  rating?: number
  helpful?: boolean
}

export const reviewService = {
  // Get reviews for a product
  getProductReviews(productId: string, params?: ReviewFilters) {
    return http.get(`/reviews/product/${productId}`, { params })
  },

  // Get user's reviews
  getUserReviews(params?: { page?: number; limit?: number }) {
    return http.get("/reviews/my-reviews", { params })
  },
  
  // Create new review
  create(data: ReviewPayload) {
    return http.post("/reviews", data)
  },

  // Update review
  update(reviewId: string, data: Partial<ReviewPayload>) {
    return http.patch(`/reviews/${reviewId}`, data)
  },
  
  // Delete review
  remove(reviewId: string) {
    return http.delete(`/reviews/${reviewId}`)
  },

  // Mark review as helpful
  markHelpful(reviewId: string) {
    return http.post(`/reviews/${reviewId}/helpful`)
  },

  // Mark review as not helpful
  markNotHelpful(reviewId: string) {
    return http.post(`/reviews/${reviewId}/not-helpful`)
  },
  
  // Moderate review (admin only)
  moderate(reviewId: string, approved: boolean, response?: string) {
    return http.patch(`/reviews/${reviewId}/moderate`, { approved, response })
  },

  // Get rating summary for a product
  getRatingSummary(productId: string) {
    return http.get(`/reviews/product/${productId}`).then(response => {
      return response.data?.ratingSummary || { total: 0, average: 0, ratings: [] }
    })
  }
}