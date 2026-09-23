import { languageHref, parseLang, type Lang, type Query } from "../language";
import type { LensRecommendationInput } from "./types";

// Start another LENS while retaining navigation context, not the legacy duration answer.
export function lensResultHref(target: LensRecommendationInput, query: Query, lang: Lang = parseLang(query.lang)) {
  const next: Query = { ...query, companion: target.companion, interest: target.interest };
  delete next.duration;
  return languageHref("/lens/result", next, lang);
}
