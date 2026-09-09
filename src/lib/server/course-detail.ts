import "server-only";
import { db } from "./db";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getCourseDetail(courseId: string) {
  if (!uuidPattern.test(courseId)) return null;

  const course = await db.orm.public.Course
    .where({ id: courseId, isPublished: true })
    .select("id", "name", "description", "durationType", "durationMinutes", "lensId")
    .include("courseSpots", (courseSpots) =>
      courseSpots
        .select("courseId", "spotId", "sortOrder")
        .orderBy((courseSpot) => courseSpot.sortOrder.asc())
        .include("spot", (spot) =>
          spot.where({ isPublished: true }).select(
            "id", "name", "slug", "category", "description",
            "latitude", "longitude", "strollerAccessible", "hasToilet", "hasRestArea",
          ),
        ),
    )
    .first();

  if (!course) return null;

  return {
    ...course,
    courseSpots: course.courseSpots.filter(({ spot }) => spot !== null),
  };
}
