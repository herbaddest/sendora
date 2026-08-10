import { NextResponse } from "next/server";
import { db } from "@/db";
import { transfers, notifications } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  await ensureDbSeeded();
  const list = await db.select().from(transfers).orderBy(desc(transfers.createdAt));
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

export async function POST(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const id = `SD-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTransfer = {
      id,
      userId: body.userId || "usr_john_doe_01",
      recipientId: body.recipientId,
      senderAmount: body.senderAmount.toString(),
      senderCurrency: body.senderCurrency || "USD",
      recipientAmount: body.recipientAmount.toString(),
      recipientCurrency: body.recipientCurrency || "KES",
      fee: body.fee.toString(),
      exchangeRate: body.exchangeRate.toString(),
      deliveryMethod: body.deliveryMethod || "mobile_money",
      provider: body.provider || "M-Pesa",
      accountNumber: body.accountNumber || "",
      recipientName: body.recipientName,
      status: "processing",
      currentStep: 2, // Payment Received, process step 3 sending
      note: body.note || "",
      estimatedDelivery: "Instantly (~2 mins)",
      createdAt: new Date(),
    };

    await db.insert(transfers).values(newTransfer);

    // Create notification
    await db.insert(notifications).values({
      id: `notif_${Date.now()}`,
      userId: body.userId || "usr_john_doe_01",
      title: "Transfer Initiated",
      message: `Your transfer of ${Number(body.recipientAmount).toLocaleString()} ${body.recipientCurrency || "KES"} to ${body.recipientName} is processing.`,
      type: "transfer",
      isRead: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      transfer: {
        ...newTransfer,
        senderAmount: parseFloat(newTransfer.senderAmount),
        recipientAmount: parseFloat(newTransfer.recipientAmount),
        fee: parseFloat(newTransfer.fee),
        exchangeRate: parseFloat(newTransfer.exchangeRate),
        createdAt: newTransfer.createdAt.toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create transfer" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { id, status, currentStep } = body;

    if (!id) return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 });

    const updateData: any = {};
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
