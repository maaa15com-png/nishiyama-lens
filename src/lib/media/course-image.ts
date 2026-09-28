import images from "./course-images.json";
import { getSpotImage } from "./spot-image";
import { safeExternalUrl } from "../external-url";

type SpotPhoto = { slug: string; name: string; imageUrl: string | null };
export function getCoursePhoto(spot: SpotPhoto) {
  const metadata = getSpotImage(spot.slug, spot.imageUrl);
  const local = spot.imageUrl?.startsWith("/images/") && !spot.imageUrl.includes("..") ? spot.imageUrl : null;
  const actual = metadata?.imagePath ?? local ?? safeExternalUrl(spot.imageUrl);
  // User-approved representative image for the unresolved seasonal fallback only.
  const representative = !actual && spot.slug === "seasonal-highlight"
    ? getSpotImage("nishiyama-azaleas", "/images/spots/nishiyama-azaleas.jpg") : null;
  const generated = images.find(image => image.slug === spot.slug);
  return {
    // Registered Spot images take priority over every Course presentation fallback.
    isSpotImage: !!actual,
    src: actual ?? representative?.imagePath ?? generated?.imagePath ?? null,
    alt: actual ? metadata?.alt ?? spot.name : representative ? "季節の見どころの代表イメージ：西山公園のツツジ" : generated?.alt ?? "",
    generated: !actual && !representative && !!generated,
    objectPosition: !actual && generated ? generated.objectPosition : "50% 50%",
    metadata: metadata ?? representative,
  };
}
export function getCourseHeroSpot<T extends SpotPhoto>(spots: T[]): T | undefined {
  return spots.find(spot => getCoursePhoto(spot).isSpotImage)
    ?? spots.find(spot => getCoursePhoto(spot).src);
}
