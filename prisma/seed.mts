import "temporal-polyfill/full/global";
import { Temporal } from "temporal-polyfill";
import "dotenv/config";

import { randomUUID } from "node:crypto";
import postgres from "@prisma/orm-postgres/runtime";
import type {
  Numeric,
  Varchar,
} from "@prisma/orm-postgres/target/codec-types";
import type { Contract } from "./schema.d.ts";
import contractJson from "./schema.json" with { type: "json" };

const varchar100 = (value: string) => value as Varchar<100>;
const varchar150 = (value: string) => value as Varchar<150>;
const varchar255 = (value: string) => value as Varchar<255>;
const numeric9_6 = (value: string) => value as Numeric<9, 6>;

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the seed.");
}

const db = postgres<Contract>({ contractJson, url: databaseUrl });

const spotSeeds = [
  {
    name: varchar150("西山動物園"),
    nameEn: varchar150("Nishiyama Zoo"),
    slug: varchar150("nishiyama-zoo"),
    category: "ZOO" as const,
    description:
      "レッサーパンダを中心に動物たちに会える、西山公園を代表するスポット。",
    descriptionEn:
      "A signature spot in Nishiyama Park where visitors can meet red pandas and other animals.",
    // 鯖江市公式アクセスページの埋め込み地図が示す施設代表点（表示中心ではない）。
    latitude: numeric9_6("35.950693"),
    longitude: numeric9_6("136.180883"),
    imageUrl: null,
    stayMinutes: 30,
    feeText: varchar100("無料"),
    feeTextEn: varchar100("Free"),
    strollerAccessible: true,
    hasToilet: true,
    hasRestArea: true,
    openingHours: null,
    externalUrl:
      "https://www.city.sabae.fukui.jp/nishiyama_zoo/info/access.html",
    isPublished: true,
  },
  {
    name: varchar150("冒険の森"),
    nameEn: varchar150("Adventure Forest"),
    slug: varchar150("adventure-forest"),
    category: "PLAYGROUND" as const,
    description: "子どもが体を動かして遊べる遊具エリア。",
    descriptionEn:
      "A playground area where children can enjoy active outdoor play.",
    // 鯖江市公式「鯖江百景ボリューム7」のパンダらんど代表点。
    // https://www.city.sabae.fukui.jp/kanko_sangyo/kankoshisetsu_meisho/sabaehyakkei/sabae-hyakkei-07.html
    latitude: numeric9_6("35.951933"),
    longitude: numeric9_6("136.182763"),
    imageUrl: null,
    stayMinutes: 40,
    feeText: null,
    feeTextEn: null,
    strollerAccessible: true,
    hasToilet: false,
    hasRestArea: true,
    openingHours: null,
    externalUrl:
      "https://www3.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/Nishiyama-Shisetsu.html",
    isPublished: true,
  },
  {
    name: varchar150("季節の見どころ"),
    nameEn: varchar150("Seasonal Highlight"),
    slug: varchar150("seasonal-highlight"),
    category: "FLOWER" as const,
    description:
      "季節によって、つつじや紅葉など西山公園らしい景色を楽しめるスポット。",
    descriptionEn:
      "A seasonal spot to enjoy flowers, autumn leaves, and other changing scenery in Nishiyama Park.",
    // 固定施設ではないため、鯖江市公式「西山公園」の代表座標を使用。
    latitude: numeric9_6("35.949674"),
    longitude: numeric9_6("136.181872"),
    imageUrl: null,
    stayMinutes: 20,
    feeText: null,
    feeTextEn: null,
    strollerAccessible: true,
    hasToilet: null,
    hasRestArea: true,
    openingHours: null,
    externalUrl:
      "https://www.city.sabae.fukui.jp/kanko/playing/nishiyama.html",
    isPublished: true,
  },
  {
    name: varchar150("道の駅 西山公園"),
    nameEn: varchar150("Michi-no-Eki Nishiyama Park"),
    slug: varchar150("michi-no-eki-nishiyama"),
    category: "FOOD" as const,
    description: "食事や休憩、お土産選びに利用できる西山公園隣接施設。",
    descriptionEn:
      "A roadside station next to Nishiyama Park for food, rest, and souvenirs.",
    // 鯖江市公式「道の駅 西山公園」ページの地図座標。
    latitude: numeric9_6("35.948699"),
    longitude: numeric9_6("136.180722"),
    imageUrl: null,
    stayMinutes: 30,
    feeText: null,
    feeTextEn: null,
    strollerAccessible: true,
    hasToilet: true,
    hasRestArea: true,
    openingHours: null,
    externalUrl:
      "https://www.city.sabae.fukui.jp/about_city/shinoshokai/kokyoshisetsu/michinoeki.html",
    isPublished: true,
  },
] as const;

