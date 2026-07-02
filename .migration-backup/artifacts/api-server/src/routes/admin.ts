import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin, AuthRequest } from "../lib/auth.js";

const router = Router();

router.get("/stats", requireAdmin as any, async (req: AuthRequest, res) => {
  const [orderStats] = await db.select({
    total: sql<number>`count(*)::int`,
    revenue: sql<number>`sum(total_amount::float)`,
    pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)::int`,
  }).from(ordersTable);

  const [{ productCount }] = await db.select({ productCount: sql<number>`count(*)::int` }).from(productsTable);
  const [{ userCount }] = await db.select({ userCount: sql<number>`count(*)::int` }).from(usersTable);

  const recentOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(5);

  return res.json({
    totalOrders: orderStats?.total ?? 0,
    totalRevenue: orderStats?.revenue ?? 0,
    totalProducts: productCount ?? 0,
    totalUsers: userCount ?? 0,
    pendingOrders: orderStats?.pending ?? 0,
    recentOrders: recentOrders.map(o => ({
      id: o.id,
      userId: o.userId,
      items: o.items,
      totalAmount: parseFloat(o.totalAmount),
      status: o.status,
      shippingAddress: o.shippingAddress,
      paymentId: o.paymentId,
      createdAt: o.createdAt.toISOString(),
    })),
  });
});

router.get("/orders", requireAdmin as any, async (req: AuthRequest, res) => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  return res.json(orders.map(o => ({
    id: o.id,
    userId: o.userId,
    items: o.items,
    totalAmount: parseFloat(o.totalAmount),
    status: o.status,
    shippingAddress: o.shippingAddress,
    paymentId: o.paymentId,
    createdAt: o.createdAt.toISOString(),
  })));
});

router.put("/orders/:id/status", requireAdmin as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"] as string);
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const [order] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
  if (!order) return res.status(404).json({ error: "Not found" });

  return res.json({
    id: order.id,
    userId: order.userId,
    items: order.items,
    totalAmount: parseFloat(order.totalAmount),
    status: order.status,
    shippingAddress: order.shippingAddress,
    paymentId: order.paymentId,
    createdAt: order.createdAt.toISOString(),
  });
});

export default router;
