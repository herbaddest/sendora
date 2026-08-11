import { db } from "@/db";
import { users, wallets, recipients, transfers, exchangeRates, notifications } from "@/db/schema";
import {
  INITIAL_USER,
  INITIAL_WALLET,
  INITIAL_RECIPIENTS,
  INITIAL_TRANSFERS,
  INITIAL_RATES,
  INITIAL_NOTIFICATIONS,
  DEMO_PASSWORD_HASH,
} from "@/lib/seedData";
import { count } from "drizzle-orm";

let isInitialized = false;

function mapUserForDb(u: typeof INITIAL_USER) {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    country: u.country,
    avatarUrl: u.avatarUrl,
    isVerified: u.isVerified,
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: new Date(u.createdAt),
  };
}

function mapRecipientForDb(r: typeof INITIAL_RECIPIENTS[0]) {
  return {
    ...r,
    createdAt: new Date(r.createdAt),
  };
}

function mapTransferForDb(t: typeof INITIAL_TRANSFERS[0]) {
  return {
    ...t,
    senderAmount: t.senderAmount.toString(),
    recipientAmount: t.recipientAmount.toString(),
    fee: t.fee.toString(),
    exchangeRate: t.exchangeRate.toString(),
    createdAt: new Date(t.createdAt),
  };
}

function mapRateForDb(r: typeof INITIAL_RATES[0]) {
  return {
    ...r,
    rate: r.rate.toString(),
    feeFixed: r.feeFixed.toString(),
    feePercent: r.feePercent.toString(),
    updatedAt: new Date(r.updatedAt),
  };
}

function mapNotificationForDb(n: typeof INITIAL_NOTIFICATIONS[0]) {
  return {
    ...n,
    createdAt: new Date(n.createdAt),
  };
}

export async function ensureDbSeeded() {
  if (isInitialized) return;
  try {
    const userCount = await db.select({ count: count() }).from(users);
    if (Number(userCount[0]?.count || 0) === 0) {
      console.log("Seeding database with initial mock data...");
      await db.insert(users).values(mapUserForDb(INITIAL_USER));
      await db.insert(wallets).values({
        ...INITIAL_WALLET,
        updatedAt: new Date(),
      });
      await db.insert(recipients).values(INITIAL_RECIPIENTS.map(mapRecipientForDb));
      await db.insert(transfers).values(INITIAL_TRANSFERS.map(mapTransferForDb));
      await db.insert(exchangeRates).values(INITIAL_RATES.map(mapRateForDb));
      await db.insert(notifications).values(INITIAL_NOTIFICATIONS.map(mapNotificationForDb));
      console.log("Database seeded successfully.");
    }
    isInitialized = true;
  } catch (err) {
    console.error("Database seed check error:", err);
  }
}

export async function resetDatabase() {
  try {
    await db.delete(notifications);
    await db.delete(transfers);
    await db.delete(recipients);
    await db.delete(wallets);
    await db.delete(users);
    await db.delete(exchangeRates);

    await db.insert(users).values(mapUserForDb(INITIAL_USER));
    await db.insert(wallets).values({
      ...INITIAL_WALLET,
      updatedAt: new Date(),
    });
    await db.insert(recipients).values(INITIAL_RECIPIENTS.map(mapRecipientForDb));
    await db.insert(transfers).values(INITIAL_TRANSFERS.map(mapTransferForDb));
    await db.insert(exchangeRates).values(INITIAL_RATES.map(mapRateForDb));
    await db.insert(notifications).values(INITIAL_NOTIFICATIONS.map(mapNotificationForDb));

    isInitialized = false;
    return { success: true };
  } catch (err: any) {
    console.error("Database reset error:", err);
    return { success: false, error: err?.message || "Failed to reset database" };
  }
}
