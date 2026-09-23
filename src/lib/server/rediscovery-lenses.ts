import { hasSelectableCourse } from "@/lib/lens/availability";
import "server-only";
import { db } from "./db";
import { companionTypes, interestTypes, isLensRecommendationInput } from "@/lib/lens/types";

export async function getRediscoveryLenses(currentLensId: string) {
  const rows = await db.orm.public.Lens.where({ isPublished: true })
    .select("id", "name", "description", "companion", "interest")
    .include("courses", courses => courses.where({ isPublished: true }).select("durationType"))
    .all();
  const current = rows.find(lens => lens.id === currentLensId);
  if (!current || !isLensRecommendationInput(current)) return [];
  const eligible = rows.flatMap(lens => {
    if (lens.id === currentLensId || !isLensRecommendationInput(lens)
      || !hasSelectableCourse(lens.courses)) return [];
    return [{ id: lens.id, name: String(lens.name), description: lens.description,
      companion: lens.companion, interest: lens.interest }];
  });
  const sameCompanion = eligible.filter(lens => lens.companion === current.companion && lens.interest !== current.interest);
  // Do not fill a single same-companion suggestion with a different party type.
  const candidates = sameCompanion.length ? sameCompanion : eligible.filter(lens => lens.companion !== current.companion);
  // The existing choice order is editorial, independent of row order or UUID.
  // Lens(companion, interest) is unique in the DB.
  return candidates.sort((a, b) => interestTypes.indexOf(a.interest) - interestTypes.indexOf(b.interest)
    || companionTypes.indexOf(a.companion) - companionTypes.indexOf(b.companion)).slice(0, 2);
}

export type RediscoveryLens = Awaited<ReturnType<typeof getRediscoveryLenses>>[number];
