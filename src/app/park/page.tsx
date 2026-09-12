import Link from "next/link";
import InformationShell, { Localized, infoCard, infoLink } from "@/components/information/InformationShell";
import { parseLang, type Query } from "@/lib/language";
import { informationText, zooAccessUrl } from "@/lib/park/content";
import { safeExternalUrl } from "@/lib/external-url";
import { getParkInformation } from "@/lib/server/information";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Query> }) {
  return { title: `${informationText[parseLang((await searchParams).lang)].park} | NISHIYAMA LENS` };
}
export default async function ParkPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const lang = parseLang(query.lang);
  const text = informationText[lang];
  const { facilities, seasons } = await getParkInformation();
  const accessUrl = safeExternalUrl(zooAccessUrl);
  return <InformationShell lang={lang} query={query} path="/park">
    <h1 className="text-3xl font-medium">{text.park}</h1>
    <nav aria-label={lang === "en" ? "On this page" : "ページ内の案内"} className="flex flex-wrap gap-2">
      {(["about", "facilities", "access", "faq"] as const).map((section) => <a key={section} className={infoLink} href={`#${section}`}>{text[section]}</a>)}
    </nav>
    <section id="about" aria-labelledby="about-title" className={`${infoCard} space-y-5`}>
      <h2 id="about-title" className="text-2xl font-medium">{text.about}</h2>
      <p className="leading-8">{text.intro}</p>
      {seasons.length > 0 && <div className="space-y-5">
        <h3 className="text-xl font-medium">{text.seasons}</h3>
        {seasons.map((season) => <div key={season.id} className="space-y-2 border-l-2 border-[#c8b781] pl-4">
          <h4 className="font-semibold"><Localized ja={season.name} en={season.nameEn} lang={lang} /></h4>
          {(season.description || season.descriptionEn) && <p className="whitespace-pre-line leading-8"><Localized ja={season.description} en={season.descriptionEn} lang={lang} /></p>}
        </div>)}
      </div>}
    </section>
    <section id="facilities" aria-labelledby="facilities-title" className="space-y-5">
      <h2 id="facilities-title" className="text-2xl font-medium">{text.facilities}</h2>
      <ul className="grid gap-5 sm:grid-cols-2">{facilities.map((spot) => <li key={spot.id} className={`${infoCard} space-y-4`}>
        <h3 className="text-xl font-semibold"><Localized ja={spot.name} en={spot.nameEn} lang={lang} /></h3>
        <p className="whitespace-pre-line leading-8"><Localized ja={spot.description} en={spot.descriptionEn} lang={lang} /></p>
        <Link href={`/spots/${spot.slug}`} className={infoLink}>{text.spotLink}</Link>
      </li>)}</ul>
    </section>
    <section id="access" aria-labelledby="access-title" className={`${infoCard} space-y-4`}>
      <h2 id="access-title" className="text-2xl font-medium">{text.access}</h2>
      <p className="leading-8">{text.accessBody}</p>
      {accessUrl && <a href={accessUrl} target="_blank" rel="noopener noreferrer" className={infoLink}>{text.accessLink}</a>}
    </section>
    <section id="faq" aria-labelledby="faq-title" className={`${infoCard} space-y-4`}>
      <h2 id="faq-title" className="text-2xl font-medium">{text.faq}</h2>
      <p className="leading-8">{text.faqBody}</p>
    </section>
  </InformationShell>;
}
