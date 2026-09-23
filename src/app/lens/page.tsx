import { getAvailableLensCombinations } from "@/lib/server/lens-availability";
import type { Query } from "@/lib/language";
import StandardHeader from "@/components/navigation/StandardHeader";
import type { Metadata } from "next";
import { LensDiagnosisClient } from "@/components/lens/LensDiagnosisClient";

export const metadata: Metadata = {
  title: "LENS診断 | NISHIYAMA LENS",
  description: "2つの質問から、あなたに合った西山公園の楽しみ方を見つけます。",
};

export default async function LensPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const combinations = await getAvailableLensCombinations();
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f1e7] text-[#173e30]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-24 size-80 rounded-full border border-[#174a36]/8 sm:-right-20 sm:size-[28rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-72 size-56 rounded-full bg-[#dce4d6]/55 blur-3xl"
      />

      <StandardHeader />

      <main className="relative z-10 flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <section aria-labelledby="lens-page-title" className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-bold tracking-[0.25em] text-[#9a805a]">
              FIND YOUR LENS
            </p>
            <h1
              id="lens-page-title"
              className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#173e30] sm:text-4xl lg:text-5xl"
            >
              2つの質問から、
              <br />
              今日の楽しみ方を見つけよう。
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#68736c] sm:text-base sm:leading-8">
              今の気分に近いものを、ひとつずつ選んでください。
              <br className="hidden sm:block" />
              回答はいつでも戻って選び直せます。
            </p>
          </div>

          <LensDiagnosisClient query={query} combinations={combinations} />
        </section>
      </main>

      <footer className="relative z-10 px-5 pb-8 pt-2 text-center text-xs text-[#7b857e] sm:px-8">
        <p>見方を変えると、公園は旅になる。</p>
      </footer>
    </div>
  );
}
