import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useGetFeaturedProducts, useGetNewArrivals, useListCategories } from "@workspace/api-client-react";

function TrendingCard({ img, name, slug, video }: { img: string; name: string; slug: string; video: string | null }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden cursor-pointer"
      style={{ width: 240, height: 320 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { window.location.href = `/product/${slug}`; }}
    >
      <img
        src={img}
        alt={name}
        className="w-full h-full object-cover transition-all duration-500"
        style={{ opacity: hovered && video ? 0 : 1 }}
        loading="lazy"
      />
      {video && hovered && (
        <iframe
          src={`${video}?background=%23ffffff&autoplay=true&loop=true&mute=true&controls=false&tr=w-500`}
          title={name}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
          allow="autoplay"
          loading="lazy"
        />
      )}
      {/* product-video-info overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
        style={{ background: "rgba(0,0,0,0.55)" }}
      >
        <h3 className="text-white text-[11px] font-medium leading-snug mb-1 line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {name}
        </h3>
        <a
          href={`/product/${slug}`}
          className="inline-block text-[10px] font-semibold tracking-[0.1em] text-white underline underline-offset-2 hover:text-gray-200 transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          onClick={(e) => e.stopPropagation()}
        >
          View
        </a>
      </div>
    </div>
  );
}

const HERO_SLIDES = [
  {
    id: 1,
    title: "The Grand Sale",
    subtitle: "Exclusive discounts on premium ethnic wear",
    cta: "Shop Now",
    href: "/category/lehenga",
    bg: "/banner1.avif",
  },
  {
    id: 2,
    title: "Flat Price Festival",
    subtitle: "Designer styles at unbeatable prices",
    cta: "Explore Deals",
    href: "/category/sarees",
    bg: "/banner2.avif",
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Fresh styles added every day",
    cta: "View Collection",
    href: "/category/new-arrivals",
    bg: "/banner3.avif",
  },
];

const TESTIMONIALS = [
  { name: "Priya Malhotra", text: "The Banarasi silk saree I ordered was absolutely stunning. The quality exceeded my expectations — I received so many compliments at my cousin's wedding.", rating: 5 },
  { name: "Ananya Sharma", text: "Elara has the most exquisite collection I've seen online. The bridal lehenga was perfect and arrived beautifully packaged. Will definitely shop again!", rating: 5 },
  { name: "Meera Reddy", text: "Excellent customer service and authentic fabrics. The embroidery work on my gown was flawless. A truly premium shopping experience.", rating: 5 },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const { data: featured } = useGetFeaturedProducts();
  const { data: newArrivals } = useGetNewArrivals();
  const { data: categories } = useListCategories();

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function prevSlide() { setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length); }
  function nextSlide() { setSlide((s) => (s + 1) % HERO_SLIDES.length); }

  const current = HERO_SLIDES[slide];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Slider */}
      <section className="relative w-full overflow-hidden" data-testid="hero-slider">
        {/* Slides */}
        <div className="relative w-full">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0, position: i === slide ? "relative" : "absolute" }}
            >
              <img
                src={s.bg}
                alt={s.title}
                className="w-full object-cover"
                style={{ display: "block" }}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 text-white transition-colors" data-testid="button-hero-prev">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 text-white transition-colors" data-testid="button-hero-next">
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-8 h-0.5 transition-all ${i === slide ? "bg-white" : "bg-white/50"}`} />
          ))}
        </div>
      </section>

      {/* USP Feature Strip */}
      <section className="border-b border-gray-200 bg-white py-2">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            {[
              { file: "icon1.svg?v=1755609266",        label: "24 Hour Dispatch" },
              { file: "Easy_Returns.svg",             label: "Easy Returns" },
              { file: "Global.svg?v=1755608503",       label: "Free Shipping* Over ₹3000" },
              { file: "Stiching.svg?v=1755608731",    label: "KALKI Express" },
              { file: "icon_5.svg?v=1755609266",       label: "Custom Fitting" },
              { file: "Icons-1_20d3010f-5e9c-4531-9ea6-e9afe2a99c29.svg?v=1755611727", label: "New Styles Daily" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 flex-1 min-w-[80px]">
                <img
                  src={`https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-50,c-at_max/cdn/shop/files/${item.file}`}
                  alt={item.label}
                  width={34}
                  height={34}
                  loading="lazy"
                />
                <span className="text-[10px] font-medium text-gray-700 text-center tracking-wide whitespace-nowrap" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Image Promo Grid */}
      <section className="bg-white py-4 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
              title: "Styles Under ₹999",
              badge: "ON SALE",
              badgeStyle: "bg-[#d10024] text-white",
              href: "/category/sarees",
            },
            {
              img: "https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=600&q=80",
              title: "Most Wishlisted Styles",
              badge: "UPTO 50% OFF!",
              badgeStyle: "bg-black text-white",
              href: "/category/lehenga",
            },
            {
              img: "https://images.unsplash.com/photo-1591130222369-26a7c1c29d35?w=600&q=80",
              title: "Occasion Styles",
              badge: "UP TO 50% OFF!",
              badgeStyle: "bg-black text-white",
              href: "/category/bridal",
            },
            {
              img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
              title: "Buy Any 3 Fits @ ₹299",
              badge: "EXPLORE NOW",
              badgeStyle: "bg-white text-black",
              href: "/category/indo-western",
            },
          ].map((card) => (
            <Link key={card.title} href={card.href} className="group relative overflow-hidden block aspect-[3/4]">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-sm sm:text-base font-semibold mb-2 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {card.title}
                </h3>
                <span className={`inline-block text-[10px] font-bold tracking-widest px-3 py-1 ${card.badgeStyle}`}>
                  {card.badge}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Styles On SALE — horizontal video slider */}
      <section className="bg-white py-8 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-center text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Trending Styles On SALE
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {[
              { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/green-bandhani-banarasi-dhoti-set-with-gotta-work-sg400298-1_acde47b5-33ae-48fe-8e30-2fce484876f9.jpg?v=1780743070", name: "Green Printed Cotton Kurta Set And Dupatta", slug: "green-printed-cotton-kurta-set-and-dupatta", video: "https://imagekit.io/player/embed/4sjmoqtje/SG400298.mp4" },
              { img: "https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=350&q=80", name: "Red Embroidered Lehenga Choli", slug: "red-embroidered-lehenga-choli", video: null },
              { img: "https://images.unsplash.com/photo-1591130222369-26a7c1c29d35?w=350&q=80", name: "Blue Silk Anarkali Gown", slug: "blue-silk-anarkali-gown", video: null },
              { img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=350&q=80", name: "Yellow Banarasi Silk Saree", slug: "yellow-banarasi-silk-saree", video: null },
              { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=350&q=80", name: "Pink Chanderi Salwar Kameez", slug: "pink-chanderi-salwar-kameez", video: null },
              { img: "https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=350&q=80&sig=2", name: "Beige Organza Dupatta Set", slug: "beige-organza-dupatta-set", video: null },
            ].map((item) => (
              <TrendingCard key={item.slug} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Promo Banner */}
      <section className="w-full">
        <a href="/category/sarees">
          <img
            src="https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-1438,c-at_max/cdn/shop/files/1438x389-india-desk-01-01.jpg?v=1781350441"
            alt="Shop the Sale with a Personal Stylist via 24x7 Video call"
            className="w-full object-cover block"
            loading="lazy"
            width={1438}
            height={389}
          />
        </a>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3" style={{ letterSpacing: "0.2em" }}>Explore</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} data-testid={`link-category-${cat.slug}`}>
              <div className="group cursor-pointer">
                <div className="aspect-square bg-secondary overflow-hidden relative">
                  <img
                    src={`https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70&sig=${cat.id}`}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                    <h3 className="text-white font-serif text-sm sm:text-base">{cat.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{cat.productCount} pieces</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3" style={{ letterSpacing: "0.2em" }}>Curated</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Featured Pieces</h2>
            </div>
            <Link href="/category/sarees" className="flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured?.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
            {!featured && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded" />
                <div className="mt-3 h-4 bg-muted rounded w-3/4" />
                <div className="mt-2 h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Strip */}
      <section className="bg-primary text-primary-foreground py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg italic">Free Shipping on orders above ₹3,000</p>
          <div className="flex items-center gap-8 text-sm font-medium tracking-wider">
            <span>Authentic Fabrics</span>
            <span className="hidden sm:block">·</span>
            <span>Expert Craftsmanship</span>
            <span className="hidden sm:block">·</span>
            <span>Easy Returns</span>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3" style={{ letterSpacing: "0.2em" }}>Just In</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">New Arrivals</h2>
          </div>
          <Link href="/category/lehengas" className="flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all">
            Shop All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals?.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3" style={{ letterSpacing: "0.2em" }}>Stories</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Our Customers Love Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white p-8 border border-border" data-testid={`card-testimonial-${i}`}>
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-primary text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">"{t.text}"</p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
