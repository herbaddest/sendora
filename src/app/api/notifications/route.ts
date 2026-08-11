import { NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq, desc, and } from "drizzle-orm";

// GET /api/notifications?userId=xxx
export async function GET(req: Request) {
  await ensureDbSeeded();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const list = userId
    ? await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt))
    : await db.select().from(notifications).orderBy(desc(notifications.createdAt));

  const parsed = list.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
  }));
  return NextResponse.json({ notifications: parsed });
}

export async function PUT(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { id, markAllAsRead, userId } = body;

    if (markAllAsRead && userId) {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
    } else if (markAllAsRead) {
      await db.update(notifications).set({ isRead: true });
    } else if (id) {
      await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update notification" }, { status: 500 });
  }
}
