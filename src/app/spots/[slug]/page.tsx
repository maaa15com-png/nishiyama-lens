import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { spotCategoryLabels } from "@/lib/courses/labels";
import { getSpotDetail } from "@/lib/server/spot-detail";

export const metadata: Metadata = {
  title: "スポット詳細 | NISHIYAMA LENS",
  description: "西山公園のスポットと、子連れで過ごすための情報をご紹介します。",
};

function officialUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

function sexLabel(value: string): string {
  const labels: Record<string, string> = { male: "オス", female: "メス", m: "オス", f: "メス", unknown: "不明" };
  const key = value.toLowerCase();
  return Object.hasOwn(labels, key) ? labels[key] : value;
}

export default async function SpotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spot = await getSpotDetail(slug);
  if (!spot) notFound();
  const amenities = [
    spot.strollerAccessible === true && "ベビーカーOK",
    spot.hasToilet === true && "トイレあり",
    spot.hasRestArea === true && "休憩スペースあり",
  ].filter((label): label is string => typeof label === "string");
  const externalUrl = officialUrl(spot.externalUrl);

  return <>
    <section aria-labelledby="spot-title" className="rounded-[2rem] bg-[#173e30] px-6 py-9 text-white sm:px-10 sm:py-12">
      <p className="text-xs font-bold tracking-widest text-[#d7c69d]">{spotCategoryLabels[spot.category]}</p>
      <h1 id="spot-title" className="mt-5 break-words text-3xl font-medium leading-relaxed sm:text-4xl">{spot.name}</h1>
      <p className="mt-6 whitespace-pre-line break-words text-sm leading-8 text-white/85 sm:text-base">{spot.description}</p>
    </section>
    {amenities.length > 0 && <section aria-labelledby="amenities-title" className="mt-8 rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] p-6 sm:p-8">
      <h2 id="amenities-title" className="text-xl font-semibold">子連れで過ごすために</h2>
      <ul className="mt-5 flex flex-wrap gap-3">{amenities.map((label) => <li key={label} className="rounded-full bg-[#edf1e7] px-4 py-3 text-sm text-[#365746]">{label}</li>)}</ul>
    </section>}
    {externalUrl && <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center rounded-full border border-[#b9c3b8] bg-[#fffdf8] px-6 py-3 text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">公式情報を見る（別タブ）</a>}
    {spot.redPandas.length > 0 && <section aria-labelledby="pandas-title" className="mt-12">
      <h2 id="pandas-title" className="text-2xl font-medium">レッサーパンダたち</h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2">{spot.redPandas.map((panda) => <li key={panda.id} className="min-w-0 rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] p-6 sm:p-8">
        <h3 className="break-words text-xl font-semibold">{panda.name}</h3>
        {panda.nameEn && <p className="mt-1 break-words text-sm text-[#68736c]" lang="en">{panda.nameEn}</p>}
        <dl className="mt-4 space-y-2 text-sm">
          {panda.sex && <div><dt className="inline text-[#68736c]">性別：</dt><dd className="inline break-words">{sexLabel(panda.sex)}</dd></div>}
          {panda.birthDate && <div><dt className="inline text-[#68736c]">誕生日：</dt><dd className="inline"><time dateTime={panda.birthDate.toString()}>{panda.birthDate.year}年{panda.birthDate.month}月{panda.birthDate.day}日</time></dd></div>}
        </dl>
        {panda.description && <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-[#53665a]">{panda.description}</p>}
      </li>)}</ul>
    </section>}
    <nav aria-label="次のアクション" className="mt-10"><Link href="/lens" className="inline-flex min-h-14 items-center rounded-full bg-[#174a36] px-7 py-3 text-sm font-bold text-white hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-4">LENSでコースを探す</Link></nav>
  </>;
}
