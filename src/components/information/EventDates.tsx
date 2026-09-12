import { formatDate, type Lang } from "@/lib/language";
type Instant = { epochMilliseconds: number; toString(): string };
export default function EventDates({ startAt, endAt, lang }: { startAt: Instant; endAt: Instant | null; lang: Lang }) {
  return <dl className="space-y-2 text-sm leading-7">
    <div><dt>{lang === "en" ? "Starts" : "開始"}</dt><dd><time dateTime={startAt.toString()}>{formatDate(startAt.epochMilliseconds, lang, true)}</time></dd></div>
    {endAt && <div><dt>{lang === "en" ? "Ends" : "終了"}</dt><dd><time dateTime={endAt.toString()}>{formatDate(endAt.epochMilliseconds, lang, true)}</time></dd></div>}
  </dl>;
}
