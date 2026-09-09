export default function CourseLoading() {
  return (
    <div role="status" className="rounded-[2rem] bg-[#fffdf8] px-6 py-16 text-center">
      <span aria-hidden="true" className="mx-auto block size-10 animate-pulse rounded-full border-4 border-[#c7d0c5] border-t-[#174a36] motion-reduce:animate-none" />
      <p className="mt-5 text-sm font-semibold">コースを読み込んでいます…</p>
    </div>
  );
}
