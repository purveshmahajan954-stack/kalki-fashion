import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const cats = await db.select().from(categoriesTable);
  const result = await Promise.all(cats.map(async (cat) => {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(eq(productsTable.categorySlug, cat.slug));
    return { ...cat, productCount: count ?? 0 };
  }));
  return res.json(result);
});

export default router;
