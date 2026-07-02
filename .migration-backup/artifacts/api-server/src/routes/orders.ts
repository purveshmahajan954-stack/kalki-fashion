import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/auth.js";
import { z } from "zod";

const router = Router();

const addressSchema = z.object({
  fullName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  phone: z.string().min(10),
});

const orderInputSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.string(),
  couponCode: z.string().optional(),
});

function formatOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    userId: o.userId,
    items: o.items,
    totalAmount: parseFloat(o.totalAmount),
    status: o.status,
    shippingAddress: o.shippingAddress,
    paymentId: o.paymentId,
    createdAt: o.createdAt.toISOString(),
  };
}

router.get("/", requireAuth as any, async (req: AuthRequest, res) => {
  const orders = await db.select().from(ordersTable)
    .where(eq(ordersTable.userId, req.user!.id))
    .orderBy(desc(ordersTable.createdAt));
  return res.json(orders.map(formatOrder));
});

router.post("/", requireAuth as any, async (req: AuthRequest, res) => {
  const parsed = orderInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const session = req.session as any;
  const cartItems = session.cartItems ?? [];
  if (cartItems.length === 0) return res.status(400).json({ error: "Cart is empty" });

  const discount = session.cartDiscount ?? 0;
  const subtotal = cartItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const discountAmt = subtotal * discount / 100;
  const total = Math.max(0, subtotal - discountAmt);

  const [order] = await db.insert(ordersTable).values({
    userId: req.user!.id,
    items: cartItems,
    totalAmount: total.toFixed(2),
    status: "confirmed",
    shippingAddress: parsed.data.shippingAddress,
    paymentId: `PAY-${Date.now()}`,
  }).returning();

  session.cartItems = [];
  session.couponCode = undefined;
  session.cartDiscount = 0;

  return res.status(201).json(formatOrder(order));
});

router.get("/:id", requireAuth as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"] as string);
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!order || order.userId !== req.user!.id) return res.status(404).json({ error: "Not found" });
  return res.json(formatOrder(order));
});

export default router;
