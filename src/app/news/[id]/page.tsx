import Link from "next/link";
import InformationShell, { Localized, infoCard, infoLink } from "@/components/information/InformationShell";
import { parseLang, languageHref, formatDate, type Query } from "@/lib/language";
import { informationText } from "@/lib/park/content";
import { getNewsDetail } from "@/lib/server/information";
import { notFound } from "next/navigation";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }) {
  return { title: `${informationText[parseLang((await searchParams).lang)].news} | NISHIYAMA LENS` };
}
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const query = await searchParams;
  const lang = parseLang(query.lang);
  const text = informationText[lang];
  const item = await getNewsDetail((await params).id);
  if (!item) notFound();
  return <InformationShell lang={lang} query={query} path={`/news/${item.id}`}>
    <article className={`${infoCard} space-y-6`}>
      <h1 className="text-3xl font-medium leading-relaxed"><Localized ja={item.title} en={item.titleEn} lang={lang} /></h1>
      {item.publishedAt && <p className="text-sm"><time dateTime={item.publishedAt.toString()}>{formatDate(item.publishedAt.epochMilliseconds, lang)}</time></p>}
      <p className="text-sm">{text.timeZone}</p>
      <p className="whitespace-pre-line leading-8"><Localized ja={item.body} en={item.bodyEn} lang={lang} /></p>
    </article>
    <Link className={infoLink} href={languageHref("/news", query, lang)}>{text.back}</Link>
  </InformationShell>;
}
