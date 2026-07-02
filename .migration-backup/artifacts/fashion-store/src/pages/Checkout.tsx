import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useGetCart, useCreateOrder, getGetCartQueryKey, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode is required"),
  phone: z.string().min(10, "Phone number is required"),
});

type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: cart } = useGetCart();
  const createOrder = useCreateOrder();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user?.name ?? "", street: "", city: "", state: "", pincode: "", phone: "" },
  });

  function onSubmit(data: FormData) {
    createOrder.mutate(
      { data: { shippingAddress: data, paymentMethod: "cod", couponCode: cart?.couponCode ?? undefined } },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({ title: "Order placed successfully!", description: `Order #${order.id} confirmed.` });
          setLocation("/account");
        },
        onError: (e: any) => toast({ title: e?.data?.error ?? "Failed to place order", variant: "destructive" }),
      }
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-10">Checkout</h1>

        {isEmpty ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <a href="/category/sarees" className="mt-4 inline-block text-primary hover:underline text-sm">Continue Shopping</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Address Form */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-foreground mb-6">Shipping Address</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Full Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Priya Sharma" className="border-border rounded-none" data-testid="input-full-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="street" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Street Address</FormLabel>
                      <FormControl><Input {...field} placeholder="123, Main Street, Apartment 4B" className="border-border rounded-none" data-testid="input-street" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">City</FormLabel>
                        <FormControl><Input {...field} placeholder="Mumbai" className="border-border rounded-none" data-testid="input-city" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">State</FormLabel>
                        <FormControl><Input {...field} placeholder="Maharashtra" className="border-border rounded-none" data-testid="input-state" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="pincode" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Pincode</FormLabel>
                        <FormControl><Input {...field} placeholder="400001" className="border-border rounded-none" data-testid="input-pincode" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">Phone</FormLabel>
                        <FormControl><Input {...field} placeholder="+91 98765 43210" className="border-border rounded-none" data-testid="input-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="pt-4">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
                    <div className="border border-border p-4 flex items-center gap-3 bg-secondary/20">
                      <input type="radio" defaultChecked id="cod" name="payment" className="accent-primary" />
                      <label htmlFor="cod" className="text-sm text-foreground">Cash on Delivery</label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Pay when your order arrives at your doorstep.</p>
                  </div>

                  {!user && (
                    <div className="bg-secondary/40 p-4 text-sm text-muted-foreground">
                      <a href="/login" className="text-primary hover:underline">Sign in</a> to save your address and track orders.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={createOrder.isPending}
                    className="w-full bg-foreground text-white text-sm py-4 tracking-widest uppercase hover:bg-primary transition-colors font-medium mt-6 disabled:opacity-50"
                    data-testid="button-place-order"
                  >
                    {createOrder.isPending ? "Placing Order..." : "Place Order"}
                  </button>
                </form>
              </Form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-secondary/30 p-6 sticky top-24" data-testid="checkout-summary">
                <h2 className="font-serif text-lg text-foreground mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cart?.items?.map((item) => (
                    <div key={item.productId} className="flex gap-3" data-testid={`checkout-item-${item.productId}`}>
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-white flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground leading-snug">{item.name}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.size && <span>Size: {item.size} </span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <p className="text-sm font-semibold mt-1">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
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
                    <span className={`${(cart?.subtotal ?? 0) >= 3000 ? "text-accent" : ""}`}>
                      {(cart?.subtotal ?? 0) >= 3000 ? "Free" : "₹199"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span data-testid="text-checkout-total">₹{(cart?.total ?? 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
