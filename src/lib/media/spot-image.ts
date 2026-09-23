import images from "./spot-images.json";

// Match both identity and stored path: never attach a license to another image.
export function getSpotImage(slug: string, imageUrl: string | null) {
  return images.find((image) => image.slug === slug && image.imagePath === imageUrl) ?? null;
}
