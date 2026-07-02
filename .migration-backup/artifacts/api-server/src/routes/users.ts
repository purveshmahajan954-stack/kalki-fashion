import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, wishlistsTable, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/auth.js";

const router = Router();

router.get("/me", requireAuth as any, async (req: AuthRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.id)).limit(1);
  if (!user) return res.status(404).json({ error: "Not found" });
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

async function formatWishlistProduct(p: typeof productsTable.$inferSelect) {
  const cats = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, p.categorySlug)).limit(1);
  const [rating] = await db
    .select({ avg: sql<number>`avg(rating)::float`, count: sql<number>`count(*)::int` })
    .from(reviewsTable).where(eq(reviewsTable.productId, p.id));
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: parseFloat(p.price),
    discountPrice: p.discountPrice ? parseFloat(p.discountPrice) : null,
    images: p.images,
    category: cats[0]?.name ?? p.categorySlug,
    categorySlug: p.categorySlug,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    featured: p.featured,
    avgRating: rating?.avg ?? null,
    reviewCount: rating?.count ?? 0,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/wishlist", requireAuth as any, async (req: AuthRequest, res) => {
  const items = await db.select({ product: productsTable })
    .from(wishlistsTable)
    .innerJoin(productsTable, eq(wishlistsTable.productId, productsTable.id))
    .where(eq(wishlistsTable.userId, req.user!.id));
  const result = await Promise.all(items.map(i => formatWishlistProduct(i.product)));
  return res.json(result);
});

router.post("/wishlist", requireAuth as any, async (req: AuthRequest, res) => {
  const productId = req.body.productId;
  if (!productId) return res.status(400).json({ error: "productId required" });

  const existing = await db.select().from(wishlistsTable)
    .where(and(eq(wishlistsTable.userId, req.user!.id), eq(wishlistsTable.productId, productId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(wishlistsTable).values({ userId: req.user!.id, productId });
  }

  const items = await db.select({ product: productsTable })
    .from(wishlistsTable)
    .innerJoin(productsTable, eq(wishlistsTable.productId, productsTable.id))
    .where(eq(wishlistsTable.userId, req.user!.id));
  const result = await Promise.all(items.map(i => formatWishlistProduct(i.product)));
  return res.json(result);
});

router.delete("/wishlist/:productId", requireAuth as any, async (req: AuthRequest, res) => {
  const productId = parseInt(req.params["productId"] as string);
  await db.delete(wishlistsTable)
    .where(and(eq(wishlistsTable.userId, req.user!.id), eq(wishlistsTable.productId, productId)));

  const items = await db.select({ product: productsTable })
    .from(wishlistsTable)
    .innerJoin(productsTable, eq(wishlistsTable.productId, productsTable.id))
    .where(eq(wishlistsTable.userId, req.user!.id));
  const result = await Promise.all(items.map(i => formatWishlistProduct(i.product)));
  return res.json(result);
});

export default router;
