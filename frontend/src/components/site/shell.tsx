"use client"

import { usePathname } from "next/navigation"
import SiteHeader from "@/components/site/header"
import SiteFooter from "@/components/site/footer"

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  if (isAdmin) return <>{children}</>
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  )
}


