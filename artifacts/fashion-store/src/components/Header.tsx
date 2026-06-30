import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, User, Search, Menu, X, MapPin, Video, Shirt, Truck, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetCart, useListCategories, useSearchProducts } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

const announcements = [
  { icon: Video, text: "Seamless Video Shopping Experience" },
  { icon: Shirt, text: "Designer Quality Styles" },
  { icon: Truck, text: "Free Shipping within India" },
  { icon: RotateCcw, text: "Easy Returns*" },
];

function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % announcements.length);
        setAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const { icon: Icon, text } = announcements[current];

  return (
    <div className="bg-black text-white text-center text-xs py-2 tracking-widest font-light overflow-hidden">
      <div
        className="flex items-center justify-center gap-2 transition-all duration-300"
        style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(-6px)" : "translateY(0)" }}
      >
        <Icon size={13} strokeWidth={1.8} />
        <span>{text}</span>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();

  const { data: cart } = useGetCart();
  const { data: categories } = useListCategories();
  const { data: searchResults } = useSearchProducts(
    { q: searchQuery, limit: 5 },
    { query: { enabled: searchQuery.length > 1 } }
  );

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  }

  const navLinks = [
    { label: "WOMEN", slug: "women" },
    { label: "MEN", slug: "men" },
    { label: "BRIDAL", slug: "bridal" },
    { label: "LUXE", slug: "luxe", gold: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      <AnnouncementBar />

      {/* Main header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[72px] gap-4 relative">

          {/* LEFT — Nav links */}
          <nav className="hidden md:flex items-center gap-7 flex-shrink-0">
            {navLinks.map((link) => {
              const cat = categories?.find(
                (c) => c.slug === link.slug || c.name.toUpperCase() === link.label
              );
              const href = cat ? `/category/${cat.slug}` : `/category/${link.slug}`;
              return (
                <Link
                  key={link.label}
                  href={href}
                  className="text-[13px] font-semibold tracking-[0.1em] whitespace-nowrap px-2 py-1 transition-all hover:bg-black hover:text-white"
                  style={{ color: link.gold ? "#b8860b" : "#222" }}
                  onMouseEnter={(e) => {
                    if (!link.gold) {
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = link.gold ? "#b8860b" : "#222";
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/stores"
              className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.08em] text-gray-700 hover:text-black transition-colors whitespace-nowrap"
            >
              <MapPin size={15} strokeWidth={1.8} />
              Find Store
            </Link>
          </nav>

          {/* CENTER — Logo (absolutely centered) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center select-none">
            <span
              className="font-serif leading-none text-black"
              style={{ fontSize: "28px", letterSpacing: "0.35em" }}
            >
              ELARA
            </span>
            <span
              className="text-[9px] text-gray-500 mt-0.5 font-light"
              style={{ letterSpacing: "0.5em" }}
            >
              FASHION
            </span>
          </Link>

          {/* RIGHT — Search + Icons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Search box */}
            <form onSubmit={handleSearch} className="relative flex items-center border border-gray-300 h-9">
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Anarkali"
                className="pl-3 pr-1 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none bg-transparent w-44"
                data-testid="input-search"
              />
              <button
                type="submit"
                className="w-9 h-9 flex items-center justify-center bg-black text-white flex-shrink-0"
                data-testid="button-search-toggle"
              >
                <Search size={15} strokeWidth={2} />
              </button>

              {/* Dropdown suggestions */}
              {searchResults && searchResults.length > 0 && searchQuery.length > 1 && (
                <div className="absolute left-0 right-0 top-full mt-px bg-white border border-gray-200 shadow-lg z-50" data-testid="search-suggestions">
                  {searchResults.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product/${p.slug}`}
                      onClick={() => setSearchQuery("")}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover" />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{p.name}</p>
                        <p className="text-[11px] text-gray-400">{p.category}</p>
                      </div>
                      <span className="ml-auto text-xs font-semibold text-[#b8860b]">
                        ₹{(p.discountPrice ?? p.price).toLocaleString("en-IN")}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* WhatsApp-style icon */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-600 hover:text-black transition-colors"
              title="Chat with us"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Account */}
            {user ? (
              <div className="relative group">
                <button className="p-1.5 text-gray-600 hover:text-black transition-colors" data-testid="button-account">
                  <User size={18} strokeWidth={1.8} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/account" className="block px-4 py-2.5 text-xs tracking-wide text-gray-700 hover:bg-gray-50 transition-colors uppercase">My Account</Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2.5 text-xs tracking-wide text-gray-700 hover:bg-gray-50 transition-colors uppercase">Admin</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-xs tracking-wide text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 uppercase">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-1.5 text-gray-600 hover:text-black transition-colors" data-testid="link-login">
                <User size={18} strokeWidth={1.8} />
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/account" className="p-1.5 text-gray-600 hover:text-black transition-colors" data-testid="link-wishlist">
              <Heart size={18} strokeWidth={1.8} />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-1.5 text-gray-600 hover:text-black transition-colors" data-testid="link-cart">
              <ShoppingBag size={18} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#b8860b] text-white text-[10px] rounded-full flex items-center justify-center font-semibold" data-testid="text-cart-count">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-1.5 text-gray-700">
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#b8860b] text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 text-gray-700" data-testid="button-mobile-menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav strip — desktop only */}
      <div className="hidden md:block border-b border-gray-200 bg-white">
        <div className="w-full px-4 flex items-center h-10">
          {/* Promo badges */}
          <div className="flex items-center flex-shrink-0 border-r border-gray-200 pr-3 mr-3 gap-1">
            <Link href="/category/new-arrivals" className="px-2 py-0.5 bg-[#d97706] text-white text-[10px] font-bold tracking-wide whitespace-nowrap hover:bg-[#b45309] transition-colors">
              READY TO SHIP
            </Link>
            <Link href="/cart" className="px-2 py-0.5 bg-[#7c2d12] text-white text-[10px] font-bold tracking-wide whitespace-nowrap hover:bg-[#6b1f0e] transition-colors">
              BUY 3 @ ₹999
            </Link>
            <Link href="/category/sale" className="px-2 py-0.5 bg-[#dc2626] text-white text-[10px] font-bold tracking-wide whitespace-nowrap hover:bg-[#b91c1c] transition-colors">
              SALE
            </Link>
          </div>

          {/* Category quick-links — evenly spread */}
          <div className="flex items-center justify-between flex-1 gap-0">
            {[
              { label: "SAREES", slug: "sarees" },
              { label: "SALWAR KAMEEZ", slug: "salwar-kameez" },
              { label: "LEHENGA", slug: "lehenga" },
              { label: "INDO WESTERN", slug: "indo-western" },
              { label: "BLOUSE", slug: "blouse" },
              { label: "JEWELLERY", slug: "jewellery" },
              { label: "KIDS", slug: "kids" },
              { label: "CO-ORDS", slug: "co-ords" },
              { label: "BESTSELLERS", slug: "bestsellers" },
              { label: "NEW", slug: "new-arrivals" },
              { label: "WEDDING", slug: "bridal" },
              { label: "COLLECTION", slug: "collection" },
            ].map((item) => {
              const cat = categories?.find(
                (c) => c.slug === item.slug || c.name.toUpperCase() === item.label
              );
              const href = cat ? `/category/${cat.slug}` : `/category/${item.slug}`;
              const isActive = location === href;
              return (
                <Link
                  key={item.label}
                  href={href}
                  className="text-[10px] font-semibold tracking-[0.06em] whitespace-nowrap transition-colors flex-shrink-0 py-1 px-1 hover:text-black"
                  style={{
                    color: isActive ? "#000" : "#555",
                    borderBottom: isActive ? "2px solid #000" : "2px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white" data-testid="mobile-nav">
          {/* Mobile search */}
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-300">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Anarkali"
                className="flex-1 pl-3 py-2 text-sm text-gray-700 outline-none bg-transparent"
              />
              <button type="submit" className="w-10 h-10 flex items-center justify-center bg-black text-white">
                <Search size={15} />
              </button>
            </form>
          </div>
          <nav className="flex flex-col px-4 pb-4">
            {navLinks.map((link) => {
              const cat = categories?.find(
                (c) => c.slug === link.slug || c.name.toUpperCase() === link.label
              );
              const href = cat ? `/category/${cat.slug}` : `/category/${link.slug}`;
              return (
                <Link
                  key={link.label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 border-b border-gray-100 text-[13px] font-semibold tracking-[0.1em]"
                  style={{ color: link.gold ? "#b8860b" : "#222" }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-1">My Account</Link>
                  {user.role === "admin" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-1">Admin</Link>}
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-1">Wishlist</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-sm text-gray-700 py-1">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-1">Sign In</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700 py-1">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
