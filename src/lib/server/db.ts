import "server-only";
import "temporal-polyfill/full/global";

import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../prisma/schema.d.ts";
import contractJson from "../../../prisma/schema.json" with { type: "json" };

function createDatabase() {
  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to PostgreSQL.");
  }

  return postgres<Contract>({ contractJson, url: databaseUrl });
}

type Database = ReturnType<typeof createDatabase>;

const globalForDatabase = globalThis as typeof globalThis & {
  nishiyamaLensDatabase?: Database;
};

export const db = globalForDatabase.nishiyamaLensDatabase ?? createDatabase();

if (process.env["NODE_ENV"] !== "production") {
  globalForDatabase.nishiyamaLensDatabase = db;
}
