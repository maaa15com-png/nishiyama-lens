"use client";

import Image from "next/image";
import { useState } from "react";
import type { getHomePhoto } from "@/lib/media/home-photos";

export default function HomePhoto({ photo, sizes }: {
  photo: NonNullable<ReturnType<typeof getHomePhoto>>;
  sizes: string;
}) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  if (state === "failed") return null;
  return <><Image src={photo.image.imagePath} alt={photo.image.alt} lang="ja" fill sizes={sizes}
    loading="lazy" onLoad={() => setState("ready")} onError={() => setState("failed")}
    data-home-photo={photo.image.slug} className="z-[1] object-cover"
    style={{ objectPosition: photo.objectPosition, opacity: state === "ready" ? 1 : 0 }} />
    {!photo.image.license && state === "ready" && <span className="pointer-events-none absolute bottom-2 right-2 z-[3] rounded bg-[#123d30]/80 px-2 py-1 text-[10px] text-white">AI生成イメージ / AI illustration</span>}
  </>;
}
