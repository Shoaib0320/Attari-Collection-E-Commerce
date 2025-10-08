"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { authService } from "@/services/authService"

export default function RegisterPage() {
  const { login } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authService.register({ name, email, password })
      await login(email, password)
      const next = params.get("next")
      router.replace(next || "/")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm">Name</label>
          <input className="mt-1 w-full rounded border bg-background px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input className="mt-1 w-full rounded border bg-background px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" className="mt-1 w-full rounded border bg-background px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-sm text-destructive">{error}</div>}
        <button disabled={loading} className="w-full bg-primary text-primary-foreground rounded px-4 py-2">{loading ? "Creating..." : "Create account"}</button>
      </form>
    </div>
  )
}


