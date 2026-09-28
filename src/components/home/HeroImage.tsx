"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { createHeroImageStore, heroImages, heroHistoryStorage } from "@/lib/media/hero-image";
import type { Lang } from "@/lib/language";

const store = createHeroImageStore(heroImages, () => window.sessionStorage, Math.random, () => heroHistoryStorage(window.history));
const useHeroImage = () => useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

export function HeroImage() {
  const snapshot = useHeroImage();
  if (!snapshot) return null;
  const { image, ready } = snapshot;
  return <Image data-hero-image src={image.imagePath} alt={image.alt} lang="ja" fill sizes="100vw"
    loading="eager" fetchPriority="high" onLoad={store.loaded} onError={store.failed}
    className="object-cover brightness-50" style={{ objectPosition: image.hero.objectPosition, opacity: ready ? 1 : 0 }} />;
}

export function HeroImageCredits({ lang }: { lang: Lang }) {
  const snapshot = useHeroImage();
  const image = snapshot?.ready ? snapshot.image : null;
  const english = lang === "en";
  const linkStyle = "inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";
  return <div className="min-h-14 bg-[#f6f5ef] px-5 text-xs leading-relaxed text-[#345447] sm:px-8" data-hero-credits>
    {image && <details className="mx-auto max-w-7xl py-1">
      <summary className="min-h-12 cursor-pointer content-center py-3 focus-visible:outline-2 focus-visible:outline-offset-2">
        {image.license ? (english ? "Image credits · Representative image" : "画像の出典・ライセンス · 代表イメージ") : (english ? "AI-generated illustration · Image information" : "AI生成イメージ · 画像について")}
      </summary>
      <div className="max-w-3xl space-y-1 break-words pb-4">
        <p>{english ? "Source: " : "出典："}<span lang="ja">{image.attribution}「{image.title}」</span></p>
        {image.sourceUrl && image.licenseUrl && <div className="flex flex-wrap gap-x-5">
          <a className={linkStyle} href={image.sourceUrl}>{english ? "Original image source" : "画像の出典ページ"}</a>
          <a className={linkStyle} href={image.licenseUrl}>{english ? "License: " : "ライセンス："}{image.license}</a>
        </div>}
        <p lang="ja">{image.modification}</p>
        <p>{english ? "The hero frame crops the display to fit; the saved image is unchanged." : "Heroでは表示枠に合わせて切り抜き表示しています。保存画像は変更していません。"}</p>
        <p>{english ? (image.license ? "Representative image, not a live view of flowers, foliage or zoo exhibits." : "AI-generated illustration, not a photograph of actual park facilities, scenery or animals.") : image.representativeNotice}</p>
      </div>
    </details>}
  </div>;
}
