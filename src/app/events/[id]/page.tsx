import Link from "next/link";
import InformationShell, { Localized, infoCard, infoLink } from "@/components/information/InformationShell";
import { parseLang, languageHref, type Query } from "@/lib/language";
import { informationText } from "@/lib/park/content";
import EventDates from "@/components/information/EventDates";
import { getEventDetail } from "@/lib/server/information";
import { notFound } from "next/navigation";
import { safeExternalUrl } from "@/lib/external-url";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }) {
  return { title: `${informationText[parseLang((await searchParams).lang)].events} | NISHIYAMA LENS` };
}
export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  const query = await searchParams;
  const lang = parseLang(query.lang);
  const text = informationText[lang];
  const item = await getEventDetail((await params).id);
  if (!item) notFound();
  const externalUrl = safeExternalUrl(item.externalUrl);
  return <InformationShell lang={lang} query={query} path={`/events/${item.id}`}>
    <article className={`${infoCard} space-y-6`}>
      <h1 className="text-3xl font-medium leading-relaxed"><Localized ja={item.title} en={item.titleEn} lang={lang} /></h1>
      <EventDates startAt={item.startAt} endAt={item.endAt} lang={lang} />
        {(item.location || item.locationEn) && <p className="text-sm leading-7"><Localized ja={item.location} en={item.locationEn} lang={lang} /></p>}
      <p className="text-sm">{text.timeZone}</p>
      <p className="whitespace-pre-line leading-8"><Localized ja={item.description} en={item.descriptionEn} lang={lang} /></p>
      {externalUrl && <a className={infoLink} href={externalUrl} target="_blank" rel="noopener noreferrer">{text.official}</a>}
    </article>
    <Link className={infoLink} href={languageHref("/events", query, lang)}>{text.back}</Link>
  </InformationShell>;
}
