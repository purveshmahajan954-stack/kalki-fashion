import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, desc, asc, sql, or } from "drizzle-orm";
import { requireAdmin, AuthRequest } from "../lib/auth.js";
import { z } from "zod";

const router = Router();

async function getAvgRating(productId: number) {
  const [result] = await db
    .select({ avg: sql<number>`avg(rating)::float`, count: sql<number>`count(*)::int` })
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, productId));
  return { avg: result?.avg ?? null, count: result?.count ?? 0 };
}

async function formatProduct(p: typeof productsTable.$inferSelect) {
  const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, p.categorySlug)).limit(1);
  const { avg, count } = await getAvgRating(p.id);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: parseFloat(p.price),
    discountPrice: p.discountPrice ? parseFloat(p.discountPrice) : null,
    images: p.images,
    category: cat[0]?.name ?? p.categorySlug,
    categorySlug: p.categorySlug,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    featured: p.featured,
    avgRating: avg,
    reviewCount: count,
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/featured", async (req, res) => {
  const products = await db.select().from(productsTable).where(eq(productsTable.featured, true)).limit(8);
  const result = await Promise.all(products.map(formatProduct));
  return res.json(result);
});

router.get("/new-arrivals", async (req, res) => {
  const products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt)).limit(8);
  const result = await Promise.all(products.map(formatProduct));
  return res.json(result);
});

router.get("/", async (req, res) => {
  const { category, minPrice, maxPrice, sort, page = "1", limit = "12" } = req.query as Record<string, string>;

  const conditions = [];
  if (category) conditions.push(eq(productsTable.categorySlug, category));
  if (minPrice) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice) conditions.push(lte(productsTable.price, maxPrice));

  let orderBy;
  switch (sort) {
    case "price_asc": orderBy = asc(productsTable.price); break;
    case "price_desc": orderBy = desc(productsTable.price); break;
    case "popular": orderBy = desc(productsTable.createdAt); break;
    default: orderBy = desc(productsTable.createdAt);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(conditions.length ? and(...conditions) : undefined);

  const products = await db.select().from(productsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limitNum)
    .offset(offset);

  const formatted = await Promise.all(products.map(formatProduct));
  return res.json({ products: formatted, total: total ?? 0, page: pageNum, limit: limitNum });
});

const productInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  discountPrice: z.number().nullable().optional(),
  images: z.array(z.string()).default([]),
  category: z.string(),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
});

router.post("/", requireAdmin as any, async (req: AuthRequest, res) => {
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const d = parsed.data;

  const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

  const [product] = await db.insert(productsTable).values({
    name: d.name,
    slug,
    description: d.description,
    price: d.price.toString(),
    discountPrice: d.discountPrice?.toString(),
    images: d.images,
    categorySlug: d.category,
    sizes: d.sizes,
    colors: d.colors,
    stock: d.stock,
    featured: d.featured,
  }).returning();

  return res.status(201).json(await formatProduct(product));
});

router.get("/:slug", async (req, res) => {
  const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug)).limit(1);
  if (!product) return res.status(404).json({ error: "Not found" });

  const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.productId, product.id)).orderBy(desc(reviewsTable.createdAt));
  const formatted = await formatProduct(product);

  return res.json({
    ...formatted,
    reviews: reviews.map(r => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

router.put("/:slug", requireAdmin as any, async (req: AuthRequest, res) => {
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const d = parsed.data;

  const [product] = await db.update(productsTable).set({
    name: d.name,
    description: d.description,
    price: d.price.toString(),
    discountPrice: d.discountPrice?.toString(),
    images: d.images,
    categorySlug: d.category,
    sizes: d.sizes,
    colors: d.colors,
    stock: d.stock,
    featured: d.featured,
  }).where(eq(productsTable.slug, req.params["slug"] as string)).returning();

  if (!product) return res.status(404).json({ error: "Not found" });
  return res.json(await formatProduct(product));
});

router.delete("/:slug", requireAdmin as any, async (req: AuthRequest, res) => {
  await db.delete(productsTable).where(eq(productsTable.slug, req.params["slug"] as string));
  return res.status(204).send();
});

router.get("/:slug/related", async (req, res) => {
  const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug)).limit(1);
  if (!product) return res.json([]);

  const related = await db.select().from(productsTable)
    .where(and(eq(productsTable.categorySlug, product.categorySlug), sql`id != ${product.id}`))
    .limit(4);
  const formatted = await Promise.all(related.map(formatProduct));
  return res.json(formatted);
});

router.get("/:slug/reviews", async (req, res) => {
  const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug)).limit(1);
  if (!product) return res.json([]);

  const reviews = await db.select().from(reviewsTable)
    .where(eq(reviewsTable.productId, product.id))
    .orderBy(desc(reviewsTable.createdAt));

  return res.json(reviews.map(r => ({
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  })));
});

const reviewInputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  userName: z.string().min(1),
});

router.post("/:slug/reviews", async (req, res) => {
  const parsed = reviewInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug)).limit(1);
  if (!product) return res.status(404).json({ error: "Not found" });

  const [review] = await db.insert(reviewsTable).values({
    productId: product.id,
    userName: parsed.data.userName,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  }).returning();

  return res.status(201).json({
    id: review.id,
    productId: review.productId,
    userId: review.userId,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
  });
});

export default router;
