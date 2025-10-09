"use client"

import { useEffect, useState } from "react"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AdminProducts() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<any>({ 
    title: "", slug: "", price: 0, category: "", subcategory: "", description: "",
    variants: [] as Array<{ color?: string; size?: string; stock?: number }>,
    images: [] as Array<{ url: string }>,
    video: { url: "" } as { url?: string },
    featured: false, trending: false, hidden: false,
  })
  const [variantDraft, setVariantDraft] = useState<{ color?: string; size?: string; stock?: number }>({ color: "", size: "", stock: 0 })
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    productService.getAll()
      .then((res) => setProducts(res.data?.items || res.data?.products || res.data || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data?.categories || res.data || []))
  }, [])

  const refresh = async () => {
    setLoading(true)
    const res = await productService.getAll()
    setProducts(res.data?.items || res.data?.products || res.data || [])
    setLoading(false)
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ title: "", slug: "", price: 0, category: "", subcategory: "", description: "", variants: [], images: [], video: { url: "" }, featured: false, trending: false, hidden: false })
    setVariantDraft({ color: "", size: "", stock: 0 })
    setImageUrl("")
    setVideoUrl("")
    setOpen(true)
  }

  const handleOpenEdit = (p: any) => {
    setEditingId(p._id)
    setForm({ 
      title: p.title || p.name || "",
      slug: p.slug || "",
      price: p.price || 0,
      category: (typeof p.category === 'object' ? p.category?._id : p.category) || "",
      subcategory: p.subcategory || "",
      description: p.description || "",
      variants: Array.isArray(p.variants) ? p.variants.map((v: any) => ({ color: v.color || "", size: v.size || "", stock: Number(v.stock) || 0 })) : [],
      images: Array.isArray(p.images) ? p.images.map((im: any) => ({ url: im.url || im })) : [],
      video: { url: p.video?.url || "" },
      featured: !!p.featured, trending: !!p.trending, hidden: !!p.hidden,
    })
    setVariantDraft({ color: "", size: "", stock: 0 })
    setImageUrl("")
    setVideoUrl(p.video?.url || "")
    setOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      price: Number(form.price) || 0,
      category: form.category || undefined,
      subcategory: form.subcategory || undefined,
      featured: !!form.featured,
      trending: !!form.trending,
      hidden: !!form.hidden,
      variants: (form.variants || []).map((v: any) => ({ color: v.color?.trim() || undefined, size: v.size?.trim() || undefined, stock: Number(v.stock) || 0 })),
      images: (form.images || []).map((im: any) => ({ url: String(im.url) })),
      video: form.video?.url ? { url: String(form.video.url) } : undefined,
    }
    if (editingId) {
      await productService.update(editingId, payload)
    } else {
      await productService.create(payload)
    }
    setOpen(false)
    await refresh()
  }

  const handleDelete = async (id: string) => {
    await productService.remove(id)
    await refresh()
  }

  // Ensure products is an array for rendering safety
  const productList: any[] = Array.isArray(products) ? products : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button onClick={handleOpenCreate}>Add Product</Button>
      </div>
      <div className="rounded border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
            ) : productList.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No products</td></tr>
            ) : (
              productList.map((p: any) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.title || p.name}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.variants?.reduce((s: number, v: any) => s + (v.stock || 0), 0) ?? '-'}</td>
                  <td className="p-3 space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(p)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-screen md:max-w-3xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75dvh] overflow-y-auto pr-1">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((s: any) => ({ ...s, title: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm((s: any) => ({ ...s, slug: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm((s: any) => ({ ...s, price: Number(e.target.value) }))} />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <select className="rounded border bg-background px-3 py-2" value={form.category} onChange={(e) => setForm((s: any) => ({ ...s, category: e.target.value, subcategory: "" }))}>
                <option value="">Select category</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Subcategory</Label>
              <select className="rounded border bg-background px-3 py-2" value={form.subcategory} onChange={(e) => setForm((s: any) => ({ ...s, subcategory: e.target.value }))}>
                <option value="">Select subcategory</option>
                {categories.find((c: any) => c._id === form.category)?.subcategories?.filter((sc: any) => sc.active !== false).map((sc: any, idx: number) => (
                  <option key={idx} value={sc.slug || sc.name}>{sc.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label>Description</Label>
              <textarea className="rounded border bg-background px-3 py-2" rows={4} value={form.description} onChange={(e) => setForm((s: any) => ({ ...s, description: e.target.value }))} />
            </div>
            <div className="flex items-center gap-4 md:col-span-2">
              <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.featured} onCheckedChange={(v) => setForm((s: any) => ({ ...s, featured: v }))} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.trending} onCheckedChange={(v) => setForm((s: any) => ({ ...s, trending: v }))} /> Trending</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.hidden} onCheckedChange={(v) => setForm((s: any) => ({ ...s, hidden: v }))} /> Hidden</label>
            </div>

            {/* Images */}
            <div className="md:col-span-2 space-y-2">
              <Label>Images</Label>
                <div className="flex flex-col md:flex-row gap-2">
                <Input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="button" variant={'default'} onClick={() => { if (!imageUrl.trim()) return; setForm((s: any) => ({ ...s, images: [ ...(s.images || []), { url: imageUrl.trim() } ] })); setImageUrl("") }}>Add URL</Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        const res = await productService.upload(file)
                        const { url } = (res as any).data || {}
                        if (url) setForm((s: any) => ({ ...s, images: [ ...(s.images || []), { url } ] }))
                      } catch (err) {
                        alert("Upload failed")
                      } finally {
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                </div>
              </div>
              {(form.images || []).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {(form.images || []).map((im: any, idx: number) => (
                    <div key={idx} className="border rounded overflow-hidden">
                      <div className="aspect-square bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={im.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-[11px] max-w-[160px] truncate">{im.url}</span>
                        <Button size="sm" variant="ghost" onClick={() => setForm((s: any) => ({ ...s, images: (s.images || []).filter((_: any, i: number) => i !== idx) }))}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video */}
            <div className="md:col-span-2 space-y-2">
              <Label>Video</Label>
              <div className="flex gap-2">
                <Input placeholder="https://..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                <Button type="button" onClick={() => setForm((s: any) => ({ ...s, video: { url: videoUrl.trim() } }))}>Set</Button>
                <Button type="button" variant="ghost" onClick={() => { setVideoUrl(""); setForm((s: any) => ({ ...s, video: { url: "" } })) }}>Clear</Button>
              </div>
              {form.video?.url && <div className="text-xs text-muted-foreground">{form.video.url}</div>}
            </div>

            {/* Variants */}
            <div className="md:col-span-2 space-y-2">
              <Label>Variants</Label>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_160px_auto] items-end gap-2">
                <div>
                  <Label className="text-xs">Color</Label>
                  <Input value={variantDraft.color} onChange={(e) => setVariantDraft((s) => ({ ...s, color: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Size</Label>
                  <Input value={variantDraft.size} onChange={(e) => setVariantDraft((s) => ({ ...s, size: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input type="number" value={variantDraft.stock as number} onChange={(e) => setVariantDraft((s) => ({ ...s, stock: Number(e.target.value) }))} />
                </div>
                <div className="md:text-right">
                  <Button type="button" size="sm" onClick={() => { if (!variantDraft.color && !variantDraft.size) return; setForm((s: any) => ({ ...s, variants: [ ...(s.variants || []), { color: variantDraft.color, size: variantDraft.size, stock: Number(variantDraft.stock) || 0 } ] })); setVariantDraft({ color: "", size: "", stock: 0 }) }}>Add</Button>
                </div>
              </div>

              <div className="mt-2 rounded border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left p-2">Color</th>
                      <th className="text-left p-2">Size</th>
                      <th className="text-left p-2">Stock</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.variants || []).length === 0 ? (
                      <tr><td className="p-2 text-muted-foreground" colSpan={4}>No variants</td></tr>
                    ) : (
                      (form.variants || []).map((v: any, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2"><Input value={v.color} onChange={(e) => setForm((s: any) => { const next = [...(s.variants || [])]; next[idx] = { ...next[idx], color: e.target.value }; return { ...s, variants: next } })} /></td>
                          <td className="p-2"><Input value={v.size} onChange={(e) => setForm((s: any) => { const next = [...(s.variants || [])]; next[idx] = { ...next[idx], size: e.target.value }; return { ...s, variants: next } })} /></td>
                          <td className="p-2"><Input type="number" value={v.stock} onChange={(e) => setForm((s: any) => { const next = [...(s.variants || [])]; next[idx] = { ...next[idx], stock: Number(e.target.value) || 0 }; return { ...s, variants: next } })} /></td>
                          <td className="p-2 text-right"><Button size="sm" variant="ghost" onClick={() => setForm((s: any) => ({ ...s, variants: (s.variants || []).filter((_: any, i: number) => i !== idx) }))}>Remove</Button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}


