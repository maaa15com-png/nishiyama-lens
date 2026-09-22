"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapboxMap, Marker } from "mapbox-gl/esm";
import type { MapSpot } from "@/lib/map/types";
import { facilityExternalUrl, facilityLabels, facilitySymbols, facilityTypes, type FacilityType, type MapFacility } from "@/lib/map/facilities";
import styles from "./MapClient.module.css";

type Props = { facilities: MapFacility[]; spots: MapSpot[]; map: MapboxMap | null; mapbox: typeof import("mapbox-gl/esm") | null };

export default function FacilityControls({ facilities, spots, map, mapbox }: Props) {
  const [visible, setVisible] = useState<Record<FacilityType, boolean>>({ TOILET: false, PARKING: false });
  const markers = useRef(new Map<string, Marker>());
  const details = useRef<HTMLDetailsElement>(null);
  const activePopup = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map || !mapbox) return;
    const created = new Map<string, Marker>();
    for (const facility of facilities) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = styles.facilityMarker;
      button.setAttribute("aria-label", facilityLabels[facility.type] + "：" + facility.name);
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = facilitySymbols[facility.type];
      button.append(icon);
      const content = document.createElement("div");
      content.className = styles.facilityPopup;
      const title = document.createElement("h3"); title.textContent = facility.name;
      const kind = document.createElement("p"); kind.textContent = facilityLabels[facility.type];
      content.append(title, kind);
      if (facility.description) { const description = document.createElement("p"); description.textContent = facility.description; content.append(description); }
      const href = facilityExternalUrl(facility.externalUrl);
      if (href) {
        const link = document.createElement("a"); link.href = href; link.textContent = "公式情報";
        link.className = "inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline-2";
        content.append(link);
      }
      const popup = new mapbox.Popup({ offset: 28, anchor: "bottom", maxWidth: "240px" }).setDOMContent(content);
      const marker = new mapbox.Marker({ element: button, anchor: "center" })
        .setLngLat([facility.longitude, facility.latitude]).setPopup(popup);
      // Center a selected amenity so the popup is readable on a narrow screen.
      popup.on("open", () => {
        if (activePopup.current !== marker) activePopup.current?.getPopup()?.remove();
        activePopup.current = marker;
        map.easeTo({ center: [facility.longitude, facility.latitude], offset: [0, 100], duration: 0 });
      });
      created.set(facility.id, marker);
    }
    markers.current = created;
    return () => {
      for (const marker of created.values()) { marker.getPopup()?.remove(); marker.remove(); }
      markers.current = new Map(); activePopup.current = null;
    };
  }, [facilities, map, mapbox]);

  useEffect(() => {
    if (!map) return;
    for (const facility of facilities) {
      const marker = markers.current.get(facility.id);
      if (visible[facility.type]) marker?.addTo(map);
      else { marker?.getPopup()?.remove(); marker?.remove(); }
    }
  }, [visible, facilities, map, mapbox]);

  function toggle(type: FacilityType) {
    const next = { ...visible, [type]: !visible[type] }; setVisible(next);
    if (!map || !mapbox) return;
    // Only an explicit filter action fits facilities; GPS still fits Course spots only.
    const bounds = new mapbox.LngLatBounds();
    for (const point of [...spots, ...facilities.filter(f => next[f.type])]) bounds.extend([point.longitude, point.latitude]);
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: { top: 65, bottom: 105, left: 75, right: 75 }, maxZoom: 16, duration: 0 });
  }
  function locate(facility: MapFacility) {
    if (!map) return;
    setVisible(current => ({ ...current, [facility.type]: true }));
    const marker = markers.current.get(facility.id);
    marker?.addTo(map);
    if (!marker?.getPopup()?.isOpen()) marker?.togglePopup();
    if (details.current) details.current.open = false;
    map.getContainer().scrollIntoView({ block: "center" });
  }
  if (facilities.length === 0) return null;
  return <section aria-label="園内・周辺の施設" className="mb-4 rounded-2xl border border-[#d9ddd3] bg-[#fffdf8] p-3 sm:p-4">
    <p className="text-sm font-semibold">施設を地図に表示</p>
    <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="施設の表示切り替え">
      {facilityTypes.filter(type => facilities.some(f => f.type === type)).map(type => <button key={type} type="button" disabled={!map}
        aria-pressed={visible[type]} onClick={() => toggle(type)}
        className={"min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-50 " + (visible[type] ? "border-[#315a78] bg-[#315a78] text-white" : "border-[#a8b4bb] text-[#23465f]")}>
        <span aria-hidden="true">{facilitySymbols[type]} </span>{facilityLabels[type]}（{facilities.filter(f => f.type === type).length}）
      </button>)}
    </div>
    <p className="mt-2 text-xs leading-6 text-[#53665a]">番号はコースのスポット、記号は施設です。</p>
    <details ref={details} className="mt-1">
      <summary className="flex min-h-11 cursor-pointer items-center text-sm underline underline-offset-4 focus-visible:outline-2">施設一覧・公式情報</summary>
      <ul className="mt-2 grid gap-3 sm:grid-cols-2">{facilities.map(facility => <li key={facility.id} className="min-w-0 rounded-xl border border-[#d9ddd3] p-3">
        <p className="text-xs text-[#53665a]">{facilityLabels[facility.type]}</p>
        <p className="mt-1 break-words text-sm font-semibold">{facility.name}</p>
        {facility.description && <p className="mt-2 text-xs leading-6">{facility.description}</p>}
        {map && <button type="button" onClick={() => locate(facility)} aria-label={facility.name + "を地図で見る"} className="mr-3 min-h-11 text-sm underline underline-offset-4 focus-visible:outline-2">地図で見る</button>}
        {facilityExternalUrl(facility.externalUrl) && <a href={facilityExternalUrl(facility.externalUrl)!} className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2">公式情報</a>}
      </li>)}</ul>
    </details>
    <p className="mt-1 text-xs leading-6 text-[#53665a]">出典：<a href="https://data.city.sabae.lg.jp/" className="underline underline-offset-4 focus-visible:outline-2">データシティ鯖江</a>（CC BY 2.1）。施設の位置情報を使用しています。</p>
  </section>;
}
