"use client";

import { type Query } from "@/lib/language";

import { availableAnswers } from "@/lib/lens/availability";
import { lensResultHref } from "@/lib/lens/result-href";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LensOptionCard } from "./LensOptionCard";
import { lensQuestions } from "./lens-data";
import type {
  LensAnswers,
  LensAnswerValue,
  LensRecommendationInput,
} from "@/lib/lens/types";

const totalSteps = lensQuestions.length;

export function LensDiagnosisClient({ query, combinations }: { query: Query; combinations: LensRecommendationInput[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [storedAnswers, setAnswers] = useState<LensAnswers>({});
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answers = availableAnswers(storedAnswers, combinations);
  const question = lensQuestions[step];
  const options = question.options.filter(option => combinations.some(item => question.key === "companion"
    ? item.companion === option.value
    : item.companion === answers.companion && item.interest === option.value));
  const selectedValue = answers[question.key];
  const isLastStep = step === totalSteps - 1;
  const canContinue = options.some(option => option.value === selectedValue);

  function selectAnswer(value: LensAnswerValue) {
    setAnswers(currentAnswers => availableAnswers({ ...currentAnswers, [question.key]: value }, combinations));
    setCompletionMessage(null);
  }

  function goBack() {
    setStep((currentStep) => Math.max(0, currentStep - 1));
    setCompletionMessage(null);
  }

  function continueDiagnosis() {
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
    router.push(lensResultHref(answers, query));
  }

  if (!combinations.length) return <div role="status" className="mt-9 rounded-3xl border border-[#e2e4da] bg-[#fffdf8] p-6 text-sm leading-8">
    現在選べるLENSを確認できませんでした。時間をおいて、もう一度お試しください。
  </div>;

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
            {step === 1 && <span className="mt-2 block">一緒に過ごす人に合わせて、今楽しめるLENSから選べます。</span>}
          </p>
          <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4">
            {options.map((option) => (
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
  return Boolean(answers.companion && answers.interest);
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
