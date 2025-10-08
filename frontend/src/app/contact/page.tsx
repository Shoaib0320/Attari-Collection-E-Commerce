export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Contact & Support</h1>
      <div className="rounded border p-4 bg-card">
        <div className="grid gap-4">
          <div>
            <label className="text-sm">Name</label>
            <input className="mt-1 w-full rounded border bg-background px-3 py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 w-full rounded border bg-background px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm">Message</label>
            <textarea className="mt-1 w-full rounded border bg-background px-3 py-2 h-32" placeholder="How can we help?" />
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-primary text-primary-foreground rounded px-4 py-2">Send message</button>
        </div>
      </div>
    </div>
  )
}


