"use client"

import { useEffect, useMemo, useState } from "react"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Subcategory = { name: string; slug?: string; active?: boolean }
type Category = { _id?: string; name: string; slug?: string; active?: boolean; subcategories?: Subcategory[] }

export default function AdminCategories() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<Category>({ name: "", slug: "", active: true, subcategories: [] })
  const [subForm, setSubForm] = useState<Subcategory>({ name: "", slug: "", active: true })

  const isEditing = useMemo(() => Boolean(form?._id), [form])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const res = await categoryService.getAll()
      setCategories(res.data?.categories || res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const resetForm = () => setForm({ name: "", slug: "", active: true, subcategories: [] })

  const handleOpenCreate = () => {
    resetForm()
    setOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setForm({ _id: cat._id, name: cat.name, slug: cat.slug, active: cat.active, subcategories: cat.subcategories || [] })
    setOpen(true)
  }

  const handleSave = async () => {
    const payload = { 
      name: form.name, 
      slug: form.slug || slugify(form.name), 
      active: Boolean(form.active),
      subcategories: (form.subcategories || []).map((s) => ({
        name: s.name,
        slug: s.slug || slugify(s.name),
        active: Boolean(s.active),
      })),
    }
    if (isEditing && form._id) {
      await categoryService.update(form._id, payload)
    } else {
      await categoryService.create(payload)
    }
    setOpen(false)
    resetForm()
    await fetchAll()
  }

  const addSubcategory = () => {
    if (!subForm.name.trim()) return
    setForm((prev) => ({
      ...prev,
      subcategories: [
        ...(prev.subcategories || []),
        { name: subForm.name.trim(), slug: subForm.slug?.trim() || slugify(subForm.name), active: subForm.active !== false },
      ],
    }))
    setSubForm({ name: "", slug: "", active: true })
  }

  const removeSubcategory = (index: number) => {
    setForm((prev) => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter((_, i) => i !== index),
    }))
  }

  const updateSubcategory = (index: number, patch: Partial<Subcategory>) => {
    setForm((prev) => {
      const next = [...(prev.subcategories || [])]
      next[index] = { ...next[index], ...patch }
      return { ...prev, subcategories: next }
    })
  }

  const handleDelete = async (id: string) => {
    await categoryService.remove(id)
    setDeletingId(null)
    await fetchAll()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button onClick={handleOpenCreate} className="h-9">Add Category</Button>
      </div>

      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Active</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No categories</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.slug}</td>
                  <td className="p-3">{c.active ? "Yes" : "No"}</td>
                  <td className="p-3 space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(c)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeletingId(c._id!)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. Men" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} placeholder="e.g. men" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.active} onCheckedChange={(v) => setForm((s) => ({ ...s, active: v }))} />
              <span className="text-sm">Active</span>
            </div>

            <div className="pt-2">
              <div className="font-medium mb-2">Subcategories</div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_100px_auto] items-end gap-2">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input value={subForm.name} onChange={(e) => setSubForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. T-Shirts" />
                </div>
                <div>
                  <Label className="text-xs">Slug</Label>
                  <Input value={subForm.slug} onChange={(e) => setSubForm((s) => ({ ...s, slug: e.target.value }))} placeholder="e.g. t-shirts" />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Active</Label>
                  <Switch checked={!!subForm.active} onCheckedChange={(v) => setSubForm((s) => ({ ...s, active: v }))} />
                </div>
                <div className="md:text-right">
                  <Button type="button" size="sm" onClick={addSubcategory}>Add</Button>
                </div>
              </div>

              <div className="mt-3 rounded border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Slug</th>
                      <th className="text-left p-2">Active</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.subcategories || []).length === 0 ? (
                      <tr><td className="p-2 text-muted-foreground" colSpan={4}>No subcategories</td></tr>
                    ) : (
                      (form.subcategories || []).map((sc, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">
                            <Input value={sc.name} onChange={(e) => updateSubcategory(idx, { name: e.target.value })} />
                          </td>
                          <td className="p-2">
                            <Input value={sc.slug} onChange={(e) => updateSubcategory(idx, { slug: e.target.value })} />
                          </td>
                          <td className="p-2">
                            <Switch checked={!!sc.active} onCheckedChange={(v) => updateSubcategory(idx, { active: v })} />
                          </td>
                          <td className="p-2 text-right">
                            <Button size="sm" variant="destructive" onClick={() => removeSubcategory(idx)}>Remove</Button>
                          </td>
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
            <Button onClick={handleSave}>{isEditing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingId)} onOpenChange={(v) => !v && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
            {deletingId && (
              <Button variant="destructive" onClick={() => handleDelete(deletingId)}>Delete</Button>
            )}
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

