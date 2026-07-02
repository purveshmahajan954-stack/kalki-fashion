import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  useGetProduct, useGetRelatedProducts, useAddToCart, useAddToWishlist,
  getGetCartQueryKey, getGetWishlistQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Product() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews">("desc");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(slug);
  const { data: related } = useGetRelatedProducts(slug);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  function handleAddToCart() {
    if (!product) return;
    if (product.sizes?.length > 0 && !selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" }); return;
    }
    addToCart.mutate(
      { data: { productId: product.id, quantity, size: selectedSize, color: selectedColor } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Added to cart", description: product.name });
        },
        onError: () => toast({ title: "Failed to add to cart", variant: "destructive" }),
      }
    );
  }

  function handleWishlist() {
    if (!product) return;
    addToWishlist.mutate(
      { data: { productId: product.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          toast({ title: "Added to wishlist" });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="space-y-4">
              <div className="h-8 bg-muted w-2/3" />
              <div className="h-6 bg-muted w-1/3" />
              <div className="h-4 bg-muted w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="text-center py-20">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">Home</a>
          <span>/</span>
          <a href={`/category/${product.categorySlug}`} className="hover:text-foreground capitalize">{product.category}</a>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4" data-testid="product-gallery">
            {/* Main image */}
            <div className="relative aspect-[4/5] bg-secondary overflow-hidden group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs px-3 py-1 font-medium">
                  -{discount}% OFF
                </span>
              )}
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-20 border-2 transition-colors overflow-hidden ${i === selectedImage ? "border-foreground" : "border-transparent"}`}
                    data-testid={`button-thumbnail-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="py-2">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">{product.category}</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-snug mb-4" data-testid="text-product-name">
              {product.name}
            </h1>

            {/* Rating */}
            {product.avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= Math.round(product.avgRating!) ? "fill-primary text-primary" : "text-muted-foreground"} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl text-foreground" data-testid="text-product-price">
                ₹{(product.discountPrice ?? product.price).toLocaleString("en-IN")}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString("en-IN")}</span>
              )}
              {discount > 0 && (
                <span className="text-sm text-accent font-medium">Save {discount}%</span>
              )}
            </div>

            <div className="w-12 border-b border-border mb-6" />

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold tracking-wider uppercase mb-3 text-muted-foreground">
                  Color: <span className="text-foreground normal-case font-normal">{selectedColor || "Select"}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`text-sm px-4 py-2 border transition-colors ${selectedColor === c ? "border-foreground bg-foreground text-white" : "border-border text-foreground hover:border-foreground"}`}
                      data-testid={`button-color-${c}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold tracking-wider uppercase mb-3 text-muted-foreground">
                  Size: <span className="text-foreground normal-case font-normal">{selectedSize || "Select"}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`text-sm px-4 py-2 border transition-colors ${selectedSize === s ? "border-foreground bg-foreground text-white" : "border-border text-foreground hover:border-foreground"}`}
                      data-testid={`button-size-${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold tracking-wider uppercase mb-3 text-muted-foreground">Quantity</h3>
              <div className="flex items-center border border-border w-28">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-qty-minus">−</button>
                <span className="flex-1 text-center text-sm" data-testid="text-quantity">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-qty-plus">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={addToCart.isPending || product.stock === 0}
                className="flex-1 bg-foreground text-white text-sm py-4 tracking-widest uppercase hover:bg-primary transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="button-add-to-cart"
              >
                <ShoppingBag size={16} />
                {addToCart.isPending ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                className="px-4 py-4 border border-border hover:border-accent hover:text-accent transition-colors"
                data-testid="button-add-to-wishlist"
              >
                <Heart size={18} />
              </button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-accent font-medium mb-4">Only {product.stock} left in stock</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border pt-6">
              <span>Free shipping above ₹3,000</span>
              <span>·</span>
              <span>Easy 7-day returns</span>
              <span>·</span>
              <span>Authentic handcrafted</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-border">
          <div className="flex gap-8 mt-8 mb-8 border-b border-border">
            {(["desc", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm tracking-wider uppercase transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}
                data-testid={`button-tab-${tab}`}
              >
                {tab === "desc" ? "Description" : `Reviews (${product.reviews?.length ?? 0})`}
              </button>
            ))}
          </div>

          {activeTab === "desc" && (
            <div className="max-w-2xl">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || "A beautiful and authentic piece of Indian ethnic wear, crafted with the finest materials and traditional techniques. Perfect for special occasions, weddings, and festive celebrations."}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl space-y-6" data-testid="reviews-section">
              {product.reviews?.length === 0 && (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>
              )}
              {product.reviews?.map((r) => (
                <div key={r.id} className="border-b border-border pb-6" data-testid={`review-${r.id}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`text-sm ${s <= r.rating ? "text-primary" : "text-muted-foreground"}`}>★</span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground">{r.userName}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
