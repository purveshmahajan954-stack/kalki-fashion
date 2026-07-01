import React, { useState, useEffect, useRef } from "react";
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

const LEHENGA_ITEMS = [
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/beige-chanderi-silk-embroidered-kurta-set-sg326040-1_8a49b180-c945-44a6-bb14-d857261b2bba.jpg?v=1767598252", name: "Cream Floral Co-ord Set With Cut Dana And Sequins Work", slug: "cream-floral-co-ord-set-with-cut-dana", price: 88, originalPrice: 110, discount: 20 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/maroon-hand-dyed-ajrakh-jacket-shirt-and-dhoti-set-sg337285-4_ac925aa8-fc2b-4afa-925a-1ca865eac007.jpg?v=1763535305", name: "Maroon Hand Dyed Ajrakh Jacket, Shirt and Dhoti Set", slug: "maroon-hand-dyed-ajrakh-jacket-shirt-and-dhoti-set", price: 142, originalPrice: 189, discount: 25 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/yellow-silk-sequin-work-kurta-and-skirt-set-sg359428-1_650f0659-9e49-4321-ac39-1a3608f9de91.jpg?v=1764567367", name: "Yellow Cutdana Work Kurta and Skirt Set", slug: "yellow-silk-sequin-work-kurta-and-skirt-set", price: 194, originalPrice: 259, discount: 25 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/purple-silk-embroidered-kurta-and-skirt-set-sg359436-1_d6afe8b8-48e4-4e7c-8e39-3e70a11098f8.jpg?v=1764567367", name: "Purple Silk Embroidered Kurta and Skirt Set", slug: "purple-silk-embroidered-kurta-and-skirt-set", price: 209, originalPrice: 279, discount: 25 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/purple-embellished-drape-skirt-indo-western-set-sg383005-1_e5dfccc1-30bb-40e4-bcbb-b86252667a0d.jpg?v=1774344055", name: "Purple Indo-Western Co-ord Set With Mirror Work", slug: "purple-embellished-drape-skirt-indo-western-set", price: 88, originalPrice: 110, discount: 20 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/pink-embellished-drape-skirt-indo-western-set-sg399235-1_838a1a41-e7e0-45f2-925e-84d4f9eead8e.jpg?v=1774344054", name: "Pink Embellished Drape Skirt Indo Western Set", slug: "pink-embellished-drape-skirt-indo-western-set", price: 94, originalPrice: 125, discount: 25 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/wine-silk-cape-co-ord-set-sg382190-1_dad39885-571c-4d8c-9e95-fee8e8b50961.jpg?v=1767870928", name: "Wine Silk Cape Co-ord Set", slug: "wine-silk-cape-co-ord-set", price: 118, originalPrice: 157, discount: 25 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/blue-chanderi-kurta-set-with-zari-and-sequins-sg400593-1_0b3cdbd1-c29a-4bed-8e03-a3c206daf913.jpg?v=1777970055", name: "Blue Chanderi Kurta Set With Zari And Sequins", slug: "blue-chanderi-kurta-set-with-zari-and-sequins", price: 76, originalPrice: 99, discount: 23 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/yellow-chanderi-kurta-set-with-gotta-patti-work-sg400613-1_da6f91fd-2e48-4b3b-9dfe-8b1275535751.jpg?v=1777970055", name: "Yellow Chanderi Kurta Set With Gotta Patti Work", slug: "yellow-chanderi-kurta-set-with-gotta-patti-work", price: 82, originalPrice: 109, discount: 25 },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-350,c-at_max/cdn/shop/files/pink-thread-and-zardosi-cape-style-top-with-palazzo-sg382385-1_044fe455-7ce0-41ec-ba51-1b9fe044f783.jpg?v=1769257848", name: "Pink Thread And Zardosi Cape Style Top With Palazzo", slug: "pink-thread-and-zardosi-cape-style-top-with-palazzo", price: 136, originalPrice: 181, discount: 25 },
];

const CARD_W = 210;
const CARD_GAP = 12;

