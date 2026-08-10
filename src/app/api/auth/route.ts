import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq } from "drizzle-orm";

export async function GET() {
  await ensureDbSeeded();
  const allUsers = await db.select().from(users);
  return NextResponse.json({ user: allUsers[0] || null });
}

export async function POST(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { action, fullName, email, phone, password } = body;

    if (action === "signup") {
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
      }

      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fullName: fullName || "New User",
        email: email,
        phone: phone || "+1 (555) 000-0000",
        country: "US",
        isVerified: true,
        createdAt: new Date(),
      };

      await db.insert(users).values(newUser);
      return NextResponse.json({ success: true, user: { ...newUser, createdAt: newUser.createdAt.toISOString() } });
    }

    if (action === "login") {
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length === 0) {
        // Return demo user if email matches or default
        const allUsers = await db.select().from(users);
        if (allUsers.length > 0) {
          return NextResponse.json({ success: true, user: allUsers[0] });
        }
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: existing[0] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
