import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useGetFeaturedProducts, useGetNewArrivals, useListCategories } from "@workspace/api-client-react";

const TRENDING_ITEMS = [
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/green-bandhani-banarasi-dhoti-set-with-gotta-work-sg400298-1_acde47b5-33ae-48fe-8e30-2fce484876f9.jpg?v=1780743070", name: "Green Printed Cotton Kurta Set And Dupatta", slug: "green-printed-cotton-kurta-set-and-dupatta", video: "https://imagekit.io/player/embed/4sjmoqtje/SG400298.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/ivory-cotton-kurta-set-with-hand-block-print-sg399832-1_e5b2296b-764d-4e5e-a766-a92e1f8c6c6a.jpg?v=1777970054", name: "Ivory Cotton Kurta Set With Hand Block Print", slug: "ivory-cotton-kurta-set-with-hand-block-print", video: "https://imagekit.io/player/embed/4sjmoqtje/SG399832.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/maroon-hand-dyed-ajrakh-jacket-shirt-and-dhoti-set-sg337285-4_ac925aa8-fc2b-4afa-925a-1ca865eac007.jpg?v=1763535305", name: "Maroon Hand Dyed Ajrakh Jacket, Shirt and Dhoti Set", slug: "maroon-hand-dyed-ajrakh-jacket-shirt-and-dhoti-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG337285.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/yellow-floral-co-ord-set-with-cut-dana-and-sequins-work-sg395306-1_3e95e2c5-469b-4418-86a9-a59bdf227916.jpg?v=1775114623", name: "Yellow Floral Co-ord Set With Cut Dana And Sequins Work", slug: "yellow-floral-co-ord-set-with-cut-dana-and-sequins-work", video: "https://imagekit.io/player/embed/4sjmoqtje/SG395306.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/green-silk-mens-kurta-jacket-set-sg332820-1_18a5bcf1-f58d-4bcd-83b1-52c065c6c68f.jpg?v=1767349444", name: "Green Silk Mens Kurta Jacket Set", slug: "green-silk-mens-kurta-jacket-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG332820.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/LightBeigeSilkEmbroideredKurta-sg323624-6_6.jpg?v=1764569265", name: "Light Beige Silk Embroidered Kurta Set", slug: "light-beige-silk-embroidered-kurta-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG323624.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/mustard-satin-silk-saree-with-bird-motif-zari-weave-sg350500-1_52c89d9a-2b24-42b7-85a8-0331b963ebef.jpg?v=1769084004", name: "Mustard Satin Silk Saree with Bird Motif Zari Weave", slug: "mustard-satin-silk-saree-with-bird-motif-zari-weave", video: "https://imagekit.io/player/embed/4sjmoqtje/SG350500.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/brownish_grey_tissue_silk_saree_with_zari_border-sg276469_3_ddedd611-b0aa-4b06-805f-6db95b6ce7ae.jpg?v=1762013955", name: "Brownish Grey Tissue Silk Saree With Zari Border And Butti Work", slug: "brownish-grey-tissue-silk-saree-with-zari-border-and-butti-work", video: "https://imagekit.io/player/embed/4sjmoqtje/67a2f705a3a1f8e40ad9fcb5.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/purple-silk-embroidered-kurta-and-skirt-set-sg359436-1_d6afe8b8-48e4-4e7c-8e39-3e70a11098f8.jpg?v=1764567367", name: "Purple Silk Embroidered Kurta and Skirt Set", slug: "purple-silk-embroidered-kurta-and-skirt-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG359436.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/yellow-chanderi-kurta-set-with-gotta-patti-work-sg400613-1_da6f91fd-2e48-4b3b-9dfe-8b1275535751.jpg?v=1777970055", name: "Yellow Chanderi Kurta Set With Gotta Patti Work", slug: "yellow-chanderi-kurta-set-with-gotta-patti-work", video: "https://imagekit.io/player/embed/4sjmoqtje/SG400613.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/blue-chanderi-kurta-set-with-zari-and-sequins-sg400593-1_0b3cdbd1-c29a-4bed-8e03-a3c206daf913.jpg?v=1777970055", name: "Blue Chanderi Kurta Set With Zari And Sequins", slug: "blue-chanderi-kurta-set-with-zari-and-sequins", video: "https://imagekit.io/player/embed/4sjmoqtje/SG400593.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/purple-embellished-drape-skirt-indo-western-set-sg383005-1_e5dfccc1-30bb-40e4-bcbb-b86252667a0d.jpg?v=1774344055", name: "Purple Embellished Drape Skirt Indo Western Set", slug: "purple-embellished-drape-skirt-indo-western-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG383005.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/pink-embellished-drape-skirt-indo-western-set-sg399235-1_838a1a41-e7e0-45f2-925e-84d4f9eead8e.jpg?v=1774344054", name: "Pink Embellished Drape Skirt Indo Western Set", slug: "pink-embellished-drape-skirt-indo-western-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG399235.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/black-embroidered-silk-kurta-jacket-set-sg376077-1_46d1054c-2b4b-4a45-b282-709cd0a56eac.jpg?v=1767598252", name: "Black Embroidered Silk Kurta Jacket Set", slug: "black-embroidered-silk-kurta-jacket-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG376077.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/black-embroidered-mens-kurta-set-with-kashmiri-print-dupatta-sg332588-1.jpg?v=1763203149", name: "Black Embroidered Mens Kurta Set with Kashmiri Print Dupatta", slug: "black-embroidered-mens-kurta-set-with-kashmiri-print-dupatta", video: "https://imagekit.io/player/embed/4sjmoqtje/SG332588.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/red_cut_work_organza_saree_with_unstitched_blouse-sg212354_2_f66c816a-b2b4-4dbb-84e1-10a786b165cb.jpg?v=1762011120", name: "Red Cut Work Organza Saree With Unstitched Blouse", slug: "red-cut-work-organza-saree-with-unstitched-blouse", video: "https://imagekit.io/player/embed/4sjmoqtje/66866f02bd8429287f5a1de1.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/coral-red-silk-woven-saree-with-zari-work-sg350481-1.jpg?v=1762017724", name: "Coral Red Silk Woven Saree With Zari Work", slug: "coral-red-silk-woven-saree-with-zari-work", video: "https://imagekit.io/player/embed/4sjmoqtje/SG350481.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/yellow-silk-sequin-work-kurta-and-skirt-set-sg359428-1_650f0659-9e49-4321-ac39-1a3608f9de91.jpg?v=1764567367", name: "Yellow Silk Sequin Work Kurta and Skirt Set", slug: "yellow-silk-sequin-work-kurta-and-skirt-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG359428.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/blue-block-print-chanderi-kurta-set-sg400578-1_6b118c5d-a20f-46bb-a2c2-27ba989d8cf0.jpg?v=1777970055", name: "Blue Block Print Chanderi Kurta Set", slug: "blue-block-print-chanderi-kurta-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG400578.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/blue-chanderi-kurta-set-with-gotta-and-moti-work-sg400620-1_bec3a222-221b-46fe-9a15-fdcac3bb70c3.jpg?v=1777970055", name: "Blue Chanderi Kurta Set With Gotta And Moti Work", slug: "blue-chanderi-kurta-set-with-gotta-and-moti-work", video: "https://imagekit.io/player/embed/4sjmoqtje/SG400620.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/wine-silk-cape-co-ord-set-sg382190-1_dad39885-571c-4d8c-9e95-fee8e8b50961.jpg?v=1767870928", name: "Wine Silk Cape Co-ord Set", slug: "wine-silk-cape-co-ord-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG382190.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/pink-thread-and-zardosi-cape-style-top-with-palazzo-sg382385-1_044fe455-7ce0-41ec-ba51-1b9fe044f783.jpg?v=1769257848", name: "Pink Thread And Zardosi Cape Style Top With Palazzo", slug: "pink-thread-and-zardosi-cape-style-top-with-palazzo", video: "https://imagekit.io/player/embed/4sjmoqtje/SG382385.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/beige-chanderi-silk-embroidered-kurta-set-sg326040-1_8a49b180-c945-44a6-bb14-d857261b2bba.jpg?v=1767598252", name: "Beige Chanderi Silk Embroidered Kurta Set", slug: "beige-chanderi-silk-embroidered-kurta-set", video: "https://imagekit.io/player/embed/4sjmoqtje/SG326040.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/green-dola-silk-jacket-kurta-set-with-thread-work-sg330390-1_6323cabb-3974-410b-b41c-efd961fcac82.jpg?v=1766750109", name: "Green Dola Silk Jacket Kurta Set with Thread Work", slug: "green-dola-silk-jacket-kurta-set-with-thread-work", video: "https://imagekit.io/player/embed/4sjmoqtje/SG330390.mp4" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/grey-tissue-silk-woven-saree-with-zig-zag-motif-and-zari-border-sg351912-1.jpg?v=1762017437", name: "Grey Tissue Silk Woven Saree With Zig Zag Motif And Zari Border", slug: "grey-tissue-silk-woven-saree-with-zig-zag-motif-and-zari-border", video: "https://imagekit.io/player/embed/4sjmoqtje/SG351912.mp4" },
];

