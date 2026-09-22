import type postgres from "@prisma/orm-postgres/runtime";
import type { Numeric, Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Contract } from "./schema.d.ts";

// Reviewed 2026-09-23. Fixed UUIDs must never be regenerated on reruns.
// Approved source values and access restrictions: docs/issue-48-nearby-spots.md.
export const officialNearbySpotSeeds = [
  {
    "id": "97f6f7de-4b22-4df4-a50f-c9839df231f1",
    "name": "地蔵橋",
    "slug": "jizo-bridge",
    "nameEn": "Jizō Bridge",
    "latitude": "35.950064",
    "longitude": "136.185587",
    "externalUrl": "https://www.fuku-e.com/spot/detail_1030.html",
    "description": "旧北陸道沿いで人々の往来を支えた橋。地蔵にまつわる伝承が残る史跡です。"
  },
  {
    "id": "118036b6-f155-4c38-8aee-eab8bd4074e4",
    "name": "本山誠照寺",
    "slug": "honzan-jyosyoji",
    "nameEn": "Jyosyoji Temple",
    "latitude": "35.947063",
    "longitude": "136.184255",
    "externalUrl": "https://www.jyosyoji.org/",
    "description": "真宗誠照寺派の本山。御影堂や四足門などがあり、鯖江の歴史に触れられる寺院です。"
  },
  {
    "id": "99d58837-7d39-4b0a-a042-3bd0648170e9",
    "name": "萬慶寺",
    "slug": "mankeiji-temple",
    "nameEn": "Mankei-ji Temple",
    "latitude": "35.941533",
    "longitude": "136.184958",
    "externalUrl": "https://www.fuku-e.com/spot/detail_1100.html",
    "description": "鯖江藩主・間部家の菩提寺で、曹洞宗の寺院です。"
  },
  {
    "id": "ea625a39-c984-4580-978c-c5f0d1a87e63",
    "name": "恵美写真館洋館・表門",
    "slug": "emi-photo-studio",
    "nameEn": null,
    "latitude": "35.946702",
    "longitude": "136.186172",
    "externalUrl": "https://www.city.sabae.fukui.jp/kanko/sightseeing/emisyasinkan.html",
    "description": "明治期の洋館と表門が残る登録有形文化財。内部非公開で、見学は写真館への事前問い合わせが必要です。"
  },
  {
    "id": "1a6856c2-9d21-4998-b77c-5845070be2fc",
    "name": "めがねミュージアム",
    "slug": "megane-museum",
    "nameEn": "Megane Museum",
    "latitude": "35.942623",
    "longitude": "136.198832",
    "externalUrl": "https://www.megane.gr.jp/museum/",
    "description": "めがねの歴史を学ぶ博物館、ショップ、体験工房などを備える施設です。"
  },
  {
    "id": "e3e258c0-0a6c-4ca6-a9e7-7431df50d399",
    "name": "王山古墳群",
    "slug": "ozan-kofun-group",
    "nameEn": "Oyama Tumuli",
    "latitude": "35.939827",
    "longitude": "136.185127",
    "externalUrl": "https://www.city.sabae.fukui.jp/kanko/sightseeing/ozankohun.html",
    "description": "弥生時代から古墳時代の墳墓・古墳が残り、史跡公園として散策できる場所です。"
  },
  {
    "id": "2755a9c3-8bc5-4098-af3d-3bf9744ef6a3",
    "name": "兜山古墳",
    "slug": "kabutoyama-kofun",
    "nameEn": "Kabutoyama Kofun",
    "latitude": "35.974432",
    "longitude": "136.183388",
    "externalUrl": "https://www.city.sabae.fukui.jp/kosodate_kyoiku/manabenoyakata/bunkazai/sabae_bunkazai/shiseki/kabutoyama-national.html",
    "description": "周囲に濠を持つ二段構造の円墳で、国の史跡に指定されています。"
  }
] as const;

type Database = ReturnType<typeof postgres<Contract>>;

// Additive seed: never run the legacy upserts or create LensNearbySpot links.
export async function seedOfficialNearbySpots(db: Database) {
  return db.transaction(async (tx) => {
    let inserted = 0;
    for (const seed of officialNearbySpotSeeds) {
      const slug = seed.slug as Varchar<150>;
      const bySlug = await tx.orm.public.NearbySpot.where({ slug }).first();
      const byId = await tx.orm.public.NearbySpot.where({ id: seed.id }).first();
      if (byId && byId.slug !== slug) {
        throw new Error("Official NearbySpot seed ID collision: " + seed.id);
      }
      if (bySlug) continue;
      await tx.orm.public.NearbySpot.create({
        ...seed,
        name: seed.name as Varchar<150>,
        nameEn: seed.nameEn as Varchar<150> | null,
        slug,
        category: "SIGHTSEEING",
        latitude: seed.latitude as Numeric<9, 6>,
        longitude: seed.longitude as Numeric<9, 6>,
        descriptionEn: null,
        imageUrl: null,
        address: null,
        addressEn: null,
        openingHours: null,
        isPublished: true,
      });
      inserted++;
    }
    return { inserted, skipped: officialNearbySpotSeeds.length - inserted };
  });
}
