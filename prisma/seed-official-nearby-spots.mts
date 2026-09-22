import "temporal-polyfill/full/global";
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./schema.d.ts";
import contractJson from "./schema.json" with { type: "json" };
import { seedOfficialNearbySpots } from "./official-nearby-spots.mts";

const url = process.env["DATABASE_URL"];
if (!url) throw new Error("DATABASE_URL is required to run the seed.");
const db = postgres<Contract>({ contractJson, url });
try {
  const result = await seedOfficialNearbySpots(db);
  console.log(JSON.stringify({ ...result, totalNearbySpots: (await db.orm.public.NearbySpot.all()).length }));
} finally {
  await db.close();
}
