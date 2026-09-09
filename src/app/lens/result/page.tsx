import type { Metadata } from "next";
import Link from "next/link";
import {
  companionLabels,
  durationLabels,
  interestLabels,
} from "@/lib/lens/labels";
import {
  isLensRecommendationInput,
  type LensRecommendationInput,
  type LensRecommendationResponse,
} from "@/lib/lens/types";
import { getLensRecommendation } from "@/lib/server/lens-recommendation";

export const metadata: Metadata = {
  title: "診断結果 | NISHIYAMA LENS",
  description: "あなたに合った西山公園の楽しみ方とおすすめコースです。",
};

type ResultPageProps = {
  searchParams: Promise<{
    companion?: string | string[];
    interest?: string | string[];
    duration?: string | string[];
  }>;
};

export default async function LensResultPage({ searchParams }: ResultPageProps) {
  const input = await searchParams;

  if (!isLensRecommendationInput(input)) {
    return (
      <ResultLayout>
        <EmptyResult
          eyebrow="INVALID ANSWERS"
          title="診断内容を確認できませんでした。"
          description="お手数ですが、もう一度3つの質問に答えてください。"
        />
      </ResultLayout>
    );
  }

  let result: LensRecommendationResponse;

  try {
    result = await getLensRecommendation(input);
  } catch (error) {
    console.error("Failed to display a LENS recommendation.", error);

    return (
      <ResultLayout>
        <EmptyResult
          eyebrow="PLEASE TRY AGAIN"
          title="診断結果を読み込めませんでした。"
          description="時間をおいて、もう一度診断をお試しください。"
        />
      </ResultLayout>
    );
  }

  if (!result.recommendation) {
    return (
      <ResultLayout>
        <EmptyResult
          eyebrow={
            result.reason === "COURSE_NOT_FOUND"
              ? "COURSE COMING SOON"
              : "LENS COMING SOON"
          }
          title="この組み合わせのおすすめは準備中です。"
          description="別の楽しみ方も、ぜひ試してみてください。"
        />
      </ResultLayout>
    );
  }

  return (
    <ResultLayout>
      <RecommendationResult
        input={input}
        recommendation={result.recommendation}
      />
    </ResultLayout>
  );
}

function ResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f1e7] text-[#173e30]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full border border-[#174a36]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-80 size-72 rounded-full bg-[#dce4d6]/65 blur-3xl"
      />

      <header className="relative z-10 border-b border-[#d9ddd3] bg-[#fffdf8]/90 px-5 py-5 backdrop-blur-sm sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="NISHIYAMA LENS トップ"
            className="text-sm font-bold tracking-[0.16em] sm:text-base sm:tracking-[0.2em]"
          >
            NISHIYAMA LENS
          </Link>
          <span className="text-[0.65rem] font-bold tracking-[0.18em] text-[#7b857e]">
            LENS RESULT
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      <footer className="relative z-10 px-5 pb-8 pt-2 text-center text-xs text-[#7b857e]">
        <p>見方を変えると、公園は旅になる。</p>
      </footer>
    </div>
  );
}

function RecommendationResult({
  input,
  recommendation,
}: {
  input: LensRecommendationInput;
  recommendation: NonNullable<
    LensRecommendationResponse["recommendation"]
  >;
}) {
  const { lens, course } = recommendation;

  return (
    <>
      <div className="max-w-2xl">
        <p className="text-[0.68rem] font-bold tracking-[0.25em] text-[#9a805a]">
          YOUR NISHIYAMA LENS
        </p>
        <p className="mt-4 text-sm leading-7 text-[#68736c]">
          3つの回答から、今日のあなたに合う楽しみ方を見つけました。
        </p>
      </div>

      <section
        aria-labelledby="lens-result-title"
        className="relative mt-9 overflow-hidden rounded-[2rem] bg-[#173e30] px-6 py-9 text-white shadow-[0_28px_80px_rgba(21,58,44,0.2)] sm:mt-12 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
      >
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 size-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-16 size-52 rounded-full border border-[#d7c69d]/15"
        />
        <div className="relative max-w-3xl">
          <p className="text-[0.68rem] font-bold tracking-[0.24em] text-[#d7c69d]">
            あなたのLENSは…
          </p>
          <h1
            id="lens-result-title"
            className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl"
          >
            {lens.name}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
            {lens.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <ResultTag>{companionLabels[input.companion]}</ResultTag>
            <ResultTag>{interestLabels[input.interest]}を楽しむ</ResultTag>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="recommended-course-title"
        className="mt-5 rounded-[2rem] border border-[#e0e3d9] bg-[#fffdf8] px-6 py-8 shadow-[0_18px_55px_rgba(40,55,42,0.08)] sm:mt-6 sm:px-10 sm:py-10 lg:px-14 lg:py-12"
      >
        <p className="text-[0.68rem] font-bold tracking-[0.24em] text-[#9a805a]">
          RECOMMENDED COURSE
        </p>
        <h2
          id="recommended-course-title"
          className="mt-4 max-w-3xl text-2xl font-medium leading-snug tracking-[-0.03em] sm:text-3xl lg:text-4xl"
        >
          {course.name}
        </h2>

        <dl className="mt-7 grid gap-3 rounded-[1.25rem] bg-[#f1f0e7] px-5 py-5 sm:grid-cols-2 sm:px-6">
          <div>
            <dt className="text-xs font-semibold text-[#768078]">過ごし方の目安</dt>
            <dd className="mt-1 text-lg font-semibold">
              {durationLabels[course.durationType]}
            </dd>
          </div>
          <div className="border-t border-[#daddd4] pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <dt className="text-xs font-semibold text-[#768078]">所要時間</dt>
            <dd className="mt-1 text-lg font-semibold">約{course.durationMinutes}分</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#174a36] px-7 text-sm font-bold text-white shadow-[0_12px_30px_rgba(23,74,54,0.18)] transition-colors hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]"
          >
            このコースを見る
            <ArrowIcon />
          </Link>
          <Link
            href="/lens"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#b9c3b8] bg-white px-7 text-sm font-semibold text-[#365746] transition-colors hover:bg-[#f2f3ed] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]"
          >
            診断をやり直す
          </Link>
        </div>
      </section>
    </>
  );
}

function EmptyResult({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-[#e0e3d9] bg-[#fffdf8] px-6 py-12 text-center shadow-[0_20px_60px_rgba(40,55,42,0.08)] sm:px-10 sm:py-16">
      <p className="text-[0.68rem] font-bold tracking-[0.24em] text-[#9a805a]">
        {eyebrow}
      </p>
      <h1 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#68736c] sm:text-base">
        {description}
      </p>
      <Link
        href="/lens"
        className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#174a36] px-7 text-sm font-bold text-white shadow-[0_12px_30px_rgba(23,74,54,0.18)] transition-colors hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]"
      >
        診断をやり直す
      </Link>
    </section>
  );
}

function ResultTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/18 bg-white/8 px-4 py-2 text-xs font-semibold text-white/88">
      {children}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 fill-none stroke-current"
      strokeWidth="1.7"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
