import Link from "next/link";
import { languageHref, localizedText, type Lang, type Query } from "@/lib/language";
import { informationText } from "@/lib/park/content";

export const infoLink = "inline-flex min-h-11 items-center rounded-xl px-3 py-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";
export const infoCard = "min-w-0 rounded-3xl border border-[#d9ddd3] bg-[#fffdf8] p-5 sm:p-8";
export function Localized({ ja, en, lang }: { ja: string | null; en: string | null; lang: Lang }) {
  const value = localizedText(ja, en, lang);
  return <span lang={value.lang}>{value.text}</span>;
}
export default function InformationShell({ lang, query, path, children }: {
  lang: Lang; query: Query; path: string; children: React.ReactNode;
}) {
  const text = informationText[lang];
  return <div lang={lang} className="min-h-screen bg-[#f5f1e7] text-[#173e30] [overflow-wrap:anywhere]">
    <header className="border-b border-[#d9ddd3] bg-[#fffdf8] px-4 py-5 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className={`${infoLink} text-sm font-bold tracking-widest`} aria-label={lang === "en" ? "NISHIYAMA LENS home (Japanese)" : "NISHIYAMA LENS トップ"}>NISHIYAMA LENS</Link>
        <nav aria-label={lang === "en" ? "Language" : "言語"} className="mt-2 flex flex-wrap gap-2">
          {(["ja", "en"] as const).map((value) => <Link key={value} href={languageHref(path, query, value)} lang={value} hrefLang={value}
            aria-current={lang === value ? "true" : undefined}
            className={`${infoLink} ${lang === value ? "bg-[#173e30] font-bold text-white" : "border border-[#b9c3b8]"}`}>
            {lang === value && <span aria-hidden="true" className="mr-2">✓</span>}{value === "ja" ? "日本語" : "English"}
          </Link>)}
        </nav>
        <nav aria-label={lang === "en" ? "Park information" : "公園情報"} className="mt-3 flex flex-wrap gap-1">
          {(["park", "news", "events"] as const).map((route) => <Link key={route} className={infoLink} href={languageHref(`/${route}`, query, lang)} aria-current={path === `/${route}` ? "page" : undefined}>{text[route]}</Link>)}
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-9 sm:px-8 sm:py-12">{children}</main>
    {lang === "en" && <footer className="mx-auto max-w-5xl px-4 pb-8 text-sm leading-7">{text.fallback}</footer>}
  </div>;
}
