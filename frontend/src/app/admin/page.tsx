export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 bg-card text-card-foreground">
          <div className="text-sm text-muted-foreground">Total Sales</div>
          <div className="text-2xl font-bold mt-2">$24,560</div>
        </div>
        <div className="rounded-lg border p-4 bg-card text-card-foreground">
          <div className="text-sm text-muted-foreground">Orders</div>
          <div className="text-2xl font-bold mt-2">1,248</div>
        </div>
        <div className="rounded-lg border p-4 bg-card text-card-foreground">
          <div className="text-sm text-muted-foreground">Customers</div>
          <div className="text-2xl font-bold mt-2">873</div>
        </div>
        <div className="rounded-lg border p-4 bg-card text-card-foreground">
          <div className="text-sm text-muted-foreground">Conversion</div>
          <div className="text-2xl font-bold mt-2">3.2%</div>
        </div>
      </div>
    </div>
  )
}


