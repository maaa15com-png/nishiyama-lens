import type { FieldOutputTypes } from "../../../prisma/schema.d.ts";
export type FacilityType = FieldOutputTypes["public"]["ParkFacility"]["type"];
export type MapFacility = {
  id: string; name: string; type: FacilityType;
  latitude: number; longitude: number;
  description: string | null; externalUrl: string | null;
};
export const facilityLabels: Record<FacilityType, string> = { TOILET: "トイレ", PARKING: "駐車場" };
export const facilitySymbols: Record<FacilityType, string> = { TOILET: "🚻", PARKING: "P" };
export const facilityTypes = ["TOILET", "PARKING"] as const;
export { safeExternalUrl as facilityExternalUrl } from "../external-url";
