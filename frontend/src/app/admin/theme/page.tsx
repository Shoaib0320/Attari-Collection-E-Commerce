"use client"

import { useThemeTokens } from "@/providers/theme-provider"
import { useState } from "react"

const COLOR_FIELDS = [
  { key: "primary", label: "Primary" },
  { key: "primaryForeground", label: "Primary Foreground" },
  { key: "secondary", label: "Secondary" },
  { key: "secondaryForeground", label: "Secondary Foreground" },
  { key: "accent", label: "Accent" },
  { key: "accentForeground", label: "Accent Foreground" },
  { key: "destructive", label: "Destructive" },
  { key: "border", label: "Border" },
  { key: "input", label: "Input" },
  { key: "ring", label: "Ring" },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "card", label: "Card" },
  { key: "cardForeground", label: "Card Foreground" },
  { key: "popover", label: "Popover" },
  { key: "popoverForeground", label: "Popover Foreground" },
  { key: "radius", label: "Radius (e.g. 8px)" },
] as const

export default function ThemePage() {
  const { tokens, setTokens, reset } = useThemeTokens()
  const [local, setLocal] = useState(tokens)

  function handleChange(key: string, value: string) {
    const next = { ...local, [key]: value }
    setLocal(next)
  }

  function applyAll() {
    setTokens(local)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Theme Editor</h1>
        <div className="flex gap-2">
          <button className="bg-secondary text-secondary-foreground rounded px-4 py-2" onClick={() => setLocal(tokens)}>Revert</button>
          <button className="bg-destructive text-white rounded px-4 py-2" onClick={reset}>Reset</button>
          <button className="bg-primary text-primary-foreground rounded px-4 py-2" onClick={applyAll}>Apply</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COLOR_FIELDS.map((field) => (
          <div key={field.key} className="rounded border p-4 bg-card">
            <label className="block text-sm font-medium mb-2">{field.label}</label>
            <input
              className="w-full rounded border bg-background px-3 py-2"
              value={(local as any)[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.key === "radius" ? "8px" : "oklch(...) or #hex"}
            />
          </div>
        ))}
      </div>

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


