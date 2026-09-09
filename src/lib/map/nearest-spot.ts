import type { MapSpot } from "./types";

export type Coordinates = { latitude: number; longitude: number };

export function isValidCoordinates(position: Coordinates): boolean {
  return Number.isFinite(position.latitude) && Math.abs(position.latitude) <= 90
    && Number.isFinite(position.longitude) && Math.abs(position.longitude) <= 180;
}

export function distanceMeters(from: Coordinates, to: Coordinates): number {
  const radians = Math.PI / 180;
  const latitudeDelta = (to.latitude - from.latitude) * radians;
  const longitudeDelta = (to.longitude - from.longitude) * radians;
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(from.latitude * radians) * Math.cos(to.latitude * radians)
    * Math.sin(longitudeDelta / 2) ** 2;
  return 6_371_000 * 2 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, a))));
}

export function findNearestSpot(position: Coordinates, spots: readonly MapSpot[]) {
  if (!isValidCoordinates(position)) return null;
  let nearest: { spot: MapSpot; distanceMeters: number } | null = null;
  for (const spot of spots) {
    if (!isValidCoordinates(spot)) continue;
    const distance = distanceMeters(position, spot);
    if (!nearest || distance < nearest.distanceMeters
      || (distance === nearest.distanceMeters && spot.sortOrder < nearest.spot.sortOrder)) {
      nearest = { spot, distanceMeters: distance };
    }
  }
  return nearest;
}

export function formatDistance(distance: number): string {
  if (distance < 100) return "100m未満";
  const rounded = Math.round(distance / 10) * 10;
  return rounded < 1000 ? `約${rounded}m` : `約${(distance / 1000).toFixed(1)}km`;
}
