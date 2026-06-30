import { useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { useAddToWishlist, useRemoveFromWishlist, getGetWishlistQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  category: string;
  categorySlug: string;
  avgRating?: number | null;
  reviewCount?: number;
  videoUrl?: string | null;
}

interface Props {
  product: Product;
  wishlisted?: boolean;
}

export default function ProductCard({ product, wishlisted = false }: Props) {
  const [hovered, setHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);
  const queryClient = useQueryClient();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const discount = product.discountPrice && product.price
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      setIsWishlisted(false);
      removeFromWishlist.mutate({ productId: product.id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() }),
        onError: () => setIsWishlisted(true),
      });
    } else {
      setIsWishlisted(true);
      addToWishlist.mutate({ data: { productId: product.id } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() }),
        onError: () => setIsWishlisted(false),
      });
    }
  }

  const videoSrc = product.videoUrl
    ? `${product.videoUrl}?background=%23ffffff&autoplay=true&loop=true&mute=true&controls=false&tr=w-500`
    : null;

  return (
    <Link href={`/product/${product.slug}`} data-testid={`card-product-${product.id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image / Video */}
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          {/* Static image — always rendered, hidden when video is active */}
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ opacity: hovered && videoSrc ? 0 : 1 }}
            data-testid={`img-product-${product.id}`}
          />

          {/* Second image on hover (when no video) */}
          {!videoSrc && product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Video iframe on hover (Kalki ImageKit embed) */}
          {videoSrc && hovered && (
            <iframe
              src={videoSrc}
              title={`Video for ${product.name}`}
              className="absolute inset-0 w-full h-full"
              style={{ border: "none", objectFit: "cover" }}
              allow="autoplay"
              allowFullScreen={false}
              loading="lazy"
            />
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 z-10 bg-[#d10024] text-white text-[10px] px-2 py-0.5 font-semibold tracking-wider">
              -{discount}%
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white transition-colors"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-[#d10024] text-[#d10024]" : "text-gray-500"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-0.5">{product.category}</p>
          <h3 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[13px] font-semibold text-gray-900" data-testid={`text-price-${product.id}`}>
              ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-semibold text-[#d10024]">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          {product.avgRating && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-xs ${star <= Math.round(product.avgRating!) ? "text-[#b8860b]" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
