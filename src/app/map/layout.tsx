import StandardHeader from "@/components/navigation/StandardHeader";
﻿import "mapbox-gl/dist/mapbox-gl.css";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f1e7] text-[#173e30]">
      <StandardHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
        {children}
      </main>
      <footer className="px-5 pb-8 text-center text-xs text-[#68736c]">見方を変えると、公園は旅になる。</footer>
    </div>
  );
}
