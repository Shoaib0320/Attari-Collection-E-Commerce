// // "use client"

// // import { useEffect, useMemo, useState } from "react"
// // import { categoryService } from "@/services/categoryService"
// // import { Button } from "@/components/ui/button"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Switch } from "@/components/ui/switch"

// // type Subcategory = { name: string; slug?: string; active?: boolean }
// // type Category = { _id?: string; name: string; slug?: string; active?: boolean; subcategories?: Subcategory[] }

// // export default function AdminCategories() {
// //   const [loading, setLoading] = useState(false)
// //   const [categories, setCategories] = useState<Category[]>([])
// //   const [open, setOpen] = useState(false)
// //   const [deletingId, setDeletingId] = useState<string | null>(null)
// //   const [form, setForm] = useState<Category>({ name: "", slug: "", active: true, subcategories: [] })
// //   const [subForm, setSubForm] = useState<Subcategory>({ name: "", slug: "", active: true })

// //   const isEditing = useMemo(() => Boolean(form?._id), [form])

// //   const fetchAll = async () => {
// //     setLoading(true)
// //     try {
// //       const res = await categoryService.getAll()
// //       setCategories(res.data?.categories || res.data || [])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchAll()
// //   }, [])

// //   const resetForm = () => setForm({ name: "", slug: "", active: true, subcategories: [] })

// //   const handleOpenCreate = () => {
// //     resetForm()
// //     setOpen(true)
// //   }

// //   const handleOpenEdit = (cat: Category) => {
// //     setForm({ _id: cat._id, name: cat.name, slug: cat.slug, active: cat.active, subcategories: cat.subcategories || [] })
// //     setOpen(true)
// //   }

// //   const handleSave = async () => {
// //     const payload = { 
// //       name: form.name, 
// //       slug: form.slug || slugify(form.name), 
// //       active: Boolean(form.active),
// //       subcategories: (form.subcategories || []).map((s) => ({
// //         name: s.name,
// //         slug: s.slug || slugify(s.name),
// //         active: Boolean(s.active),
// //       })),
// //     }
// //     if (isEditing && form._id) {
// //       await categoryService.update(form._id, payload)
// //     } else {
// //       await categoryService.create(payload)
// //     }
// //     setOpen(false)
// //     resetForm()
// //     await fetchAll()
// //   }

// //   const addSubcategory = () => {
// //     if (!subForm.name.trim()) return
// //     setForm((prev) => ({
// //       ...prev,
// //       subcategories: [
// //         ...(prev.subcategories || []),
// //         { name: subForm.name.trim(), slug: subForm.slug?.trim() || slugify(subForm.name), active: subForm.active !== false },
// //       ],
// //     }))
// //     setSubForm({ name: "", slug: "", active: true })
// //   }

// //   const removeSubcategory = (index: number) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       subcategories: (prev.subcategories || []).filter((_, i) => i !== index),
// //     }))
// //   }

// //   const updateSubcategory = (index: number, patch: Partial<Subcategory>) => {
// //     setForm((prev) => {
// //       const next = [...(prev.subcategories || [])]
// //       next[index] = { ...next[index], ...patch }
// //       return { ...prev, subcategories: next }
// //     })
// //   }

// //   const handleDelete = async (id: string) => {
// //     await categoryService.remove(id)
// //     setDeletingId(null)
// //     await fetchAll()
// //   }

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex items-center justify-between">
// //         <h1 className="text-xl font-semibold">Categories</h1>
// //         <Button onClick={handleOpenCreate} className="h-9">Add Category</Button>
// //       </div>

// //       <div className="rounded border overflow-hidden">
// //         <table className="w-full text-sm">
// //           <thead className="bg-muted/50">
// //             <tr>
// //               <th className="text-left p-3">Name</th>
// //               <th className="text-left p-3">Slug</th>
// //               <th className="text-left p-3">Active</th>
// //               <th className="text-left p-3">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {loading ? (
// //               <tr><td className="p-3" colSpan={4}>Loading...</td></tr>
// //             ) : categories.length === 0 ? (
// //               <tr><td className="p-3" colSpan={4}>No categories</td></tr>
// //             ) : (
// //               categories.map((c) => (
// //                 <tr key={c._id} className="border-t">
// //                   <td className="p-3">{c.name}</td>
// //                   <td className="p-3 text-muted-foreground">{c.slug}</td>
// //                   <td className="p-3">{c.active ? "Yes" : "No"}</td>
// //                   <td className="p-3 space-x-2">
// //                     <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(c)}>Edit</Button>
// //                     <Button size="sm" variant="destructive" onClick={() => setDeletingId(c._id!)}>Delete</Button>
// //                   </td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       <Dialog open={open} onOpenChange={setOpen}>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
// //           </DialogHeader>
// //           <div className="space-y-4">
// //             <div className="grid gap-2">
// //               <Label htmlFor="name">Name</Label>
// //               <Input id="name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. Men" />
// //             </div>
// //             <div className="grid gap-2">
// //               <Label htmlFor="slug">Slug</Label>
// //               <Input id="slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} placeholder="e.g. men" />
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <Switch checked={!!form.active} onCheckedChange={(v) => setForm((s) => ({ ...s, active: v }))} />
// //               <span className="text-sm">Active</span>
// //             </div>

// //             <div className="pt-2">
// //               <div className="font-medium mb-2">Subcategories</div>
// //               <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_100px_auto] items-end gap-2">
// //                 <div>
// //                   <Label className="text-xs">Name</Label>
// //                   <Input value={subForm.name} onChange={(e) => setSubForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. T-Shirts" />
// //                 </div>
// //                 <div>
// //                   <Label className="text-xs">Slug</Label>
// //                   <Input value={subForm.slug} onChange={(e) => setSubForm((s) => ({ ...s, slug: e.target.value }))} placeholder="e.g. t-shirts" />
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   <Label className="text-xs">Active</Label>
// //                   <Switch checked={!!subForm.active} onCheckedChange={(v) => setSubForm((s) => ({ ...s, active: v }))} />
// //                 </div>
// //                 <div className="md:text-right">
// //                   <Button type="button" size="sm" onClick={addSubcategory}>Add</Button>
// //                 </div>
// //               </div>

