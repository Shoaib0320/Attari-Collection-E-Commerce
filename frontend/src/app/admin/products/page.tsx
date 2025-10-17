// "use client"

// import { useEffect, useState } from "react"
// import { productService } from "@/services/productService"
// import { categoryService } from "@/services/categoryService"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"

// export default function AdminProducts() {
//   const [loading, setLoading] = useState(false)
//   const [products, setProducts] = useState<any[]>([])
//   const [categories, setCategories] = useState<any[]>([])
//   const [open, setOpen] = useState(false)
//   const [form, setForm] = useState<any>({ 
//     title: "", slug: "", price: 0, category: "", subcategory: "", description: "",
//     variants: [] as Array<{ color?: string; size?: string; stock?: number }>,
//     images: [] as Array<{ url: string }>,
//     video: { url: "" } as { url?: string },
//     featured: false, trending: false, hidden: false,
//   })
//   const [variantDraft, setVariantDraft] = useState<{ color?: string; size?: string; stock?: number }>({ color: "", size: "", stock: 0 })
//   const [imageUrl, setImageUrl] = useState("")
//   const [videoUrl, setVideoUrl] = useState("")
//   const [editingId, setEditingId] = useState<string | null>(null)

//   useEffect(() => {
//     setLoading(true)
//     productService.getAll()
//       .then((res) => setProducts(res.data?.items || res.data?.products || res.data || []))
//       .finally(() => setLoading(false))
//   }, [])

//   useEffect(() => {
//     categoryService.getAll().then((res) => setCategories(res.data?.categories || res.data || []))
//   }, [])

//   const refresh = async () => {
//     setLoading(true)
//     const res = await productService.getAll()
//     setProducts(res.data?.items || res.data?.products || res.data || [])
//     setLoading(false)
//   }

//   const handleOpenCreate = () => {
//     setEditingId(null)
//     setForm({ title: "", slug: "", price: 0, category: "", subcategory: "", description: "", variants: [], images: [], video: { url: "" }, featured: false, trending: false, hidden: false })
//     setVariantDraft({ color: "", size: "", stock: 0 })
//     setImageUrl("")
//     setVideoUrl("")
//     setOpen(true)
//   }

//   const handleOpenEdit = (p: any) => {
//     setEditingId(p._id)
//     setForm({ 
//       title: p.title || p.name || "",
//       slug: p.slug || "",
//       price: p.price || 0,
//       category: (typeof p.category === 'object' ? p.category?._id : p.category) || "",
//       subcategory: p.subcategory || "",
//       description: p.description || "",
//       variants: Array.isArray(p.variants) ? p.variants.map((v: any) => ({ color: v.color || "", size: v.size || "", stock: Number(v.stock) || 0 })) : [],
//       images: Array.isArray(p.images) ? p.images.map((im: any) => ({ url: im.url || im })) : [],
//       video: { url: p.video?.url || "" },
//       featured: !!p.featured, trending: !!p.trending, hidden: !!p.hidden,
//     })
//     setVariantDraft({ color: "", size: "", stock: 0 })
//     setImageUrl("")
//     setVideoUrl(p.video?.url || "")
//     setOpen(true)
//   }

//   const handleSave = async () => {
//     const payload = {
//       title: form.title,
//       slug: form.slug || slugify(form.title),
//       description: form.description,
//       price: Number(form.price) || 0,
//       category: form.category || undefined,
//       subcategory: form.subcategory || undefined,
//       featured: !!form.featured,
//       trending: !!form.trending,
//       hidden: !!form.hidden,
//       variants: (form.variants || []).map((v: any) => ({ color: v.color?.trim() || undefined, size: v.size?.trim() || undefined, stock: Number(v.stock) || 0 })),
//       images: (form.images || []).map((im: any) => ({ url: String(im.url) })),
//       video: form.video?.url ? { url: String(form.video.url) } : undefined,
//     }
//     if (editingId) {
//       await productService.update(editingId, payload)
//     } else {
//       await productService.create(payload)
//     }
//     setOpen(false)
//     await refresh()
//   }

