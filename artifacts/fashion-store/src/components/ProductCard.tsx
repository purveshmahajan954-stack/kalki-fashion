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
}

interface Props {
  product: Product;
  wishlisted?: boolean;
}

export default function ProductCard({ product, wishlisted = false }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
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

  return (
    <Link href={`/product/${product.slug}`} data-testid={`card-product-${product.id}`}>
      <div className="group cursor-pointer">
        {/* Image */}
        <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
          <img
            src={product.images[imgIdx] || product.images[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs px-2 py-1 font-medium tracking-wider">
              -{discount}%
            </span>
          )}
          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white transition-colors"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-accent text-accent" : "text-muted-foreground"}
            />
          </button>
          {/* Second image on hover */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-3">
          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">{product.category}</p>
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-foreground" data-testid={`text-price-${product.id}`}>
              ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.avgRating && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-xs ${star <= Math.round(product.avgRating!) ? "text-primary" : "text-muted-foreground"}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
