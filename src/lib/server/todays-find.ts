import "server-only";
import { db } from "./db";
import { isSeasonActive } from "../seasons/period";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Without Course context, omitted lensId means all public
// Lens themes for this Spot; Course context supplies its Lens ID and also allows Lens-independent themes.
// Seasonal themes use the published Season calendar window in Japan.
export async function getTodaysFinds(spotId: string, lensId?: string, at = new Date()) {
  if (!uuidPattern.test(spotId) || (lensId !== undefined && !uuidPattern.test(lensId))) return [];

  const finds = await db.orm.public.TodaysFind
    .where({ spotId, isPublished: true })
    .select("id", "title", "description", "spotId", "lensId", "seasonId", "startAt", "endAt")
    .include("spot", (spot) => spot.where({ isPublished: true }).select("id"))
    .include("lens", (lens) => lens.where({ isPublished: true }).select("id"))
    .include("season", (season) => season.where({ isPublished: true }).select("name", "description", "startMonth", "startDay", "endMonth", "endDay"))
    .orderBy([(find) => find.title.asc(), (find) => find.id.asc()])
    .all();

  const now = at.getTime();
  return finds.filter((find) =>
    Number.isFinite(now)
    && find.spot !== null
    && (find.seasonId === null || (find.season !== null && isSeasonActive(find.season, at)))
    && (find.lensId === null || find.lens !== null)
    && (lensId === undefined || find.lensId === null || find.lensId === lensId.toLowerCase())
    && (find.startAt === null || find.startAt.epochMilliseconds <= now)
    && (find.endAt === null || now < find.endAt.epochMilliseconds),
  ).map(({ id, title, description, season }) => ({ id, title, description,
    season: season ? { name: season.name, description: season.description } : null,
  }));
}
