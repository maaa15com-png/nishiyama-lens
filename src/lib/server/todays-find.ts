import "server-only";
import { db } from "./db";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The Spot route has no selected Lens context yet. Omitted lensId means all public
// Lens themes for this Spot; a supplied lensId also allows Lens-independent themes.
// Season-bound themes stay hidden until seasonal matching is implemented.
export async function getTodaysFinds(spotId: string, lensId?: string) {
  if (!uuidPattern.test(spotId) || (lensId !== undefined && !uuidPattern.test(lensId))) return [];

  const finds = await db.orm.public.TodaysFind
    .where({ spotId, isPublished: true, seasonId: null })
    .select("id", "title", "description", "spotId", "lensId", "startAt", "endAt")
    .include("spot", (spot) => spot.where({ isPublished: true }).select("id"))
    .include("lens", (lens) => lens.where({ isPublished: true }).select("id"))
    .orderBy([(find) => find.title.asc(), (find) => find.id.asc()])
    .all();

  const now = Date.now();
  return finds.filter((find) =>
    find.spot !== null
    && (find.lensId === null || find.lens !== null)
    && (lensId === undefined || find.lensId === null || find.lensId === lensId.toLowerCase())
    && (find.startAt === null || find.startAt.epochMilliseconds <= now)
    && (find.endAt === null || now < find.endAt.epochMilliseconds),
  ).map(({ id, title, description }) => ({ id, title, description }));
}
