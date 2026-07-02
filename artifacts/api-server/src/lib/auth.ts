import { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { sessionsTable, usersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; name: string; role: string };
}

export async function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);

  const [session] = await db
    .select({ session: sessionsTable, user: usersTable })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(and(eq(sessionsTable.token, token), gt(sessionsTable.expiresAt, new Date())))
    .limit(1);

  if (!session) return null;
  return { id: session.user.id, email: session.user.email, name: session.user.name, role: session.user.role };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const user = await getAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  req.user = user;
  next();
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
  req.user = user;
  next();
}
