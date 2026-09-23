import "server-only";
import { db } from "./db";
import { companionTypes, interestTypes, isLensRecommendationInput } from "@/lib/lens/types";
import { hasSelectableCourse } from "@/lib/lens/availability";

export async function getAvailableLensCombinations() {
  try {
    const rows = await db.orm.public.Lens.where({ isPublished: true })
      .select("companion", "interest")
      .include("courses", courses => courses.where({ isPublished: true }).select("durationType"))
      .all();
    return rows.flatMap(lens => isLensRecommendationInput(lens) && hasSelectableCourse(lens.courses)
      ? [{ companion: lens.companion, interest: lens.interest }] : [])
      .sort((a, b) => companionTypes.indexOf(a.companion) - companionTypes.indexOf(b.companion)
        || interestTypes.indexOf(a.interest) - interestTypes.indexOf(b.interest));
  } catch (error) {
    console.error("Failed to load available LENS combinations.", error);
    return [];
  }
}
