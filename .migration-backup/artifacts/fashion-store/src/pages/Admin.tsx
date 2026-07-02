import { useState } from "react";
import { useLocation } from "wouter";
import { Package, ShoppingBag, Users, TrendingUp, Plus, Edit2, Trash2, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import {
  useGetAdminStats, useListAllOrders, useListProducts, useCreateProduct, useDeleteProduct, useUpdateOrderStatus,
  getGetAdminStatsQueryKey, getListAllOrdersQueryKey, getListProductsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type AdminTab = "overview" | "products" | "orders";

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetAdminStats();
  const { data: allOrders } = useListAllOrders();
  const { data: productsData } = useListProducts({});
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStatus = useUpdateOrderStatus();

  const [form, setForm] = useState({
    name: "", price: "", discountPrice: "", description: "",
    category: "sarees", stock: "", images: "", featured: false,
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-foreground mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
            <button onClick={() => setLocation("/")} className="bg-foreground text-white px-8 py-3 text-sm tracking-wider uppercase">Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    createProduct.mutate({
      data: {
        name: form.name,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        description: form.description,
        category: form.category,
        stock: parseInt(form.stock),
        images: form.images ? form.images.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [],
        featured: form.featured,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "Product created successfully" });
        setShowAddProduct(false);
        setForm({ name: "", price: "", discountPrice: "", description: "", category: "sarees", stock: "", images: "", featured: false });
      },
      onError: () => toast({ title: "Failed to create product", variant: "destructive" }),
    });
  }

  function handleDelete(slug: string) {
    if (!confirm("Delete this product?")) return;
    deleteProduct.mutate({ slug }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        toast({ title: "Product deleted" });
      },
    });
  }

  function handleStatusUpdate(id: number, status: string) {
    updateStatus.mutate({ id, data: { status: status as any } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAllOrdersQueryKey() });
        toast({ title: "Order status updated" });
      },
    });
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-700 bg-yellow-50",
    confirmed: "text-blue-700 bg-blue-50",
    shipped: "text-purple-700 bg-purple-50",
    delivered: "text-green-700 bg-green-50",
    cancelled: "text-red-700 bg-red-50",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">Dashboard</p>
          <h1 className="font-serif text-3xl text-foreground">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-10">
          {(["overview", "products", "orders"] as AdminTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm tracking-wider capitalize border-b-2 -mb-px transition-colors ${tab === t ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              data-testid={`button-admin-tab-${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div data-testid="admin-overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: Package, color: "text-blue-600" },
                { label: "Total Revenue", value: `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-600" },
                { label: "Total Products", value: stats?.totalProducts ?? 0, icon: ShoppingBag, color: "text-primary" },
                { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-purple-600" },
              ].map((stat, i) => (
                <div key={i} className="border border-border p-6" data-testid={`stat-card-${i}`}>
                  <stat.icon size={20} className={`${stat.color} mb-3`} />
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <h2 className="font-serif text-xl text-foreground mb-4">Recent Orders</h2>
            <div className="border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {["Order ID", "Items", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold tracking-wider uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-secondary/20" data-testid={`recent-order-${order.id}`}>
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{(order.items as any[]).length} items</td>
                      <td className="px-4 py-3">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 capitalize font-medium ${STATUS_COLORS[order.status] ?? ""}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div data-testid="admin-products">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">{productsData?.total ?? 0} products</p>
              <button onClick={() => setShowAddProduct(!showAddProduct)} className="flex items-center gap-2 bg-foreground text-white text-sm px-5 py-2.5 hover:bg-primary transition-colors" data-testid="button-add-product">
                <Plus size={14} />Add Product
              </button>
            </div>

            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="border border-border p-6 mb-8 bg-secondary/20 grid grid-cols-2 gap-4" data-testid="add-product-form">
                <div className="col-span-2">
                  <h3 className="font-medium text-foreground mb-4">Add New Product</h3>
                </div>
                {[
                  { label: "Product Name", key: "name", required: true },
                  { label: "Price (₹)", key: "price", type: "number", required: true },
                  { label: "Discount Price (₹)", key: "discountPrice", type: "number" },
                  { label: "Stock", key: "stock", type: "number", required: true },
                ].map(({ label, key, type = "text", required = false }) => (
                  <div key={key}>
                    <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1.5">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full border border-border px-3 py-2 text-sm outline-none bg-background"
                      data-testid={`input-product-${key}`}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border border-border px-3 py-2 text-sm outline-none bg-background" data-testid="select-product-category">
                    {["sarees", "lehengas", "kurtas", "gowns", "suits", "dupattas"].map((c) => (
                      <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground tracking-wider uppercase mt-5 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-primary" data-testid="checkbox-featured" />
                    Featured Product
                  </label>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1.5">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="w-full border border-border px-3 py-2 text-sm outline-none bg-background resize-none" data-testid="textarea-description" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground tracking-wider uppercase block mb-1.5">Image URLs (one per line)</label>
                  <textarea value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} rows={2} placeholder="https://..." className="w-full border border-border px-3 py-2 text-sm outline-none bg-background resize-none" data-testid="textarea-images" />
                </div>
                <div className="col-span-2 flex gap-3">
                  <button type="submit" disabled={createProduct.isPending} className="bg-foreground text-white text-sm px-6 py-2.5 hover:bg-primary transition-colors disabled:opacity-50" data-testid="button-submit-product">
                    {createProduct.isPending ? "Saving..." : "Save Product"}
                  </button>
                  <button type="button" onClick={() => setShowAddProduct(false)} className="text-sm text-muted-foreground hover:text-foreground px-6 py-2.5 border border-border">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold tracking-wider uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsData?.products?.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/20" data-testid={`product-row-${p.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover bg-secondary" />}
                          <span className="font-medium text-foreground max-w-[200px] truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{p.categorySlug}</td>
                      <td className="px-4 py-3">₹{(p.discountPrice ?? p.price).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={p.stock <= 5 ? "text-destructive font-medium" : ""}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(p.slug)} className="text-destructive hover:text-destructive/70 transition-colors" data-testid={`button-delete-${p.id}`}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div data-testid="admin-orders">
            <div className="border border-border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {["Order #", "Items", "Total", "Status", "Date", "Update Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold tracking-wider uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allOrders?.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-secondary/20" data-testid={`admin-order-${order.id}`}>
                      <td className="px-4 py-3 font-medium">#{order.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{(order.items as any[]).length} items</td>
                      <td className="px-4 py-3 font-medium">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 font-medium capitalize ${STATUS_COLORS[order.status] ?? ""}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs border border-border px-2 py-1 bg-background outline-none"
                          data-testid={`select-order-status-${order.id}`}
                        >
                          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {(!allOrders || allOrders.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
