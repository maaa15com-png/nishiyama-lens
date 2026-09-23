import "temporal-polyfill/full/global";
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./schema.d.ts";
import contractJson from "./schema.json" with { type: "json" };
import { seedSpotImages } from "./spot-images.mts";

const url = process.env["DATABASE_URL"];
if (!url) throw new Error("DATABASE_URL is required to run the seed.");
const db = postgres<Contract>({ contractJson, url });
try {
  const result = await seedSpotImages(db);
  console.log(JSON.stringify({ ...result, totalSpots: (await db.orm.public.Spot.all()).length }));
} finally {
  await db.close();
}
