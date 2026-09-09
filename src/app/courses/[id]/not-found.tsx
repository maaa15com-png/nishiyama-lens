import Link from "next/link";

export default function CourseNotFound() {
  return (
    <section className="rounded-[2rem] border border-[#e0e3d9] bg-[#fffdf8] px-6 py-12 text-center sm:px-10">
      <h1 className="text-2xl font-medium leading-relaxed sm:text-3xl">このコースは見つかりませんでした。</h1>
      <p className="mt-5 text-sm leading-7 text-[#68736c]">もう一度診断して、おすすめのコースを探してみてください。</p>
      <Link href="/lens" className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-[#174a36] px-7 py-3 text-sm font-bold text-white hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]">もう一度LENS診断する</Link>
    </section>
  );
}
