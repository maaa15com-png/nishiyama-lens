export const companionTypes = [
  "SOLO",
  "FRIENDS",
  "COUPLE",
  "SMALL_CHILDREN",
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
  "HALF_DAY",
] as const;

export type CompanionType = (typeof companionTypes)[number];
export type InterestType = (typeof interestTypes)[number];
export type DurationType = (typeof durationTypes)[number];

export type LensAnswers = {
  companion?: CompanionType;
  interest?: InterestType;
  duration?: DurationType;
};

export type LensAnswerValue = CompanionType | InterestType | DurationType;

export type LensRecommendationInput = {
  companion: CompanionType;
  interest: InterestType;
  duration: DurationType;
};

export type LensRecommendation = {
  lens: {
    id: string;
    name: string;
    companion: CompanionType;
    interest: InterestType;
  };
  course: {
    id: string;
    name: string;
    durationType: DurationType;
    durationMinutes: number;
  };
};

export type LensRecommendationResponse =
  | { recommendation: LensRecommendation }
  | {
      recommendation: null;
      reason:
        | "LENS_NOT_FOUND"
        | "COURSE_NOT_FOUND"
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
    isOneOf(interestTypes, value.interest) &&
    isOneOf(durationTypes, value.duration)
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
