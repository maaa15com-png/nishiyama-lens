import "server-only";
import { db } from "./db";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";

// Match the existing lowercase, hyphen-separated slugs and the schema limit.
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getSpotDetail(slug: string) {
  if (slug.length > 150 || !slugPattern.test(slug)) return null;

  return db.orm.public.Spot
    .where({ slug: slug as Varchar<150>, isPublished: true })
    .select("id", "name", "slug", "category", "description", "latitude", "longitude",
      "strollerAccessible", "hasToilet", "hasRestArea", "externalUrl", "isPublished")
    .include("redPandas", (pandas) => pandas
      .where({ isPublished: true })
      .select("id", "name", "nameEn", "sex", "birthDate", "description")
      .orderBy([(panda) => panda.name.asc(), (panda) => panda.id.asc()]))
    .first();
}
