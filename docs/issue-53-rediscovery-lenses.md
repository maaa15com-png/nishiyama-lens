# Issue #53 — Recapから別のLENSへ

## 目的・配置

体験後に次の1〜2個の見方を提案し、再訪のきっかけを作る。Recapの既存CTAと#52 NearbySpotセクションを維持し、その後に「次は、別のLENSで見てみる？」を追加する。現在LENS・Course・TODAY'S FIND・Headerは維持。履歴や来訪済み施設を推測せず、AI・位置・距離・ランダム推薦は行わない。

## 読み取り・推薦ルール

getRediscoveryLenses(currentLensId)は公開Lensとその公開Courseだけを読む。現在Lensが非公開・存在しない・Result非対応のCompanion/Interestなら候補なし。現在Lens自身はIDで必ず除外する。

候補はResultのisLensRecommendationInputで許容されるCompanion/Interestであり、公開CourseにdurationTypesのいずれか（MINUTES_30_60 / HOURS_1_2 / HOURS_2_3）が必要。HALF_DAYのみ、Courseなし、非公開CourseのみのLensは除外する。ResultのgetLensCoursesと同じ公開条件・durationTypesを使用し、CourseSpotの有無など独自条件は足さない。

1. 同じCompanionで異なるInterestの候補が1件以上なら、その集合から最大2件。
2. その集合が0件のときだけ別Companionへfallback。
3. 候補内は既存interestTypes順（PANDA → SEASON → PLAY → PHOTO → RELAX）、次にcompanionTypes順（SOLO → FRIENDS → COUPLE → FAMILY）。DB取得順・作成時刻・UUIDに依存しない。

同じCompanion候補が1件なら他Companionを追加しない。0件ならセクション非表示。Lensの既存unique(companion, interest)および主キーにより同一候補・同順キーは重複しない。個別Lens IDの推薦先ハードコードなし。

実装前に実DBの8Lensが公開済み、各3Courseが公開済みであることを確認。

| 現在 | 推薦順 |
| --- | --- |
| FAMILY × PANDA | FAMILY × SEASON → FAMILY × PLAY |
| FAMILY × PLAY | FAMILY × PANDA → FAMILY × SEASON |
| FAMILY × SEASON | FAMILY × PANDA → FAMILY × PLAY |
| COUPLE × SEASON | COUPLE × PHOTO |
| COUPLE × PHOTO | COUPLE × SEASON |
| SOLO × PHOTO | SOLO × RELAX |
| SOLO × RELAX | SOLO × PHOTO |
| FRIENDS × PHOTO | FAMILY × PANDA → COUPLE × SEASON |

この表は現在データでの結果であり、選定コードに固定していない。Season掲載期間での推薦ではなく別の楽しみ方の紹介。実際の季節Spotは既存#47の解決に従い、現在の見頃を断定しない。

## CTA・Language

#51のCTA処理をsrc/lib/lens/result-href.tsのlensResultHrefへ抽出して共有。新しい結果へ進む際、durationを全て除外し、companion / interestは単一の対象値へ置換する。langは既存parseLang / languageHrefに従って維持し、foo=1&foo=2等の重複queryとcourseId等の他queryも維持。入力queryは変更しない。共通Language utilityそのものの仕様変更なし。

Recap本文は既存どおり日本語中心。日本語の名称・説明とCompanion/Interestラベルを表示する。JP/ENのいずれでも「LENS results and courses — Japanese only」を表示し、日本語中心のResultへ進むことを明示する。#51のJP/ENカード文言とquery仕様は維持。

## 構成・アクセシビリティ

取得関数とRecapページはServer Component側。カードもServer Componentで追加のClient状態なし。h2/h3、ul/li、ネイティブLink、Lens名を含むaccessible name、focus-visible、48px以上のCTA領域を用いる。長い名前・説明は折り返し、省略しない。カード全体のbutton化や色だけの分類をしない。

## データ保護

schema / Migration / Seed変更なし。既存13モデルは読み取りのみ。#52の関連・推薦・表示件数・注意情報を変更しない。

## 検証

- 全142テストPASS（既存132件＋新規10件）。#52のRecap回帰テストも拡張し、現在Lens・Course・Find・既存CTAと2つの推薦セクションの順序を確認。
- TypeScript、変更ファイルESLint、本番build、git diff --checkはPASS。
- Chromiumの本番buildで8Lens × 5幅（320 / 375 / 768 / 1280 / 1440px）× JP/ENの80ケースを検証。推薦順・1/2カード・query・NearbySpot件数維持・48px以上のCTA・focus-visible・横スクロールなし、ページ実行時エラーなしを確認。
- 推薦に現れる7種類のResult URLを開き、対象Lensと各3Courseを確認。0件非表示は取得/UIの自動テストで確認。
- 320pxで長い名称・説明・CTA折り返しを追加確認。320px / 1440pxのスクリーンショットを目視確認。GlobalHeaderの開閉・Escapeも確認。
- 実DBの全13モデルを実装前スナップショットと比較し全行全値一致。DB書き込みは実施していない。
- iPhone Safari実機は未確認。

## 今後の課題

iPhone Safari実機の最終E2E。利用者の反応を踏まえた編集順の見直しは別途検討する。個人履歴・AI・季節掲載期間連動・Recap本文の英訳・#56/#61は今回の対象外。
