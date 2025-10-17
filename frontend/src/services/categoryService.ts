import { http } from "@/lib/http";

export type CategoryPayload = { name: string; description?: string }

export const categoryService = {
  // Get all categories
  getAll: () => http.get('/categories'),
  
  // Get single category
  getById: (id: string) => http.get(`/categories/${id}`),
  
  // Create category
  create: (data: any) => http.post('/categories', data),

  // Update category
  update: (id: string, data: any) => http.patch(`/categories/${id}`, data),
  
  // Delete category
  remove: (id: string) => http.delete(`/categories/${id}`),
  
  // Add subcategory
  addSubcategory: (categoryId: string, data: any) => 
    http.post(`/categories/${categoryId}/subcategories`, data),
  
  // Update subcategory
  updateSubcategory: (categoryId: string, subcategoryId: string, data: any) =>
    http.put(`/categories/${categoryId}/subcategories/${subcategoryId}`, data),
  
  // Delete subcategory
  removeSubcategory: (categoryId: string, subcategoryId: string) =>
    http.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`),
  
  // Get active categories
  getActive: () => http.get('/categories/active'),
  
  // Get featured categories  
  getFeatured: () => http.get('/categories/featured'),
};