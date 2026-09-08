import "temporal-polyfill/full/global";
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
    // 鯖江市公式「鯖江市西山動物園」アクセスページの地図座標。
    latitude: numeric9_6("35.950817"),
    longitude: numeric9_6("136.179092"),
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
    // 福井県オープンデータ「西山公園（冒険の森）」の地点座標。
    latitude: numeric9_6("35.951945"),
    longitude: numeric9_6("136.183205"),
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
      todaysFind: todaysFinds.length,
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
