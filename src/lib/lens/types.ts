export const companionTypes = [
  "SOLO",
  "FRIENDS",
  "COUPLE",
  "FAMILY",
] as const;

export const interestTypes = [
  "PANDA",
  "SEASON",
  "PLAY",
  "PHOTO",
  "RELAX",
] as const;

export const durationTypes = [
  "MINUTES_30_60",
  "HOURS_1_2",
  "HOURS_2_3",
] as const;

export type CompanionType = (typeof companionTypes)[number];
export type InterestType = (typeof interestTypes)[number];
// Keep the legacy DB type for existing detail/Recap labels.
export type DurationType = (typeof durationTypes)[number] | "HALF_DAY";

export type LensAnswers = {
  companion?: CompanionType;
  interest?: InterestType;
};

export type LensAnswerValue = CompanionType | InterestType;

export type LensRecommendationInput = {
  companion: CompanionType;
  interest: InterestType;
};

export type LensRecommendation = {
  lens: {
    id: string;
    name: string;
    description: string;
    companion: CompanionType;
    interest: InterestType;
  };
  courses: {
    id: string;
    name: string;
    description: string | null;
    durationType: (typeof durationTypes)[number];
    durationMinutes: number;
  }[];
};

export type LensRecommendationResponse =
  | { recommendation: LensRecommendation }
  | {
      recommendation: null;
      reason:
        | "LENS_NOT_FOUND"
        | "INVALID_INPUT"
        | "INTERNAL_ERROR";
    };

export function isLensRecommendationInput(
  value: unknown,
): value is LensRecommendationInput {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isOneOf(companionTypes, value.companion) &&
    isOneOf(interestTypes, value.interest)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(
  allowedValues: readonly T[],
  value: unknown,
): value is T {
  return (
    typeof value === "string" &&
    (allowedValues as readonly string[]).includes(value)
  );
}
