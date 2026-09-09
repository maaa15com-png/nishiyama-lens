export default function LensResultLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f1e7] px-5 text-[#173e30]">
      <div role="status" className="text-center">
        <span className="mx-auto block size-10 animate-pulse rounded-full border-4 border-[#c7d0c5] border-t-[#174a36] motion-reduce:animate-none" />
        <p className="mt-5 text-sm font-semibold tracking-[0.08em]">
          あなたのLENSを探しています…
        </p>
      </div>
    </main>
  );
}
