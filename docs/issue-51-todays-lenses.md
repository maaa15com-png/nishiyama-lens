# Issue #51 — 今日おすすめのLENS

## 目的と表示位置

通常の2問診断を維持し、季節の掲載期間から探す別入口をトップに追加する。LENS説明（FIND YOUR LENS）の直後、既存FAMILY × PANDA紹介の前に配置。Hero・通常CTA・Headerは変更しない。

## 表示条件・選択ルール

- Serverでリクエストごとの現在日時を取得し、既存isSeasonActive()でAsia/Tokyoの年月日を判定する。クライアントのタイムゾーンに依存しない。
- 公開Seasonのうちactiveがちょうど1件で、slugが対応表のいずれかの場合のみ候補を取得する。
- spring-cherry-blossoms → nishiyama-cherry-blossoms（現行DBは4/1〜4/10）
- spring-azaleas → nishiyama-azaleas（現行DBは5月）
- autumn-leaves → nishiyama-autumn-leaves（現行DBは11月）
- 日付範囲はコードへ重複定義せずDBから読む。桜の期間は掲載用であり、実際の開花を保証しない。
- activeなし、複数active（未知のSeasonとの重複を含む）、対応外Seasonのみの場合はセクション全体を非表示。
- 順序はFAMILY × SEASON → COUPLE × SEASON。公開Lensかつ既存Resultで選択可能な公開Courseを1件以上持つもののみ。Resultと同じdurationTypes定数を利用し、旧HALF_DAYのみでは表示しない。
- 最大2件。有効候補が1件なら1件、0件なら枠ごと非表示。重複した同一companion候補があっても任意選択しない。
- データ取得失敗も枠だけ非表示。サーバーログへ記録し、通常トップの案内は維持。

## 構成

- src/lib/server/todays-recommended-lenses.ts: 公開条件、季節判定、固定順、画像対応をまとめた読み取り関数。
- src/components/home/TodaysLenses.tsx: Server Componentのカード。取得関数の戻り値だけを受け取る。
- src/app/page.tsx: 取得関数を呼び、既存セクションの間へ追加。ページ全体のClient化なし。
- src/components/spots/SpotImage.tsx: 既存画像表示を再利用。任意lang引数を追加し、デフォルトjaの既存Spot表示を維持。
- schema / Migration / Seed / DBの変更なし。CourseSpotSeason、resolveCourseSpots、TODAY'S FIND、診断APIは変更しない。

## 画像・ライセンス

Issue #55のsrc/lib/media/spot-images.jsonとgetSpotImage()を利用。公開SpotのslugとDB imageUrlが承認済み定義に一致するときだけ表示する。外部URLや別画像へCCライセンスを流用しない。画像Spotが非公開・欠落・不一致の場合、カードの文章とCTAは維持して画像を省略する。

ツツジ→ツツジ、紅葉→紅葉。桜は画像なしで成立し、空の画像枠を設けない。動物園画像は今回の季節推薦には使用しない。既存画像ファイル・メタデータは変更しない。

写真には元のalt・出典・作品名・CC BY 2.1 JPリンク・加工内容を表示する。画像は全体を表示し、新しいcropはしない。「代表イメージ」と、現在の開花・紅葉状況ではないことを明記。

## LanguageとCTA

トップのJP/ENに従って見出し・説明・CTA・代表画像の注意書きを表示する。Lens説明は既存descriptionEnを使い、未設定ならlang=ja付きで日本語fallback。Season名はnameEnがあれば優先し、未設定の既知3Seasonには画面側の短い英訳を使用する。DBに英訳を書き込まない。画像alt・作品名・加工内容は日本語として言語属性を明示。

CTA: /lens/result?companion=FAMILY&interest=SEASON またはCOUPLE。既存languageHref()でlang・同名複数値を含む他queryを保持し、対象companion/interestを置き換える。既存queryは原則維持するが、旧診断仕様のdurationはこのCTA生成時だけ除外する（同名複数値もすべて除外）。元のqueryおよび共通Language utilityは変更しない。結果・Courseは日本語中心のため、入口に「LENS results and courses — Japanese only」を常時表示する。

## Responsive・Accessibility

320 / 375pxは縦1列、768px以上は2列。カードはmin-width:0、文章折返し、画像は元比率を保持。CTAは48px以上、focus-visibleを設定。sectionの見出しh2・カードのh3、文字でSeason名を表示し、色だけに依存しない。出典リンクはカード全体リンクに入れず個別に操作可能。

## テスト・確認方法

tests/todays-lenses.test.mjsに、3Season・日本時間境界・Seasonなし・複数active・未知Season・公開条件・Courseなし・画像なし・query維持・EN・通常CTA維持・DB取得失敗を追加。

実DBに対する日付指定の読み取りでも3Season/2Lens/画像対応を確認。ブラウザ確認はテスト専用NextプロセスのDateだけを一時ディレクトリ内のpreloadで切り替える。アプリコードへ日付変更URLや環境設定は導入しない。DBのSeasonを更新せず、各季節の本番ビルド画面を確認する。

- 全120テストPASS（既存106 + 新規14）。#47季節Course・#55画像・診断・GlobalHeaderを含む既存テストもPASS。
- TypeScript / 変更ファイルESLint / npm run build / git diff --check: PASS。
- 本番ビルドをテスト専用時計で確認。桜・ツツジ・紅葉・Seasonなし × JP/EN × 320 / 375 / 768 / 1280 / 1440px = 40ケースPASS。
- カード件数・画像有無・画像読み込み・画像はみ出しなし・横スクロールなし・CTA44px以上・focus-visible・query維持を確認。320pxのツツジとPC英語の紅葉は画面を目視確認。
- FAMILY / COUPLEの両CTAから実際のResultへ遷移し、描画完了後に3時間区分のCourseとlang・複数query維持を確認。
- DB全13モデルを検証前後で比較し、更新日時を含む全値不変。Seedは実行していない。
- iPhone Safari実機は未確認。時計差し替えは一時テストプロセスのみで終了し、リポジトリへ混入していない。

## 将来課題

実際の開花・紅葉状況、天候、ランキング、個人履歴には未対応。季節外推薦・複数Seasonの優先順位・未対応Seasonの追加は別途設計する。ページを開いたまま日付が変わった場合は自動再判定せず、次のリクエストで反映。iPhone Safari実機は最終確認対象。

## duration query修正（2026-09-24）

おすすめCTA用にqueryを浅くコピーしてdurationだけを削除し、元のqueryは変更しない。FAMILY / COUPLE両方について、duration単一値・複数値の除去、lang、foo=1&foo=2、courseId維持、companion / interest置換を追加テストで確認。TypeScript・変更ファイルESLint・build・git diff --checkも再実行してPASS。
