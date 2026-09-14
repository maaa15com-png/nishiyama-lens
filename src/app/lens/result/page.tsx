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
          description="お手数ですが、もう一度2つの質問に答えてください。"
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
          eyebrow="LENS COMING SOON"
          title="このLENSは現在準備中です。"
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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="NISHIYAMA LENS トップ"
            className="text-sm font-bold tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base sm:tracking-[0.2em]"
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

// Presentation only: keep stored Course names and detail-page wording unchanged.
function courseCardName(name: string): string {
  return name.replace(/30〜60分|1〜2時間|2〜3時間/g, "")
    .replace(/(?<!レッサー)パンダ/g, "レッサーパンダ");
}

function RecommendationResult({ input, recommendation }: {
  input: LensRecommendationInput;
  recommendation: NonNullable<LensRecommendationResponse["recommendation"]>;
}) {
  const { lens, courses } = recommendation;
  return <>
    <p className="text-sm leading-7 text-[#53665a]">あなたのLENSが見つかりました</p>
    <section aria-labelledby="lens-result-title" className="mt-5 rounded-[2rem] bg-[#173e30] px-5 py-9 text-white sm:px-10 sm:py-12">
      <p className="text-xs font-bold tracking-[0.24em] text-[#d7c69d]" lang="en">YOUR LENS</p>
      <h1 id="lens-result-title" lang="en" className="mt-5 text-3xl font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-5xl">{lens.name}</h1>
      <p className="mt-6 whitespace-pre-line break-words text-base leading-8 text-white/85">{lens.description}</p>
      <div className="mt-7 flex flex-wrap gap-2"><ResultTag>{input.companion === "FAMILY" ? "家族と" : companionLabels[input.companion]}</ResultTag><ResultTag>{interestLabels[input.interest]}を楽しむ</ResultTag></div>
    </section>
    <section aria-labelledby="course-selection-title" className="mt-10">
      <h2 id="course-selection-title" className="text-2xl font-medium leading-relaxed">このLENSで、今日はどれくらい楽しむ？</h2>
      <p className="mt-3 text-sm leading-7 text-[#53665a]">過ごせる時間に合わせて、コースを選んでください。</p>
      {courses.length === 0 ? <p className="mt-6 rounded-2xl bg-[#fffdf8] p-6">このLENSのコースは現在準備中です。</p> :
        <ul className="mt-6 grid gap-5 lg:grid-cols-3">{courses.map((course) => <li key={course.id} className="min-w-0">
          <Link href={"/courses/" + course.id} className="flex h-full flex-col rounded-3xl border border-[#cbd4c7] bg-[#fffdf8] p-6 transition-colors hover:bg-[#edf1e7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174a36]">
            <p className="text-xl font-bold text-[#174a36]">{durationLabels[course.durationType]}</p>
            <h3 className="mt-4 break-words text-lg font-semibold leading-8">{courseCardName(course.name)}</h3>
            {course.description && <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-[#53665a]">{course.description}</p>}
            <span className="mt-auto inline-flex min-h-12 items-center gap-2 pt-4 text-sm font-bold underline underline-offset-4">このコースを見る<ArrowIcon /></span>
          </Link>
        </li>)}</ul>}
    </section>
    <Link href="/lens" className="mt-8 inline-flex min-h-12 items-center rounded-full border border-[#b9c3b8] px-6 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">診断をやり直す</Link>
  </>;
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
