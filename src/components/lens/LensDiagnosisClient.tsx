"use client";

import { useState } from "react";
import { LensOptionCard } from "./LensOptionCard";
import { lensQuestions } from "./lens-data";
import type {
  LensAnswers,
  LensAnswerValue,
  LensRecommendationInput,
  LensRecommendationResponse,
} from "@/lib/lens/types";

const totalSteps = lensQuestions.length;

export function LensDiagnosisClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<LensAnswers>({});
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = lensQuestions[step];
  const selectedValue = answers[question.key];
  const isLastStep = step === totalSteps - 1;
  const canContinue = selectedValue !== undefined;

  function selectAnswer(value: LensAnswerValue) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.key]: value,
    }));
    setCompletionMessage(null);
  }

  function goBack() {
    setStep((currentStep) => Math.max(0, currentStep - 1));
    setCompletionMessage(null);
  }

  async function continueDiagnosis() {
    if (!canContinue) {
      return;
    }

    if (!isLastStep) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    if (!isCompleteAnswers(answers)) {
      setCompletionMessage("回答内容を確認して、もう一度お試しください。");
      return;
    }

    setIsSubmitting(true);
    setCompletionMessage(null);

    try {
      const response = await fetch("/api/lens/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = (await response.json()) as LensRecommendationResponse;

      if (!response.ok) {
        console.error("LENS recommendation request failed.", result);
        setCompletionMessage(
          result.recommendation === null && result.reason === "INVALID_INPUT"
            ? "回答内容を確認して、もう一度お試しください。"
            : "診断できませんでした。時間をおいてもう一度お試しください。",
        );
        return;
      }

      console.info("[NISHIYAMA LENS] recommendation", result);
      setCompletionMessage(getCompletionMessage(result));
    } catch (error) {
      console.error("LENS recommendation request failed.", error);
      setCompletionMessage(
        "診断できませんでした。通信環境を確認してもう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-9 overflow-hidden rounded-[1.75rem] border border-[#e2e4da] bg-[#fffdf8] shadow-[0_24px_70px_rgba(35,62,47,0.1)] sm:mt-12 sm:rounded-[2rem]">
      <LensProgress step={step} totalSteps={totalSteps} />

      <div className="px-5 pb-6 pt-8 sm:px-9 sm:pb-9 sm:pt-10 lg:px-12 lg:pb-12">
        <p className="text-[0.68rem] font-bold tracking-[0.24em] text-[#9a805a]">
          {question.eyebrow}
        </p>

        <fieldset
          aria-describedby="lens-question-hint"
          className="mt-3 min-w-0"
        >
          <legend className="max-w-2xl text-2xl font-medium tracking-[-0.03em] text-[#173e30] sm:text-3xl">
            {question.title}
          </legend>
          <p
            id="lens-question-hint"
            className="mt-3 text-sm leading-7 text-[#68736c]"
          >
            {question.hint}
          </p>
          <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4">
            {question.options.map((option) => (
              <LensOptionCard
                key={option.value}
                id={`lens-${question.key}-${option.value.toLowerCase().replaceAll("_", "-")}`}
                name={question.key}
                value={option.value}
                label={option.label}
                description={option.description}
                checked={selectedValue === option.value}
                onChange={() => selectAnswer(option.value)}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-8 border-t border-[#e4e5dc] pt-6 sm:mt-10 sm:flex sm:items-center sm:justify-between">
          <div className="min-h-11" aria-live="polite">
            {completionMessage ? (
              <p role="status" className="text-sm leading-6 text-[#456451]">
                {completionMessage}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 sm:mt-0 sm:justify-end">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bdc7bc] bg-white px-6 text-sm font-semibold text-[#365746] transition-colors hover:bg-[#f2f3ed] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36]"
              >
                戻る
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
            <button
              type="button"
              disabled={!canContinue || isSubmitting}
              onClick={continueDiagnosis}
              className="inline-flex min-h-12 min-w-32 items-center justify-center gap-2 rounded-full bg-[#174a36] px-6 text-sm font-bold text-white shadow-[0_10px_26px_rgba(23,74,54,0.18)] transition duration-200 hover:bg-[#0f3929] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#174a36] disabled:cursor-not-allowed disabled:bg-[#cbd1c8] disabled:text-[#737d76] disabled:shadow-none"
            >
              {isSubmitting
                ? "診断中…"
                : isLastStep
                  ? "結果を見る"
                  : "次へ"}
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function isCompleteAnswers(
  answers: LensAnswers,
): answers is LensRecommendationInput {
  return Boolean(answers.companion && answers.interest && answers.duration);
}

function getCompletionMessage(result: LensRecommendationResponse) {
  if (result.recommendation) {
    return `「${result.recommendation.lens.name}」のおすすめコースを取得しました。診断結果の表示は次のIssueで実装します。`;
  }

  if (result.reason === "LENS_NOT_FOUND") {
    return "この組み合わせの楽しみ方は、ただいま準備中です。";
  }

  if (result.reason === "COURSE_NOT_FOUND") {
    return "この滞在時間に合うコースは、ただいま準備中です。";
  }

  return "診断できませんでした。時間をおいてもう一度お試しください。";
}

function LensProgress({ step, totalSteps }: { step: number; totalSteps: number }) {
  const currentStep = step + 1;

  return (
    <div className="border-b border-[#e2e4da] bg-white px-5 py-5 sm:px-9 lg:px-12">
      <div className="flex items-center justify-between gap-6">
        <p
          aria-live="polite"
          className="text-xs font-bold tracking-[0.18em] text-[#456451]"
        >
          STEP {currentStep} / {totalSteps}
        </p>
        <p className="text-xs text-[#7b857e]">あと{totalSteps - currentStep}問</p>
      </div>
      <div
        role="progressbar"
        aria-label="LENS診断の進捗"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-valuetext={`${totalSteps}問中${currentStep}問目`}
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e7e9e1]"
      >
        <div
          className="h-full rounded-full bg-[#b07c4e] transition-[width] duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 fill-none stroke-current"
      strokeWidth="1.7"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
