import type { FieldOutputTypes } from "../../../prisma/schema.d.ts";

export const nearbyCategoryLabels: Record<FieldOutputTypes["public"]["NearbySpot"]["category"], string> = {
  CAFE: "カフェ",
  RESTAURANT: "食事",
  KIDS: "子どもと楽しむ",
  SIGHTSEEING: "観光・文化",
  SHOPPING: "買い物",
  RELAX: "くつろぎ",
  OTHER: "その他",
};