// 鯖江市オープンデータ「レッサーパンダ飼育個体情報」（2025-07-09更新、CC BY 2.1 JP）。
// 提供Excel Sheet1の黄色（凡例: 現在西山動物園で飼育中）から、2026-09-10に公式情報で照合。
// 原文の性格・特徴をdescriptionへ結合。ふりがなメタデータは本文に含めない。
// https://www.city.sabae.fukui.jp/nishiyama_zoo/panda/redpanda.html
// ミンファは公式の2026-05-21死亡発表により除外（一覧ページに残っていても採用しない）。
// https://www.city.sabae.fukui.jp/nishiyama_zoo/news/index.html
// ニーコはExcelの移動欄が空でも2025-06-20浜松移動の公式告知があるため除外。
// https://www.city.sabae.fukui.jp/nishiyama_zoo/news/2025_news.html
// ティアラのExcel移動欄2016-03-16は公式個体紹介では西山への来園日。黄色と公式を優先。
// https://www.city.sabae.fukui.jp/nishiyama_zoo/panda/redpanda_tiara.html
// CSVは死亡・移動前の情報を含むため採用しない。Excel外のアケビ・2026年出生仔は対象外。
// IDはこのSeedが所有する固定UUID。再生成しない（name等には一意制約がない）。
const redPandaSourceUrl =
  "https://ckan.odp.jig.jp/dataset/https-ckan-odp-jig-jp-dataset-18207_redpandashiikukotai/resource/ccc95c6d-e3d0-4dd6-99fb-163704f5ab33";
const redPandaSeeds = [
  {
    "id": "089d2c47-220f-486d-bdcc-65bc3fa85137",
    "name": "ライト",
    "sex": "オス",
    "birthDate": "2013-07-18",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：慎重\n特徴：人参が好き　体色は黒い部分が多い　かのこと相性が良い",
    "fatherName": "ヤンヤン",
    "motherName": "キラリ"
  },
  {
    "id": "a641f48c-b17f-4874-9e15-52ca2a3b70f7",
    "name": "たいよう",
    "sex": "オス",
    "birthDate": "2013-06-15",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：穏やか　くいしんぼう\n特徴：人参が好き　食べるのが早い　運動神経は鈍い　長い手足　2024年の西山動物園推しパン総選挙では5位に選ばれた。",
    "fatherName": null,
    "motherName": null
  },
  {
    "id": "633829b5-de11-41b4-a16a-6dde2dbc6681",
    "name": "モッチー",
    "sex": "オス",
    "birthDate": "2015-06-24",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：おっとり　好戦的　気が強い\n特徴：ベビーフェイス　幼児体型　人参が嫌い　足裏マーキング　2024年の西山動物園推しパン総選挙では首位に選ばれた。",
    "fatherName": "ヤンヤン",
    "motherName": "キラリ"
  },
  {
    "id": "9423fec5-ce54-4948-a5de-b27ceb2776b7",
    "name": "ティアラ",
    "sex": "メス",
    "birthDate": "2015-07-06",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：活発、好奇心旺盛　気が強い\n特徴：運動神経が良い　笹の枝を運んで食べる　ムータンと相性が良い 2024年の西山動物園推しパン総選挙では3位に選ばれた。",
    "fatherName": "ガイア（王子）",
    "motherName": "ミンファ"
  },
  {
    "id": "554d5e3f-16f9-4994-af5c-39813e5b24c6",
    "name": "まつば",
    "sex": "メス",
    "birthDate": "2014-07-17",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：マイペース　子煩悩\n特徴：体色は黒い部分が多い　落葉プールで背泳ぎする　りんごを両手に持って食べる。",
    "fatherName": null,
    "motherName": null
  },
  {
    "id": "d1bb66b5-40e8-42fa-b21e-4493b29bcc14",
    "name": "かのこ",
    "sex": "メス",
    "birthDate": "2016-06-24",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：くいしんぼう　慎重\n特徴：顔の模様の白い部分多い　手足が長い",
    "fatherName": null,
    "motherName": null
  },
  {
    "id": "cfc1e01c-849f-47b5-8fa2-96e80a50042d",
    "name": "かんた",
    "sex": "オス",
    "birthDate": "2018-07-12",
    "description": "鯖江市オープンデータ（2025年7月更新）より。\n性格：穏やか　くいしんぼう　愛嬌がある\n特徴：人参が好き　なんでもよく食べる 2024年の西山動物園推しパン総選挙では4位に選ばれた。",
    "fatherName": null,
    "motherName": null
  }
] as const;

