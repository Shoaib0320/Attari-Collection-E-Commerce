import { http } from "@/lib/http"

export type InventoryLogPayload = {
  product: string
  variantId?: string
  type: 'in' | 'out' | 'adjustment' | 'return' | 'damaged' | 'lost'
  quantity: number
  reason: string
  reference?: string
  cost?: number
}

export type InventoryLogFilters = {
  page?: number
  limit?: number
  product?: string
  type?: string
  startDate?: string
  endDate?: string
  sort?: string
}

export const inventoryLogService = {
  // Get all inventory logs
  getAll(params?: InventoryLogFilters) {
    return http.get("/inventory-logs", { params })
  },

  // Get inventory log by ID
  getById(id: string) {
    return http.get(`/inventory-logs/${id}`)
  },

  // Create new inventory log
  create(data: InventoryLogPayload) {
    return http.post("/inventory-logs", data)
  },

  // Update inventory log
  update(id: string, data: Partial<InventoryLogPayload>) {
    return http.patch(`/inventory-logs/${id}`, data)
  },

  // Delete inventory log
  remove(id: string) {
    return http.delete(`/inventory-logs/${id}`)
  },

  // Get product inventory logs
  getProductLogs(productId: string, params?: {
    page?: number
    limit?: number
    type?: string
    startDate?: string
    endDate?: string
  }) {
    return http.get(`/inventory-logs/product/${productId}`, { params })
  },

  // Get inventory summary
  getSummary(params?: { startDate?: string; endDate?: string }) {
    return http.get("/inventory-logs/summary", { params })
  },

  // Get stock alerts
  getStockAlerts() {
    return http.get("/inventory-logs/alerts")
  },

  // Stock adjustment types
  getStockAdjustmentTypes() {
    return [
      { value: 'in', label: 'Stock In', description: 'Add stock to inventory' },
      { value: 'out', label: 'Stock Out', description: 'Remove stock from inventory' },
      { value: 'adjustment', label: 'Adjustment', description: 'Manual stock adjustment' },
      { value: 'return', label: 'Return', description: 'Customer return' },
      { value: 'damaged', label: 'Damaged', description: 'Damaged goods' },
      { value: 'lost', label: 'Lost', description: 'Lost or stolen goods' }
    ]
  }
}