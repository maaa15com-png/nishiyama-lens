import { getNearbySpots } from "@/lib/server/nearby-spots";
import { nearbyCategoryLabels } from "@/lib/nearby/labels";

export default async function NearbySpots({ lensId }: { lensId: string }) {
  const spots = await getNearbySpots(lensId);
  if (spots.length === 0) return null;
  return <section aria-labelledby="nearby-title" className="mt-12 border-t border-[#d9ddd3] pt-9">
    <p className="text-xs font-bold tracking-widest text-[#796345]">AROUND SABAE</p>
    <h2 id="nearby-title" className="mt-3 text-2xl font-medium leading-relaxed">このLENSで、鯖江をもう少し</h2>
    <p className="mt-4 text-sm leading-8 text-[#53665a]">選んだ楽しみ方に合う、近隣の立ち寄り先をご紹介します。</p>
    <ul className="mt-6 grid gap-5 sm:grid-cols-2">{spots.map((spot) => <li key={spot.id} className="min-w-0 rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] p-6">
      <p className="text-xs font-semibold text-[#796345]">{nearbyCategoryLabels[spot.category]}</p>
      <h3 className="mt-3 break-words text-xl font-semibold leading-relaxed">{spot.name}</h3>
      <p className="mt-4 whitespace-pre-line break-words text-sm leading-8 text-[#53665a]">{spot.description}</p>
      {spot.recommendationReason && <p className="mt-4 whitespace-pre-line break-words rounded-2xl bg-[#edf1e7] p-4 text-sm leading-7">おすすめの理由：{spot.recommendationReason}</p>}
      {spot.address && <p className="mt-4 break-words text-xs leading-7 text-[#53665a]">所在地：{spot.address}</p>}
      {spot.externalUrl && <a href={spot.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center rounded-2xl border border-[#b9c3b8] px-5 py-3 text-sm font-semibold leading-7 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">施設の案内を見る（別タブ）</a>}
    </li>)}</ul>
  </section>;
}
