import "server-only";
import { isSeasonActive, type SeasonPeriod } from "../seasons/period";

type Candidate<S> = { seasonId: string; spotId: string; season: SeasonPeriod | null; spot: S | null };
type Slot<S> = { id: string; courseId: string; spotId: string; sortOrder: number; spot: S | null; seasonalCandidates: Candidate<S>[] };

// Relations are filtered to published Season/Spot rows by the caller.
// Keep fallback identity separate: the returned spotId always names the actual Spot.
export function resolveCourseSpots<S extends { id: string }>(slots: Slot<S>[], at: Date) {
  return slots.flatMap((slot) => {
    const active = slot.seasonalCandidates.filter((candidate) =>
      candidate.season !== null && candidate.spot !== null && isSeasonActive(candidate.season, at));
    if (active.length > 1) console.warn("Overlapping CourseSpot seasons; using fallback", { courseSpotId: slot.id });
    const chosen = active.length === 1 ? active[0] : null;
    const spot = chosen ? chosen.spot : slot.spot;
    if (!spot) return [];
    return [{ id: slot.id, courseSpotId: slot.id, courseId: slot.courseId, sortOrder: slot.sortOrder,
      fallbackSpotId: slot.spotId, selectedSeasonId: chosen?.seasonId ?? null, spotId: spot.id, spot }];
  });
}
