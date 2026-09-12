import "server-only";
import { db } from "./db";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Publication = { publishedAt: { epochMilliseconds: number } | null };
// Remove scheduled news on the server before returning it to a page.
function isReleased(item: Publication, at: Date) {
  return Number.isFinite(at.getTime()) && (item.publishedAt === null || item.publishedAt.epochMilliseconds <= at.getTime());
}
export async function getNews(at = new Date()) {
  const rows = await db.orm.public.News.where({ isPublished: true })
    .select("id", "title", "titleEn", "publishedAt")
    .orderBy((news) => news.id.asc()).all();
  // Newest first, undated last; preserve ID order for ties.
  return rows.filter((row) => isReleased(row, at)).sort((a, b) => {
    if (a.publishedAt === null) return b.publishedAt === null ? 0 : 1;
    if (b.publishedAt === null) return -1;
    return b.publishedAt.epochMilliseconds - a.publishedAt.epochMilliseconds;
  });
}
export async function getNewsDetail(id: string, at = new Date()) {
  if (!uuidPattern.test(id)) return null;
  const item = await db.orm.public.News.where({ id, isPublished: true })
    .select("id", "title", "titleEn", "body", "bodyEn", "publishedAt").first();
  return item && isReleased(item, at) ? item : null;
}
export async function getEvents() {
  return db.orm.public.Event.where({ isPublished: true })
    .select("id", "title", "titleEn", "startAt", "endAt", "location", "locationEn")
    .orderBy([(event) => event.startAt.asc(), (event) => event.id.asc()]).all();
}
export async function getEventDetail(id: string) {
  if (!uuidPattern.test(id)) return null;
  return db.orm.public.Event.where({ id, isPublished: true })
    .select("id", "title", "titleEn", "description", "descriptionEn", "startAt", "endAt", "location", "locationEn", "externalUrl").first();
}
export async function getParkInformation() {
  const [spots, seasons] = await Promise.all([
    db.orm.public.Spot.where({ isPublished: true })
      .select("id", "slug", "name", "nameEn", "description", "descriptionEn")
      .orderBy([(spot) => spot.name.asc(), (spot) => spot.id.asc()]).all(),
    db.orm.public.Season.where({ isPublished: true })
      .select("id", "name", "nameEn", "description", "descriptionEn", "seasonGroup")
      .orderBy([(season) => season.startMonth.asc(), (season) => season.id.asc()]).all(),
  ]);
  // Known facilities only. Seasonal highlights and nearby facilities are separate concepts.
  const facilities = spots.filter((spot) => ["nishiyama-zoo", "adventure-forest", "michi-no-eki-nishiyama"].includes(spot.slug));
  return { facilities, seasons: seasons.filter((season) => ["SPRING", "AUTUMN"].includes(season.seasonGroup)) };
}
