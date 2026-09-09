"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapboxMap, Marker } from "mapbox-gl/esm";
import { spotCategoryLabels } from "@/lib/courses/labels";
import type { MapSpot } from "@/lib/map/types";
import styles from "./MapClient.module.css";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

export default function MapClient({ spots }: { spots: MapSpot[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!accessToken || !containerRef.current) return;
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    const markers: Marker[] = [];

    async function initialize() {
      try {
        const mapbox = await import("mapbox-gl/esm");
        if (cancelled || !containerRef.current) return;
        if (!mapbox.supported()) {
          setStatus("error");
          return;
        }

        const map = new mapbox.Map({
          container: containerRef.current,
          accessToken,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [136.181872, 35.949674],
          zoom: 15,
          language: "ja",
        });
        mapRef.current = map;
        map.on("load", () => { if (!cancelled) setStatus("ready"); });
        map.on("error", () => { if (!cancelled) setStatus("error"); });
        map.addControl(new mapbox.NavigationControl({ showCompass: false }), "top-right");

        const bounds = new mapbox.LngLatBounds();
        for (const spot of spots) {
          const position: [number, number] = [spot.longitude, spot.latitude];
          bounds.extend(position);
          const button = document.createElement("button");
          button.type = "button";
          button.className = styles.marker;
          button.setAttribute("aria-label", `${spot.sortOrder} ${spot.name}`);
          const number = document.createElement("span");
          number.className = styles.number;
          number.textContent = String(spot.sortOrder);
          const name = document.createElement("span");
          name.className = styles.name;
          name.textContent = spot.name;
          button.append(number, name);

          // DOM text avoids treating names from the database as HTML.
          const content = document.createElement("div");
          content.className = styles.popup;
          const title = document.createElement("h3");
          title.textContent = `${spot.sortOrder} ${spot.name}`;
          const category = document.createElement("p");
          category.textContent = spotCategoryLabels[spot.category];
          content.append(title, category);
          const popup = new mapbox.Popup({ offset: 28, maxWidth: "240px" })
            .setDOMContent(content);
          markers.push(new mapbox.Marker({ element: button, anchor: "center" })
            .setLngLat(position)
            .setPopup(popup)
            .addTo(map));
        }

        const fitSpots = () => {
          map.resize();
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
              padding: { top: 65, bottom: 105, left: 75, right: 75 },
              maxZoom: 16,
              duration: 0,
            });
          }
        };
        fitSpots();
        observer = new ResizeObserver(fitSpots);
        observer.observe(containerRef.current);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      observer?.disconnect();
      for (const marker of markers) {
        marker.getPopup()?.remove();
        marker.remove();
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [spots]);

  if (!accessToken) {
    return (
      <div role="status" className={styles.unavailable}>
        <p className="text-lg font-semibold">地図の設定がまだ完了していません</p>
        <p className="mt-3 text-sm leading-7">コース内のスポットは、下の一覧で確認できます。</p>
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <div ref={containerRef} className={styles.map} role="region" aria-label="西山公園のコース地図" />
      {status === "loading" && <p role="status" className={styles.message}>地図を読み込んでいます…</p>}
      {status === "error" && <p role="alert" className={styles.message}>地図を読み込めませんでした。通信環境や地図の設定をご確認ください。</p>}
    </div>
  );
}
