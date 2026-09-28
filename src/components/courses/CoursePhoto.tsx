"use client";

import Image from "next/image";
import { useState } from "react";

export default function CoursePhoto({ src, alt, hero = false, square = false, compact = false, generated = false, objectPosition = "50% 50%" }: { src: string | null; alt: string; hero?: boolean; square?: boolean; compact?: boolean; generated?: boolean; objectPosition?: string }) {
  const [failed, setFailed] = useState(false);
  return <div data-course-photo className={`relative overflow-hidden bg-[#e4eadb] ${hero ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-80" : square ? "aspect-square" : "aspect-[4/3]"}`}>
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#eef1e5] to-[#cbdac1] text-[#526b50]">
      <svg aria-hidden="true" viewBox="0 0 80 80" className={compact ? "size-8" : "size-16"} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 58C16 30 34 17 62 16c1 26-12 48-36 46M22 65l31-36M33 51l-2-14m12 4 12 1" /></svg>
      {!compact && <span className="text-xs tracking-[0.15em]">NISHIYAMA LENS</span>}
      {(!src || failed) && <span className="text-xs">{compact ? "写真なし" : "写真は準備中です"}</span>}
    </div>
    {src && !failed && <Image key={src} src={src} alt={alt} fill sizes={hero ? "(min-width: 1024px) 480px, 100vw" : "(min-width: 768px) 260px, 100vw"} loading={hero ? "eager" : "lazy"} unoptimized={!src.startsWith("/")} onError={() => setFailed(true)} className="object-cover" style={{ objectPosition }} />}
    {src && !failed && generated && <span className="absolute bottom-3 right-3 rounded bg-[#173e30]/90 px-2 py-1 text-xs text-white">生成イメージ<span className="sr-only">（実際の施設を撮影した写真ではありません）</span></span>}
  </div>;
}
