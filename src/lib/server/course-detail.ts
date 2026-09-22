import "server-only";
import { db } from "./db";
import { resolveCourseSpots } from "./resolve-course-spots";

const spotFields = ["id", "name", "slug", "category", "description", "latitude", "longitude", "strollerAccessible", "hasToilet", "hasRestArea"] as const;

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getCourseDetail(courseId: string, at = new Date()) {
  if (!uuidPattern.test(courseId)) return null;

  const course = await db.orm.public.Course
    .where({ id: courseId, isPublished: true })
    .select("id", "name", "description", "durationType", "durationMinutes", "lensId")
    .include("courseSpots", (courseSpots) =>
      courseSpots
        .select("id", "courseId", "spotId", "sortOrder")
        .orderBy((courseSpot) => courseSpot.sortOrder.asc())
        .include("spot", (spot) =>
          spot.where({ isPublished: true }).select(...spotFields),
        )
        .include("seasonalCandidates", (candidates) => candidates
          .select("seasonId", "spotId")
          .include("season", (season) => season.where({ isPublished: true })
            .select("startMonth", "startDay", "endMonth", "endDay"))
          .include("spot", (spot) => spot.where({ isPublished: true }).select(...spotFields))),
    )
    .first();

  if (!course) return null;

  return {
    ...course,
    courseSpots: resolveCourseSpots(course.courseSpots, at),
  };
}
