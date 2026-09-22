import type postgres from "@prisma/orm-postgres/runtime";
import type { Numeric, Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Contract } from "./schema.d.ts";

// Reviewed 2026-09-22. Evidence and deferred candidates: docs/issue-48-spots.md.
// Fixed IDs belong to this seed; never regenerate them on reruns.
const facilities = "https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/";
export const officialSpotSeeds = [
  {
    id: "54f04fc5-faf5-4fb5-b01c-f721c41198ad",
    name: "西山橋",
    slug: "nishiyama-bridge",
    category: "OTHER",
    description: "西山公園の東西の山を結ぶ橋です。",
    // Official named marker: 35.9512552,136.1832167 (not viewport center).
    // https://www.city.sabae.fukui.jp/kanko_sangyo/kankoshisetsu_meisho/sabaehyakkei/sabae-hyakkei-07.html
    latitude: "35.951255",
    longitude: "136.183217",
    imageUrl: facilities + "Nishiyama-Shisetsu.images/shisetsu5.jpg",
    hasRestArea: null,
    externalUrl: facilities + "Nishiyama-Shisetsu.html",
  },
  {
    id: "7195d224-9c70-4d9d-83f6-89a275ff35bd",
    name: "松堂庵",
    slug: "shodoan",
    category: "REST",
    description: "嚮陽庭園内の休憩所です。茶道体験の呈茶サービスが行われています。開催日程は公式情報をご確認ください。",
    // Official named marker: 35.9507532,136.1842103 (not viewport center).
    // https://www.city.sabae.fukui.jp/kanko_sangyo/kankoshisetsu_meisho/sabaehyakkei/sabae-hyakkei-06.html
    latitude: "35.950753",
    longitude: "136.184210",
    imageUrl: facilities + "Nishiyama-Shisetsu.images/shisetsu11.jpg",
    hasRestArea: true,
    externalUrl: facilities + "Koen0120260420.html",
  },
  {
    id: "d906ef59-b9d6-401d-9844-deba2a40a1e2",
    name: "愛の鐘（展望台広場）",
    slug: "ai-no-kane-observation-deck",
    category: "VIEW",
    description: "西山の山頂に愛の鐘と展望台があり、展望台から鯖江市内を見渡せます。",
    // City walking guide -> public KML, named Point: 西山公園展望台.
    // Source: 35.952253,136.1810642; rounded to the existing Numeric(9,6).
    // https://www.google.com/maps/d/kml?mid=1wrfJ2YneZs_SSFnSpTTmMK4xkcKdzzk&forcekml=1
    latitude: "35.952253",
    longitude: "136.181064",
    imageUrl: null,
    hasRestArea: null,
    externalUrl: facilities + "Nishiyama-Shisetsu.html",
  },
  {
    "id": "be4553c3-fda6-446f-8488-16a5a114b6fe",
    "name": "西山公園の桜",
    "nameEn": "Cherry Blossoms at Nishiyama Park",
    "slug": "nishiyama-cherry-blossoms",
    "category": "FLOWER",
    "description": "春の西山公園を彩る桜。園内には約1,000本の桜が咲き、花を眺めながら散策を楽しめます。",
    "latitude": "35.950872",
    "longitude": "136.182828",
    "imageUrl": null,
    "hasRestArea": null,
    "externalUrl": "https://www.fuku-e.com/spot/detail_1537.html"
  },
  {
    "id": "d2436ba8-ccef-4158-a2a6-cbcd69195115",
    "name": "西山公園のツツジ",
    "nameEn": "Azaleas of Nishiyama Park",
    "slug": "nishiyama-azaleas",
    "category": "FLOWER",
    "description": "約5万本のツツジが咲く西山公園。春には園内を彩る花を楽しめ、つつじまつりでも賑わいます。",
    "latitude": "35.950982",
    "longitude": "136.181685",
    "imageUrl": null,
    "hasRestArea": null,
    "externalUrl": "https://www.fuku-e.com/spot/detail_1536.html"
  },
  {
    "id": "edd5befa-d48b-4f8e-992d-df26e7b5b281",
    "name": "西山公園の紅葉",
    "nameEn": "Autumn Foliage at Nishiyama Park",
    "slug": "nishiyama-autumn-leaves",
    "category": "FLOWER",
    "description": "約1,600本のもみじが植えられた西山公園。秋には赤く色づく園内を散策しながら紅葉を楽しめます。",
    "latitude": "35.951793",
    "longitude": "136.182227",
    "imageUrl": null,
    "hasRestArea": null,
    "externalUrl": "https://www.fuku-e.com/spot/detail_1538.html"
  },
] as const;

type Database = ReturnType<typeof postgres<Contract>>;

// Separate from the legacy seed, whose upserts update existing Course/Lens/etc.
// This transaction only inserts new Spot rows. Existing IDs and content win.
export async function seedOfficialSpots(db: Database) {
  return db.transaction(async (tx) => {
    let inserted = 0;
    for (const seed of officialSpotSeeds) {
      const slug = seed.slug as Varchar<150>;
      const bySlug = await tx.orm.public.Spot.where({ slug }).first();
      const byId = await tx.orm.public.Spot.where({ id: seed.id }).first();
      if (byId && byId.slug !== slug) {
        throw new Error("Official Spot seed ID collision: " + seed.id);
      }
      if (bySlug) continue;
      await tx.orm.public.Spot.create({
        ...seed,
        name: seed.name as Varchar<150>,
        slug,
        latitude: seed.latitude as Numeric<9, 6>,
        longitude: seed.longitude as Numeric<9, 6>,
        nameEn: "nameEn" in seed ? seed.nameEn as Varchar<150> : null,
        descriptionEn: null,
        stayMinutes: null,
        feeText: null,
        feeTextEn: null,
        strollerAccessible: null,
        hasToilet: null,
        openingHours: null,
        isPublished: true,
      });
      inserted++;
    }
    return { inserted, skipped: officialSpotSeeds.length - inserted };
  });
}
