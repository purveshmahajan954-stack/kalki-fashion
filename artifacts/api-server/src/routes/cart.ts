import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
};

const VALID_COUPONS: Record<string, number> = {
  ELARA10: 10,
  WELCOME20: 20,
  FESTIVE15: 15,
};

function getCart(req: Request): { items: CartItem[]; couponCode?: string; discount: number } {
  if (!req.session) return { items: [], discount: 0 };
  const session = req.session as any;
  return {
    items: session.cartItems ?? [],
    couponCode: session.couponCode,
    discount: session.cartDiscount ?? 0,
  };
}

function buildCartResponse(items: CartItem[], couponCode?: string, discountPct: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * discountPct / 100 * 100) / 100;
  const total = Math.max(0, subtotal - discount);
  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    couponCode: couponCode ?? null,
  };
}

router.get("/", (req, res) => {
  const { items, couponCode, discount } = getCart(req);
  return res.json(buildCartResponse(items, couponCode, discount));
});

const addSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
});

router.post("/", async (req, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { productId, quantity, size, color } = parsed.data;

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const session = req.session as any;
  if (!session.cartItems) session.cartItems = [];
  const items: CartItem[] = session.cartItems;

  const existing = items.find(i => i.productId === productId && i.size === size && i.color === color);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      productId,
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.discountPrice ?? product.price),
      quantity,
      size,
      color,
      image: (product.images as string[])[0] ?? "",
    });
  }

  session.cartItems = items;
  return res.json(buildCartResponse(items, session.couponCode, session.cartDiscount ?? 0));
});

router.put("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const quantity = req.body.quantity;
  if (!quantity || quantity < 1) return res.status(400).json({ error: "Invalid quantity" });

  const session = req.session as any;
  const items: CartItem[] = session.cartItems ?? [];
  const item = items.find(i => i.productId === productId);
  if (item) item.quantity = quantity;
  session.cartItems = items;

  return res.json(buildCartResponse(items, session.couponCode, session.cartDiscount ?? 0));
});

router.delete("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const session = req.session as any;
  session.cartItems = (session.cartItems ?? []).filter((i: CartItem) => i.productId !== productId);
  return res.json(buildCartResponse(session.cartItems, session.couponCode, session.cartDiscount ?? 0));
});

router.delete("/", (req, res) => {
  const session = req.session as any;
  session.cartItems = [];
  session.couponCode = undefined;
  session.cartDiscount = 0;
  return res.json(buildCartResponse([]));
});

router.post("/coupon", (req, res) => {
  const code = (req.body.code ?? "").toUpperCase();
  const discount = VALID_COUPONS[code];
  if (!discount) return res.status(400).json({ error: "Invalid coupon code" });

  const session = req.session as any;
  session.couponCode = code;
  session.cartDiscount = discount;

  const items: CartItem[] = session.cartItems ?? [];
  return res.json(buildCartResponse(items, code, discount));
});

export default router;
