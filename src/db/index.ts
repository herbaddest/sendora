import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __sendoraPool?: Pool;
};

export const pool =
  globalForDb.__sendoraPool ??
  new Pool(
    databaseUrl
      ? { connectionString: databaseUrl }
      : undefined
  );

if (process.env.NODE_ENV !== "production") {
  globalForDb.__sendoraPool = pool;
}

export const db = drizzle(pool, { schema });