//   const handleDelete = async (id: string) => {
//     await productService.remove(id)
//     await refresh()
//   }

//   // Ensure products is an array for rendering safety
//   const productList: any[] = Array.isArray(products) ? products : []

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Products</h1>
//         <Button onClick={handleOpenCreate}>Add Product</Button>
//       </div>
//       <div className="rounded border overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-muted/50">
//             <tr>
//               <th className="text-left p-3">Name</th>
//               <th className="text-left p-3">Price</th>
//               <th className="text-left p-3">Stock</th>
//               <th className="text-left p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
//             ) : productList.length === 0 ? (
//               <tr><td className="p-3" colSpan={4}>No products</td></tr>
//             ) : (
//               productList.map((p: any) => (
//                 <tr key={p._id} className="border-t">
//                   <td className="p-3">{p.title || p.name}</td>
//                   <td className="p-3">${p.price}</td>
//                   <td className="p-3">{p.variants?.reduce((s: number, v: any) => s + (v.stock || 0), 0) ?? '-'}</td>
//                   <td className="p-3 space-x-2">
//                     <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(p)}>Edit</Button>
//                     <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>Delete</Button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="w-[95vw] max-w-screen md:max-w-3xl p-4 md:p-6">
//           <DialogHeader>
//             <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
//           </DialogHeader>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75dvh] overflow-y-auto pr-1">
//             <div className="grid gap-2">
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" value={form.title} onChange={(e) => setForm((s: any) => ({ ...s, title: e.target.value }))} />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="slug">Slug</Label>
//               <Input id="slug" value={form.slug} onChange={(e) => setForm((s: any) => ({ ...s, slug: e.target.value }))} />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="price">Price</Label>
//               <Input id="price" type="number" value={form.price} onChange={(e) => setForm((s: any) => ({ ...s, price: Number(e.target.value) }))} />
//             </div>
//             <div className="grid gap-2">
//               <Label>Category</Label>
//               <select className="rounded border bg-background px-3 py-2" value={form.category} onChange={(e) => setForm((s: any) => ({ ...s, category: e.target.value, subcategory: "" }))}>
//                 <option value="">Select category</option>
//                 {categories.map((c: any) => (
//                   <option key={c._id} value={c._id}>{c.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="grid gap-2">
//               <Label>Subcategory</Label>
//               <select className="rounded border bg-background px-3 py-2" value={form.subcategory} onChange={(e) => setForm((s: any) => ({ ...s, subcategory: e.target.value }))}>
//                 <option value="">Select subcategory</option>
//                 {categories.find((c: any) => c._id === form.category)?.subcategories?.filter((sc: any) => sc.active !== false).map((sc: any, idx: number) => (
//                   <option key={idx} value={sc.slug || sc.name}>{sc.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="grid gap-2 md:col-span-2">
//               <Label>Description</Label>
//               <textarea className="rounded border bg-background px-3 py-2" rows={4} value={form.description} onChange={(e) => setForm((s: any) => ({ ...s, description: e.target.value }))} />
//             </div>
//             <div className="flex items-center gap-4 md:col-span-2">
//               <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.featured} onCheckedChange={(v) => setForm((s: any) => ({ ...s, featured: v }))} /> Featured</label>
//               <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.trending} onCheckedChange={(v) => setForm((s: any) => ({ ...s, trending: v }))} /> Trending</label>
//               <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.hidden} onCheckedChange={(v) => setForm((s: any) => ({ ...s, hidden: v }))} /> Hidden</label>
//             </div>

