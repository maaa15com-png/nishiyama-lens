import type { FieldOutputTypes } from "../../../prisma/schema.d.ts";
export type FacilityType = FieldOutputTypes["public"]["ParkFacility"]["type"];
export type MapFacility = {
  id: string; name: string; type: FacilityType;
  latitude: number; longitude: number;
  hasNursingRoom: boolean | null; hasDiaperChange: boolean | null;
  description: string | null; externalUrl: string | null;
};
export const facilityLabels: Record<FacilityType, string> = { TOILET: "トイレ", PARKING: "駐車場" };
export const facilitySymbols: Record<FacilityType, string> = { TOILET: "🚻", PARKING: "P" };
export const facilityTypes = ["TOILET", "PARKING"] as const;
export { safeExternalUrl as facilityExternalUrl } from "../external-url";

export type FacilityFilter = FacilityType | "BABY";
export type FacilityVisibility = Record<FacilityFilter, boolean>;
export const facilityFilters = [...facilityTypes, "BABY"] as const;
export const filterLabels: Record<FacilityFilter, string> = { ...facilityLabels, BABY: "ベビー" };
export const filterSymbols: Record<FacilityFilter, string> = { ...facilitySymbols, BABY: "🍼" };
export function matchesFacilityFilter(facility: MapFacility, filter: FacilityFilter): boolean {
  return filter === "BABY"
    ? facility.hasNursingRoom === true || facility.hasDiaperChange === true
    : facility.type === filter;
}
export function isFacilityVisible(facility: MapFacility, visible: FacilityVisibility): boolean {
  return facilityFilters.some(filter => visible[filter] && matchesFacilityFilter(facility, filter));
}
export function facilityAmenityLabels(facility: MapFacility): string[] {
  return [facility.hasNursingRoom === true ? "授乳室あり" : null,
    facility.hasDiaperChange === true ? "おむつ交換設備あり" : null].filter((label): label is string => label !== null);
}
