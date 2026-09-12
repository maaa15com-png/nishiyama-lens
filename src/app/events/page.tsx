import Link from "next/link";
import InformationShell, { Localized, infoCard, infoLink } from "@/components/information/InformationShell";
import { parseLang, languageHref, type Query } from "@/lib/language";
import { informationText } from "@/lib/park/content";
import EventDates from "@/components/information/EventDates";
import { getEvents } from "@/lib/server/information";
export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }) {
  return { title: `${informationText[parseLang((await searchParams).lang)].events} | NISHIYAMA LENS` };
}
export default async function Page({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const lang = parseLang(query.lang);
  const text = informationText[lang];
  const items = await getEvents();
  return <InformationShell lang={lang} query={query} path="/events">
    <h1 className="text-3xl font-medium">{text.events}</h1>
    {items.length === 0 ? <p className={infoCard}>{text.noEvents}</p> :
      <ul className="space-y-5">{items.map((item) => <li key={item.id} className={`${infoCard} space-y-4`}>
        <h2 className="text-xl font-semibold"><Link className={infoLink} href={languageHref(`/events/${item.id}`, query, lang)}><Localized ja={item.title} en={item.titleEn} lang={lang} /></Link></h2>
        <EventDates startAt={item.startAt} endAt={item.endAt} lang={lang} />
        {(item.location || item.locationEn) && <p className="text-sm leading-7"><Localized ja={item.location} en={item.locationEn} lang={lang} /></p>}
      </li>)}</ul>}
  </InformationShell>;
}
