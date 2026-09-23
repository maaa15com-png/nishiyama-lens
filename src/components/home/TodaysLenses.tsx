import Link from "next/link";
import SpotImage from "@/components/spots/SpotImage";
import { languageHref, localizedText, type Lang, type Query } from "@/lib/language";
import type { TodaysRecommendedLenses } from "@/lib/server/todays-recommended-lenses";

// UI translations for the three supported calendar themes; not live status labels.
const seasonNamesEn: Record<string, string> = {
  "spring-cherry-blossoms": "Spring cherry blossoms",
  "spring-azaleas": "Spring azaleas",
  "autumn-leaves": "Autumn leaves",
};

export default function TodaysLenses({ recommendation, lang, query }: {
  recommendation: TodaysRecommendedLenses; lang: Lang; query: Query;
}) {
  if (!recommendation) return null;
  const { season, lenses, image } = recommendation;
  const ctaQuery = { ...query };
  delete ctaQuery.duration; // Legacy quiz answer; preserve all other context.
  const seasonName = localizedText(season.name, season.nameEn?.trim() || seasonNamesEn[season.slug] || null, lang);
  return <section aria-labelledby="todays-lenses-title" className="bg-[#edf0e7] px-5 py-16 text-[#173e30] sm:px-8 sm:py-24 lg:px-12">
    <div className="mx-auto max-w-6xl">
      <p className="text-xs font-bold tracking-widest text-[#71613f]">SEASONAL LENS</p>
      <h2 id="todays-lenses-title" className="mt-4 text-3xl font-medium leading-tight sm:text-4xl">{lang === "en" ? "Today's suggested LENS" : "今日おすすめのLENS"}</h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#53665a]">{lang === "en"
        ? "Another way to explore, inspired by our seasonal calendar. These suggestions are not live flowering or foliage reports."
        : "季節から探す、もうひとつの入口。アプリの季節掲載期間に合わせた提案で、現在の開花・紅葉状況を示すものではありません。"}</p>
      <p lang="en" className="mt-2 text-xs leading-6 text-[#53665a]">LENS results and courses — Japanese only</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {lenses.map((lens) => {
          const description = localizedText(lens.description, lens.descriptionEn, lang);
          return <article key={lens.id} className="flex min-w-0 flex-col rounded-3xl border border-[#d9dfd2] bg-[#fffdf8] p-5 sm:p-7">
            <p lang={seasonName.lang} className="text-sm font-semibold text-[#71613f]">{seasonName.text}</p>
            <h3 className="mt-3 break-words text-2xl font-semibold">{lens.name}</h3>
            <p lang={description.lang} className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-[#53665a]">{description.text}</p>
            {image && <SpotImage slug={image.slug} imageUrl={image.imagePath} name={season.name} lang={lang} />}
            <div className="mt-auto pt-7">
              <Link href={languageHref("/lens/result", { ...ctaQuery, companion: lens.companion, interest: "SEASON" }, lang)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#174a36] px-6 py-3 text-center text-sm font-bold text-white hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174a36]">{lang === "en" ? "Explore this LENS" : "このLENSを見る"}</Link>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
