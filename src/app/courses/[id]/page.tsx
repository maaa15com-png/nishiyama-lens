import { navigationHref, type Query } from "@/lib/language";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { spotCategoryLabels } from "@/lib/courses/labels";
import { durationLabels } from "@/lib/lens/labels";
import { getCourseDetail } from "@/lib/server/course-detail";

export const metadata: Metadata = {
  title: "おすすめコース | NISHIYAMA LENS",
  description: "西山公園のおすすめコースと、コース内で楽しめるスポットをご紹介します。",
};

export default async function CoursePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const { id } = await params;
  const query = await searchParams;
  const course = await getCourseDetail(id);
  if (!course) notFound();

  return (
    <>
      <section aria-labelledby="course-title" className="rounded-[2rem] bg-[#173e30] px-6 py-9 text-white shadow-[0_24px_65px_rgba(21,58,44,0.16)] sm:px-10 sm:py-12">
        <p className="text-xs font-bold tracking-[0.2em] text-[#d7c69d]">おすすめコース</p>
        <h1 id="course-title" className="mt-5 break-words text-3xl font-medium leading-relaxed tracking-tight sm:text-4xl">
          {course.name}
        </h1>
        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-xs text-white/75">過ごし方の目安</dt>
            <dd className="mt-1 text-lg font-semibold">{durationLabels[course.durationType]}</dd>
          </div>
        </dl>
        {course.description && <p className="mt-7 whitespace-pre-line break-words text-sm leading-8 text-white/85 sm:text-base">{course.description}</p>}
      </section>

      <section aria-labelledby="course-spots-title" className="mt-12 sm:mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="course-spots-title" className="text-2xl font-medium">このコースで楽しめるスポット</h2>
          <p className="text-sm text-[#68736c]">{course.courseSpots.length}つのスポット</p>
        </div>
        <p className="mt-3 text-sm leading-7 text-[#68736c]">番号はMAPのピンと対応しています。巡る順番ではありません。現在地から近いスポットや、気になる場所を見つけて楽しんでください。</p>
        {course.courseSpots.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-[#fffdf8] p-6 text-sm leading-7">このコースのスポット情報は準備中です。</p>
        ) : (
          <ul role="list" className="mt-7 space-y-6">
            {course.courseSpots.map(({ spotId, sortOrder, spot }) => (
              <li key={spotId}>
                <article className="rounded-[1.5rem] border border-[#e0e3d9] bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(40,55,42,0.05)] sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#174a36] text-lg font-bold text-white"><span className="sr-only">MAPのスポット番号 </span>{sortOrder}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#68736c]">{spot ? spotCategoryLabels[spot.category] : "スポット"}</p>
                      <h3 className="mt-1 break-words text-xl font-semibold leading-relaxed sm:text-2xl">{spot?.name ?? "スポット情報は準備中です"}</h3>
                    </div>
                  </div>
                  {spot && <>
                    <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-[#53665a] sm:text-base">{spot.description}</p>
                    <SpotAmenities spot={spot} />
                    <Link href={navigationHref(`/spots/${encodeURIComponent(spot.slug)}?courseId=${course.id}`, query)} aria-label={`${spot.name}を詳しく見る`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">詳しく見る</Link>
                  </>}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav aria-label="次のアクション" className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row">
        <Link href={navigationHref(`/map?courseId=${course.id}`, query)} className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#174a36] px-7 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">園内MAPでコースを見る</Link>
        <Link href={navigationHref(`/recap?courseId=${course.id}`, query)} className="inline-flex min-h-14 items-center rounded-full border border-[#b9c3b8] px-7 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">選んだ楽しみ方を振り返る</Link>
        <Link href={navigationHref("/lens", query)} className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#b9c3b8] bg-[#fffdf8] px-7 py-3 text-sm font-semibold transition-colors hover:bg-[#f2f3ed] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">もう一度診断する</Link>
      </nav>
    </>
  );
}

function SpotAmenities({ spot }: { spot: { strollerAccessible: boolean | null; hasToilet: boolean | null; hasRestArea: boolean | null } }) {
  const labels = [
    spot.strollerAccessible === true && "ベビーカーOK",
    spot.hasToilet === true && "トイレあり",
    spot.hasRestArea === true && "休憩スペースあり",
  ].filter((label): label is string => typeof label === "string");
  if (labels.length === 0) return null;

  return <ul aria-label="子連れ向け情報" className="mt-5 flex flex-wrap gap-2">
    {labels.map((label) => <li key={label} className="rounded-full bg-[#edf1e7] px-3 py-2 text-xs font-semibold text-[#365746]">{label}</li>)}
  </ul>;
}