const CARD_W = 342;
const CARD_GAP = 12;

function TrendingSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function updateButtons() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  function slide(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + CARD_GAP) * 3, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-8 relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-center text-[18px] font-semibold text-gray-800 mb-5 tracking-wide">
          Trending Styles On SALE
        </h2>
        <div className="relative">
          {/* Prev button */}
          <button
            onClick={() => slide(-1)}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white border border-gray-300 shadow flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          {/* Scrollable track */}
          <div
            ref={trackRef}
            onScroll={updateButtons}
            className="flex overflow-x-auto"
            style={{ gap: CARD_GAP, scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
          >
            {TRENDING_ITEMS.map((item) => (
              <div key={item.slug} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                <TrendingCard {...item} />
              </div>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => slide(1)}
            disabled={!canNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white border border-gray-300 shadow flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TrendingCard({ img, name, slug, video }: { img: string; name: string; slug: string; video: string | null }) {
  return (
    <div className="product-video-card">
      <div className="product-video-wrapper">
        <img src={img} alt={name} width="" height="" loading="lazy" />
        {video && (
          <iframe
            data-original-src={video}
            src={`${video}?background=%23ffffff&autoplay=true&loop=true&mute=true&controls=false&tr=w-500`}
            title={`Video for ${name}`}
            width="100%"
            height="425"
            frameBorder="0"
            loading="lazy"
            allow="autoplay"
            allowFullScreen={false}
          />
        )}
      </div>
      <div className="product-video-info">
        <h3>{name}</h3>
        <a href={`/products/${slug}`}>View</a>
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

      {/* Trending Styles On SALE — Swiper-style slider */}
      <TrendingSlider />

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
