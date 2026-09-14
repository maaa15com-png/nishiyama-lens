import "server-only";
import { db } from "./db";
import { durationTypes, isLensRecommendationInput, type LensRecommendationInput, type LensRecommendationResponse } from "@/lib/lens/types";

// Lens is determined only by companion and interest. Duration belongs to course selection.
export async function getLensRecommendation(input: LensRecommendationInput): Promise<LensRecommendationResponse> {
  if (!isLensRecommendationInput(input)) return { recommendation: null, reason: "INVALID_INPUT" };
  const lens = await db.orm.public.Lens
    .where({ companion: input.companion, interest: input.interest, isPublished: true })
    .select("id", "name", "description")
    .first();
  if (!lens) return { recommendation: null, reason: "LENS_NOT_FOUND" };
  const courses = await getLensCourses(lens.id);
  return { recommendation: { lens: {
    id: lens.id, name: String(lens.name), description: lens.description,
    companion: input.companion, interest: input.interest,
  }, courses } };
}

// Called only after resolving a published Lens above. Excludes legacy durations.
async function getLensCourses(lensId: string) {
  const rows = await db.orm.public.Course.where({ lensId, isPublished: true })
    .select("id", "name", "description", "durationType", "durationMinutes")
    .orderBy((course) => course.id.asc()).all();
  return durationTypes.flatMap((durationType) => rows
    .filter((course) => course.durationType === durationType)
    .map((course) => ({ id: course.id, name: String(course.name), description: course.description,
      durationType, durationMinutes: course.durationMinutes })));
}
