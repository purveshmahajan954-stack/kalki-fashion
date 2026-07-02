import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, Heart, User, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useListOrders, useGetWishlist, useGetCurrentUser } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "orders" | "wishlist" | "profile";

export default function Account() {
  const [tab, setTab] = useState<Tab>("orders");
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: orders, isLoading: ordersLoading } = useListOrders();
  const { data: wishlist } = useGetWishlist();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-foreground mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to view your account.</p>
            <Link href="/login">
              <button className="bg-foreground text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-primary transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2">My Account</p>
            <h1 className="font-serif text-3xl text-foreground">Hello, {user.name}</h1>
          </div>
          <button
            onClick={() => { logout(); setLocation("/"); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-logout"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-10">
          {([
            { key: "orders", label: "Orders", icon: Package },
            { key: "wishlist", label: "Wishlist", icon: Heart },
            { key: "profile", label: "Profile", icon: User },
          ] as { key: Tab; label: string; icon: any }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm tracking-wider border-b-2 transition-colors -mb-px ${tab === key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              data-testid={`button-tab-${key}`}
            >
              <Icon size={16} />
              {label}
              {key === "orders" && orders && <span className="ml-1 text-xs bg-secondary text-muted-foreground px-1.5 py-0.5">{orders.length}</span>}
              {key === "wishlist" && wishlist && <span className="ml-1 text-xs bg-secondary text-muted-foreground px-1.5 py-0.5">{wishlist.length}</span>}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <div data-testid="orders-tab">
            {ordersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse" />
                ))}
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-16">
                <Package size={40} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Link href="/category/sarees">
                  <button className="bg-foreground text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-primary transition-colors">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div key={order.id} className="border border-border p-6" data-testid={`order-${order.id}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-foreground">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                        <span className={`text-xs px-3 py-1 font-medium capitalize ${STATUS_COLORS[order.status] ?? "bg-muted text-muted-foreground"}`}
                          data-testid={`status-${order.id}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                      {(order.items as any[]).map((item, i) => (
                        <img key={i} src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-secondary flex-shrink-0" style={{ height: "4.5rem" }} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">{(order.items as any[]).length} item(s)</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist */}
        {tab === "wishlist" && (
          <div data-testid="wishlist-tab">
            {!wishlist || wishlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart size={40} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                <Link href="/category/sarees">
                  <button className="bg-foreground text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-primary transition-colors">
                    Explore Collection
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <ProductCard key={product.id} product={product as any} wishlisted={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {tab === "profile" && (
          <div className="max-w-md" data-testid="profile-tab">
            <div className="space-y-6">
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-2">Full Name</label>
                <div className="border border-border px-4 py-3 text-sm text-foreground bg-secondary/20">{user.name}</div>
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-2">Email Address</label>
                <div className="border border-border px-4 py-3 text-sm text-foreground bg-secondary/20">{user.email}</div>
              </div>
              <div>
                <label className="text-xs tracking-wider uppercase text-muted-foreground block mb-2">Account Type</label>
                <div className="border border-border px-4 py-3 text-sm text-foreground bg-secondary/20 capitalize">{user.role}</div>
              </div>
              {user.role === "admin" && (
                <Link href="/admin">
                  <button className="bg-primary text-primary-foreground px-6 py-2.5 text-sm tracking-wider uppercase hover:bg-primary/90 transition-colors">
                    Admin Dashboard
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
