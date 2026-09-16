export type Lang = "ja" | "en";
export type Query = Record<string, string | string[] | undefined>;

export function parseLang(value: Query[string]): Lang {
  return value === "en" ? "en" : "ja";
}

export function localizedText(ja: string | null, en: string | null, lang: Lang) {
  return lang === "en" && en?.trim()
    ? { text: en, lang: "en" as const }
    : { text: ja ?? "", lang: "ja" as const };
}

// Preserve repeated and unrelated query parameters; only replace lang.
export function languageHref(path: string, query: Query, lang: Lang): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key === "lang" || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) params.append(key, item);
  }
  params.set("lang", lang);
  return `${path}?${params.toString()}`;
}

export function formatDate(epochMilliseconds: number, lang: Lang, withTime = false) {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "ja-JP", {
    timeZone: "Asia/Tokyo", dateStyle: "long", ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(new Date(epochMilliseconds));
}

// Works with URLSearchParams and Next's read-only search params.
export function queryFromParams(params: Pick<URLSearchParams, "keys" | "getAll">): Query {
  const query: Query = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }
  return query;
}

// Internal navigation: keep context, but let the destination set its own IDs/answers.
export function navigationHref(href: string, query: Query): string {
  const [target, hash] = href.split("#", 2);
  const [path, search = ""] = target.split("?", 2);
  const merged = { ...query, ...queryFromParams(new URLSearchParams(search)) };
  return languageHref(path, merged, parseLang(query.lang)) + (hash === undefined ? "" : "#" + hash);
}
