import { useState } from "react";
import { Link } from "wouter";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  useGetCart, useUpdateCartItem, useRemoveCartItem, useClearCart, useApplyCoupon,
  getGetCartQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const [couponCode, setCouponCode] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: cart, isLoading } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();

  function handleUpdate(productId: number, quantity: number) {
    updateItem.mutate({ productId, data: { quantity } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() }),
    });
  }

  function handleRemove(productId: number) {
    removeItem.mutate({ productId }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() }),
    });
  }

  function handleCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCoupon.mutate({ data: { code: couponCode } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({ title: "Coupon applied successfully!" });
        setCouponCode("");
      },
      onError: () => toast({ title: "Invalid coupon code", variant: "destructive" }),
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
          <div className="h-8 bg-muted w-40 mb-8" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 mb-6">
              <div className="w-24 h-32 bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted w-1/2" />
                <div className="h-3 bg-muted w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-10">Your Cart</h1>

        {isEmpty ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-6">Your cart is empty.</p>
            <Link href="/category/sarees">
              <button className="bg-foreground text-white text-sm px-8 py-3 tracking-wider uppercase hover:bg-primary transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6" data-testid="cart-items">
              {cart?.items?.map((item) => (
                <div key={item.productId} className="flex gap-5 pb-6 border-b border-border" data-testid={`cart-item-${item.productId}`}>
                  <Link href={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} className="w-24 h-32 object-cover flex-shrink-0 bg-secondary" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors leading-snug">{item.name}</h3>
                        </Link>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <button onClick={() => handleRemove(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors" data-testid={`button-remove-${item.productId}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border">
                        <button onClick={() => item.quantity > 1 ? handleUpdate(item.productId, item.quantity - 1) : handleRemove(item.productId)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`button-decrease-${item.productId}`}>
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm" data-testid={`text-qty-${item.productId}`}>{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors" data-testid={`button-increase-${item.productId}`}>
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-semibold text-foreground" data-testid={`text-item-total-${item.productId}`}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="pt-2">
                <form onSubmit={handleCoupon} className="flex gap-2">
                  <div className="flex-1 flex items-center border border-border px-3 gap-2">
                    <Tag size={14} className="text-muted-foreground" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code (try ELARA10)"
                      className="flex-1 py-2.5 text-sm outline-none bg-transparent"
                      data-testid="input-coupon"
                    />
                  </div>
                  <button type="submit" disabled={applyCoupon.isPending} className="px-5 py-2.5 border border-foreground text-sm hover:bg-foreground hover:text-white transition-colors" data-testid="button-apply-coupon">
                    Apply
                  </button>
                </form>
                {cart?.couponCode && (
                  <p className="text-xs text-accent mt-2 font-medium">Coupon "{cart.couponCode}" applied — you save ₹{cart.discount?.toLocaleString("en-IN")}!</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 p-8 sticky top-24" data-testid="order-summary">
                <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cart?.subtotal?.toLocaleString("en-IN")}</span>
                  </div>
                  {(cart?.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Discount</span>
                      <span>-₹{cart?.discount?.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-accent">{(cart?.subtotal ?? 0) >= 3000 ? "Free" : "₹199"}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span data-testid="text-order-total">₹{(cart?.total ?? 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <button className="w-full bg-foreground text-white text-sm py-4 tracking-widest uppercase hover:bg-primary transition-colors font-medium" data-testid="button-checkout">
                    Proceed to Checkout
                  </button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-4">Secure checkout. All transactions encrypted.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
