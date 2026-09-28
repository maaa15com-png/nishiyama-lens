import RecapSummary from "@/components/recap/RecapSummary";
import { navigationHref, type Query } from "@/lib/language";
import RediscoveryLenses from "@/components/recap/RediscoveryLenses";
import { getRediscoveryLenses } from "@/lib/server/rediscovery-lenses";
import NearbySpots from "@/components/nearby/NearbySpots";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecap } from "@/lib/server/recap";

export const metadata: Metadata = {
  title: "今日の振り返り | NISHIYAMA LENS",
  robots: { index: false, follow: false },
};

export default async function RecapPage({ searchParams }: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const { courseId } = query;
  if (typeof courseId !== "string") notFound();
  const recap = await getRecap(courseId);
  if (!recap) notFound();
  const { lens, action } = recap;
  const rediscovery = await getRediscoveryLenses(lens.id);
  return <>
    <RecapSummary recap={recap} query={query} />
    <p className="my-9 text-center text-lg leading-9">今日選んだ見方が、<br />あなたらしい公園の楽しみ方に。</p>
    <nav aria-label="次の楽しみ方">
      <Link href={navigationHref(action.href, query)} className="flex min-h-14 items-center justify-center rounded-3xl bg-[#174a36] px-6 py-4 text-center text-sm font-bold leading-7 text-white focus-visible:outline-2 focus-visible:outline-offset-4">{action.label}</Link>
      {action.needsDiagnosis && <p className="mt-3 text-sm leading-7 text-[#53665a]">次のテーマをヒントに、もう一度LENS診断から探してみましょう。</p>}
    </nav>
    <NearbySpots lensId={lens.id} />
    <RediscoveryLenses lenses={rediscovery} query={query} />
    <aside className="mt-10 rounded-3xl bg-[#e9edde] p-7 text-center"><p className="text-xl font-semibold">また、西山公園で新しい発見を。</p><p className="mt-3 text-sm leading-7 text-[#53665a]">次に来る日も、楽しみになりますように。</p></aside>
  </>;
}
