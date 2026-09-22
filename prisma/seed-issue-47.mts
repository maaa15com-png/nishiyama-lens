import "temporal-polyfill/full/global";
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./schema.d.ts";
import contractJson from "./schema.json" with { type: "json" };
import { seedIssue47 } from "./issue-47-seed.mts";
const url = process.env["DATABASE_URL"];
if (!url) throw new Error("DATABASE_URL is required");
const db = postgres<Contract>({ contractJson, url });
try { console.log(JSON.stringify(await seedIssue47(db))); } finally { await db.close(); }
