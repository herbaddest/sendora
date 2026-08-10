import { NextResponse } from "next/server";
import { db } from "@/db";
import { exchangeRates } from "@/db/schema";
import { ensureDbSeeded } from "@/lib/dbInit";
import { eq } from "drizzle-orm";

export async function GET() {
  await ensureDbSeeded();
  const list = await db.select().from(exchangeRates);
  const parsed = list.map((r) => ({
    ...r,
    rate: parseFloat(r.rate),
    feeFixed: parseFloat(r.feeFixed),
    feePercent: parseFloat(r.feePercent),
    updatedAt: r.updatedAt.toISOString(),
  }));
  return NextResponse.json({ rates: parsed });
}

export async function PUT(req: Request) {
  await ensureDbSeeded();
  try {
    const body = await req.json();
    const { fromCurrency = "USD", toCurrency = "KES", rate, feeFixed } = body;

    const existing = await db
      .select()
      .from(exchangeRates)
      .where(eq(exchangeRates.toCurrency, toCurrency));

    if (existing.length > 0) {
      await db
        .update(exchangeRates)
        .set({
          ...(rate !== undefined && { rate: rate.toString() }),
          ...(feeFixed !== undefined && { feeFixed: feeFixed.toString() }),
          updatedAt: new Date(),
        })
        .where(eq(exchangeRates.id, existing[0].id));
    } else {
      await db.insert(exchangeRates).values({
        id: `rate_${fromCurrency.toLowerCase()}_${toCurrency.toLowerCase()}`,
        fromCurrency,
        toCurrency,
        rate: rate.toString(),
        feeFixed: (feeFixed || 1.99).toString(),
        feePercent: "0.00",
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update rates" }, { status: 500 });
  }
}
