import { type Query } from "@/lib/language";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseOverview from "@/components/courses/CourseOverview";
import { getCourseDetail, getCourseLens } from "@/lib/server/course-detail";

export const metadata: Metadata = {
  title: "おすすめコース | NISHIYAMA LENS",
  description: "西山公園のおすすめコースと、コース内で楽しめるスポットをご紹介します。",
};

export default async function CoursePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const { id } = await params;
  const query = await searchParams;
  const course = await getCourseDetail(id);
  if (!course) notFound();

  const lens = await getCourseLens(course.lensId);
  return <CourseOverview course={course} lens={lens} query={query} />;
}
