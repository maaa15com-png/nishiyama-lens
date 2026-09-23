import type postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./schema.d.ts";
import images from "../src/lib/media/spot-images.json" with { type: "json" };

type Database = ReturnType<typeof postgres<Contract>>;

// Run after official-spots. Never replace an editor's existing image or create Spots.
export async function seedSpotImages(db: Database) {
  return db.transaction(async (tx) => {
    let updated = 0;
    for (const image of images) {
      const spot = await tx.orm.public.Spot.where({ id: image.spotId }).first();
      if (!spot || spot.slug !== image.slug) throw new Error("Spot image identity mismatch: " + image.slug);
      if (spot.imageUrl === image.imagePath) continue;
      if (spot.imageUrl !== null) throw new Error("Existing Spot image must be reviewed: " + image.slug);
      await tx.orm.public.Spot.where({ id: image.spotId }).update({ imageUrl: image.imagePath });
      updated++;
    }
    return { inserted: 0, updated, skipped: images.length - updated };
  });
}
