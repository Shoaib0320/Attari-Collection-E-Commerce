export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded border p-4 bg-card">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Name</label>
            <input className="mt-1 w-full rounded border bg-background px-3 py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input className="mt-1 w-full rounded border bg-background px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" className="mt-1 w-full rounded border bg-background px-3 py-2" placeholder="••••••••" />
          </div>
        </div>
        <div className="mt-4">
          <button className="bg-primary text-primary-foreground rounded px-4 py-2">Save changes</button>
        </div>
      </div>
    </div>
  )
}


