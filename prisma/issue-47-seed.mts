import type postgres from "@prisma/orm-postgres/runtime";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Contract } from "./schema.d.ts";
import { additionalLensSeeds, cherrySeasonSeed, seasonalFindSeeds } from "./issue-47-data.mts";
import { isSeasonActive, type SeasonPeriod } from "../src/lib/seasons/period.ts";

type Database = ReturnType<typeof postgres<Contract>>;
const v100 = (s: string) => s as Varchar<100>;
const v150 = (s: string) => s as Varchar<150>;

export function assertDisjointSeasons(seasons: SeasonPeriod[]) {
  // Check a leap and a non-leap year; use the same Japan calendar as the app.
  for (const year of [2024, 2025]) for (let day = 0; day < (year === 2024 ? 366 : 365); day++) {
    const at = new Date(Date.UTC(year, 0, day + 1, 3));
    if (seasons.filter((season) => isSeasonActive(season, at)).length > 1) {
      throw new Error("Issue #47 seasonal candidate periods overlap");
    }
  }
}

export async function seedIssue47(db: Database) {
  return db.transaction(async (tx) => {
    const inserted = { Lens: 0, Course: 0, CourseSpot: 0, Season: 0, TodaysFind: 0, CourseSpotSeason: 0 };
    async function add(model: keyof typeof inserted, id: string, byId: { id: string } | null,
      byKey: { id: string } | null, create: () => Promise<unknown>) {
      // Never overwrite existing IDs or attach this seed to an unrelated unique key.
      if ((byId && byKey?.id !== id) || (byKey && byKey.id !== id)) throw new Error("Issue #47 ID/unique collision: " + model + "/" + id);
      if (byKey) return;
      await create(); inserted[model]++;
    }
    const c = cherrySeasonSeed;
    const cherry = { ...c, name: v100(c.name), slug: v100(c.slug), nameEn: null, descriptionEn: null, imageUrl: null, isPublished: true };
    await add("Season", c.id, await tx.orm.public.Season.where({ id: c.id }).first(),
      await tx.orm.public.Season.where({ slug: cherry.slug }).first(), () => tx.orm.public.Season.create(cherry));

    const periods = [];
    for (const item of seasonalFindSeeds) {
      const season = await tx.orm.public.Season.where({ slug: v100(item.seasonSlug) }).first();
      const spot = await tx.orm.public.Spot.where({ slug: v150(item.spotSlug) }).first();
      if (!season || !spot) throw new Error("Missing Issue #47 dependency: " + item.seasonSlug + "/" + item.spotSlug);
      periods.push({ season, spot, find: item.find });
    }
    assertDisjointSeasons(periods.map(({ season }) => season));

    for (const item of additionalLensSeeds) {
      const { courses, ...fields } = item;
      const lens = { ...fields, name: v100(fields.name), title: v150(fields.title), titleEn: v150(fields.titleEn), imageUrl: null, isPublished: true };
      await add("Lens", lens.id, await tx.orm.public.Lens.where({ id: lens.id }).first(),
        await tx.orm.public.Lens.where({ companion: lens.companion, interest: lens.interest }).first(), () => tx.orm.public.Lens.create(lens));
      for (const itemCourse of courses) {
        const { slots, ...fields } = itemCourse;
        const course = { ...fields, name: v150(fields.name), nameEn: v150(fields.nameEn), descriptionEn: null, lensId: lens.id, imageUrl: null, isPublished: true };
        await add("Course", course.id, await tx.orm.public.Course.where({ id: course.id }).first(),
          await tx.orm.public.Course.where({ lensId: lens.id, durationType: course.durationType }).first(), () => tx.orm.public.Course.create(course));
        for (const [index, slot] of slots.entries()) {
          const spot = await tx.orm.public.Spot.where({ slug: v150(slot.slug) }).first();
          if (!spot) throw new Error("Missing Issue #47 Spot: " + slot.slug);
          const row = { id: slot.id, courseId: course.id, spotId: spot.id, sortOrder: index + 1,
            stayMinutes: null, walkMinutesFromPrevious: null, note: null, noteEn: null };
          const existing = await tx.orm.public.CourseSpot.where({ courseId: course.id, sortOrder: row.sortOrder }).first();
          if (existing && existing.spotId !== spot.id) throw new Error("Issue #47 fallback conflict: " + slot.id);
          await add("CourseSpot", row.id, await tx.orm.public.CourseSpot.where({ id: row.id }).first(), existing, () => tx.orm.public.CourseSpot.create(row));
          for (const [i, id] of slot.candidateIds.entries()) {
            const { season, spot: candidate } = periods[i];
            const data = { id, courseSpotId: slot.id, seasonId: season.id, spotId: candidate.id };
            const existing = await tx.orm.public.CourseSpotSeason.where({ courseSpotId: slot.id, seasonId: season.id }).first();
            if (existing && existing.spotId !== candidate.id) throw new Error("Issue #47 candidate conflict: " + id);
            await add("CourseSpotSeason", id, await tx.orm.public.CourseSpotSeason.where({ id }).first(), existing, () => tx.orm.public.CourseSpotSeason.create(data));
          }
        }
      }
    }
    // Three shared, Spot-specific themes (lensId=NULL). Legacy Courses never reference these Spots.
    // This also lets the two new PHOTO lenses use the same seasonal Camera/Recap flow.
    for (const { season, spot, find } of periods) {
      const data = { ...find, title: v150(find.title), titleEn: null, descriptionEn: null, seasonId: season.id,
        spotId: spot.id, lensId: null, startAt: null, endAt: null, isPublished: true };
      const matches = await tx.orm.public.TodaysFind.where({ spotId: spot.id, seasonId: season.id, lensId: null, title: data.title }).all();
      if (matches.length > 1) throw new Error("Issue #47 duplicate Find: " + find.id);
      await add("TodaysFind", find.id, await tx.orm.public.TodaysFind.where({ id: find.id }).first(), matches[0] ?? null, () => tx.orm.public.TodaysFind.create(data));
    }
    return { inserted, totalInserted: Object.values(inserted).reduce((a, b) => a + b, 0) };
  });
}
