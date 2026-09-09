import Link from "next/link";

export default function MapNotFound() {
  return (
    <section className="rounded-3xl border border-[#e0e3d9] bg-[#fffdf8] px-6 py-12 text-center">
      <h1 className="text-2xl font-medium leading-relaxed">地図に表示するコースが見つかりませんでした。</h1>
      <p className="mt-4 text-sm leading-7 text-[#53665a]">もう一度診断して、おすすめコースを選んでください。</p>
      <Link href="/lens" className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#174a36] px-7 text-sm font-bold text-white hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">もう一度LENS診断する</Link>
    </section>
  );
}
