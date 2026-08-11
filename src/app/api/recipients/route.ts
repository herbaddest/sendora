import { NextResponse } from "next/server";
import { db } from "@/db";
import { recipients } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq, and } from "drizzle-orm";

// GET /api/recipients?userId=xxx
export async function GET(req: Request) {
  await ensureDbSeeded();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const list = userId
    ? await db.select().from(recipients).where(eq(recipients.userId, userId))
    : await db.select().from(recipients);

  const parsed = list.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json({ recipients: parsed });
}

export async function POST(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const newRecipient = {
      id: body.id || `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      fullName: body.fullName,
      phone: body.phone,
      country: body.country || "Kenya",
      deliveryMethod: body.deliveryMethod || "mobile_money",
      provider: body.provider || "M-Pesa",
      accountNumber: body.accountNumber || body.phone,
      isFavorite: body.isFavorite ?? false,
      createdAt: new Date(),
    };

    await db.insert(recipients).values(newRecipient);
    return NextResponse.json({
      success: true,
      recipient: { ...newRecipient, createdAt: newRecipient.createdAt.toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create recipient" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { id, fullName, phone, deliveryMethod, provider, accountNumber, isFavorite } = body;

    if (!id) return NextResponse.json({ error: "Missing recipient ID" }, { status: 400 });

    await db
      .update(recipients)
      .set({
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(deliveryMethod && { deliveryMethod }),
        ...(provider && { provider }),
        ...(accountNumber && { accountNumber }),
        ...(isFavorite !== undefined && { isFavorite }),
      })
      .where(eq(recipients.id, id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update recipient" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await ensureDbSeeded();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.delete(recipients).where(eq(recipients.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete recipient" }, { status: 500 });
  }
}
