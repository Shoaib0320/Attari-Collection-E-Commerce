"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authService } from "@/services/authService"


type User = {
  _id: string
  name: string
  email: string
  role?: "user" | "admin"
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
  refresh: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async (): Promise<User | null> => {
    try {
      const res = await authService.me()
      const me = (res as any).data || (res as any).data?.user
      setUser(me ?? null)
      return me ?? null
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  console.log('Login User', user);

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    const res = await authService.login({ email, password })
    const data = (res as any).data
    const token = data?.token
    if (typeof window !== "undefined" && token) {
      window.localStorage.setItem("access_token", token)
    }
    const me = await refresh()
    return me
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {}
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token")
    }
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({ user, loading, login, logout, refresh }), [user, loading, login, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}


