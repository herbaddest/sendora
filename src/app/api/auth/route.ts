import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, wallets } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// GET /api/auth?userId=xxx — return user + wallet for the given userId
export async function GET(req: Request) {
  await ensureDbSeeded();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (userId) {
    const userRows = await db.select().from(users).where(eq(users.id, userId));
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = userRows[0];
    const walletRows = await db.select().from(wallets).where(eq(wallets.userId, userId));
    const wallet = walletRows[0] || null;

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
      },
      wallet: wallet
        ? { balance: parseFloat(wallet.balance), currency: wallet.currency }
        : { balance: 0, currency: "USD" },
    });
  }

  // Fallback: return first user (for legacy calls without userId)
  const allUsers = await db.select().from(users);
  if (allUsers.length === 0) {
    return NextResponse.json({ user: null, wallet: null });
  }
  const user = allUsers[0];
  const walletRows = await db.select().from(wallets).where(eq(wallets.userId, user.id));
  const wallet = walletRows[0] || null;

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
    },
    wallet: wallet
      ? { balance: parseFloat(wallet.balance), currency: wallet.currency }
      : { balance: 0, currency: "USD" },
  });
}

export async function POST(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { action, fullName, email, phone, password } = body;

    if (action === "signup") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newUser = {
        id: userId,
        fullName: fullName || "New User",
        email,
        phone: phone || "+1 (555) 000-0000",
        passwordHash,
        country: "US",
        isVerified: true,
        createdAt: new Date(),
      };

      await db.insert(users).values(newUser);

      // Create wallet for new user
      const walletId = `wal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(wallets).values({
        id: walletId,
        userId,
        balance: "0.00",
        currency: "USD",
        updatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          country: newUser.country,
          isVerified: newUser.isVerified,
          createdAt: newUser.createdAt.toISOString(),
        },
        wallet: { balance: 0, currency: "USD" },
      });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length === 0) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const user = existing[0];
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const walletRows = await db.select().from(wallets).where(eq(wallets.userId, user.id));
      const wallet = walletRows[0] || null;

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          country: user.country,
          avatarUrl: user.avatarUrl,
          isVerified: user.isVerified,
          createdAt: user.createdAt.toISOString(),
        },
        wallet: wallet
          ? { balance: parseFloat(wallet.balance), currency: wallet.currency }
          : { balance: 0, currency: "USD" },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
