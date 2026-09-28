import officialImages from "./spot-images.json";
import generatedImages from "./home-generated-images.json";

// Reuse the image metadata shape; presentation assets never enter the Spot seed.
export const homeImages = [...officialImages, ...generatedImages];
const placements = {
  animals: { slug: "generated-panda-bamboo", objectPosition: "50% 50%" },
  seasons: { slug: "nishiyama-azaleas", objectPosition: "50% 50%" },
  play: { slug: "generated-woodland-playground", objectPosition: "50% 50%" },
  walk: { slug: "generated-green-path", objectPosition: "60% 50%" },
  familyPanda: { slug: "generated-panda-walking", objectPosition: "65% 45%" },
} as const;

export type HomePhotoPlacement = keyof typeof placements;
export function getHomePhoto(placement: HomePhotoPlacement) {
  const { slug, objectPosition } = placements[placement];
  const image = homeImages.find(image => image.slug === slug);
  return image ? { image, objectPosition } : null;
}
