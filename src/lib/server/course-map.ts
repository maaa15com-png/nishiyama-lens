import "server-only";
import type { MapSpot } from "@/lib/map/types";
import { getCourseDetail } from "./course-detail";

export async function getCourseMap(courseId: string) {
  const course = await getCourseDetail(courseId);
  if (!course) return null;

  const spots: MapSpot[] = [];
  for (const { sortOrder, spot } of course.courseSpots) {
    if (!spot) continue;
    const latitude = coordinate(spot.latitude, 90);
    const longitude = coordinate(spot.longitude, 180);
    if (latitude === null || longitude === null) continue;

    spots.push({
      id: spot.id,
      name: String(spot.name),
      slug: String(spot.slug),
      sortOrder,
      latitude,
      longitude,
      category: spot.category,
    });
  }

  return { id: course.id, name: String(course.name), spots };
}

function coordinate(value: unknown, limit: number): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= limit ? number : null;
}
