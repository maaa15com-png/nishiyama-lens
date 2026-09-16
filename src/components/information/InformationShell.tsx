import GlobalHeader from "@/components/navigation/GlobalHeader";
import { localizedText, type Lang, type Query } from "@/lib/language";
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
    <GlobalHeader key={path + JSON.stringify(query)} path={path} lang={lang} query={query} />
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-9 sm:px-8 sm:py-12">{children}</main>
    {lang === "en" && <footer className="mx-auto max-w-5xl px-4 pb-8 text-sm leading-7">{text.fallback}</footer>}
  </div>;
}
