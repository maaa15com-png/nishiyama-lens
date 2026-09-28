import { getHomePhoto, type HomePhotoPlacement } from "@/lib/media/home-photos";
import type { Lang } from "@/lib/language";

export default function HomePhotoCredits({ placements, lang }: { placements: HomePhotoPlacement[]; lang: Lang }) {
  const images = placements.flatMap(placement => {
    const photo = getHomePhoto(placement);
    return photo ? [photo.image] : [];
  }).filter((image, index, all) => all.findIndex(other => other.imagePath === image.imagePath) === index);
  if (!images.length) return null;
  const english = lang === "en";
  const linkClass = "inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";
  return <details data-home-photo-credits className="mt-4 text-xs leading-6 text-[#526658]">
    <summary className="min-h-11 cursor-pointer content-center py-2 focus-visible:outline-2 focus-visible:outline-offset-2">
      {english ? "Photo credits · Representative images" : "写真の出典・ライセンス · 代表イメージ"}
    </summary>
    <ul className="space-y-3 pb-2">
      {images.map(image => <li key={image.imagePath}>
        <p lang="ja">{image.attribution}「{image.title}」</p>
        {image.sourceUrl && image.licenseUrl && <div className="flex flex-wrap gap-x-5">
          <a className={linkClass} href={image.sourceUrl}>{english ? "Image source: " : "画像の出典："}<span lang="ja">{image.title}</span></a>
          <a className={linkClass} href={image.licenseUrl}>{english ? "License: " : "ライセンス："}{image.license}</a>
        </div>}
        <p lang="ja">{image.modification}</p>
        <p lang={english ? "en" : "ja"}>{english && !image.license ? "AI-generated illustration, not a photograph of actual park facilities, scenery or animals." : image.representativeNotice}</p>
      </li>)}
    </ul>
    <p className="pb-3">{english
      ? "Representative images, not live views of flowers, foliage or zoo exhibits. Cropped to fit the display; saved images are unchanged."
      : "表示枠に合わせて切り抜き表示しています。保存画像は変更していません。"}</p>
  </details>;
}