// //               <div className="mt-3 rounded border overflow-hidden">
// //                 <table className="w-full text-sm">
// //                   <thead className="bg-muted/40">
// //                     <tr>
// //                       <th className="text-left p-2">Name</th>
// //                       <th className="text-left p-2">Slug</th>
// //                       <th className="text-left p-2">Active</th>
// //                       <th className="text-right p-2">Actions</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {(form.subcategories || []).length === 0 ? (
// //                       <tr><td className="p-2 text-muted-foreground" colSpan={4}>No subcategories</td></tr>
// //                     ) : (
// //                       (form.subcategories || []).map((sc, idx) => (
// //                         <tr key={idx} className="border-t">
// //                           <td className="p-2">
// //                             <Input value={sc.name} onChange={(e) => updateSubcategory(idx, { name: e.target.value })} />
// //                           </td>
// //                           <td className="p-2">
// //                             <Input value={sc.slug} onChange={(e) => updateSubcategory(idx, { slug: e.target.value })} />
// //                           </td>
// //                           <td className="p-2">
// //                             <Switch checked={!!sc.active} onCheckedChange={(v) => updateSubcategory(idx, { active: v })} />
// //                           </td>
// //                           <td className="p-2 text-right">
// //                             <Button size="sm" variant="destructive" onClick={() => removeSubcategory(idx)}>Remove</Button>
// //                           </td>
// //                         </tr>
// //                       ))
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>
// //           <DialogFooter>
// //             <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
// //             <Button onClick={handleSave}>{isEditing ? "Save" : "Create"}</Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <Dialog open={Boolean(deletingId)} onOpenChange={(v) => !v && setDeletingId(null)}>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>Delete category?</DialogTitle>
// //           </DialogHeader>
// //           <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
// //           <DialogFooter>
// //             <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
// //             {deletingId && (
// //               <Button variant="destructive" onClick={() => handleDelete(deletingId)}>Delete</Button>
// //             )}
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   )
// // }

// // function slugify(value: string) {
// //   return value
// //     .toLowerCase()
// //     .trim()
// //     .replace(/[^a-z0-9\s-]/g, "")
// //     .replace(/\s+/g, "-")
// //     .replace(/-+/g, "-")
// // }
// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { categoryService } from "@/services/categoryService"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { slugify } from "@/lib/utils"

// type Category = { 
//   _id?: string; 
//   name: string; 
//   slug: string; 
//   description?: string;
//   image?: {
//     url?: string;
//     publicId?: string;
//     alt?: string;
//   };
//   icon?: string;
//   parent?: string;
//   featured: boolean;
//   sortOrder: number;
//   seo?: {
//     title?: string;
//     keywords?: string[];
//     metaDescription?: string;
//   };
//   status: 'active' | 'inactive' | 'archived';
//   showInMenu: boolean;
//   showInFooter: boolean;
//   productCount?: number;
//   viewCount?: number;
//   subcategories?: Category[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// export default function AdminCategories() {
//   const [loading, setLoading] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const [open, setOpen] = useState(false)
//   const [deletingId, setDeletingId] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState("basic")
//   const [form, setForm] = useState<Category>({ 
//     name: "", 
//     slug: "", 
//     description: "",
//     image: { url: "", publicId: "", alt: "" },
//     icon: "",
//     parent: "",
//     featured: false,
//     sortOrder: 0,
//     seo: { title: "", keywords: [], metaDescription: "" },
//     status: "active",
//     showInMenu: true,
//     showInFooter: false
//   })
//   const [keywordInput, setKeywordInput] = useState("")

//   const isEditing = useMemo(() => Boolean(form?._id), [form])
//   const parentCategories = useMemo(() => 
//     categories.filter(cat => !cat.parent && cat._id !== form._id), 
//     [categories, form._id]
//   )

//   const fetchAll = async () => {
//     setLoading(true)
//     try {
//       const res = await categoryService.getAll()
//       // Ensure data is properly formatted
//       const categoriesData = res.data?.categories || res.data || []
//       console.log('Fetched categories:', categoriesData) // Debugging
//       setCategories(Array.isArray(categoriesData) ? categoriesData : [])
//     } catch (error) {
//       console.error('Error fetching categories:', error)
//       setCategories([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAll()
//   }, [])

//   const resetForm = () => {
//     setForm({ 
//       name: "", 
//       slug: "", 
//       description: "",
//       image: { url: "", publicId: "", alt: "" },
//       icon: "",
//       parent: "",
//       featured: false,
//       sortOrder: 0,
//       seo: { title: "", keywords: [], metaDescription: "" },
//       status: "active",
//       showInMenu: true,
//       showInFooter: false
//     })
//     setKeywordInput("")
//     setActiveTab("basic")
//   }

//   const handleOpenCreate = () => {
//     resetForm()
//     setOpen(true)
//   }

//   const handleOpenEdit = (cat: Category) => {
//     setForm({ 
//       _id: cat._id,
//       name: cat.name || "",
//       slug: cat.slug || "",
//       description: cat.description || "",
//       image: cat.image || { url: "", publicId: "", alt: "" },
//       icon: cat.icon || "",
//       parent: cat.parent || "",
//       featured: cat.featured || false,
//       sortOrder: cat.sortOrder || 0,
//       seo: cat.seo || { title: "", keywords: [], metaDescription: "" },
//       status: cat.status || "active",
//       showInMenu: cat.showInMenu !== false,
//       showInFooter: cat.showInFooter || false,
//       productCount: cat.productCount,
//       viewCount: cat.viewCount,
//       createdAt: cat.createdAt,
//       updatedAt: cat.updatedAt
//     })
//     setOpen(true)
//   }

//   const handleSave = async () => {
//     const payload = { 
//       name: form.name.trim(), 
//       slug: form.slug.trim() || slugify(form.name),
//       description: form.description?.trim() || undefined,
//       image: form.image?.url ? form.image : undefined,
//       icon: form.icon?.trim() || undefined,
//       parent: form.parent || undefined,
//       featured: Boolean(form.featured),
//       sortOrder: Number(form.sortOrder) || 0,
//       seo: {
//         title: form.seo?.title?.trim() || undefined,
//         keywords: form.seo?.keywords?.filter(k => k.trim()) || [],
//         metaDescription: form.seo?.metaDescription?.trim() || undefined,
//       },
//       status: form.status,
//       showInMenu: Boolean(form.showInMenu),
//       showInFooter: Boolean(form.showInFooter),
//     }
    
