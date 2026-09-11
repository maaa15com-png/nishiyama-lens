import "server-only";
import { db } from "./db";
import { getCourseDetail } from "./course-detail";
import { getTodaysFinds } from "./todays-find";
import { getNextAction } from "@/lib/recap/next-action";

export async function getRecap(courseId: string) {
  const course = await getCourseDetail(courseId);
  if (!course) return null;
  const lens = await db.orm.public.Lens
    .where({ id: course.lensId, isPublished: true })
    .select("id", "name", "title", "companion", "interest")
    .first();
  if (!lens) return null;

  const spotIds = [...new Set(course.courseSpots.flatMap(({ spot }) => spot ? [spot.id] : []))];
  const groups = await Promise.all(spotIds.map((id) => getTodaysFinds(id, lens.id)));
  const finds = [...new Map(groups.flat().map((find) => [find.id, find])).values()];
  const action = getNextAction(lens.interest);
  const nextLens = await db.orm.public.Lens
    .where({ companion: lens.companion, interest: action.interest, isPublished: true })
    .select("id")
    .include("courses", (courses) => courses.where({ isPublished: true })
      .select("id", "durationType")
      .orderBy((candidate) => candidate.id.asc()))
    .first();
  const nextCourse = nextLens?.courses.find((candidate) => candidate.durationType === course.durationType)
    ?? nextLens?.courses[0];
  return { course, lens, finds, action: {
    ...action,
    href: nextCourse ? `/courses/${nextCourse.id}` : "/lens",
    needsDiagnosis: !nextCourse,
  } };
}
