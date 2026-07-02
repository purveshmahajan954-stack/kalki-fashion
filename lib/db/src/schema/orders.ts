import { pgTable, serial, integer, decimal, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  items: json("items").$type<Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image: string;
  }>>().notNull().default([]),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  shippingAddress: json("shipping_address").$type<{
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }>(),
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