//     try {
//       if (isEditing && form._id) {
//         await categoryService.update(form._id, payload)
//       } else {
//         await categoryService.create(payload)
//       }
//       setOpen(false)
//       resetForm()
//       await fetchAll()
//     } catch (error) {
//       console.error("Error saving category:", error)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     try {
//       await categoryService.remove(id)
//       setDeletingId(null)
//       await fetchAll()
//     } catch (error) {
//       console.error("Error deleting category:", error)
//     }
//   }

//   // Auto-generate slug when name changes
//   const handleNameChange = (value: string) => {
//     setForm(prev => ({
//       ...prev,
//       name: value,
//       slug: prev.slug || slugify(value)
//     }))
//   }

//   // Add keyword to SEO keywords
//   const addKeyword = () => {
//     if (!keywordInput.trim()) return
    
//     const newKeyword = keywordInput.trim()
//     setForm(prev => ({
//       ...prev,
//       seo: {
//         ...prev.seo,
//         keywords: [...(prev.seo?.keywords || []), newKeyword]
//       }
//     }))
//     setKeywordInput("")
//   }

//   // Remove keyword from SEO keywords
//   const removeKeyword = (index: number) => {
//     setForm(prev => ({
//       ...prev,
//       seo: {
//         ...prev.seo,
//         keywords: (prev.seo?.keywords || []).filter((_, i) => i !== index)
//       }
//     }))
//   }

//   // Safe status badge function with null checks
//   const getStatusBadge = (status: string | undefined) => {
//     if (!status) {
//       return (
//         <Badge variant="outline" className="bg-gray-100 text-gray-800">
//           Unknown
//         </Badge>
//       )
//     }

//     const variants = {
//       active: "default",
//       inactive: "secondary", 
//       archived: "outline"
//     } as const

//     const colors = {
//       active: "bg-green-100 text-green-800 hover:bg-green-100",
//       inactive: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
//       archived: "bg-gray-100 text-gray-800 hover:bg-gray-100"
//     }

//     const safeStatus = status as keyof typeof colors

//     return (
//       <Badge 
//         variant={variants[safeStatus] || "outline"} 
//         className={colors[safeStatus] || "bg-gray-100 text-gray-800"}
//       >
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     )
//   }

//   // Safe subcategories count with null checks
//   const getSubcategoriesCount = (categoryId?: string) => {
//     if (!categoryId) return 0
//     return categories.filter(cat => cat.parent === categoryId).length
//   }

//   // Safe product count with null checks
//   const getProductCount = (category: Category) => {
//     return category.productCount || 0
//   }

//   // Safe category name with fallback
//   const getCategoryName = (category: Category) => {
//     return category.name || "Unnamed Category"
//   }

//   // Safe category slug with fallback
//   const getCategorySlug = (category: Category) => {
//     return category.slug || "no-slug"
//   }

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
//           <p className="text-muted-foreground">Manage product categories and hierarchy</p>
//         </div>
//         <Button onClick={handleOpenCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
//           Add New Category
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Category Management</CardTitle>
//           <CardDescription>
//             All categories ({categories.length}) • {categories.filter(c => c.status === 'active').length} Active
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-lg border overflow-hidden">
//             <table className="w-full text-sm">
//               <thead className="bg-secondary">
//                 <tr>
//                   <th className="text-left p-4 font-semibold text-secondary-foreground">Name & Info</th>
//                   <th className="text-left p-4 font-semibold text-secondary-foreground">SEO</th>
//                   <th className="text-left p-4 font-semibold text-secondary-foreground">Visibility</th>
//                   <th className="text-left p-4 font-semibold text-secondary-foreground">Status</th>
//                   <th className="text-left p-4 font-semibold text-secondary-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td className="p-4 text-center text-muted-foreground" colSpan={5}>
//                       Loading categories...
//                     </td>
//                   </tr>
//                 ) : categories.length === 0 ? (
//                   <tr>
//                     <td className="p-4 text-center text-muted-foreground" colSpan={5}>
//                       No categories found. Create your first category!
//                     </td>
//                   </tr>
//                 ) : (
//                   categories.map((category) => (
//                     <tr key={category._id} className="border-t hover:bg-muted/50 transition-colors">
//                       <td className="p-4">
//                         <div className="flex items-start gap-3">
//                           {category.image?.url && (
//                             <img 
//                               src={category.image.url} 
//                               alt={category.image.alt || getCategoryName(category)}
//                               className="w-10 h-10 rounded object-cover"
//                               onError={(e) => {
//                                 // Hide image if it fails to load
//                                 e.currentTarget.style.display = 'none'
//                               }}
//                             />
//                           )}
//                           <div>
//                             <div className="font-medium flex items-center gap-2">
//                               {getCategoryName(category)}
//                               {category.featured && (
//                                 <Badge variant="secondary" className="bg-blue-100 text-blue-800">
//                                   Featured
//                                 </Badge>
//                               )}
//                             </div>
//                             <div className="text-sm text-muted-foreground font-mono">
//                               {getCategorySlug(category)}
//                             </div>
//                             <div className="text-xs text-muted-foreground mt-1">
//                               {getSubcategoriesCount(category._id)} subcategories • {getProductCount(category)} products
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="space-y-1">
//                           <div className="text-xs">
//                             <strong>Title:</strong> {category.seo?.title || 'Not set'}
//                           </div>
//                           <div className="text-xs">
//                             <strong>Keywords:</strong> {(category.seo?.keywords?.length || 0)}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex flex-wrap gap-1">
//                           {category.showInMenu && (
//                             <Badge variant="outline" className="text-xs">Menu</Badge>
//                           )}
//                           {category.showInFooter && (
//                             <Badge variant="outline" className="text-xs">Footer</Badge>
//                           )}
//                           <Badge variant="outline" className="text-xs">
//                             Order: {category.sortOrder || 0}
//                           </Badge>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         {getStatusBadge(category.status)}
//                       </td>
//                       <td className="p-4 space-x-2">
//                         <Button 
//                           size="sm" 
//                           variant="outline" 
//                           onClick={() => handleOpenEdit(category)}
//                           className="bg-primary text-primary-foreground hover:bg-primary/90"
//                         >
//                           Edit
//                         </Button>
//                         <Button 
//                           size="sm" 
//                           variant="outline" 
//                           onClick={() => setDeletingId(category._id!)}
//                           className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add/Edit Category Dialog */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">
//               {isEditing ? "Edit Category" : "Create New Category"}
//             </DialogTitle>
//           </DialogHeader>
          
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
//             <TabsList className="grid w-full grid-cols-4">
//               <TabsTrigger value="basic">Basic Info</TabsTrigger>
//               <TabsTrigger value="media">Media</TabsTrigger>
//               <TabsTrigger value="seo">SEO</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>
            
