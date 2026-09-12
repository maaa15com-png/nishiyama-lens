import Link from "next/link";
import InformationShell, { Localized, infoCard, infoLink } from "@/components/information/InformationShell";
import { parseLang, languageHref, formatDate, type Query } from "@/lib/language";
import { informationText } from "@/lib/park/content";
import { getNews } from "@/lib/server/information";
export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }) {
  return { title: `${informationText[parseLang((await searchParams).lang)].news} | NISHIYAMA LENS` };
}
export default async function Page({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const lang = parseLang(query.lang);
  const text = informationText[lang];
  const items = await getNews();
  return <InformationShell lang={lang} query={query} path="/news">
    <h1 className="text-3xl font-medium">{text.news}</h1>
    {items.length === 0 ? <p className={infoCard}>{text.noNews}</p> :
      <ul className="space-y-5">{items.map((item) => <li key={item.id} className={`${infoCard} space-y-4`}>
        <h2 className="text-xl font-semibold"><Link className={infoLink} href={languageHref(`/news/${item.id}`, query, lang)}><Localized ja={item.title} en={item.titleEn} lang={lang} /></Link></h2>
        {item.publishedAt && <p className="text-sm"><time dateTime={item.publishedAt.toString()}>{formatDate(item.publishedAt.epochMilliseconds, lang)}</time></p>}
      </li>)}</ul>}
  </InformationShell>;
}
