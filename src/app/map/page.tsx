import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MapClient from "@/components/map/MapClient";
import { spotCategoryLabels } from "@/lib/courses/labels";
import { getCourseMap } from "@/lib/server/course-map";

export const metadata: Metadata = {
  title: "園内MAP | NISHIYAMA LENS",
  description: "西山公園のおすすめコースを地図で確認できます。",
};

export default async function MapPage({ searchParams }: {
  searchParams: Promise<{ courseId?: string | string[] }>;
}) {
  const { courseId } = await searchParams;
  if (typeof courseId !== "string") notFound();
  const course = await getCourseMap(courseId);
  if (!course) notFound();

  return (
    <>
      <p className="text-xs font-bold tracking-[0.2em] text-[#796345]">西山公園 園内MAP</p>
      <h1 className="mt-3 break-words text-2xl font-medium leading-relaxed sm:text-3xl">{course.name}</h1>
      <p className="mt-3 text-sm leading-7 text-[#53665a]">番号のピンを押すと、スポット名と楽しみ方を確認できます。</p>
      <div className="mt-7">
        <MapClient key={course.id} courseId={course.id} spots={course.spots} />
      </div>
      <section aria-labelledby="map-spots-title" className="mt-8 rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] p-5 sm:p-7">
        <h2 id="map-spots-title" className="text-lg font-semibold">地図に表示するスポット（{course.spots.length}件）</h2>
        {course.spots.length === 0 ? (
          <p className="mt-3 text-sm leading-7 text-[#53665a]">地図に表示できるスポットはまだありません。</p>
        ) : (
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {course.spots.map((spot) => (
              <li key={spot.sortOrder} value={spot.sortOrder} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#174a36] text-sm font-bold text-white">{spot.sortOrder}</span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold">{spot.name}</p>
                  <p className="mt-1 text-xs text-[#53665a]">{spotCategoryLabels[spot.category]}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
      <Link href={`/courses/${course.id}`} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border border-[#b9c3b8] bg-[#fffdf8] px-6 text-sm font-semibold hover:bg-[#edf1e7] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">
        コース詳細に戻る
      </Link>
    </>
  );
}