//             <div className="flex-1 overflow-y-auto py-4">
//               {/* Basic Information Tab */}
//               <TabsContent value="basic" className="space-y-6 m-0">
//                 <div className="grid gap-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name" className="text-base font-medium">
//                         Category Name *
//                       </Label>
//                       <Input 
//                         id="name" 
//                         value={form.name} 
//                         onChange={(e) => handleNameChange(e.target.value)} 
//                         placeholder="e.g. Men's Fashion, Electronics"
//                         className="h-12"
//                       />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="slug" className="text-base font-medium">
//                         Slug *
//                         <span className="text-sm text-muted-foreground ml-2 font-normal">
//                           (Auto-generated from name)
//                         </span>
//                       </Label>
//                       <Input 
//                         id="slug" 
//                         value={form.slug} 
//                         onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} 
//                         placeholder="e.g. mens-fashion, electronics"
//                         className="h-12 font-mono"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-base font-medium">
//                       Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={form.description || ""}
//                       onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of this category..."
//                       rows={4}
//                     />
//                     <div className="text-xs text-muted-foreground">
//                       {(form.description?.length || 0)}/500 characters
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="parent" className="text-base font-medium">
//                         Parent Category
//                       </Label>
//                       <Select value={form.parent || ""} onValueChange={(value) => setForm(prev => ({ ...prev, parent: value }))}>
//                         <SelectTrigger className="h-12">
//                           <SelectValue placeholder="Select parent category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="no">No Parent (Top Level)</SelectItem>
//                           {parentCategories.map((category) => (
//                             <SelectItem key={category._id} value={category._id!}>
//                               {getCategoryName(category)}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="sortOrder" className="text-base font-medium">
//                         Sort Order
//                       </Label>
//                       <Input 
//                         id="sortOrder" 
//                         type="number" 
//                         value={form.sortOrder}
//                         onChange={(e) => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))}
//                         placeholder="0"
//                         className="h-12"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="icon" className="text-base font-medium">
//                       Icon Class
//                     </Label>
//                     <Input 
//                       id="icon" 
//                       value={form.icon || ""}
//                       onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
//                       placeholder="e.g. fa-shirt, bi-phone"
//                       className="h-12"
//                     />
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Media Tab */}
//               <TabsContent value="media" className="space-y-6 m-0">
//                 <div className="grid gap-6">
//                   <div className="space-y-4">
//                     <Label className="text-base font-medium">Category Image</Label>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label className="text-sm">Image URL</Label>
//                         <Input 
//                           value={form.image?.url || ""}
//                           onChange={(e) => setForm(prev => ({ 
//                             ...prev, 
//                             image: { ...prev.image, url: e.target.value } 
//                           }))}
//                           placeholder="https://example.com/image.jpg"
//                           className="h-10"
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label className="text-sm">Alt Text</Label>
//                         <Input 
//                           value={form.image?.alt || ""}
//                           onChange={(e) => setForm(prev => ({ 
//                             ...prev, 
//                             image: { ...prev.image, alt: e.target.value } 
//                           }))}
//                           placeholder="Description of the image"
//                           className="h-10"
//                         />
//                       </div>
//                     </div>

//                     {form.image?.url && (
//                       <div className="mt-4">
//                         <Label className="text-sm mb-2 block">Preview</Label>
//                         <div className="border rounded-lg p-4 max-w-xs">
//                           <img 
//                             src={form.image.url} 
//                             alt={form.image.alt || "Category image"}
//                             className="w-full h-32 object-cover rounded"
//                             onError={(e) => {
//                               e.currentTarget.style.display = 'none'
//                             }}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* SEO Tab */}
//               <TabsContent value="seo" className="space-y-6 m-0">
//                 <div className="grid gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="seoTitle" className="text-base font-medium">
//                       SEO Title
//                     </Label>
//                     <Input 
//                       id="seoTitle" 
//                       value={form.seo?.title || ""}
//                       onChange={(e) => setForm(prev => ({ 
//                         ...prev, 
//                         seo: { ...prev.seo, title: e.target.value } 
//                       }))}
//                       placeholder="Optimized title for search engines"
//                       className="h-12"
//                     />
//                     <div className="text-xs text-muted-foreground">
//                       {(form.seo?.title?.length || 0)}/60 characters
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="metaDescription" className="text-base font-medium">
//                       Meta Description
//                     </Label>
//                     <Textarea
//                       id="metaDescription"
//                       value={form.seo?.metaDescription || ""}
//                       onChange={(e) => setForm(prev => ({ 
//                         ...prev, 
//                         seo: { ...prev.seo, metaDescription: e.target.value } 
//                       }))}
//                       placeholder="Brief description for search engine results..."
//                       rows={3}
//                     />
//                     <div className="text-xs text-muted-foreground">
//                       {(form.seo?.metaDescription?.length || 0)}/160 characters
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="text-base font-medium">
//                       Keywords
//                     </Label>
//                     <div className="flex gap-2">
//                       <Input 
//                         value={keywordInput}
//                         onChange={(e) => setKeywordInput(e.target.value)}
//                         placeholder="Add a keyword..."
//                         className="h-10"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault()
//                             addKeyword()
//                           }
//                         }}
//                       />
//                       <Button 
//                         type="button" 
//                         onClick={addKeyword}
//                         disabled={!keywordInput.trim()}
//                         className="h-10"
//                       >
//                         Add
//                       </Button>
//                     </div>
                    
