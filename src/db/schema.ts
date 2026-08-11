import { pgTable, text, timestamp, numeric, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  country: text("country").notNull().default("US"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  currency: text("currency").notNull().default("USD"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipients = pgTable("recipients", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull().default("Kenya"),
  deliveryMethod: text("delivery_method").notNull(),
  provider: text("provider").notNull(),
  accountNumber: text("account_number").notNull(),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transfers = pgTable("transfers", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipientId: text("recipient_id").notNull(),
  senderAmount: numeric("sender_amount", { precision: 12, scale: 2 }).notNull(),
  senderCurrency: text("sender_currency").notNull().default("USD"),
  recipientAmount: numeric("recipient_amount", { precision: 12, scale: 2 }).notNull(),
  recipientCurrency: text("recipient_currency").notNull().default("KES"),
  fee: numeric("fee", { precision: 8, scale: 2 }).notNull(),
  exchangeRate: numeric("exchange_rate", { precision: 10, scale: 4 }).notNull(),
  deliveryMethod: text("delivery_method").notNull(),
  provider: text("provider").notNull(),
  accountNumber: text("account_number").notNull(),
  recipientName: text("recipient_name").notNull(),
  status: text("status").notNull().default("processing"),
  currentStep: integer("current_step").notNull().default(2),
  note: text("note"),
  estimatedDelivery: text("estimated_delivery").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topups = pgTable("topups", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: text("method").notNull(),
  cardLast4: text("card_last4"),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exchangeRates = pgTable("exchange_rates", {
  id: text("id").primaryKey(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  rate: numeric("rate", { precision: 10, scale: 4 }).notNull(),
  feeFixed: numeric("fee_fixed", { precision: 8, scale: 2 }).notNull(),
  feePercent: numeric("fee_percent", { precision: 5, scale: 2 }).notNull().default("0.00"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
