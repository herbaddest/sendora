import { NextResponse } from "next/server";
import { db, pool } from "@/db";
import { wallets, topups, notifications } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq } from "drizzle-orm";

// GET /api/wallet?userId=xxx — return wallet balance
export async function GET(req: Request) {
  await ensureDbSeeded();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const walletRows = await db.select().from(wallets).where(eq(wallets.userId, userId));
  if (walletRows.length === 0) {
    return NextResponse.json({ wallet: { balance: 0, currency: "USD" } });
  }

  const wallet = walletRows[0];
  return NextResponse.json({
    wallet: {
      balance: parseFloat(wallet.balance),
      currency: wallet.currency,
    },
  });
}

// POST /api/wallet — top up wallet (simulated card payment)
export async function POST(req: Request) {
  await ensureDbSeeded();
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { userId, amount, method, cardLast4 } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: "userId and positive amount are required" }, { status: 400 });
    }

    await client.query("BEGIN");

    // Update wallet balance
    const walletResult = await client.query(
      `UPDATE wallets SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2 RETURNING balance`,
      [amount.toFixed(2), userId]
    );

    if (walletResult.rowCount === 0) {
      // Create wallet if it doesn't exist
      const walletId = `wal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await client.query(
        `INSERT INTO wallets (id, user_id, balance, currency, updated_at) VALUES ($1, $2, $3, 'USD', NOW())`,
        [walletId, userId, amount.toFixed(2)]
      );
    }

    // Insert topup record
    const topupId = `topup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await client.query(
      `INSERT INTO topups (id, user_id, amount, method, card_last4, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'completed', NOW())`,
      [topupId, userId, amount.toFixed(2), method || "card", cardLast4 || null]
    );

    // Create notification
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await client.query(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
       VALUES ($1, $2, $3, $4, 'topup', false, NOW())`,
      [
        notifId,
        userId,
        "Wallet Funded 💰",
        `$${Number(amount).toFixed(2)} USD has been added to your Sendora wallet.`,
      ]
    );

    await client.query("COMMIT");

    // Fetch updated wallet balance
    const updatedWallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
    const newBalance = updatedWallet.length > 0 ? parseFloat(updatedWallet[0].balance) : amount;

    return NextResponse.json({
      success: true,
      wallet: { balance: newBalance, currency: "USD" },
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Top-up error:", err);
    return NextResponse.json({ error: err?.message || "Failed to top up" }, { status: 500 });
  } finally {
    client.release();
  }
}
