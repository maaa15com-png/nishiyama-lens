import type postgres from "@prisma/orm-postgres/runtime";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Contract } from "./schema.d.ts";
import { issue52Links } from "./issue-52-data.mts";

type Database = ReturnType<typeof postgres<Contract>>;

export async function seedIssue52(db: Database) {
  return db.transaction(async (tx) => {
    let inserted = 0;
    for (const seed of issue52Links) {
      const lens = await tx.orm.public.Lens.where({ id: seed.lensId }).first();
      const spot = await tx.orm.public.NearbySpot.where({ id: seed.nearbySpotId }).first();
      if (!lens || lens.companion !== seed.companion || lens.interest !== seed.interest
        || !spot || spot.slug !== seed.nearbySpotSlug) {
        throw new Error("Issue 52 target identity mismatch: " + seed.id);
      }
      const byId = await tx.orm.public.LensNearbySpot.where({ id: seed.id }).first();
      if (byId && (byId.lensId !== seed.lensId || byId.nearbySpotId !== seed.nearbySpotId)) {
        throw new Error("Issue 52 relation ID collision: " + seed.id);
      }
      const existing = await tx.orm.public.LensNearbySpot.where({ lensId: seed.lensId, nearbySpotId: seed.nearbySpotId }).first();
      // Existing pair wins, including its ID, priority and editorial reason.
      if (existing) continue;
      if (!lens.isPublished || !spot.isPublished) throw new Error("Issue 52 target is not published: " + seed.id);
      await tx.orm.public.LensNearbySpot.create({ id: seed.id, lensId: seed.lensId,
        nearbySpotId: seed.nearbySpotId, priority: seed.priority,
        recommendationReason: seed.recommendationReason as Varchar<255>, recommendationReasonEn: null });
      inserted++;
    }
    return { inserted, updated: 0, skipped: issue52Links.length - inserted };
  });
}
