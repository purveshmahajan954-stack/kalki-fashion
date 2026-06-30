import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useGetCart, useListCategories, useSearchProducts } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();

  const { data: cart } = useGetCart();
  const { data: categories } = useListCategories();
  const { data: searchResults } = useSearchProducts(
    { q: searchQuery, limit: 5 },
    { query: { enabled: searchQuery.length > 1 } }
  );

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border" style={{ backdropFilter: "blur(8px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-2xl tracking-widest text-foreground" style={{ letterSpacing: "0.15em" }}>
              ELARA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {categories?.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase"
                style={{ letterSpacing: "0.08em" }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-search-toggle"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link href="/account" className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block" data-testid="link-wishlist">
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="link-cart">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium" data-testid="text-cart-count">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <div className="relative group hidden sm:block">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1" data-testid="button-account">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/account" className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">My Account</Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors border-t border-border">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden sm:block" data-testid="link-login">
                <User size={18} />
              </Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground" data-testid="button-mobile-menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-border py-3 relative" data-testid="search-bar">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search size={16} className="text-muted-foreground flex-shrink-0" />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sarees, lehengas, kurtas..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                data-testid="input-search"
              />
              <button type="submit" className="text-sm text-primary hover:underline">Search</button>
            </form>
            {searchResults && searchResults.length > 0 && searchQuery.length > 1 && (
              <div className="absolute left-0 right-0 top-full bg-white border border-border shadow-lg z-50" data-testid="search-suggestions">
                {searchResults.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/product/${p.slug}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-primary">₹{p.discountPrice?.toLocaleString("en-IN") ?? p.price.toLocaleString("en-IN")}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4" data-testid="mobile-nav">
            <nav className="flex flex-col gap-3">
              {categories?.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-wider text-foreground py-1 uppercase"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-border pt-3 mt-1 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/account" onClick={() => setMobileOpen(false)} className="text-sm text-foreground py-1">My Account</Link>
                    {user.role === "admin" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-foreground py-1">Admin</Link>}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-sm text-foreground py-1">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-foreground py-1">Sign In</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm text-foreground py-1">Register</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