//                     {(form.seo?.keywords && form.seo.keywords.length > 0) && (
//                       <div className="flex flex-wrap gap-2 mt-3">
//                         {form.seo.keywords.map((keyword, index) => (
//                           <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                             {keyword}
//                             <button
//                               onClick={() => removeKeyword(index)}
//                               className="ml-1 hover:text-destructive"
//                             >
//                               ×
//                             </button>
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Settings Tab */}
//               <TabsContent value="settings" className="space-y-6 m-0">
//                 <div className="grid gap-6">
//                   <div className="space-y-4">
//                     <Label className="text-base font-medium">Status & Visibility</Label>
                    
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between p-4 border rounded-lg">
//                         <div>
//                           <Label className="font-medium">Category Status</Label>
//                           <div className="text-sm text-muted-foreground">
//                             Control category visibility
//                           </div>
//                         </div>
//                         <Select 
//                           value={form.status} 
//                           onValueChange={(value: 'active' | 'inactive' | 'archived') => 
//                             setForm(prev => ({ ...prev, status: value }))
//                           }
//                         >
//                           <SelectTrigger className="w-32">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="active">Active</SelectItem>
//                             <SelectItem value="inactive">Inactive</SelectItem>
//                             <SelectItem value="archived">Archived</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="flex items-center justify-between p-4 border rounded-lg">
//                         <div>
//                           <Label className="font-medium">Show in Navigation Menu</Label>
//                           <div className="text-sm text-muted-foreground">
//                             Display this category in main navigation
//                           </div>
//                         </div>
//                         <Switch 
//                           checked={form.showInMenu}
//                           onCheckedChange={(checked) => setForm(prev => ({ ...prev, showInMenu: checked }))}
//                         />
//                       </div>

//                       <div className="flex items-center justify-between p-4 border rounded-lg">
//                         <div>
//                           <Label className="font-medium">Show in Footer</Label>
//                           <div className="text-sm text-muted-foreground">
//                             Display this category in footer links
//                           </div>
//                         </div>
//                         <Switch 
//                           checked={form.showInFooter}
//                           onCheckedChange={(checked) => setForm(prev => ({ ...prev, showInFooter: checked }))}
//                         />
//                       </div>

//                       <div className="flex items-center justify-between p-4 border rounded-lg">
//                         <div>
//                           <Label className="font-medium">Featured Category</Label>
//                           <div className="text-sm text-muted-foreground">
//                             Highlight this category as featured
//                           </div>
//                         </div>
//                         <Switch 
//                           checked={form.featured}
//                           onCheckedChange={(checked) => setForm(prev => ({ ...prev, featured: checked }))}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>
//             </div>
//           </Tabs>

//           <DialogFooter className="pt-4 border-t">
//             <Button variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSave} 
//               disabled={!form.name.trim() || !form.slug.trim()}
//               className="bg-primary text-primary-foreground hover:bg-primary/90"
//             >
//               {isEditing ? "Update Category" : "Create Category"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={Boolean(deletingId)} onOpenChange={(v) => !v && setDeletingId(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-destructive">Delete Category</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <p className="text-sm text-muted-foreground">
//               Are you sure you want to delete this category? This action cannot be undone and 
//               will affect all products and subcategories associated with it.
//             </p>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setDeletingId(null)}>
//               Cancel
//             </Button>
//             {deletingId && (
//               <Button 
//                 variant="destructive" 
//                 onClick={() => handleDelete(deletingId)}
//                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               >
//                 Delete Category
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }





"use client"
import React from "react"
import { useEffect, useMemo, useState } from "react"
import { categoryService } from "@/services/categoryService"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { slugify } from "@/lib/utils"
import { Plus, Trash2, Edit, ChevronDown, ChevronRight } from "lucide-react"

type Subcategory = {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    publicId?: string;
    alt?: string;
  };
  icon?: string;
  featured: boolean;
  sortOrder: number;
  seo?: {
    title?: string;
    keywords?: string[];
    metaDescription?: string;
  };
  status: 'active' | 'inactive' | 'archived';
  showInMenu: boolean;
  showInFooter: boolean;
  productCount?: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

