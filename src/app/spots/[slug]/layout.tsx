import Link from "next/link";

export default function SpotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1e7] text-[#173e30]">
      <header className="border-b border-[#d9ddd3] bg-[#fffdf8] px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <Link href="/" aria-label="NISHIYAMA LENS トップ" className="text-sm font-bold tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base">
            NISHIYAMA LENS
          </Link>
          <span className="text-[0.65rem] font-bold tracking-[0.18em] text-[#68736c]">SPOT GUIDE</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
      <footer className="px-5 pb-8 text-center text-xs text-[#68736c]">
        見方を変えると、公園は旅になる。
      </footer>
    </div>
  );
}
