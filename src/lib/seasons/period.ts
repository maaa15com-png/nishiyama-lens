export type SeasonPeriod = {
  startMonth: number; startDay: number | null;
  endMonth: number; endDay: number | null;
};

// Calendar display window in Japan, not a flowering/foliage forecast.
// Null days mean the first/last day of that month. Both endpoints are inclusive.
export function isSeasonActive(season: SeasonPeriod, now = new Date()): boolean {
  if (!Number.isFinite(now.getTime())) return false;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const part = (name: string) => Number(parts.find((p) => p.type === name)?.value);
  const year = part("year"), month = part("month"), day = part("day");
  const { startMonth, endMonth } = season;
  if (![startMonth, endMonth].every((m) => Number.isInteger(m) && m >= 1 && m <= 12)) return false;
  const daysInMonth = (m: number) => new Date(Date.UTC(year, m, 0)).getUTCDate();
  const startDay = season.startDay ?? 1;
  const endDay = season.endDay ?? daysInMonth(endMonth);
  if (!Number.isInteger(startDay) || startDay < 1 || startDay > daysInMonth(startMonth)
    || !Number.isInteger(endDay) || endDay < 1 || endDay > daysInMonth(endMonth)) return false;
  const start = startMonth * 100 + startDay, end = endMonth * 100 + endDay;
  const current = month * 100 + day;
  if (startMonth === endMonth && startDay > endDay) return false;
  return start <= end ? start <= current && current <= end : current >= start || current <= end;
}
