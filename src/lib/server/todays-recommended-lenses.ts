import { hasSelectableCourse } from "@/lib/lens/availability";
import "server-only";
import { db } from "./db";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { isSeasonActive } from "@/lib/seasons/period";
import { getSpotImage } from "@/lib/media/spot-image";

const seasonSpots: Record<string, string> = {
  "spring-cherry-blossoms": "nishiyama-cherry-blossoms",
  "spring-azaleas": "nishiyama-azaleas",
  "autumn-leaves": "nishiyama-autumn-leaves",
};
const companionOrder = ["FAMILY", "COUPLE"] as const;

// A calendar-based optional entry point; never changes the quiz or Course resolver.
export async function getTodaysRecommendedLenses(at = new Date()) {
  if (!Number.isFinite(at.getTime())) return null;
  try {
    const seasons = await db.orm.public.Season.where({ isPublished: true })
      .select("id", "slug", "name", "nameEn", "startMonth", "startDay", "endMonth", "endDay").all();
    const active = seasons.filter((season) => isSeasonActive(season, at));
    // Fail closed even when an unconfigured Season overlaps a known Season.
    if (active.length !== 1 || !Object.hasOwn(seasonSpots, active[0].slug)) return null;
    const season = active[0];
    const candidates = await db.orm.public.Lens.where({ interest: "SEASON", isPublished: true })
      .select("id", "name", "description", "descriptionEn", "companion")
      .include("courses", (courses) => courses.where({ isPublished: true }).select("id", "durationType")).all();
    const lenses = companionOrder.flatMap((companion) => {
      const matches = candidates.filter((lens) => lens.companion === companion);
      if (matches.length !== 1) return [];
      const lens = matches[0];
      // Same selectable durations as the existing Result page.
      if (!hasSelectableCourse(lens.courses)) return [];
      return [{ id: lens.id, name: String(lens.name), description: lens.description,
        descriptionEn: lens.descriptionEn, companion }];
    });
    if (!lenses.length) return null;
    const spot = await db.orm.public.Spot.where({ slug: seasonSpots[season.slug] as Varchar<150>, isPublished: true })
      .select("slug", "imageUrl").first();
    return { season: { slug: String(season.slug), name: String(season.name), nameEn: season.nameEn }, lenses,
      image: spot ? getSpotImage(spot.slug, spot.imageUrl) : null };
  } catch (error) {
    // An optional recommendation must not take down the normal home page.
    console.error("Failed to load today's seasonal LENS suggestions.", error);
    return null;
  }
}

export type TodaysRecommendedLenses = Awaited<ReturnType<typeof getTodaysRecommendedLenses>>;
