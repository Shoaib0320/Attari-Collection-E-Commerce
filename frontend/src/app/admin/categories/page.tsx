"use client"

import { useEffect, useState } from "react"
import { categoryService } from "@/services/categoryService"

export default function AdminCategories() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    categoryService.getAll().then((res) => setCategories(res.data || res.data?.categories || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <a className="bg-primary text-primary-foreground rounded px-4 py-2" href="/admin/categories/new">Add Category</a>
      </div>
      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={2}>Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td className="p-3" colSpan={2}>No categories</td></tr>
            ) : (
              categories.map((c: any) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 space-x-2">
                    <a className="underline text-primary" href={`/admin/categories/${c._id}`}>Edit</a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


