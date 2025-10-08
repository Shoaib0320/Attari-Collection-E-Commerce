export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="rounded border p-4 bg-card">
        <div className="text-sm text-muted-foreground">Brand assets and global settings.</div>
        <div className="mt-4 flex gap-3">
          <a className="bg-primary text-primary-foreground rounded px-4 py-2" href="/admin/theme">Open Theme Editor</a>
        </div>
      </div>
    </div>
  )
}


