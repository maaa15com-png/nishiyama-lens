import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./page.module.css";

const highlights = [
  {
    number: "01",
    title: "動物に会う",
    description: "愛らしいレッサーパンダと、目線が合うひととき。",
    className: styles.featureZoo,
    icon: <PandaIcon />,
  },
  {
    number: "02",
    title: "四季を感じる",
    description: "春のつつじ、秋の紅葉。訪れるたびに違う色。",
    className: styles.featureSeason,
    icon: <LeafIcon />,
  },
  {
    number: "03",
    title: "思いきり遊ぶ",
    description: "森の遊具を駆けめぐって、家族の思い出を。",
    className: styles.featurePlay,
    icon: <PlayIcon />,
  },
  {
    number: "04",
    title: "のんびり歩く",
    description: "木漏れ日の小径を、気の向くままに散策。",
    className: styles.featureWalk,
    icon: <WalkIcon />,
  },
] as const;

const lensQuestions = [
  { number: "01", label: "誰と行くか", en: "COMPANION" },
  { number: "02", label: "何を楽しみたいか", en: "INTEREST" },
  { number: "03", label: "どのくらい過ごせるか", en: "DURATION" },
] as const;

function PrimaryCta({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/lens"
      className={`group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-6 py-3 text-center text-sm font-bold tracking-[0.04em] transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 sm:px-8 ${
        inverse
          ? "bg-[#f5f0e4] text-[#173e30] hover:bg-white focus-visible:outline-[#f5f0e4]"
          : "bg-[#174a36] text-white shadow-[0_12px_32px_rgba(23,74,54,0.2)] hover:-translate-y-0.5 hover:bg-[#0f3929] focus-visible:outline-[#174a36]"
      }`}
    >
      わたしに合う楽しみ方を見つける
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-full border border-current/25 transition-transform duration-300 group-hover:translate-x-1"
      >
        <ArrowIcon />
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-5 pt-5 text-white sm:px-8 sm:pt-7 lg:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-[2.75rem_1fr_2.75rem] items-center border-b border-white/35 pb-4 sm:pb-5">
        <button
          type="button"
          disabled
          aria-label="メニュー（準備中）"
          className="grid size-11 cursor-not-allowed place-items-center rounded-full border border-white/45 opacity-70"
        >
          <MenuIcon />
        </button>

        <Link
          href="/"
          aria-label="NISHIYAMA LENS トップ"
          className="justify-self-center text-center font-semibold tracking-[0.2em] sm:text-lg"
        >
          NISHIYAMA LENS
        </Link>

        <span
          aria-label="現在の言語：日本語。言語切替は準備中です"
          className="grid size-11 place-items-center justify-self-end rounded-full border border-white/45 text-[0.65rem] font-bold tracking-[0.16em]"
        >
          JP
        </span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[45rem] overflow-hidden bg-[#264f3e] text-white sm:min-h-[50rem] lg:min-h-[54rem]">
      <div className={`${styles.heroLandscape} absolute inset-0`} aria-hidden="true">
        <div className={styles.heroSun} />
        <div className={`${styles.heroHill} ${styles.heroHillBack}`} />
        <div className={`${styles.heroHill} ${styles.heroHillFront}`} />
        <div className={`${styles.heroTree} ${styles.heroTreeOne}`} />
        <div className={`${styles.heroTree} ${styles.heroTreeTwo}`} />
        <div className={`${styles.heroTree} ${styles.heroTreeThree}`} />
        <div className={styles.heroPath} />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,35,25,0.38)_0%,rgba(8,35,25,0.08)_35%,rgba(8,35,25,0.78)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[45rem] max-w-7xl items-end px-5 pb-14 pt-36 sm:min-h-[50rem] sm:px-8 sm:pb-20 lg:min-h-[54rem] lg:px-12 lg:pb-24">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-white/80">
            <span className="h-px w-9 bg-white/60" />
            NISHIYAMA PARK, FUKUI
          </p>
          <h1 className="text-[clamp(2.7rem,10vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-balance">
            見方を変えると、
            <br />
            公園は旅になる。
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/82 sm:text-base sm:leading-8">
            動物、季節、遊び、ひと休み。
            <br className="sm:hidden" />
            いつもの公園に、まだ知らない一日を見つけよう。
          </p>
          <div className="mt-8 sm:mt-10">
            <PrimaryCta inverse />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-5 z-10 hidden items-center gap-3 text-[0.65rem] font-semibold tracking-[0.24em] text-white/70 sm:flex lg:right-12">
        SCROLL
        <span className="h-px w-12 bg-white/50" />
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  children,
  center = false,
}: {
  eyebrow: string;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : undefined}>
      <p className="mb-4 text-[0.68rem] font-bold tracking-[0.24em] text-[#8b7654]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-[#173e30] sm:text-4xl lg:text-5xl">
        {children}
      </h2>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
  className,
  icon,
}: (typeof highlights)[number]) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_55px_rgba(40,55,42,0.08)]">
      <div
        className={`${styles.featureScene} relative aspect-[4/3] overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <span className="absolute left-5 top-5 text-xs font-bold tracking-[0.18em] text-white/75">
          {number}
        </span>
        <div className="absolute inset-0 grid place-items-center transition-transform duration-500 group-hover:scale-105">
          <span className="grid size-20 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm">
            {icon}
          </span>
        </div>
      </div>
      <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#173e30]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#5f6d65]">{description}</p>
      </div>
    </article>
  );
}

function ParkHighlights() {
  return (
    <section className="bg-[#f5f1e7] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="DISCOVER THE PARK">
            知ってる？西山公園
          </SectionHeading>
          <p className="max-w-sm text-sm leading-7 text-[#68736c] sm:text-right">
            小さな山のふもとに、家族で楽しめる景色がぎゅっと詰まっています。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <FeatureCard key={highlight.number} {...highlight} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LensIntroduction() {
  return (
    <section className="bg-[#fffdf8] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="FIND YOUR LENS" center>
          あなたに合った、
          <br className="sm:hidden" />
          西山公園の楽しみ方。
        </SectionHeading>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-7 text-[#68736c] sm:text-base sm:leading-8">
          ３つの質問から、今のあなたにちょうどいい過ごし方をご提案します。
        </p>

        <ol className="relative mt-12 grid gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {lensQuestions.map((question, index) => (
            <li
              key={question.number}
              className="relative flex min-h-40 items-center gap-5 rounded-[1.5rem] border border-[#dfe3d8] bg-white px-6 py-6 sm:block sm:min-h-52 sm:px-7 sm:py-7"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#edf0e7] text-xs font-bold text-[#5b715f]">
                {question.number}
              </span>
              <div className="sm:mt-9">
                <p className="text-xl font-semibold text-[#173e30]">
                  {question.label}
                </p>
                <p className="mt-1 text-[0.65rem] font-bold tracking-[0.2em] text-[#a29072]">
                  {question.en}
                </p>
              </div>
              {index < lensQuestions.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 left-1/2 z-10 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-[#174a36] text-xs text-white sm:-right-3 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0"
                >
                  +
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FamilyPandaExample() {
  return (
    <section className="bg-[#fffdf8] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12 lg:pb-36">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#183f31] text-white shadow-[0_28px_80px_rgba(21,58,44,0.18)] lg:grid-cols-[0.95fr_1.05fr] lg:rounded-[2.5rem]">
        <div className="p-7 sm:p-10 lg:flex lg:flex-col lg:justify-center lg:p-16">
          <p className="text-[0.68rem] font-bold tracking-[0.25em] text-[#d7c69d]">
            ONE LENS FOR YOU
          </p>
          <p className="mt-8 text-sm text-white/65">たとえば、こんな楽しみ方。</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            FAMILY <span className="font-light text-[#d7c69d]">×</span> PANDA
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/90 sm:text-xl">
            小さな子どもと、
            <br />
            レッサーパンダや遊び場を楽しむ
          </p>
          <div className="mt-10 border-t border-white/20 pt-6 text-sm leading-7 text-white/66">
            その人らしい西山公園の見方を、
            <br />
            NISHIYAMA LENSでは「LENS」と呼びます。
          </div>
        </div>

        <div className={`${styles.pandaScene} relative min-h-80 overflow-hidden lg:min-h-[38rem]`} aria-hidden="true">
          <div className={styles.pandaBranch} />
          <div className={styles.pandaMark}>
            <span className={`${styles.pandaEar} ${styles.pandaEarLeft}`} />
            <span className={`${styles.pandaEar} ${styles.pandaEarRight}`} />
            <span className={`${styles.pandaEye} ${styles.pandaEyeLeft}`} />
            <span className={`${styles.pandaEye} ${styles.pandaEyeRight}`} />
            <span className={styles.pandaNose} />
          </div>
          <p className="absolute bottom-6 right-7 text-right text-[0.62rem] font-semibold leading-5 tracking-[0.2em] text-white/65">
            RED PANDA
            <br />
            NISHIYAMA ZOO
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#e8e1cf] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
      <div className={`${styles.finalRings} absolute inset-0`} aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-[0.68rem] font-bold tracking-[0.25em] text-[#8b7654]">
          START YOUR JOURNEY
        </p>
        <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.03em] text-[#173e30] sm:text-5xl">
          今日のあなたは、
          <br />
          どんな公園を旅する？
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#617066]">
          3つの質問に答えて、あなたらしい西山公園の一日を見つけてみましょう。
        </p>
        <div className="mt-9">
          <PrimaryCta />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#103326] px-5 py-8 text-white/60 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold tracking-[0.18em] text-white/85">
          NISHIYAMA LENS
        </p>
        <p>見方を変えると、公園は旅になる。</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <Hero />
        <ParkHighlights />
        <LensIntroduction />
        <FamilyPandaExample />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.5">
      <path d="M4 8h16M4 16h16" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current" strokeWidth="1.5">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PandaIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current" strokeWidth="1.6">
      <circle cx="24" cy="25" r="14" />
      <path d="M14 15c-5-5-9 2-5 7M34 15c5-5 9 2 5 7M16 28c3 5 13 5 16 0" />
      <path d="M17 23c1-3 4-4 6-1M31 23c-1-3-4-4-6-1" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current" strokeWidth="1.6">
      <path d="M39 9C20 11 10 20 11 37c17 1 26-9 28-28Z" />
      <path d="M10 39c7-9 14-15 24-22" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current" strokeWidth="1.6">
      <path d="M9 38 24 10l15 28M15 27h18M18 38l6-11 6 11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalkIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current" strokeWidth="1.6">
      <circle cx="28" cy="9" r="4" />
      <path d="m24 17-5 10 8 4 4 9M24 18l8 7 7 1M20 27l-8 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
