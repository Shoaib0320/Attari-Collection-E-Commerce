"use client"

import { useEffect, useState } from "react"
import { orderService } from "@/services/orderService"

export default function AdminOrders() {
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    orderService.getAll().then((res) => setOrders(res.data || res.data?.orders || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="rounded border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Order #</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No orders</td></tr>
            ) : (
              orders.map((o: any) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3">{o._id}</td>
                  <td className="p-3">{o.user?.name ?? '-'}</td>
                  <td className="p-3">${o.total ?? '-'}</td>
                  <td className="p-3">{o.status ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


