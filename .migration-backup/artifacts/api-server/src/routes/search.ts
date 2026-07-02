import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { ilike, or, sql, desc, eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const q = req.query.q as string;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!q || q.trim().length === 0) return res.json([]);

  const products = await db.select().from(productsTable)
    .where(or(
      ilike(productsTable.name, `%${q}%`),
      ilike(productsTable.categorySlug, `%${q}%`),
    ))
    .orderBy(desc(productsTable.createdAt))
    .limit(limit);

  const result = await Promise.all(products.map(async (p) => {
    const cats = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, p.categorySlug)).limit(1);
    const [rating] = await db
      .select({ avg: sql<number>`avg(rating)::float`, count: sql<number>`count(*)::int` })
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, p.id));
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
  }));

  return res.json(result);
});

export default router;