type Category = {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    publicId?: string;
    alt?: string;
  };
  icon?: string;
  parent?: string;
  featured: boolean;
  sortOrder: number;
  subcategories: Subcategory[];
  seo?: {
    title?: string;
    keywords?: string[];
    metaDescription?: string;
  };
  status: 'active' | 'inactive' | 'archived';
  showInMenu: boolean;
  showInFooter: boolean;
  productCount?: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCategories() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const [subcategoryOpen, setSubcategoryOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingSubId, setDeletingSubId] = useState<{categoryId: string, subId: string} | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [form, setForm] = useState<Category>({
    name: "",
    slug: "",
    description: "",
    image: { url: "", publicId: "", alt: "" },
    icon: "",
    parent: "",
    featured: false,
    sortOrder: 0,
    subcategories: [],
    seo: { title: "", keywords: [], metaDescription: "" },
    status: "active",
    showInMenu: true,
    showInFooter: false
  })
  const [subForm, setSubForm] = useState<Subcategory>({
    name: "",
    slug: "",
    description: "",
    image: { url: "", publicId: "", alt: "" },
    icon: "",
    featured: false,
    sortOrder: 0,
    seo: { title: "", keywords: [], metaDescription: "" },
    status: "active",
    showInMenu: true,
    showInFooter: false
  })
  const [keywordInput, setKeywordInput] = useState("")
  const [subKeywordInput, setSubKeywordInput] = useState("")
  const [editingSubcategory, setEditingSubcategory] = useState<{categoryId?: string, subcategory?: Subcategory} | null>(null)

  const isEditing = useMemo(() => Boolean(form?._id), [form])
  const parentCategories = useMemo(() =>
    categories.filter(cat => !cat.parent && cat._id !== form._id),
    [categories, form._id]
  )

  const fetchAll = async () => {
    setLoading(true)
    try {
      const res = await categoryService.getAll()
      const categoriesData = res.data?.categories || res.data || []
      console.log('Fetched categories:', categoriesData)
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      image: { url: "", publicId: "", alt: "" },
      icon: "",
      parent: "",
      featured: false,
      sortOrder: 0,
      subcategories: [],
      seo: { title: "", keywords: [], metaDescription: "" },
      status: "active",
      showInMenu: true,
      showInFooter: false
    })
    setKeywordInput("")
    setActiveTab("basic")
  }

  const resetSubForm = () => {
    setSubForm({
      name: "",
      slug: "",
      description: "",
      image: { url: "", publicId: "", alt: "" },
      icon: "",
      featured: false,
      sortOrder: 0,
      seo: { title: "", keywords: [], metaDescription: "" },
      status: "active",
      showInMenu: true,
      showInFooter: false
    })
    setSubKeywordInput("")
    setEditingSubcategory(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setForm({
      _id: cat._id,
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || { url: "", publicId: "", alt: "" },
      icon: cat.icon || "",
      parent: cat.parent || "",
      featured: cat.featured || false,
      sortOrder: cat.sortOrder || 0,
      subcategories: cat.subcategories || [],
      seo: cat.seo || { title: "", keywords: [], metaDescription: "" },
      status: cat.status || "active",
      showInMenu: cat.showInMenu !== false,
      showInFooter: cat.showInFooter || false,
      productCount: cat.productCount,
      viewCount: cat.viewCount,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt
    })
    setOpen(true)
  }

  const handleOpenSubcategoryCreate = (categoryId?: string) => {
    resetSubForm()
    if (categoryId) {
      setEditingSubcategory({ categoryId })
    }
    setSubcategoryOpen(true)
  }

  const handleOpenSubcategoryEdit = (categoryId: string, subcategory: Subcategory) => {
    setSubForm({
      _id: subcategory._id,
      name: subcategory.name || "",
      slug: subcategory.slug || "",
      description: subcategory.description || "",
      image: subcategory.image || { url: "", publicId: "", alt: "" },
      icon: subcategory.icon || "",
      featured: subcategory.featured || false,
      sortOrder: subcategory.sortOrder || 0,
      seo: subcategory.seo || { title: "", keywords: [], metaDescription: "" },
      status: subcategory.status || "active",
      showInMenu: subcategory.showInMenu !== false,
      showInFooter: subcategory.showInFooter || false,
      productCount: subcategory.productCount,
      viewCount: subcategory.viewCount,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt
    })
    setEditingSubcategory({ categoryId, subcategory })
    setSubcategoryOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description?.trim() || undefined,
      image: form.image?.url ? form.image : undefined,
      icon: form.icon?.trim() || undefined,
      parent: form.parent || undefined,
      featured: Boolean(form.featured),
      sortOrder: Number(form.sortOrder) || 0,
      subcategories: form.subcategories.map(sub => ({
        name: sub.name.trim(),
        slug: sub.slug.trim() || slugify(sub.name),
        description: sub.description?.trim() || undefined,
        image: sub.image?.url ? sub.image : undefined,
        icon: sub.icon?.trim() || undefined,
        featured: Boolean(sub.featured),
        sortOrder: Number(sub.sortOrder) || 0,
        seo: {
          title: sub.seo?.title?.trim() || undefined,
          keywords: sub.seo?.keywords?.filter(k => k.trim()) || [],
          metaDescription: sub.seo?.metaDescription?.trim() || undefined,
        },
        status: sub.status,
        showInMenu: Boolean(sub.showInMenu),
        showInFooter: Boolean(sub.showInFooter),
      })),
      seo: {
        title: form.seo?.title?.trim() || undefined,
        keywords: form.seo?.keywords?.filter(k => k.trim()) || [],
        metaDescription: form.seo?.metaDescription?.trim() || undefined,
      },
      status: form.status,
      showInMenu: Boolean(form.showInMenu),
      showInFooter: Boolean(form.showInFooter),
    }

    try {
      if (isEditing && form._id) {
        await categoryService.update(form._id, payload)
      } else {
        await categoryService.create(payload)
      }
      setOpen(false)
      resetForm()
      await fetchAll()
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleSaveSubcategory = async () => {
    if (!editingSubcategory?.categoryId) return

    const subcategoryPayload = {
      name: subForm.name.trim(),
      slug: subForm.slug.trim() || slugify(subForm.name),
      description: subForm.description?.trim() || undefined,
      image: subForm.image?.url ? subForm.image : undefined,
      icon: subForm.icon?.trim() || undefined,
      featured: Boolean(subForm.featured),
      sortOrder: Number(subForm.sortOrder) || 0,
      seo: {
        title: subForm.seo?.title?.trim() || undefined,
        keywords: subForm.seo?.keywords?.filter(k => k.trim()) || [],
        metaDescription: subForm.seo?.metaDescription?.trim() || undefined,
      },
      status: subForm.status,
      showInMenu: Boolean(subForm.showInMenu),
      showInFooter: Boolean(subForm.showInFooter),
    }

    try {
      if (editingSubcategory.subcategory?._id) {
        // Update existing subcategory
        await categoryService.updateSubcategory(
          editingSubcategory.categoryId,
          editingSubcategory.subcategory._id,
          subcategoryPayload
        )
      } else {
        // Add new subcategory
        await categoryService.addSubcategory(editingSubcategory.categoryId, subcategoryPayload)
      }
      setSubcategoryOpen(false)
      resetSubForm()
      await fetchAll()
    } catch (error) {
      console.error("Error saving subcategory:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await categoryService.remove(id)
      setDeletingId(null)
      await fetchAll()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleDeleteSubcategory = async (categoryId: string, subId: string) => {
    try {
      await categoryService.removeSubcategory(categoryId, subId)
      setDeletingSubId(null)
      await fetchAll()
    } catch (error) {
      console.error("Error deleting subcategory:", error)
    }
  }

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Auto-generate slugs
  const handleNameChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      name: value,
      slug: prev.slug || slugify(value)
    }))
  }

  const handleSubNameChange = (value: string) => {
    setSubForm(prev => ({
      ...prev,
      name: value,
      slug: prev.slug || slugify(value)
    }))
  }

  // Keywords management
  const addKeyword = () => {
    if (!keywordInput.trim()) return
    const newKeyword = keywordInput.trim()
    setForm(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: [...(prev.seo?.keywords || []), newKeyword]
      }
    }))
    setKeywordInput("")
  }

  const removeKeyword = (index: number) => {
    setForm(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: (prev.seo?.keywords || []).filter((_, i) => i !== index)
      }
    }))
  }

  const addSubKeyword = () => {
    if (!subKeywordInput.trim()) return
    const newKeyword = subKeywordInput.trim()
    setSubForm(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: [...(prev.seo?.keywords || []), newKeyword]
      }
    }))
    setSubKeywordInput("")
  }

  const removeSubKeyword = (index: number) => {
    setSubForm(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: (prev.seo?.keywords || []).filter((_, i) => i !== index)
      }
    }))
  }

  // Safe status badge function
  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Unknown
        </Badge>
      )
    }

    const colors = {
      active: "bg-green-100 text-green-800 hover:bg-green-100",
      inactive: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      archived: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }

    const safeStatus = status as keyof typeof colors

    return (
      <Badge variant="outline" className={colors[safeStatus] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Helper functions with null checks
  const getCategoryName = (category: Category) => category.name || "Unnamed Category"
  const getCategorySlug = (category: Category) => category.slug || "no-slug"
  const getSubcategoryName = (sub: Subcategory) => sub.name || "Unnamed Subcategory"
  const getSubcategorySlug = (sub: Subcategory) => sub.slug || "no-slug"

  // Generate unique keys for React lists
  const getCategoryKey = (category: Category) => category._id || `category-${Math.random()}`
  const getSubcategoryKey = (sub: Subcategory) => sub._id || `subcategory-${Math.random()}`

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories & Subcategories</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories hierarchy</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            All categories ({categories.length}) • {categories.filter(c => c.status === 'active').length} Active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-semibold text-secondary-foreground w-8"></th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Name & Info</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Subcategories</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Visibility</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-secondary-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                      No categories found. Create your first category!
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <React.Fragment key={getCategoryKey(category)}>
                      {/* Main Category Row */}
                      <tr className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          {category.subcategories && category.subcategories.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCategory(category._id!)}
                              className="h-6 w-6 p-0"
                            >
                              {expandedCategories.has(category._id!) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            {category.image?.url && (
                              <img
                                src={category.image.url}
                                alt={category.image.alt || getCategoryName(category)}
                                className="w-10 h-10 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {getCategoryName(category)}
                                {category.featured && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {getCategorySlug(category)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {category.productCount || 0} products
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {category.subcategories?.length || 0} subcategories
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSubcategoryCreate(category._id)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {category.showInMenu && (
                              <Badge variant="outline" className="text-xs">Menu</Badge>
                            )}
                            {category.showInFooter && (
                              <Badge variant="outline" className="text-xs">Footer</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              Order: {category.sortOrder || 0}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(category.status)}
                        </td>
                        <td className="p-4 space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(category)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingId(category._id!)}
                            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>

                      {/* Subcategories Rows */}
                      {expandedCategories.has(category._id!) && category.subcategories?.map((subcategory) => (
                        <tr key={getSubcategoryKey(subcategory)} className="border-t bg-muted/30 hover:bg-muted/50 transition-colors">
                          <td className="p-4"></td>
                          <td className="p-4 pl-12">
                            <div className="flex items-start gap-3">
                              {subcategory.image?.url && (
                                <img
                                  src={subcategory.image.url}
                                  alt={subcategory.image.alt || getSubcategoryName(subcategory)}
                                  className="w-8 h-8 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              )}
                              <div>
                                <div className="font-medium flex items-center gap-2 text-sm">
                                  {getSubcategoryName(subcategory)}
                                  {subcategory.featured && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {getSubcategorySlug(subcategory)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {subcategory.productCount || 0} products
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-muted-foreground">Subcategory</span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {subcategory.showInMenu && (
                                <Badge variant="outline" className="text-xs">Menu</Badge>
                              )}
                              {subcategory.showInFooter && (
                                <Badge variant="outline" className="text-xs">Footer</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                Order: {subcategory.sortOrder || 0}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(subcategory.status)}
                          </td>
                          <td className="p-4 space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSubcategoryEdit(category._id!, subcategory)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeletingSubId({ categoryId: category._id!, subId: subcategory._id! })}
                              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Add/Edit Category Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isEditing ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto py-4">
              {/* Basic Information Tab - Same as before */}
              <TabsContent value="basic" className="space-y-6 m-0">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium">
                        Category Name *
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Men's Fashion, Electronics"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-base font-medium">
                        Slug *
                        <span className="text-sm text-muted-foreground ml-2 font-normal">
                          (Auto-generated from name)
                        </span>
                      </Label>
                      <Input
                        id="slug"
                        value={form.slug}
                        onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g. mens-fashion, electronics"
                        className="h-12 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={form.description || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this category..."
                      rows={4}
                    />
                    <div className="text-xs text-muted-foreground">
                      {(form.description?.length || 0)}/500 characters
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent" className="text-base font-medium">
                        Parent Category
                      </Label>
                      <Select value={form.parent || ""} onValueChange={(value) => setForm(prev => ({ ...prev, parent: value }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No Parent (Top Level)</SelectItem>
                          {parentCategories.map((category) => (
                            <SelectItem key={category._id} value={category._id!}>
                              {getCategoryName(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortOrder" className="text-base font-medium">
                        Sort Order
                      </Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={form.sortOrder}
                        onChange={(e) => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))}
                        placeholder="0"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-base font-medium">
                      Icon Class
                    </Label>
                    <Input
                      id="icon"
                      value={form.icon || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="e.g. fa-shirt, bi-phone"
                      className="h-12"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Media Tab - Same as before */}
              <TabsContent value="media" className="space-y-6 m-0">
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Category Image</Label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Image URL</Label>
                        <Input
                          value={form.image?.url || ""}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            image: { ...prev.image, url: e.target.value }
                          }))}
                          placeholder="https://example.com/image.jpg"
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Alt Text</Label>
                        <Input
                          value={form.image?.alt || ""}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            image: { ...prev.image, alt: e.target.value }
                          }))}
                          placeholder="Description of the image"
                          className="h-10"
                        />
                      </div>
                    </div>

                    {form.image?.url && (
                      <div className="mt-4">
                        <Label className="text-sm mb-2 block">Preview</Label>
                        <div className="border rounded-lg p-4 max-w-xs">
                          <img
                            src={form.image.url}
                            alt={form.image.alt || "Category image"}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* SEO Tab - Same as before */}
              <TabsContent value="seo" className="space-y-6 m-0">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle" className="text-base font-medium">
                      SEO Title
                    </Label>
                    <Input
                      id="seoTitle"
                      value={form.seo?.title || ""}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        seo: { ...prev.seo, title: e.target.value }
                      }))}
                      placeholder="Optimized title for search engines"
                      className="h-12"
                    />
                    <div className="text-xs text-muted-foreground">
                      {(form.seo?.title?.length || 0)}/60 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-base font-medium">
                      Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={form.seo?.metaDescription || ""}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                      placeholder="Brief description for search engine results..."
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground">
                      {(form.seo?.metaDescription?.length || 0)}/160 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Keywords
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add a keyword..."
                        className="h-10"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addKeyword()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addKeyword}
                        disabled={!keywordInput.trim()}
                        className="h-10"
                      >
                        Add
                      </Button>
                    </div>

                    {(form.seo?.keywords && form.seo.keywords.length > 0) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.seo.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <button
                              onClick={() => removeKeyword(index)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab - Same as before */}
              <TabsContent value="settings" className="space-y-6 m-0">
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Status & Visibility</Label>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="font-medium">Category Status</Label>
                          <div className="text-sm text-muted-foreground">
                            Control category visibility
                          </div>
                        </div>
                        <Select
                          value={form.status}
                          onValueChange={(value: 'active' | 'inactive' | 'archived') =>
                            setForm(prev => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="font-medium">Show in Navigation Menu</Label>
                          <div className="text-sm text-muted-foreground">
                            Display this category in main navigation
                          </div>
                        </div>
                        <Switch
                          checked={form.showInMenu}
                          onCheckedChange={(checked) => setForm(prev => ({ ...prev, showInMenu: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="font-medium">Show in Footer</Label>
                          <div className="text-sm text-muted-foreground">
                            Display this category in footer links
                          </div>
                        </div>
                        <Switch
                          checked={form.showInFooter}
                          onCheckedChange={(checked) => setForm(prev => ({ ...prev, showInFooter: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="font-medium">Featured Category</Label>
                          <div className="text-sm text-muted-foreground">
                            Highlight this category as featured
                          </div>
                        </div>
                        <Switch
                          checked={form.featured}
                          onCheckedChange={(checked) => setForm(prev => ({ ...prev, featured: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name.trim() || !form.slug.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Subcategory Dialog */}
      <Dialog open={subcategoryOpen} onOpenChange={setSubcategoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingSubcategory?.subcategory ? "Edit Subcategory" : "Add New Subcategory"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subName" className="text-base font-medium">
                    Subcategory Name *
                  </Label>
                  <Input
                    id="subName"
                    value={subForm.name}
                    onChange={(e) => handleSubNameChange(e.target.value)}
                    placeholder="e.g. T-Shirts, Smartphones"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subSlug" className="text-base font-medium">
                    Slug *
                    <span className="text-sm text-muted-foreground ml-2 font-normal">
                      (Auto-generated from name)
                    </span>
                  </Label>
                  <Input
                    id="subSlug"
                    value={subForm.slug}
                    onChange={(e) => setSubForm(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. t-shirts, smartphones"
                    className="h-12 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subDescription" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="subDescription"
                  value={subForm.description || ""}
                  onChange={(e) => setSubForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this subcategory..."
                  rows={3}
                />
                <div className="text-xs text-muted-foreground">
                  {(subForm.description?.length || 0)}/500 characters
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subSortOrder" className="text-base font-medium">
                    Sort Order
                  </Label>
                  <Input
                    id="subSortOrder"
                    type="number"
                    value={subForm.sortOrder}
                    onChange={(e) => setSubForm(prev => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))}
                    placeholder="0"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subIcon" className="text-base font-medium">
                    Icon Class
                  </Label>
                  <Input
                    id="subIcon"
                    value={subForm.icon || ""}
                    onChange={(e) => setSubForm(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="e.g. fa-shirt, bi-phone"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Subcategory Image</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Image URL</Label>
                    <Input
                      value={subForm.image?.url || ""}
                      onChange={(e) => setSubForm(prev => ({
                        ...prev,
                        image: { ...prev.image, url: e.target.value }
                      }))}
                      placeholder="https://example.com/image.jpg"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Alt Text</Label>
                    <Input
                      value={subForm.image?.alt || ""}
                      onChange={(e) => setSubForm(prev => ({
                        ...prev,
                        image: { ...prev.image, alt: e.target.value }
                      }))}
                      placeholder="Description of the image"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <Label className="text-base font-medium">Subcategory Settings</Label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Status</Label>
                    <Select
                      value={subForm.status}
                      onValueChange={(value: 'active' | 'inactive' | 'archived') =>
                        setSubForm(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Show in Menu</Label>
                    <Switch
                      checked={subForm.showInMenu}
                      onCheckedChange={(checked) => setSubForm(prev => ({ ...prev, showInMenu: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Show in Footer</Label>
                    <Switch
                      checked={subForm.showInFooter}
                      onCheckedChange={(checked) => setSubForm(prev => ({ ...prev, showInFooter: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Featured Subcategory</Label>
                    <Switch
                      checked={subForm.featured}
                      onCheckedChange={(checked) => setSubForm(prev => ({ ...prev, featured: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSubcategoryOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSubcategory}
              disabled={!subForm.name.trim() || !subForm.slug.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editingSubcategory?.subcategory ? "Update Subcategory" : "Create Subcategory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={Boolean(deletingId)} onOpenChange={(v) => !v && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this category? This action cannot be undone and
              will affect all products and subcategories associated with it.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            {deletingId && (
              <Button
                variant="destructive"
                onClick={() => handleDelete(deletingId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Category
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subcategory Confirmation Dialog */}
      <Dialog open={Boolean(deletingSubId)} onOpenChange={(v) => !v && setDeletingSubId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Subcategory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this subcategory? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSubId(null)}>
              Cancel
            </Button>
            {deletingSubId && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteSubcategory(deletingSubId.categoryId, deletingSubId.subId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Subcategory
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}