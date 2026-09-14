import type {
  CompanionType,
  DurationType,
  InterestType,
} from "./types";

export const companionLabels: Record<CompanionType | "SMALL_CHILDREN", string> = {
  // Compatibility label for legacy DB rows; not a diagnosis option.
  SMALL_CHILDREN: "小さな子どもと",
  SOLO: "ひとりで",
  FRIENDS: "友達と",
  COUPLE: "パートナーと",
  FAMILY: "子ども連れの家族と",
};

export const interestLabels: Record<InterestType, string> = {
  PANDA: "動物",
  SEASON: "季節・自然",
  PLAY: "外遊び",
  PHOTO: "写真",
  RELAX: "のんびり",
};

export const durationLabels: Record<DurationType, string> = {
  MINUTES_30_60: "30〜60分",
  HOURS_1_2: "1〜2時間",
  HOURS_2_3: "2〜3時間",
  HALF_DAY: "半日",
};
