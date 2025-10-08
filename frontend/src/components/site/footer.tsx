export default function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Attari Collection</div>
        <nav className="flex items-center gap-4">
          <a className="hover:underline" href="/contact">Contact</a>
          <a className="hover:underline" href="/profile">Profile</a>
        </nav>
      </div>
    </footer>
  )
}


