"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import styles from "./FindCamera.module.css";

export default function FindCamera({ title }: { title: string }) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const completion = useRef<HTMLDivElement>(null);
  const currentUrl = useRef<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const element = input.current;
    const cancel = () => setMessage("撮影・選択をキャンセルしました。カメラを使わなくても、この発見を楽しめます。");
    element?.addEventListener("cancel", cancel);
    return () => element?.removeEventListener("cancel", cancel);
  }, []);

  useEffect(() => () => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
  }, []);

  useEffect(() => {
    if (done) completion.current?.focus();
  }, [done]);

  function discard() {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    currentUrl.current = null;
    setPhoto(null);
    setReady(false);
    setDone(false);
  }

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    // Release the File reference and allow selecting the same image again.
    event.currentTarget.value = "";
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      setMessage("画像を選んでください。カメラを使わなくても、この発見を楽しめます。");
      return;
    }
    try {
      const url = URL.createObjectURL(file);
      discard();
      currentUrl.current = url;
      setPhoto(url);
      setMessage("");
    } catch {
      setMessage("写真を開けませんでした。もう一度撮影するか、別の画像を選んでください。");
    }
  }

  const buttonClass = "min-h-12 rounded-full px-5 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-50";

  return <div className="mt-5 min-w-0">
    <label htmlFor={inputId} className="sr-only">{title}の写真を撮影・選択</label>
    <input ref={input} id={inputId} type="file" accept="image/*" capture="environment" hidden
      onChange={selectPhoto} />
    {photo && <figure className="mb-4">
      {/* A local blob URL must stay in the browser, without Next image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={photo} src={photo} alt={`${title}で撮影・選択した写真`}
        className="max-h-80 w-full rounded-2xl object-contain" onLoad={() => {
          if (currentUrl.current === photo) setReady(true);
        }} onError={() => {
          if (currentUrl.current !== photo) return;
          discard();
          setMessage("この写真は表示できませんでした。別の画像を選ぶか、撮り直してください。");
          trigger.current?.focus();
        }} />
      <figcaption className="mt-2 text-xs text-[#53665a]">あなたが見つけた景色</figcaption>
    </figure>}
    <div role="status" aria-atomic="true">
      {done && <div ref={completion} tabIndex={-1} className={`${styles.completion} mb-5 rounded-2xl bg-[#e7efdf] p-5 text-center focus-visible:outline-2`}>
        <span aria-hidden="true" className={styles.spark}>✧</span>
        <p className="text-3xl font-bold text-[#174a36]">見つけた！</p>
        <p className="mt-3 break-words text-sm leading-7">{title}</p>
        <p className="mt-2 text-sm">今日の発見、ひとつ達成！</p>
      </div>}
    </div>
    <div className="flex flex-wrap gap-3">
      <button ref={trigger} type="button" className={`${buttonClass} bg-[#174a36] text-white hover:bg-[#0f3929]`}
        aria-describedby={`${inputId}-help`} onClick={() => {
          setMessage("");
          input.current?.click();
        }}>{photo ? "撮り直す" : "見つけてみる"}</button>
      {photo && !done && <button type="button" disabled={!ready} className={`${buttonClass} border border-[#174a36] text-[#174a36]`}
        onClick={() => { if (ready) { setMessage(""); setDone(true); } }}>見つけた！</button>}
      {photo && <button type="button" className={`${buttonClass} border border-[#b9c3b8] text-[#365746]`} onClick={() => {
        discard();
        setMessage("写真を閉じました。");
        trigger.current?.focus();
      }}>写真を閉じる</button>}
    </div>
    <p role="status" className="mt-3 text-sm leading-7 text-[#53665a]">{message}</p>
    <p id={`${inputId}-help`} className="mt-3 text-xs leading-6 text-[#53665a]">カメラで撮影、または画像を選べます。カメラを使わなくても、この発見を楽しめます。</p>
    <p className="mt-2 text-xs leading-6 text-[#53665a]">写真はこの画面で一時表示するだけで、アプリから保存・送信されません。達成履歴も保存しません。</p>
  </div>;
}
