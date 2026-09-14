import type { LensAnswers, LensAnswerValue } from "@/lib/lens/types";

type LensQuestion = {
  key: keyof LensAnswers;
  eyebrow: string;
  title: string;
  hint: string;
  options: readonly {
    value: LensAnswerValue;
    label: string;
    description: string;
  }[];
};

export const lensQuestions = [
  {
    key: "companion",
    eyebrow: "COMPANION",
    title: "誰と行きますか？",
    hint: "今回、一緒に公園を楽しむ人を選んでください。",
    options: [
      { value: "SOLO", label: "ひとり", description: "自分のペースで楽しむ" },
      { value: "FRIENDS", label: "友達", description: "気の合う仲間と出かける" },
      { value: "COUPLE", label: "パートナー", description: "ふたりの時間を過ごす" },
      { value: "FAMILY", label: "家族", description: "子どもと一緒に楽しむ" },
    ],
  },
  {
    key: "interest",
    eyebrow: "INTEREST",
    title: "何を楽しみたいですか？",
    hint: "今日いちばん気になる過ごし方を選んでください。",
    options: [
      { value: "PANDA", label: "動物", description: "レッサーパンダたちに会う" },
      { value: "SEASON", label: "季節・自然", description: "草花や木々の色を感じる" },
      { value: "PLAY", label: "外遊び", description: "遊具や広場で思いきり遊ぶ" },
      { value: "PHOTO", label: "写真", description: "心に残る景色を見つける" },
      { value: "RELAX", label: "のんびり", description: "ゆっくり歩いてひと休みする" },
    ],
  },
] as const satisfies readonly LensQuestion[];
