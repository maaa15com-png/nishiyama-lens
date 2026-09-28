import { homeImages } from "./home-photos";

export const heroImages = homeImages.filter(image => ["nishiyama-azaleas", "nishiyama-autumn-leaves", "generated-panda-sunlight"].includes(image.slug));
export type HeroImage = (typeof heroImages)[number];
export const HERO_IMAGE_STORAGE_KEY = "nishiyama-lens:last-hero-image";

export function selectHeroImage<T extends { imagePath: string }>(
  candidates: readonly T[], previous: string | null, random: () => number = Math.random,
): T | null {
  const alternatives = candidates.filter(image => image.imagePath !== previous);
  const pool = alternatives.length ? alternatives : candidates;
  if (!pool.length) return null;
  return pool[Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)))];
}

type StorageAccess = () => Pick<Storage, "getItem" | "setItem">;
type Snapshot = { image: HeroImage; ready: boolean } | null;

// One store per browser document: subscription retries/remounts never reselect.
// Server rendering only reads the null server snapshot; it never touches storage.
export function createHeroImageStore(
  candidates: readonly HeroImage[], storage: StorageAccess, random: () => number = Math.random,
  fallbackStorage?: StorageAccess,
) {
  let initialized = false;
  let snapshot: Snapshot = null;
  let saved = false;
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach(listener => listener());
  return {
    getServerSnapshot: (): Snapshot => null,
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!initialized) {
        initialized = true;
        let previous: string | null = null;
        try { previous = storage().getItem(HERO_IMAGE_STORAGE_KEY); } catch { /* Storage is optional. */ }
        if (!previous && fallbackStorage) {
          try { previous = fallbackStorage().getItem(HERO_IMAGE_STORAGE_KEY); } catch { /* History may also be unavailable. */ }
        }
        const image = selectHeroImage(candidates, previous, random);
        snapshot = image ? { image, ready: false } : null;
      }
      return () => { listeners.delete(listener); };
    },
    loaded() {
      if (!snapshot || snapshot.ready) return;
      snapshot = { ...snapshot, ready: true };
      if (!saved) {
        saved = true;
        try { storage().setItem(HERO_IMAGE_STORAGE_KEY, snapshot.image.imagePath); } catch { /* Try the same-tab history below. */ }
        try { fallbackStorage?.().setItem(HERO_IMAGE_STORAGE_KEY, snapshot.image.imagePath); } catch { /* Display still works without persistence. */ }
      }
      notify();
    },
    failed() { snapshot = null; notify(); },
  };
}

// Preserve Next router state. History survives reload even when sessionStorage is blocked.
export function heroHistoryStorage(history: Pick<History, "state" | "replaceState">) {
  return {
    getItem(key: string): string | null {
      const value = history.state?.[key];
      return typeof value === "string" ? value : null;
    },
    setItem(key: string, value: string) {
      history.replaceState({ ...history.state, [key]: value }, "");
    },
  };
}
