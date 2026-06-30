import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useGetFeaturedProducts, useGetNewArrivals, useListCategories } from "@workspace/api-client-react";

const HERO_SLIDES = [
  {
    id: 1,
    title: "The Bridal Edit",
    subtitle: "Timeless pieces for your most cherished moments",
    cta: "Explore Collection",
    href: "/category/lehengas",
    bg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80",
  },
  {
    id: 2,
    title: "Silk Sarees",
    subtitle: "Woven with centuries of artistry",
    cta: "Shop Sarees",
    href: "/category/sarees",
    bg: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1400&q=80",
  },
  {
    id: 3,
    title: "Festive Season",
    subtitle: "Celebrate in grace and splendour",
    cta: "View Festive Wear",
    href: "/category/suits",
    bg: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1400&q=80",
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
      <section className="relative h-[85vh] overflow-hidden" data-testid="hero-slider">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${current.bg})` }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="max-w-xl">
              <p className="text-white/80 text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: "0.2em" }}>
                New Collection
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight mb-6">
                {current.title}
              </h1>
              <p className="text-white/80 text-lg mb-10 leading-relaxed">
                {current.subtitle}
              </p>
              <Link href={current.href}>
                <button className="bg-white text-foreground text-sm px-10 py-4 tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium" data-testid="button-hero-cta">
                  {current.cta}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white transition-colors" data-testid="button-hero-prev">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 text-white transition-colors" data-testid="button-hero-next">
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-8 h-0.5 transition-all ${i === slide ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
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
