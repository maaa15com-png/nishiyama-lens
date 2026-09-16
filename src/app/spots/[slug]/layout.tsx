import StandardHeader from "@/components/navigation/StandardHeader";

export default function SpotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1e7] text-[#173e30]">
      <StandardHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
      <footer className="px-5 pb-8 text-center text-xs text-[#68736c]">
        見方を変えると、公園は旅になる。
      </footer>
    </div>
  );
}
