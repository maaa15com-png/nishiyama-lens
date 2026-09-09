"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapboxMap, Marker } from "mapbox-gl/esm";
import { spotCategoryLabels } from "@/lib/courses/labels";
import type { MapSpot } from "@/lib/map/types";
import { findNearestSpot, formatDistance } from "@/lib/map/nearest-spot";
import { useCurrentLocation, locationMessages } from "./useCurrentLocation";
import styles from "./MapClient.module.css";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();

export default function MapClient({ spots }: { spots: MapSpot[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const mapboxRef = useRef<typeof import("mapbox-gl/esm") | null>(null);
  const courseMarkersRef = useRef(new Map<number, Marker>());
  const [mapInstance, setMapInstance] = useState<MapboxMap | null>(null);
  const { state: location, requestLocation } = useCurrentLocation();
  const nearest = useMemo(() => location.position ? findNearestSpot(location.position, spots) : null, [location.position, spots]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!accessToken || !containerRef.current) return;
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    const markers: Marker[] = [];
    const courseMarkers = courseMarkersRef.current;

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
        mapboxRef.current = mapbox;
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
          const nextBadge = document.createElement("span");
          nextBadge.className = styles.nextBadge;
          nextBadge.textContent = "おすすめ";
          button.append(number, name, nextBadge);

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
          const marker = new mapbox.Marker({ element: button, anchor: "center" })
            .setLngLat(position)
            .setPopup(popup)
            .addTo(map);
          markers.push(marker);
          courseMarkers.set(spot.sortOrder, marker);
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
        // Resizing must not reset a view chosen by the user or a GPS request.
        observer = new ResizeObserver(() => map.resize());
        observer.observe(containerRef.current);
        setMapInstance(map);
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
      mapboxRef.current = null;
      courseMarkers.clear();
    };
  }, [spots]);

  useEffect(() => {
    const mapbox = mapboxRef.current;
    if (!location.position || !mapInstance || mapInstance !== mapRef.current || !mapbox) return;

    const position: [number, number] = [location.position.longitude, location.position.latitude];
    const element = document.createElement("div");
    element.className = styles.currentMarker;
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", "現在地");
    const label = document.createElement("span");
    label.textContent = "現在地";
    element.append(label);
    const marker = new mapbox.Marker({ element }).setLngLat(position).addTo(mapInstance);

    const bounds = new mapbox.LngLatBounds(position, position);
    const courseMarkers = courseMarkersRef.current;
    for (const spot of spots) {
      bounds.extend([spot.longitude, spot.latitude]);
      const button = courseMarkers.get(spot.sortOrder)?.getElement();
      if (button && nearest?.spot.sortOrder === spot.sortOrder) {
        button.classList.add(styles.nextMarker);
        button.setAttribute("aria-label", `${spot.sortOrder} ${spot.name} 次におすすめ`);
      }
    }
    // Only a new position (or a newly mounted map) changes the camera.
    mapInstance.fitBounds(bounds, {
      padding: { top: 85, bottom: 105, left: 75, right: 75 },
      maxZoom: 16,
      duration: 0,
    });

    return () => {
      marker.remove();
      for (const spot of spots) {
        const button = courseMarkers.get(spot.sortOrder)?.getElement();
        button?.classList.remove(styles.nextMarker);
        button?.setAttribute("aria-label", `${spot.sortOrder} ${spot.name}`);
      }
    };
  }, [mapInstance, location.position, nearest, spots]);

  if (!accessToken) {
    return (
      <div role="status" className={styles.unavailable}>
        <p className="text-lg font-semibold">地図の設定がまだ完了していません</p>
        <p className="mt-3 text-sm leading-7">コース内のスポットは、下の一覧で確認できます。</p>
      </div>
    );
  }

  return (
    <>
      <section aria-label="現在地の表示" className="mb-5 rounded-2xl border border-[#d9ddd3] bg-[#fffdf8] p-5">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-[#53665a]">現在地から、近くのコース内スポットを探しましょう。</p>
          <button
            type="button"
            onClick={requestLocation}
            disabled={location.status === "requesting"}
            aria-describedby="location-status"
            className="min-h-12 shrink-0 rounded-full bg-[#174a36] px-6 py-3 text-sm font-bold text-white hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36] disabled:cursor-wait disabled:opacity-60"
          >
            {location.status === "requesting" ? "現在地を確認中…" : location.status === "idle" ? "現在地を表示" : "現在地を再取得"}
          </button>
        </div>
        <p id="location-status" role="status" className="mt-3 text-sm leading-7 text-[#53665a]">{locationMessages[location.status]}</p>
      </section>
      <div className={styles.frame}>
        <div ref={containerRef} className={styles.map} role="region" aria-label="西山公園のコース地図" />
        {status === "loading" && <p role="status" className={styles.message}>地図を読み込んでいます…</p>}
        {status === "error" && <p role="alert" className={styles.message}>地図を読み込めませんでした。通信環境や地図の設定をご確認ください。</p>}
      </div>
      {location.status === "success" && (
        <section aria-label="次におすすめ" className="mt-5 rounded-2xl border border-[#bccbb5] bg-[#edf1e7] p-5" aria-live="polite">
          {nearest ? (
            <>
              <p className="text-xs font-bold tracking-wider">次におすすめ</p>
              <h2 className="mt-2 break-words text-xl font-semibold">{nearest.spot.sortOrder}. {nearest.spot.name}</h2>
              <p className="mt-2 text-sm font-semibold">現在地から{formatDistance(nearest.distanceMeters)}（直線距離の目安）</p>
              <p className="mt-2 text-xs leading-6 text-[#53665a]">コース内で現在地に最も近いスポットです。位置情報には誤差があります。</p>
            </>
          ) : (
            <p className="text-sm leading-7">このコースには、現在地からおすすめできるスポットがありません。</p>
          )}
        </section>
      )}
    </>
  );
}