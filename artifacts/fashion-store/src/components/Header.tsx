import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, User, Search, Menu, X, MapPin, Video, Shirt, Truck, RotateCcw, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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

const COUNTRIES = [
  { code: "in", name: "India", currency: "INR" },
  { code: "us", name: "USA", currency: "USD" },
  { code: "gb", name: "UK", currency: "GBP" },
  { code: "ae", name: "UAE", currency: "AED" },
  { code: "ca", name: "Canada", currency: "CAD" },
  { code: "au", name: "Australia", currency: "AUD" },
  { code: "sg", name: "Singapore", currency: "SGD" },
];

function FlagImg({ code, width = 23, height = 17 }: { code: string; width?: number; height?: number }) {
  return (
    <img
      src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${code}.svg`}
      alt={code}
      width={width}
      height={height}
      className="object-cover"
      style={{ display: "inline-block" }}
    />
  );
}

const SEARCH_WORDS = ["Saree", "Suits", "Gown", "Anarkali", "Lehengas"];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [searchWordIdx, setSearchWordIdx] = useState(0);
  const [searchWordVisible, setSearchWordVisible] = useState(true);
  const [location, setLocation] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSearchWordVisible(false);
      setTimeout(() => {
        setSearchWordIdx((i) => (i + 1) % SEARCH_WORDS.length);
        setSearchWordVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(id);
  }, []);

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
    { label: "WOMEN", slug: "women", href: "/category/women" },
    { label: "MEN", slug: "men", href: "/category/men" },
    { label: "BRIDAL", slug: "bridal", href: "/category/bridal" },
    { label: "LUXE", slug: "luxe", href: "/category/luxe", gold: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white">
      <AnnouncementBar />

      {/* Main header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[72px] gap-4 relative">

          {/* LEFT — Nav links */}
          <nav className="hidden md:flex items-center gap-7 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] font-semibold tracking-[0.1em] whitespace-nowrap px-2 py-1 transition-all hover:bg-black hover:text-white"
                style={{ color: link.gold ? "#b8860b" : "#222" }}
                onMouseEnter={(e) => {
                  if (!link.gold) (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = link.gold ? "#b8860b" : "#222";
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/stores"
              className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.08em] text-gray-700 hover:text-black transition-colors whitespace-nowrap"
            >
              <img
                src="https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-30,c-at_max/cdn/shop/files/Find-a-store-icon-black.svg?v=8374190354904078554"
                width={22}
                height={18}
                alt=""
              />
              Find Store
            </Link>
          </nav>

          {/* CENTER — Logo (absolutely centered) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center select-none">
            <img src="/logo.svg" alt="Logo" height={41} style={{ height: "41px", width: "auto" }} />
          </Link>

          {/* RIGHT — Search + Icons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Search box */}
            <form onSubmit={handleSearch} className="relative flex items-center border border-gray-300 h-9">
              <div className="relative flex items-center flex-1">
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-1 text-[13px] text-gray-700 outline-none bg-transparent w-44 h-9 placeholder:text-transparent"
                  data-testid="input-search"
                />
                {!searchQuery && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[13px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                    Search for&nbsp;
                    <span
                      className="transition-all duration-300 inline-block"
                      style={{ opacity: searchWordVisible ? 1 : 0, transform: searchWordVisible ? "translateY(0)" : "translateY(-4px)" }}
                    >
                      {SEARCH_WORDS[searchWordIdx]}
                    </span>
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="w-9 h-9 flex items-center justify-center bg-black flex-shrink-0"
                data-testid="button-search-toggle"
              >
                <svg width="16" height="17" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.33313 0.5C6.99297 0.500034 5.67259 0.823285 4.48397 1.44234C3.29536 2.06139 2.27358 2.95797 1.5053 4.05605C0.737026 5.15413 0.244913 6.4213 0.0707069 7.75009C-0.1035 9.07887 0.0453389 10.4301 0.504598 11.6891C0.963857 12.9481 1.71999 14.0778 2.70886 14.9823C3.69773 15.8868 4.89016 16.5395 6.18502 16.885C7.47988 17.2305 8.83897 17.2586 10.147 16.9669C11.455 16.6752 12.6734 16.0724 13.6988 15.2095L17.8569 19.3667L18.8665 18.3571L14.7093 14.199C15.7314 12.9846 16.3853 11.5034 16.5942 9.9299C16.803 8.35637 16.5582 6.75593 15.8884 5.31685C15.2185 3.87777 14.1517 2.65993 12.8132 1.80661C11.4748 0.953279 9.92045 0.499966 8.33313 0.5ZM1.42836 8.83333C1.42836 7.92659 1.60696 7.02872 1.95396 6.191C2.30095 5.35327 2.80956 4.5921 3.45072 3.95093C4.09189 3.30976 4.85306 2.80116 5.69079 2.45416C6.52851 2.10717 7.42638 1.92857 8.33313 1.92857C9.23987 1.92857 10.1377 2.10717 10.9755 2.45416C11.8132 2.80116 12.5744 3.30976 13.2155 3.95093C13.8567 4.5921 14.3653 5.35327 14.7123 6.191C15.0593 7.02872 15.2379 7.92659 15.2379 8.83333C15.2379 10.6646 14.5104 12.4208 13.2155 13.7157C11.9206 15.0106 10.1644 15.7381 8.33313 15.7381C6.50187 15.7381 4.74562 15.0106 3.45072 13.7157C2.15583 12.4208 1.42836 10.6646 1.42836 8.83333Z" fill="white"/></svg>
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

            {/* Country selector */}
            <div ref={countryRef} className="relative">
              <button
                onClick={() => setCountryOpen((o) => !o)}
                className="flex items-center gap-1 p-1.5 text-gray-600 hover:text-black transition-colors"
                title="Select country"
              >
                <FlagImg code={selectedCountry.code} width={23} height={17} />
                <ChevronDown size={12} strokeWidth={2} className={`transition-transform ${countryOpen ? "rotate-180" : ""}`} />
              </button>
              {countryOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 shadow-lg z-50">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setSelectedCountry(c); setCountryOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors ${selectedCountry.code === c.code ? "bg-gray-50 font-semibold" : ""}`}
                    >
                      <FlagImg code={c.code} width={22} height={16} />
                      <span className="flex-1 text-gray-700">{c.name}</span>
                      <span className="text-gray-400 text-[10px]">{c.currency}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                <button className="p-1.5 hover:opacity-70 transition-opacity" data-testid="button-account">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="10" r="5" stroke="#262433" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.51562 19C6.13015 16.588 8.87966 15 12.0001 15C15.1539 15 17.9288 16.6222 19.5359 19.0777" stroke="#262433" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10.4" stroke="#262433" strokeWidth="1.2" strokeLinecap="round"/></svg>
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
              <Link href="/login" className="p-1.5 hover:opacity-70 transition-opacity" data-testid="link-login">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="10" r="5" stroke="#262433" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.51562 19C6.13015 16.588 8.87966 15 12.0001 15C15.1539 15 17.9288 16.6222 19.5359 19.0777" stroke="#262433" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10.4" stroke="#262433" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/account" className="p-1.5 hover:opacity-70 transition-opacity" data-testid="link-wishlist">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.9381 1.06392C13.0745 1.53293 10.9864 4.79519 10.9864 6.84843C10.9864 4.79519 9.29609 1.59547 6.01486 1.06392C3.30038 0.626169 0.625677 2.83575 1.04329 6.29604C1.76914 12.289 8.9978 15.8327 10.9864 17C12.9751 15.8327 19.9949 12.1535 20.9296 6.29604C21.4466 3.06505 19.0503 0.563634 15.9381 1.06392Z" stroke="#262433" strokeWidth="1.2"/></svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-1.5 hover:opacity-70 transition-opacity" data-testid="link-cart">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.3551 7.05859H0.890625L2.37753 17.1168C2.68098 19.1814 4.38028 20.706 6.37292 20.706H15.6281C17.6207 20.706 19.3201 19.1814 19.6235 17.1168L21.1104 7.05859H19.3551Z" stroke="black" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 11.5V7.14183C6 4.52937 7.60494 2.12444 9.9618 1.61172C13.1717 0.915877 16 3.56496 16 6.9343V11.5" stroke="black" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      {/* Scrolling sale ticker */}
      <div className="bg-[#d10024] overflow-hidden py-1.5" style={{ whiteSpace: "nowrap" }}>
        <div
          style={{
            display: "inline-block",
            animation: "marquee-scroll 28s linear infinite",
          }}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="text-white text-[11px] font-bold tracking-[0.15em] mx-6">
              SALE ENDS SOON!
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
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
