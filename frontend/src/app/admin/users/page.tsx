"use client"

import { useEffect, useState } from "react"
import { userService } from "@/services/userService"

export default function AdminUsers() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    userService.getAll().then((res) => setUsers(res.data || res.data?.users || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="rounded border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={3}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="p-3" colSpan={3}>No users</td></tr>
            ) : (
              users.map((u: any) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 space-x-2">
                    <a className="underline text-primary" href={`/admin/users/${u._id}`}>View</a>
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


