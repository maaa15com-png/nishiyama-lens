import type { FieldOutputTypes } from "../../../prisma/schema.d.ts";

export const spotCategoryLabels: Record<
  FieldOutputTypes["public"]["Spot"]["category"],
  string
> = {
  ZOO: "動物",
  PLAYGROUND: "遊び",
  GARDEN: "庭園",
  FLOWER: "花・自然",
  VIEW: "景色",
  REST: "休憩",
  FOOD: "食事",
  OTHER: "その他",
};
