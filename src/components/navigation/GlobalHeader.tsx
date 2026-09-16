"use client";

import Link from "next/link";
import styles from "./GlobalHeader.module.css";
import { useEffect, useRef, useState } from "react";
import { languageHref, type Lang, type Query } from "@/lib/language";

export default function GlobalHeader({ lang, query, path, variant = "standard" }: { lang: Lang; query: Query; path: string; variant?: "overlay" | "standard" }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const english = lang === "en";
  const menuId = "global-navigation";
  const overlay = variant === "overlay";
  const japaneseContent = ["/lens", "/courses", "/map", "/spots", "/recap"].some((route) => path === route || path.startsWith(route + "/"));
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  const items = [
    { href: languageHref("/", query, lang), label: english ? "Home" : "トップ" },
    { href: languageHref("/lens", query, lang), label: english ? "LENS quiz — Japanese only" : "LENS診断", quiz: true },
    { href: languageHref("/park", query, lang), label: english ? "About the park" : "公園について" },
    { href: languageHref("/news", query, lang), label: "News" },
    { href: languageHref("/events", query, lang), label: "Event" },
  ];

  return <header ref={header} lang={lang}
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
        trigger.current?.focus();
      }
    }}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    }}
    className={`${styles.header} ${overlay ? styles.overlay : styles.standard} px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12`}>
    <div className="relative mx-auto max-w-7xl">
      <div className={`${styles.row} ${japaneseContent ? styles.japaneseRow : ""} border-b border-current/25 pb-4 sm:pb-5`}>
        <button ref={trigger} type="button" aria-expanded={open} aria-controls={menuId}
          aria-label={english ? (open ? "Close menu" : "Open menu") : (open ? "メニューを閉じる" : "メニューを開く")}
          onClick={() => setOpen((value) => !value)}
          className={`${styles.roundControl} ${styles.menuButton} border border-current/40 hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-4`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 fill-none stroke-current" strokeWidth="1.8">
            <path d={open ? "M6 6l12 12M6 18 18 6" : "M4 8h16M4 16h16"} strokeLinecap="round" />
          </svg>
        </button>
        <Link href={languageHref("/", query, lang)} onClick={close}
          aria-label={english ? "NISHIYAMA LENS home" : "NISHIYAMA LENS トップ"}
          className={`${styles.logo} text-center text-xs font-semibold tracking-[0.12em] focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-lg sm:tracking-[0.2em]`}>
          NISHIYAMA LENS
        </Link>
        {!japaneseContent && (
          <Link href={languageHref(path, query, english ? "ja" : "en")} onClick={close} scroll={false}
            aria-label={english ? "Current language: English. Switch to Japanese" : "現在の表示言語：日本語。英語に切り替える"}
            className={`${styles.roundControl} ${styles.languageButton} border border-current/40 text-[0.65rem] font-bold tracking-[0.16em] hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-4`}>
            {english ? "EN" : "JP"}
          </Link>
        )}
      </div>
      {(japaneseContent || (english && overlay)) && <p lang="en" className="mt-3 max-w-xl text-xs leading-5 opacity-90">
        {japaneseContent ? "This page's main content is available in Japanese only." : "The LENS quiz is available in Japanese only."}
      </p>}
      <nav id={menuId} hidden={!open} aria-label={english ? "Main navigation" : "メインナビゲーション"}
        className="absolute left-0 top-full mt-3 max-h-[60dvh] w-full overflow-y-auto rounded-2xl border border-[#d9ddd3] bg-[#fffdf8] p-3 text-[#173e30] shadow-xl sm:w-80">
        <ul>
          {items.map(({ href, label, quiz }) => <li key={href}>
            <Link href={href} onClick={close} aria-current={path === href.split("?")[0] ? "page" : href.split("?")[0] !== "/" && path.startsWith(href.split("?")[0] + "/") ? "location" : undefined}
              className="flex min-h-12 flex-col items-start justify-center rounded-xl px-4 py-3 text-sm font-semibold aria-[current=page]:bg-[#edf1e7] aria-[current=location]:bg-[#edf1e7] hover:bg-[#edf1e7] focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
              <span>{label}</span>
              {quiz && !english && <span lang="en" className="mt-1 text-xs font-normal">LENS quiz — Japanese only</span>}
            </Link>
          </li>)}
          <li>
            <Link href={languageHref("/park", query, "en")} onClick={close} lang="en"
              aria-label="Open English Guide (park information)"
              className="flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#edf1e7] focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
              English Guide <span aria-hidden="true" className="ml-1">↗</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>;
}
