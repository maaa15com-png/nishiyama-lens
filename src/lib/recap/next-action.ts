import type { InterestType } from "../lens/types";

const actions: Record<InterestType, { interest: InterestType; label: string }> = {
  PANDA: { interest: "SEASON", label: "次は季節の西山公園も見てみる" },
  SEASON: { interest: "PANDA", label: "次はレッサーパンダに会いにいく" },
  PLAY: { interest: "RELAX", label: "次はのんびり過ごすコースを探す" },
  PHOTO: { interest: "SEASON", label: "別の景色を探してみる" },
  RELAX: { interest: "PHOTO", label: "次は写真に残したい景色を探す" },
};

// Lens determines the next theme. Course duration is only a candidate-selection hint.
export function getNextAction(interest: InterestType) {
  return { ...actions[interest] };
}
