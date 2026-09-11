import "server-only";
import { db } from "./db";
import { safeExternalUrl } from "../external-url";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getNearbySpots(lensId: string) {
  if (!uuidPattern.test(lensId)) return [];
  const lens = await db.orm.public.Lens
    .where({ id: lensId, isPublished: true })
    .select("id")
    .include("nearbySpots", (links) => links
      .select("id", "priority", "recommendationReason")
      // Lower priority numbers appear first; id makes equal priorities stable.
      .orderBy([(link) => link.priority.asc(), (link) => link.id.asc()])
      .include("nearbySpot", (spot) => spot.where({ isPublished: true })
        .select("id", "name", "category", "description", "address", "externalUrl")))
    .first();
  if (!lens) return [];
  return lens.nearbySpots.flatMap(({ nearbySpot, recommendationReason }) => nearbySpot ? [{
    ...nearbySpot,
    externalUrl: safeExternalUrl(nearbySpot.externalUrl),
    recommendationReason,
  }] : []);
}
