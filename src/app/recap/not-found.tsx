import Link from "next/link";
export default function RecapNotFound() {
  return <section><h1 className="text-2xl font-semibold">振り返るコースを確認できませんでした</h1>
    <p className="mt-4 text-sm leading-8">LENS診断から、気になる楽しみ方を選んでみてください。</p>
    <Link href="/lens" className="mt-6 inline-flex min-h-14 items-center rounded-full bg-[#174a36] px-6 text-white focus-visible:outline-2 focus-visible:outline-offset-4">LENS診断へ</Link>
  </section>;
}
