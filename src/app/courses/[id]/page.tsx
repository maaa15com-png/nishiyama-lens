import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { spotCategoryLabels } from "@/lib/courses/labels";
import { durationLabels } from "@/lib/lens/labels";
import { getCourseDetail } from "@/lib/server/course-detail";

export const metadata: Metadata = {
  title: "おすすめコース | NISHIYAMA LENS",
  description: "西山公園のおすすめコースと、順番にめぐるスポットをご紹介します。",
};

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
          <div>
            <dt className="text-xs text-white/75">所要時間</dt>
            <dd className="mt-1 text-lg font-semibold">約{course.durationMinutes}分</dd>
          </div>
        </dl>
        {course.description && <p className="mt-7 whitespace-pre-line break-words text-sm leading-8 text-white/85 sm:text-base">{course.description}</p>}
      </section>

      <section aria-labelledby="course-flow-title" className="mt-12 sm:mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="course-flow-title" className="text-2xl font-medium">コースの流れ</h2>
          <p className="text-sm text-[#68736c]">{course.courseSpots.length}つのスポットをめぐる</p>
        </div>
        <p className="mt-3 text-sm leading-7 text-[#68736c]">上から順に、気になる景色や遊びを楽しみましょう。</p>
        {course.courseSpots.length === 0 ? (
          <p className="mt-6 rounded-3xl bg-[#fffdf8] p-6 text-sm leading-7">このコースのスポット情報は準備中です。</p>
        ) : (
          <ol className="mt-7">
            {course.courseSpots.map(({ spotId, sortOrder, spot }, index) => (
              <li key={spotId} value={sortOrder}>
                <article className="rounded-[1.5rem] border border-[#e0e3d9] bg-[#fffdf8] p-6 shadow-[0_12px_35px_rgba(40,55,42,0.05)] sm:p-8">
                  <div className="flex items-start gap-4">
                    <span aria-label={`順番 ${sortOrder}`} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#174a36] text-lg font-bold text-white">{sortOrder}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#68736c]">{spot ? spotCategoryLabels[spot.category] : "スポット"}</p>
                      <h3 className="mt-1 break-words text-xl font-semibold leading-relaxed sm:text-2xl">{spot?.name ?? "スポット情報は準備中です"}</h3>
                    </div>
                  </div>
                  {spot && <>
                    <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-[#53665a] sm:text-base">{spot.description}</p>
                    <SpotAmenities spot={spot} />
                    <Link href={`/spots/${encodeURIComponent(spot.slug)}`} aria-label={`${spot.name}を詳しく見る`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">詳しく見る</Link>
                  </>}
                </article>
                {index < course.courseSpots.length - 1 && <div aria-hidden="true" className="py-3 pl-10 text-xl text-[#7b857e] sm:pl-12">↓</div>}
              </li>
            ))}
          </ol>
        )}
      </section>

      <nav aria-label="次のアクション" className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row">
        <Link href={`/map?courseId=${course.id}`} className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#174a36] px-7 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">園内MAPでコースを見る</Link>
        <Link href="/lens" className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#b9c3b8] bg-[#fffdf8] px-7 py-3 text-sm font-semibold transition-colors hover:bg-[#f2f3ed] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">もう一度診断する</Link>
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
