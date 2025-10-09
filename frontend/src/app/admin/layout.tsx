"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { Hamburger, HamIcon, Menu } from "lucide-react"

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href || pathname?.startsWith(href + "/")
  return (
    <a
      className={`block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground ${active ? 'bg-accent text-accent-foreground' : ''}`}
      href={href}
    >
      {label}
    </a>
  )
}

function Sidebar() {
  return (
    <aside className="border-r bg-card text-card-foreground hidden md:block min-h-dvh">
      <div className="h-14 flex items-center px-4 font-semibold">Attari Admin</div>
      <nav className="px-2 pb-4">
        <div className="text-[11px] uppercase text-muted-foreground px-3 py-2">Management</div>
        <NavLink href="/admin" label="Dashboard" />
        <NavLink href="/admin/products" label="Products" />
        <NavLink href="/admin/categories" label="Categories" />
        <NavLink href="/admin/orders" label="Orders" />
        <NavLink href="/admin/users" label="Users" />
        <NavLink href="/admin/reviews" label="Reviews" />
        <div className="text-[11px] uppercase text-muted-foreground px-3 py-2 mt-2">Insights</div>
        <NavLink href="/admin/analytics" label="Analytics" />
        <div className="text-[11px] uppercase text-muted-foreground px-3 py-2 mt-2">System</div>
        <NavLink href="/admin/settings" label="Settings" />
        <NavLink href="/admin/theme" label="Theme" />
        <NavLink href="/" label="View Site" />
      </nav>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="min-h-dvh">
        <header className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button className="md:hidden" variant="outline" size="sm"><Menu /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px]">
                <div className="h-14 flex items-center px-4 font-semibold border-b">Attari Admin</div>
                <nav className="px-2 pb-4">
                  <div className="text-[11px] uppercase text-muted-foreground px-3 py-2">Management</div>
                  <NavLink href="/admin" label="Dashboard" />
                  <NavLink href="/admin/products" label="Products" />
                  <NavLink href="/admin/categories" label="Categories" />
                  <NavLink href="/admin/orders" label="Orders" />
                  <NavLink href="/admin/users" label="Users" />
                  <NavLink href="/admin/reviews" label="Reviews" />
                  <div className="text-[11px] uppercase text-muted-foreground px-3 py-2 mt-2">Insights</div>
                  <NavLink href="/admin/analytics" label="Analytics" />
                  <div className="text-[11px] uppercase text-muted-foreground px-3 py-2 mt-2">System</div>
                  <NavLink href="/admin/settings" label="Settings" />
                  <NavLink href="/admin/theme" label="Theme" />
                  <NavLink href="/" label="View Site" />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="font-semibold">Attari Collection</div>
          </div>
          <div className="text-sm text-muted-foreground">Admin Panel</div>
        </header>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  )
}


