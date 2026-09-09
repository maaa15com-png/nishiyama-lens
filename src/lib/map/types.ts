import type { FieldOutputTypes } from "../../../prisma/schema.d.ts";

export type MapSpot = {
  id: string;
  name: string;
  sortOrder: number;
  latitude: number;
  longitude: number;
  category: FieldOutputTypes["public"]["Spot"]["category"];
};
