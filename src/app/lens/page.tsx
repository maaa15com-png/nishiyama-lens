import type { Metadata } from "next";
import Link from "next/link";
import { LensDiagnosisClient } from "@/components/lens/LensDiagnosisClient";

export const metadata: Metadata = {
  title: "LENS診断 | NISHIYAMA LENS",
  description: "3つの質問から、あなたに合った西山公園の楽しみ方を見つけます。",
};

export default function LensPage() {
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

      <header className="relative z-10 border-b border-[#d9ddd3] bg-[#fffdf8]/90 px-5 py-5 backdrop-blur-sm sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="NISHIYAMA LENS トップへ戻る"
            className="text-sm font-bold tracking-[0.16em] text-[#173e30] sm:text-base sm:tracking-[0.2em]"
          >
            NISHIYAMA LENS
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-xs font-semibold text-[#5f6d65] transition-colors hover:text-[#173e30] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]"
          >
            <BackIcon />
            トップへ戻る
          </Link>
        </div>
      </header>

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
              3つの質問から、
              <br />
              今日の楽しみ方を見つけよう。
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#68736c] sm:text-base sm:leading-8">
              今の気分に近いものを、ひとつずつ選んでください。
              <br className="hidden sm:block" />
              回答はいつでも戻って選び直せます。
            </p>
          </div>

          <LensDiagnosisClient />
        </section>
      </main>

      <footer className="relative z-10 px-5 pb-8 pt-2 text-center text-xs text-[#7b857e] sm:px-8">
        <p>見方を変えると、公園は旅になる。</p>
      </footer>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 fill-none stroke-current"
      strokeWidth="1.7"
    >
      <path d="M13 8H4m3.5-3.5L4 8l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
