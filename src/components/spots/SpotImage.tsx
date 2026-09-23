import Image from "next/image";
import { safeExternalUrl } from "@/lib/external-url";
import { getSpotImage } from "@/lib/media/spot-image";

export default function SpotImage({ slug, name, imageUrl }: { slug: string; name: string; imageUrl: string | null }) {
  const image = getSpotImage(slug, imageUrl);
  const legacyUrl = safeExternalUrl(imageUrl);
  if (!image && !legacyUrl) return null;
  if (!image) return <Image src={legacyUrl!} alt={name} width={500} height={333} loading="lazy" unoptimized className="mt-8 h-auto w-full max-w-[500px] rounded-3xl object-contain" />;
  const linkClass = "rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";
  return <figure className="mt-8 min-w-0 max-w-[800px]">
    <Image src={image.imagePath} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 848px) calc(100vw - 48px), 800px" loading="lazy" className="h-auto w-full rounded-3xl object-contain" />
    <figcaption className="mt-3 break-words text-xs leading-6 text-[#53665a]">
      <p>出典：<a href={image.sourceUrl} className={linkClass}>{image.attribution}「{image.title}」</a> · <a href={image.licenseUrl} className={linkClass}>{image.license}</a></p>
      <p>{image.modification}</p>
      <p>{image.representativeNotice}</p>
    </figcaption>
  </figure>;
}
