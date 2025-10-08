export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-r bg-card text-card-foreground">
        <div className="h-14 flex items-center px-4 font-semibold">Attari Admin</div>
        <nav className="px-2 pb-4">
          <div className="text-[11px] uppercase text-muted-foreground px-3 py-2">Management</div>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin">Dashboard</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/products">Products</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/categories">Categories</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/orders">Orders</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/users">Users</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/reviews">Reviews</a>
          <div className="text-[11px] uppercase text-muted-foreground px-3 py-2 mt-2">Insights</div>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/analytics">Analytics</a>
          <div className="text-[11px] uppercase text-muted-foreground px-3 py-2 mt-2">System</div>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/settings">Settings</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/admin/theme">Theme</a>
          <a className="block px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground" href="/">View Site</a>
        </nav>
      </aside>
      <main className="min-h-dvh">
        <header className="h-14 border-b flex items-center justify-between px-4">
          <div className="font-semibold">Attari Collection</div>
          <div className="text-sm text-muted-foreground">Admin Panel</div>
        </header>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  )
}


