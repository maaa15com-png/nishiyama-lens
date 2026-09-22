import "server-only";
import { db } from "./db";
import { facilityExternalUrl, facilityTypes, type MapFacility } from "@/lib/map/facilities";

export async function getParkFacilities(): Promise<MapFacility[]> {
  const rows = await db.orm.public.ParkFacility.where({ isPublished: true })
    .select("id", "name", "type", "latitude", "longitude", "description", "externalUrl")
    .orderBy([(facility) => facility.type.asc(), (facility) => facility.name.asc()]).all();
  return rows.flatMap((row) => {
    const latitude = Number(row.latitude), longitude = Number(row.longitude);
    if ((typeof row.latitude !== "string" && typeof row.latitude !== "number")
      || (typeof row.longitude !== "string" && typeof row.longitude !== "number")
      || !facilityTypes.includes(row.type) || !String(row.latitude).trim() || !String(row.longitude).trim()
      || !Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) return [];
    return [{ ...row, name: String(row.name), latitude, longitude, externalUrl: facilityExternalUrl(row.externalUrl) }];
  });
}