//             {/* Images */}
//             <div className="md:col-span-2 space-y-2">
//               <Label>Images</Label>
//                 <div className="flex flex-col md:flex-row gap-2">
//                 <Input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
//                 <div className="flex gap-2">
//                   <Button type="button" variant={'default'} onClick={() => { if (!imageUrl.trim()) return; setForm((s: any) => ({ ...s, images: [ ...(s.images || []), { url: imageUrl.trim() } ] })); setImageUrl("") }}>Add URL</Button>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={async (e) => {
//                       const file = e.target.files?.[0]
//                       if (!file) return
//                       try {
//                         const res = await productService.upload(file)
//                         const { url } = (res as any).data || {}
//                         if (url) setForm((s: any) => ({ ...s, images: [ ...(s.images || []), { url } ] }))
//                       } catch (err) {
//                         alert("Upload failed")
//                       } finally {
//                         e.currentTarget.value = ""
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//               {(form.images || []).length > 0 && (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                   {(form.images || []).map((im: any, idx: number) => (
//                     <div key={idx} className="border rounded overflow-hidden">
//                       <div className="aspect-square bg-muted">
//                         {/* eslint-disable-next-line @next/next/no-img-element */}
//                         <img src={im.url} alt="" className="w-full h-full object-cover" />
//                       </div>
//                       <div className="flex items-center justify-between px-2 py-1">
//                         <span className="text-[11px] max-w-[160px] truncate">{im.url}</span>
//                         <Button size="sm" variant="ghost" onClick={() => setForm((s: any) => ({ ...s, images: (s.images || []).filter((_: any, i: number) => i !== idx) }))}>Remove</Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Video */}
//             <div className="md:col-span-2 space-y-2">
//               <Label>Video</Label>
//               <div className="flex gap-2">
//                 <Input placeholder="https://..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
//                 <Button type="button" onClick={() => setForm((s: any) => ({ ...s, video: { url: videoUrl.trim() } }))}>Set</Button>
//                 <Button type="button" variant="ghost" onClick={() => { setVideoUrl(""); setForm((s: any) => ({ ...s, video: { url: "" } })) }}>Clear</Button>
//               </div>
//               {form.video?.url && <div className="text-xs text-muted-foreground">{form.video.url}</div>}
//             </div>

//             {/* Variants */}
//             <div className="md:col-span-2 space-y-2">
//               <Label>Variants</Label>
//               <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_160px_auto] items-end gap-2">
//                 <div>
//                   <Label className="text-xs">Color</Label>
//                   <Input value={variantDraft.color} onChange={(e) => setVariantDraft((s) => ({ ...s, color: e.target.value }))} />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Size</Label>
//                   <Input value={variantDraft.size} onChange={(e) => setVariantDraft((s) => ({ ...s, size: e.target.value }))} />
//                 </div>
//                 <div>
//                   <Label className="text-xs">Stock</Label>
//                   <Input type="number" value={variantDraft.stock as number} onChange={(e) => setVariantDraft((s) => ({ ...s, stock: Number(e.target.value) }))} />
//                 </div>
//                 <div className="md:text-right">
//                   <Button type="button" size="sm" onClick={() => { if (!variantDraft.color && !variantDraft.size) return; setForm((s: any) => ({ ...s, variants: [ ...(s.variants || []), { color: variantDraft.color, size: variantDraft.size, stock: Number(variantDraft.stock) || 0 } ] })); setVariantDraft({ color: "", size: "", stock: 0 }) }}>Add</Button>
//                 </div>
//               </div>

//               <div className="mt-2 rounded border overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead className="bg-muted/40">
//                     <tr>
//                       <th className="text-left p-2">Color</th>
//                       <th className="text-left p-2">Size</th>
//                       <th className="text-left p-2">Stock</th>
//                       <th className="text-right p-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(form.variants || []).length === 0 ? (
//                       <tr><td className="p-2 text-muted-foreground" colSpan={4}>No variants</td></tr>
//                     ) : (
//                       (form.variants || []).map((v: any, idx: number) => (
//                         <tr key={idx} className="border-t">
//                           <td className="p-2"><Input value={v.color} onChange={(e) => setForm((s: any) => { const next = [...(s.variants || [])]; next[idx] = { ...next[idx], color: e.target.value }; return { ...s, variants: next } })} /></td>
//                           <td className="p-2"><Input value={v.size} onChange={(e) => setForm((s: any) => { const next = [...(s.variants || [])]; next[idx] = { ...next[idx], size: e.target.value }; return { ...s, variants: next } })} /></td>
//                           <td className="p-2"><Input type="number" value={v.stock} onChange={(e) => setForm((s: any) => { const next = [...(s.variants || [])]; next[idx] = { ...next[idx], stock: Number(e.target.value) || 0 }; return { ...s, variants: next } })} /></td>
//                           <td className="p-2 text-right"><Button size="sm" variant="ghost" onClick={() => setForm((s: any) => ({ ...s, variants: (s.variants || []).filter((_: any, i: number) => i !== idx) }))}>Remove</Button></td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
//             <Button onClick={handleSave}>{editingId ? "Save" : "Create"}</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// function slugify(value: string) {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
// }







