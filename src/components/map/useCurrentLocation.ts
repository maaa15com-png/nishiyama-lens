"use client";

import { useEffect, useRef, useState } from "react";
import { isValidCoordinates, type Coordinates } from "@/lib/map/nearest-spot";

type LocationState =
  | { status: "idle" | "requesting" | "denied" | "unavailable" | "timeout" | "error"; position: null }
  | { status: "success"; position: Coordinates };

export const locationMessages: Record<LocationState["status"], string> = {
  idle: "現在地を使って、近くのコース内スポットを探せます。",
  requesting: "現在地を確認しています…",
  success: "現在地を確認しました。",
  denied: "現在地を表示するには、位置情報の利用を許可してください。",
  unavailable: "現在地を取得できませんでした。場所や端末の設定を確認して、もう一度お試しください。",
  timeout: "現在地の確認に時間がかかっています。もう一度お試しください。",
  error: "この環境では現在地を取得できません。地図とスポット一覧はそのまま利用できます。",
};

export function useCurrentLocation() {
  const [state, setState] = useState<LocationState>({ status: "idle", position: null });
  const mounted = useRef(false);
  const requestId = useRef(0);
  const requesting = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestId.current += 1;
      requesting.current = false;
    };
  }, []);

  function requestLocation() {
    if (!mounted.current || requesting.current) return;
    if (!window.isSecureContext || !navigator.geolocation) {
      setState({ status: "error", position: null });
      return;
    }

    requesting.current = true;
    const id = ++requestId.current;
    setState({ status: "requesting", position: null });
    function finish(nextState: LocationState) {
      if (!mounted.current || requestId.current !== id) return;
      requesting.current = false;
      setState(nextState);
    }

    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const position = { latitude: coords.latitude, longitude: coords.longitude };
          finish(isValidCoordinates(position)
            ? { status: "success", position }
            : { status: "unavailable", position: null });
        },
        (error) => {
          const status = error.code === 1 ? "denied"
            : error.code === 2 ? "unavailable"
            : error.code === 3 ? "timeout" : "error";
          finish({ status, position: null });
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
      );
    } catch {
      finish({ status: "error", position: null });
    }
  }

  return { state, requestLocation };
}
