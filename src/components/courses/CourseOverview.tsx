import PhotoCredit from "@/components/courses/CoursePhotoCredit";
﻿import Link from "next/link";
import CoursePhoto from "@/components/courses/CoursePhoto";
import { getCoursePhoto as photoFor, getCourseHeroSpot } from "@/lib/media/course-image";

import { navigationHref, type Query } from "@/lib/language";
import { durationLabels } from "@/lib/lens/labels";
import { spotCategoryLabels } from "@/lib/courses/labels";
import type { getCourseDetail, getCourseLens } from "@/lib/server/course-detail";

type Course = NonNullable<Awaited<ReturnType<typeof getCourseDetail>>>;
type Spot = Course["courseSpots"][number]["spot"];
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174a36]";

export default function CourseOverview({ course, lens, query }: { course: Course; lens: Awaited<ReturnType<typeof getCourseLens>>; query: Query }) {
  const heroSpot = getCourseHeroSpot(course.courseSpots.map(({ spot }) => spot));
  const hero = heroSpot ? photoFor(heroSpot) : null;
  return <>
    <section aria-labelledby="course-title" className="overflow-hidden rounded-[2rem] bg-[#fffdf8] shadow-[0_24px_65px_rgba(21,58,44,0.10)]">
      <div className="grid lg:grid-cols-2">
        <div className="min-w-0 px-6 py-9 sm:p-10 lg:py-12">
          <p className="text-xs font-bold tracking-[0.18em] text-[#687953]">YOUR PARK EXPERIENCE</p>
          {lens && <p className="mt-5 inline-block rounded-full bg-[#edf1e7] px-4 py-2 text-xs font-bold tracking-wide">{lens.name} LENS</p>}
          <h1 id="course-title" className="mt-5 break-words text-3xl font-semibold leading-relaxed tracking-tight sm:text-4xl">{course.name}</h1>
          {course.description && <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-[#53665a]">{course.description}</p>}
          <div className="mt-7 flex flex-wrap gap-3 border-t border-[#dce3d6] pt-5 text-sm">
            <p><span aria-hidden="true">◷ </span>過ごし方の目安：<strong>{durationLabels[course.durationType]}</strong></p>
            <p><span aria-hidden="true">⌖ </span>{course.courseSpots.length}つのスポット</p>
          </div>
        </div>
        <div className="min-w-0"><CoursePhoto key={hero?.src ?? "empty"} src={hero?.src ?? null} alt={hero?.alt ?? ""} generated={hero?.generated} objectPosition={hero?.objectPosition} hero /></div>
      </div>
      {heroSpot && <PhotoCredit spot={heroSpot} />}
    </section>

    {lens?.description && <aside aria-labelledby="course-hint" className="mt-7 rounded-3xl border border-[#e2dfcc] bg-[#eeeadc] p-6 sm:p-8">
      <h2 id="course-hint" className="font-semibold"><span aria-hidden="true">✧ </span>{lens.name}で楽しむヒント</h2>
      <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-[#53665a]">{lens.description}</p>
    </aside>}

    <section aria-labelledby="course-spots-title" className="mt-12 sm:mt-16">
      <p className="text-xs font-bold tracking-[0.2em] text-[#687953]">EXPLORE THE PARK</p>
      <h2 id="course-spots-title" className="mt-3 text-2xl font-semibold leading-relaxed">このコースで楽しめるスポット</h2>
      <p className="mt-3 text-sm leading-7 text-[#68736c]">番号はMAPのピンと対応しています。巡る順番ではありません。現在地から近いスポットや、気になる場所を見つけて楽しんでください。</p>
      {!course.courseSpots.length ? <p className="mt-6 rounded-3xl bg-[#fffdf8] p-6 text-sm">このコースのスポット情報は準備中です。</p> :
        <ul role="list" className="mt-8">
          {course.courseSpots.map(({ spotId, sortOrder, spot }, index) => {
            const photo = photoFor(spot);
            return <li key={spotId} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-2 pb-7 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:gap-5">
              <div className="relative flex justify-center">
                {index < course.courseSpots.length - 1 && <span aria-hidden="true" className="absolute bottom-[-1.75rem] top-8 w-px bg-[#b6c3ad]" />}
                <span className="relative z-[1] flex size-8 items-center justify-center rounded-full bg-[#174a36] font-bold text-white sm:size-11 sm:text-lg"><span className="sr-only">MAPのスポット番号 </span>{sortOrder}</span>
              </div>
              <article className="min-w-0 overflow-hidden rounded-3xl border border-[#e0e3d9] bg-white shadow-[0_12px_35px_rgba(40,55,42,0.06)]">
                <div className="grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div className="min-w-0"><CoursePhoto key={photo.src ?? "empty"} src={photo.src} alt={photo.alt} generated={photo.generated} objectPosition={photo.objectPosition} /><PhotoCredit spot={spot} /></div>
                  <div className="min-w-0 p-5 sm:p-7">
                    <p className="text-xs font-semibold text-[#68736c]">{spotCategoryLabels[spot.category]}</p>
                    <h3 className="mt-2 break-words text-xl font-semibold leading-relaxed sm:text-2xl">{spot.name}</h3>
                    <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-[#53665a]">{spot.description}</p>
                    <SpotAmenities spot={spot} />
                    <Link href={navigationHref(`/spots/${encodeURIComponent(spot.slug)}?courseId=${course.id}`, query)} aria-label={`${spot.name}を詳しく見る`} className={`mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline underline-offset-4 ${focus}`}>スポットを詳しく見る <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            </li>;
          })}
        </ul>}
    </section>

    <nav aria-label="次のアクション" className="mt-7 rounded-[2rem] bg-[#e9edde] p-5 sm:p-8">
      <p className="text-center text-lg font-semibold">気になる場所から、公園を楽しもう。</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
        <Link href={navigationHref(`/map?courseId=${course.id}`, query)} className={`inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[#174a36] px-5 py-4 text-center font-bold text-white shadow-lg transition-colors hover:bg-[#0f3929] ${focus}`}><span aria-hidden="true">⌖</span>このコースをMAPで見る<span aria-hidden="true">→</span></Link>
        <Link href={navigationHref("/lens", query)} className={`inline-flex min-h-16 items-center justify-center rounded-2xl border border-[#174a36] bg-[#fffdf8] px-5 py-4 text-center font-semibold hover:bg-[#f2f3ed] ${focus}`}>別の楽しみ方を見る</Link>
      </div>
      <div className="mt-4 text-center"><Link href={navigationHref(`/recap?courseId=${course.id}`, query)} className={`inline-flex min-h-11 items-center text-sm underline underline-offset-4 ${focus}`}>選んだ楽しみ方を振り返る</Link></div>
    </nav>
  </>;
}

function SpotAmenities({ spot }: { spot: Spot }) {
  const labels = [
    spot.strollerAccessible === true && ["♧", "ベビーカーOK"],
    spot.hasToilet === true && ["ⓘ", "トイレあり"],
    spot.hasRestArea === true && ["☕", "休憩スペースあり"],
  ].filter((label): label is string[] => Array.isArray(label));
  if (!labels.length) return null;
  return <ul aria-label="子連れ向け情報" className="mt-4 flex flex-wrap gap-2">
    {labels.map(([icon, label]) => <li key={label} className="rounded-xl bg-[#edf1e7] px-3 py-2 text-xs font-semibold text-[#365746]"><span aria-hidden="true">{icon} </span>{label}</li>)}
  </ul>;
}