"use client"

import { useEffect, useState } from "react"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminProducts() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("base-info")
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
    // productService.getAll()
    //   .then((res) => setProducts(res.data?.items || res.data?.products || res.data || []))
    //   .finally(() => setLoading(false))
    productService.getAll()
      .then((res) => {
        console.log('API Response:', res); // Debugging ke liye
        console.log('Response data:', res.data); // Debugging ke liye

        const productsData = res.data?.items || res.data?.products || res.data || [];
        console.log('Final products data:', productsData); // Debugging ke liye

        setProducts(productsData);
      })
      .catch((error) => {
        console.error('API Error:', error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
    console.log('Products Data', products)
  }, [])

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data?.categories || res.data || []))
  }, [])

  const refresh = async () => {
    setLoading(true)
    const res = await productService.getAll()
    setProducts(res.data?.items || res.data?.products || res.data || [])
    console.log('Products Data', res.data)
    setLoading(false)
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm({ title: "", slug: "", price: 0, category: "", subcategory: "", description: "", variants: [], images: [], video: { url: "" }, featured: false, trending: false, hidden: false })
    setVariantDraft({ color: "", size: "", stock: 0 })
    setImageUrl("")
    setVideoUrl("")
    setActiveTab("base-info")
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
    setActiveTab("base-info")
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ProXduct</h1>
          <p className="text-muted-foreground">Manage your products and inventory</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700">
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>View, edit, and manage all your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold">Product Name</th>
                  <th className="text-left p-4 font-semibold">Price</th>
                  <th className="text-left p-4 font-semibold">Stock</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="p-4 text-center" colSpan={5}>Loading products...</td></tr>
                ) : productList.length === 0 ? (
                  <tr><td className="p-4 text-center text-muted-foreground" colSpan={5}>No products found</td></tr>
                ) : (
                  productList.map((p: any) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{p.title || p.name}</td>
                      <td className="p-4">${p.price}</td>
                      <td className="p-4">{p.variants?.reduce((s: number, v: any) => s + (v.stock || 0), 0) ?? '-'}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {p.featured && <Badge variant="secondary">Featured</Badge>}
                          {p.trending && <Badge variant="secondary">Trending</Badge>}
                          {p.hidden && <Badge variant="destructive">Hidden</Badge>}
                        </div>
                      </td>
                      <td className="p-4 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(p)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-4xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* Header - Fixed */}
          <DialogHeader className="p-4 sm:p-6 border-b shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {editingId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          {/* Main Content - Scrollable */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              {/* Tabs Navigation - Fixed */}
              <div className="border-b shrink-0">
                <TabsList className="w-full justify-start rounded-none h-auto p-2 sm:p-4 sm:h-14 flex-wrap sm:flex-nowrap overflow-x-auto">
                  <TabsTrigger value="base-info" className="flex-1 min-w-[120px] data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm py-2">
                    Base Info
                  </TabsTrigger>
                  <TabsTrigger value="pictures" className="flex-1 min-w-[120px] data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm py-2">
                    Pictures
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="flex-1 min-w-[120px] data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm py-2">
                    Variants
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1 min-w-[120px] data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none text-xs sm:text-sm py-2">
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Base Information Tab */}
                <TabsContent value="base-info" className="space-y-4 sm:space-y-6 m-0">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm sm:text-base font-medium">Title</Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm((s: any) => ({ ...s, title: e.target.value }))}
                        placeholder="Loom Stars Original T-Shirt"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description" className="text-sm sm:text-base font-medium">Description</Label>
                      <textarea
                        className="rounded border bg-background px-3 py-2 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-vertical"
                        value={form.description}
                        onChange={(e) => setForm((s: any) => ({ ...s, description: e.target.value }))}
                        placeholder="Short-sleeved T-shirt with round neck. Thickness: 135 – 145 g/m². Collar Style: Round Collar"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price" className="text-sm sm:text-base font-medium">Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="price"
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm((s: any) => ({ ...s, price: Number(e.target.value) }))}
                            className="h-10 sm:h-12 pl-8 text-sm sm:text-base"
                            placeholder="120"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="slug" className="text-sm sm:text-base font-medium">Slug</Label>
                        <Input
                          id="slug"
                          value={form.slug}
                          onChange={(e) => setForm((s: any) => ({ ...s, slug: e.target.value }))}
                          className="h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm sm:text-base font-medium">Category</Label>
                        <select
                          className="rounded border bg-background px-3 py-2 h-10 sm:h-12 text-sm sm:text-base"
                          value={form.category}
                          onChange={(e) => setForm((s: any) => ({ ...s, category: e.target.value, subcategory: "" }))}
                        >
                          <option value="">Select category</option>
                          {categories.map((c: any) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-sm sm:text-base font-medium">Subcategory</Label>
                        <select
                          className="rounded border bg-background px-3 py-2 h-10 sm:h-12 text-sm sm:text-base"
                          value={form.subcategory}
                          onChange={(e) => setForm((s: any) => ({ ...s, subcategory: e.target.value }))}
                        >
                          <option value="">Select subcategory</option>
                          {categories.find((c: any) => c._id === form.category)?.subcategories?.filter((sc: any) => sc.active !== false).map((sc: any, idx: number) => (
                            <option key={idx} value={sc.slug || sc.name}>{sc.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-4">
                      <label className="flex items-center gap-3 text-sm sm:text-base">
                        <Switch checked={!!form.featured} onCheckedChange={(v) => setForm((s: any) => ({ ...s, featured: v }))} />
                        <span>Featured</span>
                      </label>
                      <label className="flex items-center gap-3 text-sm sm:text-base">
                        <Switch checked={!!form.trending} onCheckedChange={(v) => setForm((s: any) => ({ ...s, trending: v }))} />
                        <span>Trending</span>
                      </label>
                      <label className="flex items-center gap-3 text-sm sm:text-base">
                        <Switch checked={!!form.hidden} onCheckedChange={(v) => setForm((s: any) => ({ ...s, hidden: v }))} />
                        <span>Hidden</span>
                      </label>
                    </div>
                  </div>
                </TabsContent>

                {/* Pictures Tab */}
                <TabsContent value="pictures" className="space-y-4 sm:space-y-6 m-0">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm sm:text-base font-medium mb-3 block">Product Images</Label>
                      <div className="flex flex-col gap-3">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="h-10 sm:h-12 text-sm sm:text-base"
                        />
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            type="button"
                            variant={'default'}
                            onClick={() => {
                              if (!imageUrl.trim()) return;
                              setForm((s: any) => ({ ...s, images: [...(s.images || []), { url: imageUrl.trim() }] }));
                              setImageUrl("")
                            }}
                            className="h-10 sm:h-12 text-sm flex-1 min-w-[120px]"
                          >
                            Add URL
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                const res = await productService.upload(file)
                                const { url } = (res as any).data || {}
                                if (url) setForm((s: any) => ({ ...s, images: [...(s.images || []), { url }] }))
                              } catch (err) {
                                alert("Upload failed")
                              } finally {
                                e.currentTarget.value = ""
                              }
                            }}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button asChild variant="outline" className="h-10 sm:h-12 text-sm flex-1 min-w-[120px]">
                            <label htmlFor="image-upload">Upload File</label>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {(form.images || []).length > 0 && (
                      <div className="max-h-60 sm:max-h-80 overflow-y-auto border rounded-lg p-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {(form.images || []).map((im: any, idx: number) => (
                            <div key={idx} className="border rounded-lg overflow-hidden group relative">
                              <div className="aspect-square bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={im.url} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setForm((s: any) => ({ ...s, images: (s.images || []).filter((_: any, i: number) => i !== idx) }))}
                                  className="text-xs"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 sm:pt-6">
                    <Label className="text-sm sm:text-base font-medium">Product Video</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="https://example.com/video.mp4"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="h-10 sm:h-12 text-sm sm:text-base flex-1"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => setForm((s: any) => ({ ...s, video: { url: videoUrl.trim() } }))}
                          className="h-10 sm:h-12 text-sm flex-1"
                        >
                          Set Video
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setVideoUrl(""); setForm((s: any) => ({ ...s, video: { url: "" } })) }}
                          className="h-10 sm:h-12 text-sm flex-1"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    {form.video?.url && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium">Current Video:</div>
                        <div className="text-sm text-muted-foreground truncate">{form.video.url}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Variants Tab */}
                <TabsContent value="variants" className="space-y-4 sm:space-y-6 m-0">
                  <div className="space-y-4">
                    <Label className="text-sm sm:text-base font-medium">Add Product Variants</Label>
                    <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs sm:text-sm font-medium">Color</Label>
                          <Input
                            value={variantDraft.color}
                            onChange={(e) => setVariantDraft((s) => ({ ...s, color: e.target.value }))}
                            placeholder="e.g., Black, White"
                            className="h-9 sm:h-11 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm font-medium">Size</Label>
                          <Input
                            value={variantDraft.size}
                            onChange={(e) => setVariantDraft((s) => ({ ...s, size: e.target.value }))}
                            placeholder="e.g., S, M, L"
                            className="h-9 sm:h-11 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs sm:text-sm font-medium">Stock</Label>
                          <Input
                            type="number"
                            value={variantDraft.stock as number}
                            onChange={(e) => setVariantDraft((s) => ({ ...s, stock: Number(e.target.value) }))}
                            className="h-9 sm:h-11 text-sm"
                          />
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <Button
                          type="button"
                          size="lg"
                          onClick={() => {
                            if (!variantDraft.color && !variantDraft.size) return;
                            setForm((s: any) => ({ ...s, variants: [...(s.variants || []), { color: variantDraft.color, size: variantDraft.size, stock: Number(variantDraft.stock) || 0 }] }));
                            setVariantDraft({ color: "", size: "", stock: 0 })
                          }}
                          className="h-9 sm:h-11 w-full sm:w-auto text-sm"
                        >
                          Add Variant
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border overflow-hidden">
                      <div className="max-h-60 sm:max-h-80 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 sticky top-0">
                            <tr>
                              <th className="text-left p-3 font-semibold text-xs sm:text-sm">Color</th>
                              <th className="text-left p-3 font-semibold text-xs sm:text-sm">Size</th>
                              <th className="text-left p-3 font-semibold text-xs sm:text-sm">Stock</th>
                              <th className="text-right p-3 font-semibold text-xs sm:text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(form.variants || []).length === 0 ? (
                              <tr>
                                <td className="p-4 text-muted-foreground text-center text-sm" colSpan={4}>
                                  No variants added yet
                                </td>
                              </tr>
                            ) : (
                              (form.variants || []).map((v: any, idx: number) => (
                                <tr key={idx} className="border-t hover:bg-gray-50">
                                  <td className="p-3">
                                    <Input
                                      value={v.color}
                                      onChange={(e) => setForm((s: any) => {
                                        const next = [...(s.variants || [])];
                                        next[idx] = { ...next[idx], color: e.target.value };
                                        return { ...s, variants: next }
                                      })}
                                      className="h-8 sm:h-9 text-xs sm:text-sm"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      value={v.size}
                                      onChange={(e) => setForm((s: any) => {
                                        const next = [...(s.variants || [])];
                                        next[idx] = { ...next[idx], size: e.target.value };
                                        return { ...s, variants: next }
                                      })}
                                      className="h-8 sm:h-9 text-xs sm:text-sm"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="number"
                                      value={v.stock}
                                      onChange={(e) => setForm((s: any) => {
                                        const next = [...(s.variants || [])];
                                        next[idx] = { ...next[idx], stock: Number(e.target.value) || 0 };
                                        return { ...s, variants: next }
                                      })}
                                      className="h-8 sm:h-9 text-xs sm:text-sm"
                                    />
                                  </td>
                                  <td className="p-3 text-right">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setForm((s: any) => ({ ...s, variants: (s.variants || []).filter((_: any, i: number) => i !== idx) }))}
                                      className="text-xs h-8 sm:h-9"
                                    >
                                      Remove
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview" className="space-y-4 sm:space-y-6 m-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Product Preview */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-lg sm:text-xl font-semibold">Product Preview</h3>

                      <Card>
                        <CardContent className="p-4 sm:p-6">
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                            {form.images?.[0]?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={form.images[0].url}
                                alt={form.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="text-muted-foreground text-sm">No image</div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="space-y-3">
                            <h4 className="text-base sm:text-lg font-semibold">{form.title || "Product Title"}</h4>
                            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">
                              {form.description || "Product description will appear here."}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl sm:text-2xl font-bold">${form.price || "0"}</span>
                              <div className="flex gap-2">
                                {form.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                                {form.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                              </div>
                            </div>
                          </div>

                          {/* Variants Preview */}
                          {(form.variants || []).length > 0 && (
                            <div className="space-y-3 mt-4 pt-4 border-t">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <select className="flex-1 rounded border bg-background px-3 py-2 text-sm">
                                  <option value="">Select Size</option>
                                  {Array.from(new Set(form.variants.map((v: any) => v.size).filter(Boolean))).map((size: any) => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                                <select className="flex-1 rounded border bg-background px-3 py-2 text-sm">
                                  <option value="">Select Color</option>
                                  {Array.from(new Set(form.variants.map((v: any) => v.color).filter(Boolean))).map((color: any) => (
                                    <option key={color} value={color}>{color}</option>
                                  ))}
                                </select>
                              </div>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                                Add To Cart
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Form Summary */}
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-lg sm:text-xl font-semibold">Form Summary</h3>

                      <Card>
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-base sm:text-lg">Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                          <div>
                            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Title</Label>
                            <p className="text-sm sm:text-base">{form.title || "Not set"}</p>
                          </div>

                          <div>
                            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Price</Label>
                            <p className="text-sm sm:text-base">${form.price || "0"}</p>
                          </div>

                          <div>
                            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Category</Label>
                            <p className="text-sm sm:text-base">
                              {categories.find(c => c._id === form.category)?.name || "Not selected"}
                              {form.subcategory && ` / ${form.subcategory}`}
                            </p>
                          </div>

                          <div>
                            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Images</Label>
                            <p className="text-sm sm:text-base">{form.images?.length || 0} images</p>
                          </div>

                          <div>
                            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Variants</Label>
                            <p className="text-sm sm:text-base">{form.variants?.length || 0} variants</p>
                          </div>

                          <div>
                            <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Status</Label>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {form.featured && <Badge className="text-xs">Featured</Badge>}
                              {form.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                              {form.hidden && <Badge variant="destructive" className="text-xs">Hidden</Badge>}
                              {!form.featured && !form.trending && !form.hidden && (
                                <Badge variant="outline" className="text-xs">Default</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Footer - Fixed */}
          <DialogFooter className="p-4 sm:p-6 border-t bg-gray-50 shrink-0">
            <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="order-2 sm:order-1 text-sm">
                Cancel
              </Button>
              <div className="flex gap-2 order-1 sm:order-2">
                <Button variant="outline" className="text-sm flex-1 sm:flex-none">
                  Save Draft
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-sm flex-1 sm:flex-none">
                  {editingId ? "Update Product" : "Publish Now"}
                </Button>
              </div>
            </div>
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