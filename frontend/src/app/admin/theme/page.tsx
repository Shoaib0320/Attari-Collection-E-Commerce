"use client"

import { useTheme } from "@/providers/theme-provider"

export default function ThemePage() {
  const { actualTheme, setTheme } = useTheme()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Theme</h1>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-2" onClick={() => setTheme('system')}>System</button>
          <button className="bg-white text-black rounded px-3 py-2" onClick={() => setTheme('light')}>Light</button>
          <button className="bg-black text-white rounded px-3 py-2" onClick={() => setTheme('dark')}>Dark</button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">Current: {actualTheme}</div>

      <div className="rounded border p-4">
        <div className="text-sm text-muted-foreground mb-2">Preview</div>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-primary text-primary-foreground rounded px-4 py-2">Primary Button</button>
          <button className="bg-secondary text-secondary-foreground rounded px-4 py-2">Secondary</button>
          <button className="border rounded px-4 py-2">Outline</button>
          <button className="underline text-primary">Link</button>
        </div>
      </div>
    </div>
  )
}