function parentSeedId(name: string | null, childId: string): string | null {
  if (!name) return null;
  const matches = redPandaSeeds.filter((panda) => panda.name === name);
  return matches.length === 1 && matches[0].id !== childId ? matches[0].id : null;
}

const courseSpotSeeds = [
  {
    slug: "nishiyama-zoo",
    sortOrder: 1,
    stayMinutes: 30,
    note: varchar255("まずはレッサーパンダに会いに行こう"),
    noteEn: varchar255("Start by meeting the red pandas."),
  },
  {
    slug: "adventure-forest",
    sortOrder: 2,
    stayMinutes: 40,
    note: varchar255("次は思いきり遊ぼう"),
    noteEn: null,
  },
  {
    slug: "seasonal-highlight",
    sortOrder: 3,
    stayMinutes: 20,
    note: varchar255("今日の季節を見つけよう"),
    noteEn: null,
  },
  {
    slug: "michi-no-eki-nishiyama",
    sortOrder: 4,
    stayMinutes: 30,
    note: varchar255("最後は休憩とごはんタイム"),
    noteEn: null,
  },
] as const;

async function seed() {
  return db.transaction(async (tx) => {
    const lens = await tx.orm.public.Lens.upsert({
      create: {
        id: randomUUID(),
        name: varchar100("FAMILY × PANDA"),
        companion: "SMALL_CHILDREN",
        interest: "PANDA",
        title: varchar150("親子でレッサーパンダを楽しむ旅"),
        titleEn: varchar150("A Red Panda Adventure for Families"),
        description:
          "小さな子どもと一緒に、レッサーパンダや遊び場を中心に西山公園を楽しむLENS。",
        descriptionEn:
          "A family-friendly way to explore Nishiyama Park with red pandas and play areas.",
        imageUrl: null,
        isPublished: true,
      },
      update: {
        name: varchar100("FAMILY × PANDA"),
        title: varchar150("親子でレッサーパンダを楽しむ旅"),
        titleEn: varchar150("A Red Panda Adventure for Families"),
        description:
          "小さな子どもと一緒に、レッサーパンダや遊び場を中心に西山公園を楽しむLENS。",
        descriptionEn:
          "A family-friendly way to explore Nishiyama Park with red pandas and play areas.",
        imageUrl: null,
        isPublished: true,
      },
      conflictOn: {
        companion: "SMALL_CHILDREN",
        interest: "PANDA",
      },
    });

    const course = await tx.orm.public.Course.upsert({
      create: {
        id: randomUUID(),
        lensId: lens.id,
        name: varchar150("親子で楽しむ西山公園2〜3時間コース"),
        nameEn: varchar150("2–3 Hour Family Course"),
        durationType: "HOURS_2_3",
        durationMinutes: 150,
        description:
          "西山動物園、冒険の森、季節の見どころ、道の駅西山公園を巡る親子向けコース。",
        descriptionEn:
          "A family course visiting Nishiyama Zoo, the adventure playground, a seasonal highlight, and Michi-no-Eki Nishiyama Park.",
        imageUrl: null,
        isPublished: true,
      },
      update: {
        name: varchar150("親子で楽しむ西山公園2〜3時間コース"),
        nameEn: varchar150("2–3 Hour Family Course"),
        durationMinutes: 150,
        description:
          "西山動物園、冒険の森、季節の見どころ、道の駅西山公園を巡る親子向けコース。",
        descriptionEn:
          "A family course visiting Nishiyama Zoo, the adventure playground, a seasonal highlight, and Michi-no-Eki Nishiyama Park.",
        imageUrl: null,
        isPublished: true,
      },
      conflictOn: { lensId: lens.id, durationType: "HOURS_2_3" },
    });

    const spots = new Map<string, { id: string }>();

    for (const spotSeed of spotSeeds) {
      const spot = await tx.orm.public.Spot.upsert({
        create: { id: randomUUID(), ...spotSeed },
        update: spotSeed,
        conflictOn: { slug: spotSeed.slug },
      });
      spots.set(spotSeed.slug, spot);
    }

    for (const courseSpotSeed of courseSpotSeeds) {
      const spot = spots.get(courseSpotSeed.slug);
      if (!spot) {
        throw new Error(`Seed spot was not created: ${courseSpotSeed.slug}`);
      }
      await tx.orm.public.CourseSpot.upsert({
        create: {
          id: randomUUID(),
          courseId: course.id,
          spotId: spot.id,
          sortOrder: courseSpotSeed.sortOrder,
          stayMinutes: courseSpotSeed.stayMinutes,
          walkMinutesFromPrevious: null,
          note: courseSpotSeed.note,
          noteEn: courseSpotSeed.noteEn,
        },
        update: {
          spotId: spot.id,
          stayMinutes: courseSpotSeed.stayMinutes,
          walkMinutesFromPrevious: null,
          note: courseSpotSeed.note,
          noteEn: courseSpotSeed.noteEn,
        },
        conflictOn: {
          courseId: course.id,
          sortOrder: courseSpotSeed.sortOrder,
        },
      });
    }

    const zoo = spots.get("nishiyama-zoo");
    if (!zoo) throw new Error("Nishiyama Zoo was not created.");

    // Check for independently registered copies instead of silently duplicating or merging them.
    const existingPandas = await tx.orm.public.RedPanda.where({ spotId: zoo.id }).all();
    for (const panda of redPandaSeeds) {
      if (existingPandas.some((existing) => existing.name === panda.name
        && existing.birthDate?.toString() === panda.birthDate && existing.id !== panda.id)) {
        throw new Error(`Red panda already exists with a different ID: ${panda.name}`);
      }
      const data = {
        spotId: zoo.id,
        name: varchar100(panda.name),
        nameEn: null,
        sex: panda.sex as Varchar<20>,
        birthDate: Temporal.PlainDate.from(panda.birthDate),
        description: panda.description,
        descriptionEn: null,
        imageUrl: null,
        sourceUrl: redPandaSourceUrl,
        isPublished: true,
      };
      await tx.orm.public.RedPanda.upsert({
        create: { id: panda.id, ...data, fatherId: null, motherId: null },
        update: data,
        conflictOn: { id: panda.id },
      });
    }
    // Resolve parents only within the confirmed target set, after all target IDs exist.
    // For this import all parents are unknown or outside the target set, so both IDs remain null.
    for (const panda of redPandaSeeds) {
      await tx.orm.public.RedPanda.where({ id: panda.id }).update({
        fatherId: parentSeedId(panda.fatherName, panda.id),
        motherId: parentSeedId(panda.motherName, panda.id),
      });
    }

    const todaysFindMatches = await tx.orm.public.TodaysFind
      .where({
        lensId: lens.id,
        spotId: zoo.id,
        title: varchar150("お気に入りのレッサーパンダを見つけよう"),
      })
      .all();
    if (todaysFindMatches.length > 1) {
      throw new Error("Duplicate Today's Find seed records already exist.");
    }

    const todaysFindData = {
      titleEn: varchar150("Find Your Favorite Red Panda"),
      description:
        "いろいろなレッサーパンダを見て、今日のお気に入りを見つけてみよう。",
      descriptionEn:
        "Meet the red pandas and find your favorite one today.",
      seasonId: null,
      effectType: "NONE" as const,
      startAt: null,
      endAt: null,
      isPublished: true,
    };

    if (todaysFindMatches[0]) {
      await tx.orm.public.TodaysFind
        .where({ id: todaysFindMatches[0].id })
        .update(todaysFindData);
    } else {
      await tx.orm.public.TodaysFind.create({
        id: randomUUID(),
        title: varchar150("お気に入りのレッサーパンダを見つけよう"),
        lensId: lens.id,
        spotId: zoo.id,
        ...todaysFindData,
      });
    }

    // Issue #37: user-approved calendar display windows, not peak predictions.
    // Source: 鯖江市公式・西山公園特集 / さばえつつじまつり / もみじライトアップ案内。
    // May and November are display categories; no exact flowering dates are inferred.
    const seasonalSpot = spots.get("seasonal-highlight");
    if (!seasonalSpot) throw new Error("Seasonal highlight Spot is required.");
    const seasonSeeds = [
      { slug: "spring-azaleas", name: "春のツツジ", seasonGroup: "SPRING" as const, month: 5,
        description: "春の西山公園では、約5万株のつつじが公園を彩ります。毎年5月上旬にはつつじまつりも開かれます。",
        title: "お気に入りのツツジを見つけよう", findDescription: "春の西山公園で、心に留まったつつじを探してみよう。", effectType: "FLOWER" as const },
      { slug: "autumn-leaves", name: "秋の紅葉", seasonGroup: "AUTUMN" as const, month: 11,
        description: "西山公園には1600本を越えるもみじがあり、秋深まる頃には色とりどりの紅葉を楽しめます。",
        title: "お気に入りの紅葉を見つけよう", findDescription: "秋の西山公園で、お気に入りの葉の色や形を探してみよう。", effectType: "AUTUMN" as const },
    ];
    for (const item of seasonSeeds) {
      const data = { name: varchar100(item.name), nameEn: null, seasonGroup: item.seasonGroup,
        startMonth: item.month, endMonth: item.month, startDay: null, endDay: null,
        description: item.description, descriptionEn: null, imageUrl: null, isPublished: true };
      const season = await tx.orm.public.Season.upsert({
        create: { id: randomUUID(), slug: varchar100(item.slug), ...data },
        update: data, conflictOn: { slug: varchar100(item.slug) },
      });
      const matches = await tx.orm.public.TodaysFind.where({ seasonId: season.id, spotId: seasonalSpot.id, lensId: null, title: varchar150(item.title) }).all();
      if (matches.length > 1) throw new Error("Duplicate seasonal Find seed records already exist.");
      const findData = { titleEn: null, description: item.findDescription, descriptionEn: null,
        seasonId: season.id, spotId: seasonalSpot.id, lensId: null, effectType: item.effectType,
        startAt: null, endAt: null, isPublished: true };
      if (matches[0]) await tx.orm.public.TodaysFind.where({ id: matches[0].id }).update(findData);
      else await tx.orm.public.TodaysFind.create({ id: randomUUID(), title: varchar150(item.title), ...findData });
    }

    const nearbySpot = await tx.orm.public.NearbySpot.upsert({
      create: {
        id: randomUUID(),
        name: varchar150("鯖江市まなべの館"),
        nameEn: varchar150("Sabae City Manabe Museum"),
        slug: varchar150("sabae-manabe-museum"),
        category: "SIGHTSEEING",
        description:
          "西山公園の一角にあり、鯖江の芸術・歴史・文化を学べる総合博物館。",
        descriptionEn:
          "A museum in Nishiyama Park where visitors can learn about Sabae's art, history, and culture.",
        // 鯖江市公式「まなべの館」ページの地図座標。
        latitude: numeric9_6("35.953517"),
        longitude: numeric9_6("136.184363"),
        address: varchar255("福井県鯖江市長泉寺町1丁目9番20号"),
        addressEn: null,
        imageUrl: null,
        openingHours: varchar255("9:00〜17:00（入館は16:30まで）"),
        externalUrl:
          "https://www.city.sabae.fukui.jp/kosodate_kyoiku/manabenoyakata/manabenoyakata.html",
        isPublished: true,
      },
      update: {
        name: varchar150("鯖江市まなべの館"),
        nameEn: varchar150("Sabae City Manabe Museum"),
        category: "SIGHTSEEING",
        description:
          "西山公園の一角にあり、鯖江の芸術・歴史・文化を学べる総合博物館。",
        descriptionEn:
          "A museum in Nishiyama Park where visitors can learn about Sabae's art, history, and culture.",
        latitude: numeric9_6("35.953517"),
        longitude: numeric9_6("136.184363"),
        address: varchar255("福井県鯖江市長泉寺町1丁目9番20号"),
        addressEn: null,
        imageUrl: null,
        openingHours: varchar255("9:00〜17:00（入館は16:30まで）"),
        externalUrl:
          "https://www.city.sabae.fukui.jp/kosodate_kyoiku/manabenoyakata/manabenoyakata.html",
        isPublished: true,
      },
      conflictOn: { slug: varchar150("sabae-manabe-museum") },
    });

    await tx.orm.public.LensNearbySpot.upsert({
      create: {
        id: randomUUID(),
        lensId: lens.id,
        nearbySpotId: nearbySpot.id,
        priority: 1,
        recommendationReason: varchar255(
          "親子で鯖江の文化や歴史にも触れられるため。",
        ),
        recommendationReasonEn: varchar255(
          "Families can also explore Sabae's culture and history.",
        ),
      },
      update: {
        priority: 1,
        recommendationReason: varchar255(
          "親子で鯖江の文化や歴史にも触れられるため。",
        ),
        recommendationReasonEn: varchar255(
          "Families can also explore Sabae's culture and history.",
        ),
      },
      conflictOn: { lensId: lens.id, nearbySpotId: nearbySpot.id },
    });

    return {
      lensId: lens.id,
      courseId: course.id,
      zooId: zoo.id,
      nearbySpotId: nearbySpot.id,
    };
  });
}

