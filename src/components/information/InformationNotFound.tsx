"use client";

import { usePathname, useSearchParams } from "next/navigation";
import InformationShell, { infoLink } from "./InformationShell";
import Link from "next/link";
import { languageHref, parseLang, type Query } from "@/lib/language";

// not-found does not receive searchParams. Only this fallback reads the URL on the client.
export default function InformationNotFound() {
  const params = useSearchParams();
  const path = usePathname();
  const query: Query = {};
  for (const key of new Set(params.keys())) query[key] = params.getAll(key).length > 1 ? params.getAll(key) : params.get(key) ?? undefined;
  const lang = parseLang(query.lang);
  const list = path.startsWith("/events/") ? "/events" : "/news";
  return <InformationShell lang={lang} query={query} path={path}>
    <h1 className="text-2xl font-medium">{lang === "en" ? "Page not found" : "ページが見つかりません"}</h1>
    <p>{lang === "en" ? "This information is not available." : "この情報は現在公開されていません。"}</p>
    <Link className={infoLink} href={languageHref(list, query, lang)}>{lang === "en" ? "Back to the list" : "一覧へ戻る"}</Link>
  </InformationShell>;
}
