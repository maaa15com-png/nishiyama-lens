import Link from "next/link";
import { companionLabels, interestLabels } from "@/lib/lens/labels";
import { lensResultHref } from "@/lib/lens/result-href";
import type { Query } from "@/lib/language";
import type { RediscoveryLens } from "@/lib/server/rediscovery-lenses";

export default function RediscoveryLenses({ lenses, query }: { lenses: RediscoveryLens[]; query: Query }) {
  if (!lenses.length) return null;
  return <section aria-labelledby="rediscovery-title" className="mt-12 border-t border-[#d9ddd3] pt-9">
    <p className="text-xs font-bold tracking-widest text-[#796345]">ANOTHER LENS</p>
    <h2 id="rediscovery-title" className="mt-3 text-2xl font-medium leading-relaxed">次は、別のLENSで見てみる？</h2>
    <p className="mt-4 text-sm leading-8 text-[#53665a]">見方を変えると、また違う西山公園。次のひとときに、こんな楽しみ方はいかがでしょう。</p>
    <p lang="en" className="mt-2 text-xs leading-6 text-[#53665a]">LENS results and courses — Japanese only</p>
    <ul className="mt-6 grid gap-5 sm:grid-cols-2">{lenses.map(lens => <li key={lens.id} className="flex min-w-0 flex-col rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] p-6">
      <h3 className="break-words text-xl font-semibold leading-relaxed">{lens.name}</h3>
      <p className="mt-3 text-sm leading-7 text-[#796345]">{companionLabels[lens.companion]} × {interestLabels[lens.interest]}</p>
      <p className="mt-4 whitespace-pre-line break-words text-sm leading-8 text-[#53665a]">{lens.description}</p>
      <div className="mt-auto pt-5"><Link href={lensResultHref(lens, query)} aria-label={lens.name + "：このLENSで見てみる"} className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#b9c3b8] px-5 py-3 text-center text-sm font-semibold leading-7 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">このLENSで見てみる</Link></div>
    </li>)}</ul>
  </section>;
}
