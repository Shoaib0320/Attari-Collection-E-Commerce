"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const demo = Array.from({ length: 12 }).map((_, i) => ({ month: i + 1, sales: Math.round(1000 + Math.random() * 5000) }))

export default function AdminAnalytics() {
  const [data, setData] = useState(demo)
  useEffect(() => {
    // Fetch analytics later
  }, [])
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <div className="rounded border p-4 bg-card">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


