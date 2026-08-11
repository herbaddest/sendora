import { NextResponse } from "next/server";
import { db, pool } from "@/db";
import { transfers, notifications } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq, desc, and } from "drizzle-orm";

// GET /api/transfers?userId=xxx
export async function GET(req: Request) {
  await ensureDbSeeded();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const query = userId
    ? db.select().from(transfers).where(eq(transfers.userId, userId)).orderBy(desc(transfers.createdAt))
    : db.select().from(transfers).orderBy(desc(transfers.createdAt));

  const list = await query;
  const parsed = list.map((t) => ({
    ...t,
    senderAmount: parseFloat(t.senderAmount),
    recipientAmount: parseFloat(t.recipientAmount),
    fee: parseFloat(t.fee),
    exchangeRate: parseFloat(t.exchangeRate),
    createdAt: t.createdAt.toISOString(),
  }));
  return NextResponse.json({ transfers: parsed });
}

// POST /api/transfers — create transfer with wallet deduction in a PG transaction
export async function POST(req: Request) {
  await ensureDbSeeded();
  const client = await pool.connect();
  try {
    const body = await req.json();
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const senderAmount = parseFloat(body.senderAmount);
    const fee = parseFloat(body.fee);
    const totalDeducted = Number((senderAmount + fee).toFixed(2));

    const id = body.id || `SD-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    await client.query("BEGIN");

    // Deduct from wallet — fail if insufficient balance
    const walletResult = await client.query(
      `UPDATE wallets
       SET balance = balance - $1, updated_at = NOW()
       WHERE user_id = $2 AND balance >= $1
       RETURNING balance`,
      [totalDeducted, userId]
    );

    if (walletResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
    }

    const newBalance = parseFloat(walletResult.rows[0].balance);

    // Insert transfer
    await client.query(
      `INSERT INTO transfers (id, user_id, recipient_id, sender_amount, sender_currency, recipient_amount, recipient_currency, fee, exchange_rate, delivery_method, provider, account_number, recipient_name, status, current_step, note, estimated_delivery, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())`,
      [
        id,
        userId,
        body.recipientId,
        senderAmount.toFixed(2),
        body.senderCurrency || "USD",
        parseFloat(body.recipientAmount).toFixed(2),
        body.recipientCurrency || "KES",
        fee.toFixed(2),
        parseFloat(body.exchangeRate).toFixed(4),
        body.deliveryMethod || "mobile_money",
        body.provider || "M-Pesa",
        body.accountNumber || "",
        body.recipientName,
        "processing",
        2,
        body.note || "",
        "Instantly (~2 mins)",
      ]
    );

    // Create notification
    const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await client.query(
      `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
       VALUES ($1, $2, $3, $4, 'transfer', false, NOW())`,
      [
        notifId,
        userId,
        "Transfer Processing",
        `${Number(body.recipientAmount).toLocaleString()} ${body.recipientCurrency || "KES"} is being sent to ${body.recipientName}.`,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      transfer: {
        id,
        userId,
        recipientId: body.recipientId,
        senderAmount,
        senderCurrency: body.senderCurrency || "USD",
        recipientAmount: parseFloat(body.recipientAmount),
        recipientCurrency: body.recipientCurrency || "KES",
        fee,
        exchangeRate: parseFloat(body.exchangeRate),
        deliveryMethod: body.deliveryMethod || "mobile_money",
        provider: body.provider || "M-Pesa",
        accountNumber: body.accountNumber || "",
        recipientName: body.recipientName,
        status: "processing",
        currentStep: 2,
        note: body.note || "",
        estimatedDelivery: "Instantly (~2 mins)",
        createdAt: new Date().toISOString(),
      },
      wallet: { balance: newBalance, currency: "USD" },
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("Transfer creation error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create transfer" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { id, status, currentStep } = body;

    if (!id) return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 });

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (currentStep !== undefined) updateData.currentStep = currentStep;

    if (currentStep === 4 || status === "delivered") {
      updateData.status = "delivered";
      updateData.currentStep = 4;
      updateData.estimatedDelivery = "Delivered";
    }

    await db.update(transfers).set(updateData).where(eq(transfers.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update transfer" }, { status: 500 });
  }
}
