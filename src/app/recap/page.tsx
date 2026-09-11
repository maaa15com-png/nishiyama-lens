import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecap } from "@/lib/server/recap";
import { companionLabels, durationLabels, interestLabels } from "@/lib/lens/labels";

export const metadata: Metadata = {
  title: "今日の振り返り | NISHIYAMA LENS",
  robots: { index: false, follow: false },
};

export default async function RecapPage({ searchParams }: {
  searchParams: Promise<{ courseId?: string | string[] }>;
}) {
  const { courseId } = await searchParams;
  if (typeof courseId !== "string") notFound();
  const recap = await getRecap(courseId);
  if (!recap) notFound();
  const { course, lens, finds, action } = recap;
  return <>
    <p className="text-xs font-bold tracking-widest text-[#796345]">TODAY’S RECAP</p>
    <h1 className="mt-4 text-3xl font-medium leading-relaxed">今日選んだ、<br />西山公園の楽しみ方</h1>
    <p className="mt-5 text-sm leading-8 text-[#53665a]">選んだテーマを振り返って、次に見つけたい景色へ。あなたのペースで、公園の楽しみ方を広げてみませんか。</p>
    <section aria-labelledby="recap-lens" className="mt-8 rounded-3xl bg-[#173e30] p-6 text-white sm:p-8">
      <h2 id="recap-lens" className="text-sm text-[#d7c69d]">今日のLENS</h2>
      <p className="mt-3 break-words text-2xl font-semibold">{lens.name}</p>
      <p className="mt-3 break-words text-lg leading-8">{lens.title}</p>
      <p className="mt-3 text-sm">{companionLabels[lens.companion]} × {interestLabels[lens.interest]}</p>
    </section>
    <section aria-labelledby="recap-course" className="mt-6 rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] p-6 sm:p-8">
      <h2 id="recap-course" className="text-sm text-[#53665a]">今日選んだCourse</h2>
      <p className="mt-3 break-words text-xl font-semibold">{course.name}</p>
      <p className="mt-4 whitespace-pre-line break-words text-sm leading-8">{course.description}</p>
      <p className="mt-4 text-sm">所要時間の目安：{durationLabels[course.durationType]}（約{course.durationMinutes}分）</p>
      <p className="mt-4 text-xs leading-6 text-[#53665a]">選んだコースの紹介です。実際に訪れた場所や滞在時間の記録ではありません。</p>
    </section>
    {finds.length > 0 && <section aria-labelledby="recap-find" className="mt-6 rounded-3xl border border-[#c8b781] bg-[#f0eddb] p-6 sm:p-8">
      <h2 id="recap-find" className="text-lg font-semibold">TODAY’S FIND</h2>
      <p className="mt-3 text-sm leading-7">このコースで楽しめる発見テーマ。見つけたことも、次に探したいことも、あなたのペースで。</p>
      <ul className="mt-5 space-y-5">{finds.map((find) => <li key={find.id}>
        <h3 className="break-words font-semibold leading-7">{find.title}</h3>
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-7">{find.description}</p>
      </li>)}</ul>
    </section>}
    <p className="my-9 text-center text-lg leading-9">今日選んだ見方が、<br />あなたらしい公園の楽しみ方に。</p>
    <nav aria-label="次の楽しみ方">
      <Link href={action.href} className="flex min-h-14 items-center justify-center rounded-3xl bg-[#174a36] px-6 py-4 text-center text-sm font-bold leading-7 text-white focus-visible:outline-2 focus-visible:outline-offset-4">{action.label}</Link>
      {action.needsDiagnosis && <p className="mt-3 text-sm leading-7 text-[#53665a]">次のテーマをヒントに、もう一度LENS診断から探してみましょう。</p>}
    </nav>
  </>;
}
