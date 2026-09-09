import { db } from "./db";
import type {
  LensRecommendationInput,
  LensRecommendationResponse,
} from "@/lib/lens/types";

export async function getLensRecommendation(
  input: LensRecommendationInput,
): Promise<LensRecommendationResponse> {
  const lens = await db.orm.public.Lens
    .where({ companion: input.companion, interest: input.interest })
    .select("id", "name", "companion", "interest")
    .first();

  if (!lens) {
    return { recommendation: null, reason: "LENS_NOT_FOUND" };
  }

  const course = await db.orm.public.Course
    .where({ lensId: lens.id, durationType: input.duration })
    .select("id", "name", "durationType", "durationMinutes")
    .first();

  if (!course) {
    return { recommendation: null, reason: "COURSE_NOT_FOUND" };
  }

  return {
    recommendation: {
      lens: {
        id: lens.id,
        name: String(lens.name),
        companion: lens.companion,
        interest: lens.interest,
      },
      course: {
        id: course.id,
        name: String(course.name),
        durationType: course.durationType,
        durationMinutes: course.durationMinutes,
      },
    },
  };
}
