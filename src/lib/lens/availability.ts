import { durationTypes, type LensAnswers, type LensRecommendationInput } from "./types";

// Callers select published Courses first, including Result and recommendation queries.
export function isSelectableDuration(value: string): value is (typeof durationTypes)[number] {
  return durationTypes.some(duration => duration === value);
}
export function hasSelectableCourse(courses: readonly { durationType: string }[]) {
  return courses.some(course => isSelectableDuration(course.durationType));
}

// Keep a compatible answer, but never carry an unavailable Interest into a new party type.
export function availableAnswers(answers: LensAnswers, combinations: readonly LensRecommendationInput[]): LensAnswers {
  if (!combinations.some(item => item.companion === answers.companion)) return {};
  return {
    companion: answers.companion,
    interest: combinations.some(item => item.companion === answers.companion && item.interest === answers.interest)
      ? answers.interest : undefined,
  };
}
