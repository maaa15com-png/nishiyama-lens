import Link from "next/link";
import CoursePhoto from "@/components/courses/CoursePhoto";
import CoursePhotoCredit from "@/components/courses/CoursePhotoCredit";
import { getCoursePhoto, getCourseHeroSpot } from "@/lib/media/course-image";
import { navigationHref, type Query } from "@/lib/language";
import { companionLabels, durationLabels, interestLabels } from "@/lib/lens/labels";
import type { getRecap } from "@/lib/server/recap";

type Recap = NonNullable<Awaited<ReturnType<typeof getRecap>>>;
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174a36]";

export default function RecapSummary({ recap, query }: { recap: Recap; query: Query }) {
  const { course, lens, finds } = recap;
  const slots = course.courseSpots;
  const heroSpot = getCourseHeroSpot(slots.map(slot => slot.spot));
  const hero = heroSpot ? getCoursePhoto(heroSpot) : null;
  return <>
    <header className="relative py-3 text-center sm:py-7">
      <p className="text-xs font-bold tracking-[0.25em] text-[#7d8757]">TODAY’S RECAP</p>
      <span aria-hidden="true" className="mt-4 block text-4xl text-[#8c9d69]">❧</span>
      <h1 className="mt-3 text-3xl font-semibold leading-relaxed sm:text-4xl">今日選んだ、<br className="sm:hidden" />西山公園の楽しみ方</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-[#53665a]">心に残った景色はありましたか。<br />選んだテーマを振り返って、次に見つけたい景色へ。</p>
    </header>

    <div className="mt-7 grid items-start gap-5 lg:grid-cols-2">
      <div className="min-w-0 overflow-hidden rounded-[2rem] bg-[#fffdf8] shadow-sm">
        <CoursePhoto key={hero?.src ?? "empty"} src={hero?.src ?? null} alt={hero?.alt ?? ""} generated={hero?.generated} objectPosition={hero?.objectPosition} />
        {heroSpot && <><p className="px-5 pt-4 text-sm font-semibold">{heroSpot.name} · コースの代表イメージ</p><CoursePhotoCredit spot={heroSpot} /></>}
      </div>
      <div className="min-w-0 space-y-5">
        <section aria-labelledby="recap-lens" className="rounded-3xl border border-[#dce3d3] bg-[#fffdf8] p-6 sm:p-8">
          <h2 id="recap-lens" className="text-sm font-semibold text-[#526c49]">今日のLENS</h2>
          <p className="mt-4 break-words text-2xl font-semibold">{lens.name}</p>
          <p className="mt-3 break-words text-base leading-8">{lens.title}</p>
          <p className="mt-3 text-sm leading-7 text-[#53665a]">{companionLabels[lens.companion]} × {interestLabels[lens.interest]}</p>
        </section>
        <section aria-labelledby="recap-course" className="rounded-3xl border border-[#e4dfcf] bg-white p-6 sm:p-8">
          <h2 id="recap-course" className="text-sm font-semibold text-[#526c49]">今日選んだコース</h2>
          <p className="mt-3 break-words text-xl font-semibold">{course.name}</p>
          <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-[#53665a]">{course.description}</p>
          <p className="mt-4 text-sm">所要時間の目安：{durationLabels[course.durationType]}（約{course.durationMinutes}分）</p>
          <p className="mt-3 text-xs leading-6 text-[#68736c]">選んだコースの紹介です。実際に訪れた場所や滞在時間の記録ではありません。</p>
          <Link className={`mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 ${focus}`} href={navigationHref(`/courses/${course.id}`, query)}>コースをもう一度見る →</Link>
        </section>
      </div>
    </div>

    {slots.length > 0 && <section aria-labelledby="recap-spots" className="mt-7 rounded-[2rem] bg-[#eaf0e3] p-5 sm:p-7">
      <h2 id="recap-spots" className="text-lg font-semibold">このコースのスポット</h2>
      <p className="mt-2 text-xs leading-6 text-[#53665a]">番号はMAPのピンに対応します。訪問順や訪問済みの記録ではありません。</p>
      <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">{slots.map(({spot,sortOrder}) => {
        const photo = getCoursePhoto(spot);
        return <li key={spot.id} className="min-w-0">
          <div className="overflow-hidden rounded-2xl"><CoursePhoto compact src={photo.src} alt={photo.alt} generated={photo.generated} objectPosition={photo.objectPosition} /></div>
          <Link href={navigationHref(`/spots/${spot.slug}?courseId=${course.id}`, query)} className={`mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold leading-6 ${focus}`}><span aria-hidden="true" className="shrink-0 text-[#78865e]">{sortOrder.toString().padStart(2,"0")}</span><span className="break-words">{spot.name}</span></Link>
        </li>;
      })}</ul>
      <details className="mt-3 text-xs text-[#53665a]"><summary className={`min-h-11 cursor-pointer content-center ${focus}`}>スポット画像について</summary>
        <p className="leading-6">代表イメージです。生成画像は実際の施設を撮影した写真ではありません。</p>
        {slots.filter(slot => getCoursePhoto(slot.spot).metadata).map(slot => <CoursePhotoCredit key={slot.spot.id} spot={slot.spot} />)}
      </details>
    </section>}

    {finds.length > 0 && <section aria-labelledby="recap-find" className="mt-7 rounded-[2rem] border border-[#e3dec8] bg-[#f6f3e5] p-5 sm:p-8">
      <p className="text-xs font-bold tracking-[0.18em] text-[#9a646d]">TODAY’S FIND</p>
      <h2 id="recap-find" className="mt-2 text-xl font-semibold">今日の発見を、振り返ってみよう</h2>
      <p className="mt-3 text-sm leading-7 text-[#53665a]">このコースで楽しめる発見テーマ。見つけたことも、次に探したいことも、あなたのペースで。</p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{finds.map(find => {
        const spot = slots.find(slot => slot.spotId === recap.findSpotIds[find.id])?.spot;
        const photo = spot ? getCoursePhoto(spot) : null;
        return <li key={find.id} className={`min-w-0 rounded-3xl bg-white/75 p-5 ${finds.length === 1 ? "sm:col-span-2 lg:col-span-3 sm:flex sm:items-start sm:gap-6" : ""}`}>
          <div className="mx-auto mb-5 size-28 shrink-0 overflow-hidden rounded-full border-4 border-white">{photo?.src ? <CoursePhoto compact square src={photo.src} alt={photo.alt} /> : <div aria-hidden="true" className="flex h-full items-center justify-center bg-[#e8eddf] text-4xl text-[#7d945e]">✿</div>}</div>
          <div className="min-w-0">
          {photo?.generated && <p className="mb-3 text-center text-xs text-[#53665a]">生成イメージ（実景写真ではありません）</p>}
          {find.season && <div className="mb-3 text-xs leading-6 text-[#687953]"><p className="font-semibold">{find.season.name}</p>{find.season.description && <p className="mt-1 whitespace-pre-line break-words">{find.season.description}</p>}</div>}
          <h3 className="break-words font-semibold leading-7">{find.title}</h3>
          <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-[#53665a]">{find.description}</p>
          {spot && <Link href={navigationHref(`/spots/${spot.slug}?courseId=${course.id}`, query)} className={`mt-3 inline-flex min-h-11 items-center text-xs font-semibold underline ${focus}`}>{spot.name}で探す →</Link>}
          </div>
        </li>;
      })}</ul>
    </section>}
  </>;
}