async function verify(ids: Awaited<ReturnType<typeof seed>>) {
  const lenses = await db.orm.public.Lens
    .where({ companion: "SMALL_CHILDREN", interest: "PANDA" })
    .all();
  const courses = await db.orm.public.Course
    .where({ lensId: ids.lensId, durationType: "HOURS_2_3" })
    .all();
  const spots = await db.orm.public.Spot.all();
  const seededSpots = spots.filter((spot) =>
    spotSeeds.some((seedSpot) => seedSpot.slug === spot.slug),
  );
  const courseSpots = await db.orm.public.CourseSpot
    .where({ courseId: ids.courseId })
    .all();
  const todaysFinds = await db.orm.public.TodaysFind
    .where({
      lensId: ids.lensId,
      spotId: ids.zooId,
      title: varchar150("お気に入りのレッサーパンダを見つけよう"),
    })
    .all();
  const nearbySpots = await db.orm.public.NearbySpot
    .where({ slug: varchar150("sabae-manabe-museum") })
    .all();
  const lensNearbySpots = await db.orm.public.LensNearbySpot
    .where({ lensId: ids.lensId, nearbySpotId: ids.nearbySpotId })
    .all();
  const redPandas = await db.orm.public.RedPanda.all();
  const allFinds = await db.orm.public.TodaysFind.all();
  const seasons = (await db.orm.public.Season.all()).filter((season) =>
    ["spring-azaleas", "autumn-leaves"].includes(season.slug));
  const seasonalFinds = allFinds.filter((find) => seasons.some((season) => season.id === find.seasonId));

  const orderedCourseSpots = [...courseSpots].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const expectedSpotIds = courseSpotSeeds.map((courseSpotSeed) => {
    const spot = seededSpots.find(
      (candidate) => candidate.slug === courseSpotSeed.slug,
    );
    if (!spot) throw new Error(`Seeded spot is missing: ${courseSpotSeed.slug}`);
    return spot.id;
  });

  const checks = {
    seasonalData: seasons.length === 2 && seasonalFinds.length === 2 && seasons.every((season) => {
      const spring = season.slug === "spring-azaleas";
      const month = spring ? 5 : 11;
      const find = seasonalFinds.find((candidate) => candidate.seasonId === season.id);
      return season.startMonth === month && season.endMonth === month
        && season.startDay === null && season.endDay === null && season.isPublished
        && season.seasonGroup === (spring ? "SPRING" : "AUTUMN")
        && find?.title === (spring ? "お気に入りのツツジを見つけよう" : "お気に入りの紅葉を見つけよう")
        && find.spotId === seededSpots.find((spot) => spot.slug === "seasonal-highlight")?.id
        && find.lensId === null && find.isPublished && find.startAt === null && find.endAt === null;
    }),
    redPandaSeedData: redPandaSeeds.every((seedPanda) => {
      const matches = redPandas.filter((panda) => panda.id === seedPanda.id);
      const panda = matches[0];
      return matches.length === 1 && panda.spotId === ids.zooId
        && panda.name === seedPanda.name && panda.sex === seedPanda.sex
        && panda.birthDate?.toString() === seedPanda.birthDate
        && panda.description === seedPanda.description && panda.isPublished
        && panda.sourceUrl === redPandaSourceUrl
        && panda.nameEn === null && panda.descriptionEn === null && panda.imageUrl === null
        && panda.fatherId === parentSeedId(seedPanda.fatherName, seedPanda.id)
        && panda.motherId === parentSeedId(seedPanda.motherName, seedPanda.id);
    }),
    oneLens: lenses.length === 1 && lenses[0]?.id === ids.lensId,
    oneCourse: courses.length === 1 && courses[0]?.id === ids.courseId,
    fourSpots: seededSpots.length === 4,
    fourOrderedCourseSpots:
      orderedCourseSpots.length === 4 &&
      orderedCourseSpots.every(
        (courseSpot, index) =>
          courseSpot.sortOrder === index + 1 &&
          courseSpot.spotId === expectedSpotIds[index],
      ),
    oneTodaysFind:
      todaysFinds.length === 1 && todaysFinds[0]?.spotId === ids.zooId,
    oneNearbySpot: nearbySpots.length === 1,
    oneLensNearbySpot: lensNearbySpots.length === 1,
  };

  if (Object.values(checks).some((passed) => !passed)) {
    throw new Error(`Seed verification failed: ${JSON.stringify(checks)}`);
  }

  return {
    counts: {
      lens: lenses.length,
      course: courses.length,
      spot: seededSpots.length,
      courseSpot: courseSpots.length,
      todaysFind: allFinds.length,
      season: seasons.length,
      seasonalFind: seasonalFinds.length,
      nearbySpot: nearbySpots.length,
      lensNearbySpot: lensNearbySpots.length,
      redPanda: redPandas.length,
    },
    courseSpotOrder: orderedCourseSpots.map((courseSpot) => {
      const spot = seededSpots.find(
        (candidate) => candidate.id === courseSpot.spotId,
      );
      return `${courseSpot.sortOrder}: ${spot?.name ?? "unknown"}`;
    }),
    checks,
  };
}

try {
  const ids = await seed();
  const verification = await verify(ids);
  console.log(JSON.stringify(verification, null, 2));
} finally {
  await db.close();
}