function CategoryProductSlider({ title, items, viewAllHref }: {
  title: string;
  viewAllHref: string;
  items: { img: string; name: string; slug: string; price: number; originalPrice: number; discount: number }[];
}) {
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
    el.scrollBy({ left: dir * (CARD_W + CARD_GAP) * 2, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-8">
        <h2 className="text-center text-[18px] font-normal text-gray-800 mb-6 tracking-wide">
          {title}
        </h2>
        <div className="relative">
          {/* Prev */}
          <button
            onClick={() => slide(-1)}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 -translate-y-8 -translate-x-5 z-10 w-8 h-8 bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>

          {/* Track */}
          <div
            ref={trackRef}
            onScroll={updateButtons}
            className="flex overflow-x-auto"
            style={{ gap: CARD_GAP, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                style={{ flexShrink: 0, width: CARD_W, display: "block", textDecoration: "none", color: "inherit" }}
              >
                <div style={{ width: CARD_W, aspectRatio: "3/4", overflow: "hidden", background: "#f5f5f5" }}>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                    loading="lazy"
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p style={{ fontSize: 12, color: "#222", lineHeight: 1.45, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>${item.price}</span>
                    <span style={{ fontSize: 12, color: "#999", textDecoration: "line-through" }}>${item.originalPrice}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#d10024" }}>{item.discount}% OFF</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => slide(1)}
            disabled={!canNext}
            className="absolute right-0 top-1/2 -translate-y-8 translate-x-5 z-10 w-8 h-8 bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="text-center mt-6">
          <Link href={viewAllHref} className="inline-block border border-gray-800 text-gray-800 text-[11px] font-semibold tracking-widest px-8 py-2.5 hover:bg-gray-800 hover:text-white transition-colors">
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}

const TOP_COLLECTIONS = [
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/LightBeigeSilkEmbroideredKurta-sg323624-6_6.jpg?v=1764569265", title: "Embroidered Saree", badge: "UPTO 40% OFF*", href: "/category/sarees" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/black-embroidered-mens-kurta-set-with-kashmiri-print-dupatta-sg332588-1.jpg?v=1763203149", title: "Men's Kurta & Jacket Set", badge: "MINI 30% OFF*", href: "/category/men" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/green-dola-silk-jacket-kurta-set-with-thread-work-sg330390-1_6323cabb-3974-410b-b41c-efd961fcac82.jpg?v=1766750109", title: "Anarkali Suits", badge: "UPTO 50% OFF*", href: "/category/salwar-kameez" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/black-embroidered-silk-kurta-jacket-set-sg376077-1_46d1054c-2b4b-4a45-b282-709cd0a56eac.jpg?v=1767598252", title: "Ready Pleated Saree", badge: "ON SALE", href: "/category/sarees" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/mustard-satin-silk-saree-with-bird-motif-zari-weave-sg350500-1_52c89d9a-2b24-42b7-85a8-0331b963ebef.jpg?v=1769084004", title: "Silk Sarees", badge: "UPTO 35% OFF*", href: "/category/sarees" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/purple-embellished-drape-skirt-indo-western-set-sg383005-1_e5dfccc1-30bb-40e4-bcbb-b86252667a0d.jpg?v=1774344055", title: "Indo Western Sets", badge: "UPTO 40% OFF*", href: "/category/indo-western" },
  { img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-500,h-680,c-at_max/cdn/shop/files/wine-silk-cape-co-ord-set-sg382190-1_dad39885-571c-4d8c-9e95-fee8e8b50961.jpg?v=1767870928", title: "Co-ord Sets", badge: "UPTO 50% OFF*", href: "/category/co-ords" },
];

const TOP_CARD_W = 290;

function TopCollectionSlider() {
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
    el.scrollBy({ left: dir * (TOP_CARD_W + 12) * 2, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-8">
        <h2 className="text-center text-[18px] font-normal text-gray-800 mb-6 tracking-wide">
          Top Collection
        </h2>
        <div className="relative">
          <button
            onClick={() => slide(-1)}
            disabled={!canPrev}
            className="absolute left-0 top-1/2 -translate-y-8 -translate-x-5 z-10 w-8 h-8 bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-0"
            aria-label="Previous"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>

          <div
            ref={trackRef}
            onScroll={updateButtons}
            className="flex overflow-x-auto"
            style={{ gap: 12, scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TOP_COLLECTIONS.map((col) => (
              <a
                key={col.title}
                href={col.href}
                style={{ flexShrink: 0, width: TOP_CARD_W, display: "block", textDecoration: "none", position: "relative", overflow: "hidden" }}
              >
                <div style={{ width: TOP_CARD_W, height: 400, overflow: "hidden", position: "relative" }}>
                  <img
                    src={col.img}
                    alt={col.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s ease" }}
                    loading="lazy"
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 16px" }}>
                    <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.3 }}>
                      {col.title}
                    </p>
                    <span style={{
                      display: "inline-block",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      padding: "4px 12px",
                      border: "1px solid rgba(255,255,255,0.8)",
                    }}>
                      {col.badge}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <button
            onClick={() => slide(1)}
            disabled={!canNext}
            className="absolute right-0 top-1/2 -translate-y-8 translate-x-5 z-10 w-8 h-8 bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-0"
            aria-label="Next"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

const COVERFLOW_CARD_W = 260;
const COVERFLOW_CARD_H = 420;
const SIDE_SCALE_1 = 0.82;
const SIDE_SCALE_2 = 0.67;
const OFFSET_PX_1 = 215;
const OFFSET_PX_2 = 390;

function TrendingSlider() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const len = TRENDING_ITEMS.length;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function prev() { setActive((i) => (i - 1 + len) % len); }
  function next() { setActive((i) => (i + 1) % len); }

  function getStyle(offset: number): React.CSSProperties {
    const absOff = Math.abs(offset);
    let scale = 1;
    let tx = 0;
    let zIndex = 1;
    let opacity = 1;

    if (absOff === 0) {
      scale = 1; tx = 0; zIndex = 10; opacity = 1;
    } else if (absOff === 1) {
      scale = SIDE_SCALE_1; tx = offset > 0 ? OFFSET_PX_1 : -OFFSET_PX_1; zIndex = 7; opacity = 0.92;
    } else if (absOff === 2) {
      scale = SIDE_SCALE_2; tx = offset > 0 ? OFFSET_PX_2 : -OFFSET_PX_2; zIndex = 4; opacity = 0.8;
    } else {
      return { display: "none" };
    }

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: COVERFLOW_CARD_W,
      height: COVERFLOW_CARD_H,
      transform: `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`,
      zIndex,
      opacity,
      transition: "all 0.42s cubic-bezier(0.25,0.46,0.45,0.94)",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: absOff === 0
        ? "0 20px 50px rgba(0,0,0,0.35)"
        : "0 6px 20px rgba(0,0,0,0.2)",
      cursor: absOff !== 0 ? "pointer" : "default",
      flexShrink: 0,
    };
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(135deg, #c9a882 0%, #b8916a 50%, #c9a882 100%)",
        fontFamily: "'Poppins', sans-serif",
        padding: "36px 0 40px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 400,
          color: "#fff",
          letterSpacing: "0.04em",
          marginBottom: 28,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Trending Styles On Sale
      </h2>

      <div style={{ position: "relative", height: COVERFLOW_CARD_H + 40, overflow: "hidden" }}>
        {/* Arrow left */}
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            position: "absolute",
            left: "calc(50% - 270px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        {/* Cards */}
        {TRENDING_ITEMS.map((item, i) => {
          let offset = i - active;
          if (offset > len / 2) offset -= len;
          if (offset < -len / 2) offset += len;
          const style = getStyle(offset);
          const isCenter = offset === 0;

          return (
            <div
              key={item.slug}
              style={style}
              onClick={!isCenter ? (offset < 0 ? prev : next) : undefined}
            >
              <img
                src={item.img}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
                loading="lazy"
              />
              {isCenter && inView && item.video && (
                <iframe
                  key={`${item.slug}-video`}
                  src={`${item.video}?background=%23000000&autoplay=true&loop=true&mute=true&controls=false&tr=w-500`}
                  title={item.name}
                  allow="autoplay"
                  frameBorder="0"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: "none",
                  }}
                />
              )}
              {isCenter && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
                    padding: "32px 14px 14px",
                  }}
                >
                  <p
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 500,
                      marginBottom: 8,
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.name}
                  </p>
                  <a
                    href={`/product/${item.slug}`}
                    style={{
                      display: "inline-block",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.6)",
                      paddingBottom: 1,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {/* Arrow right */}
        <button
          onClick={next}
          aria-label="Next"
          style={{
            position: "absolute",
            right: "calc(50% - 270px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </section>
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

const CUSTOMER_STORIES = [
  {
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=300&q=80",
    text: "They delivered my outfit on time. Outfit looked great, fitting and everything worked out perfect for me. I would definitely recommend others.",
    name: "Shradha Patel",
    location: "Michigan, USA",
  },
  {
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80",
    text: "\"I wore two stunning outfits, each with its own unique vibe and style. Every time I wear them, I feel like the main character! Both outfits were incredibly comfortable and well-designed.\"",
    name: "Nandini Kothari",
    location: "Mandsaur, Madhya Pradesh",
  },
  {
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80",
    text: "The lehenga I ordered for my sister's wedding was breathtaking. The embroidery detailing was exquisite and it fit perfectly. Received endless compliments!",
    name: "Priya Malhotra",
    location: "Dubai, UAE",
  },
  {
    img: "https://images.unsplash.com/photo-1591130222369-26a7c1c29d35?w=300&q=80",
    text: "Absolutely love the quality of fabric and craftsmanship. The saree draped beautifully and the blouse fit was perfect. Will definitely order again!",
    name: "Ananya Sharma",
    location: "Toronto, Canada",
  },
  {
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80",
    text: "Outstanding service and the kurta set is gorgeous. The packaging was beautiful too. I gifted it to my mother and she absolutely loved it.",
    name: "Meera Reddy",
    location: "Hyderabad, India",
  },
];

function CustomerStoriesSlider() {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.ceil(CUSTOMER_STORIES.length / perPage);
  const visible = CUSTOMER_STORIES.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="bg-white py-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-center text-[20px] font-normal text-gray-800 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Customer Stories
        </h2>

        <div className="relative">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {visible.map((story, i) => (
              <div
                key={story.name}
                style={{
                  display: "flex",
                  gap: 20,
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  padding: 24,
                  alignItems: "flex-start",
                  background: "#fff",
                }}
              >
                <img
                  src={story.img}
                  alt={story.name}
                  style={{ width: 160, height: 200, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                  loading="lazy"
                />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16, textAlign: "center" }}>
                    {story.text}
                  </p>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 2 }}>{story.name}</p>
                    <p style={{ fontSize: 12, color: "#888" }}>{story.location}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Fill empty slot if odd number on last page */}
            {visible.length < perPage && <div />}
          </div>

          {/* Right arrow */}
          {page < totalPages - 1 && (
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              aria-label="Next"
              style={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #ddd",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 10,
              }}
            >
              <ChevronRight size={18} strokeWidth={1.5} color="#555" />
            </button>
          )}
          {page > 0 && (
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              aria-label="Previous"
              style={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #ddd",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 10,
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} color="#555" />
            </button>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              style={{
                width: i === page ? 20 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: i === page ? "#333" : "#ccc",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

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
              img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-600,h-780,c-at_max/cdn/shop/files/maroon-hand-dyed-ajrakh-jacket-shirt-and-dhoti-set-sg337285-4_ac925aa8-fc2b-4afa-925a-1ca865eac007.jpg?v=1763535305",
              title: "Styles Under $99",
              badge: "ON SALE",
              href: "/collections/style-under-usd99",
            },
            {
              img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-600,h-780,c-at_max/cdn/shop/files/yellow-floral-co-ord-set-with-cut-dana-and-sequins-work-sg395306-1_3e95e2c5-469b-4418-86a9-a59bdf227916.jpg?v=1775114623",
              title: "Most Wishlisted Styles",
              badge: "UPTO 50% OFF*",
              href: "/category/lehenga",
            },
            {
              img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-600,h-780,c-at_max/cdn/shop/files/purple-embellished-drape-skirt-indo-western-set-sg383005-1_e5dfccc1-30bb-40e4-bcbb-b86252667a0d.jpg?v=1774344055",
              title: "Occasion Styles",
              badge: "UP TO 50% OFF*",
              href: "/category/bridal",
            },
            {
              img: "https://ik.imagekit.io/4sjmoqtje/kalki-global/tr:w-600,h-780,c-at_max/cdn/shop/files/green-silk-mens-kurta-jacket-set-sg332820-1_18a5bcf1-f58d-4bcd-83b1-52c065c6c68f.jpg?v=1767349444",
              title: "Buy Any 3 Fits @ $299",
              badge: "EXPLORE NOW",
              href: "/category/indo-western",
            },
          ].map((card) => (
            <Link key={card.title} href={card.href} className="group relative overflow-hidden block aspect-[3/4]">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="text-white text-sm sm:text-base font-semibold mb-3 leading-tight drop-shadow"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {card.title}
                </h3>
                <span
                  className="inline-block text-[11px] font-semibold tracking-widest px-4 py-1.5 bg-white text-gray-900 border border-white/80"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {card.badge}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Styles On SALE — Swiper-style slider */}
      <TrendingSlider />

      {/* Lehengas & Indo Western product slider */}
      <CategoryProductSlider
        title="Lehengas & Indo Western"
        viewAllHref="/category/lehenga"
        items={LEHENGA_ITEMS}
      />

      {/* Top Collection slider */}
      <TopCollectionSlider />

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

      {/* Customer Stories */}
      <CustomerStoriesSlider />

      <Footer />
    </div>
  );
}
