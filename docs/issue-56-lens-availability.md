# Issue #56 — 今あるLENSを確実に選べる診断

## 実装前調査

2026-09-24に実DBを読み取り確認。公開Lens 8件、非公開Lens 0件。各Lensに3件ずつ公開Course（合計24件）があり、すべてMINUTES_30_60 / HOURS_1_2 / HOURS_2_3を選択可能。非公開Courseは0件。

| Companion | 公開LensのInterest（表示順） | 未対応Interest |
| --- | --- | --- |
| SOLO | PHOTO / RELAX | PANDA / SEASON / PLAY |
| FRIENDS | PHOTO | PANDA / SEASON / PLAY / RELAX |
| COUPLE | SEASON / PHOTO | PANDA / PLAY / RELAX |
| FAMILY | PANDA / SEASON / PLAY | PHOTO / RELAX |

各セルのCompanion × Interestが個々のLens。従来のQ1はSOLO / FRIENDS / COUPLE / FAMILY、Q2はPANDA / SEASON / PLAY / PHOTO / RELAXを無条件に表示し、未対応12組み合わせを選択できた。

Resultは公開Lensなしで準備中の安全案内、公開Lensはあるが選択可能Courseが0件ならCourse準備中の案内。不正・重複回答は入力確認案内、DB取得失敗は再試行案内。これらの防御UIは維持する。

## 採用方針

A「既存Lensだけ診断候補として成立させる」。新規Lens / Course、schema / Migration / Seed変更はない。DBは全13モデル読み取りのみ。

getAvailableLensCombinationsがServerで公開Lensとその公開Courseを取得し、対応Companion / Interestおよび選択可能Courseを確認する。Clientへ渡すのはcompanion / interestの組のみ。DBアクセスや施設情報をClientへ持ち込まない。

Courseの対応Duration判定をsrc/lib/lens/availability.tsへ集約。Result・#51・#53・今回の取得処理で同じ対応Duration判定を使う。公開条件は各既存取得クエリで維持する。CourseSpotの数等、Resultにない追加条件は導入しない。HALF_DAYのみ・Courseなし・非公開Courseのみは診断候補にならない。

## 診断UIと回答状態

Q1は利用可能Lensが1件以上あるCompanionだけを既存順で表示。現在は4候補すべて表示する。Q2は選んだCompanionに利用可能なInterestだけを元の選択肢順で表示し、「一緒に過ごす人に合わせて、今楽しめるLENSから選べます。」を補足。

availableAnswersでCompanionに対応しないInterestを解除する。Q2から戻る→Companion変更でも状態更新時に古いInterestを除去し、結果ボタンは新しい選択までdisabled。共通して利用可能なInterest（例：SOLO PHOTO→COUPLE PHOTO）は維持する。表示・送信でも有効な回答を用い、古い無効値で進めない。

利用可能Interestが0件のCompanionはQ1から除外する。全件0または取得失敗なら空の質問を表示せず、「現在選べるLENSを確認できませんでした。時間をおいて、もう一度お試しください。」と案内する。

ネイティブradio・fieldset/legend・選択チェック表示・peer-focus-visible・disabledボタン・進捗のaria-liveを維持する。

## Result・query・Language

診断結果は選んだCompanion / Interestをそのまま使用し、別Lensへすり替えない。#51/#53と同じlensResultHrefでduration除去・回答置換・lang/他query/同名複数query維持。質問数は2問のまま、本文は日本語中心。GlobalHeaderとEnglish Guideは変更しない。

未対応直接URL、古いブックマーク、不正回答のResult防御は残す。ページ表示後に管理者が公開状態を変更した場合は、Result時点の最新DB判定が優先され、安全案内になることがある。閲覧中の公開状態を固定する仕組みや定期ポーリングは今回追加しない。

## 検証

- 全157テストPASS（既存142件＋新規15件）。公開条件・Course条件・全Companionの選択肢順・無効回答reset・有効回答維持・0件・DB取得失敗・query維持を確認。#42/#51/#53およびResult回帰もPASS。
- TypeScript、変更ファイルESLint、npm run build、git diff --checkはPASS。
- Chromium本番buildで8組み合わせ × 5幅（320 / 375 / 768 / 1280 / 1440px）× JP/EN、全80診断を完了。すべて正しいLensと3Courseが表示され、lang・重複queryが維持されることを確認。
- 未対応12組み合わせの直接URLはHTTP 200の準備中案内と診断再開Linkを表示。404 / 500 / 空白画面なし。
- 各5幅でFAMILY PANDA→戻る→COUPLEのリセット、結果ボタンdisabled、長い補足、横スクロールなしを確認。
- ネイティブradioのSpace操作とfocus-visible、GlobalHeaderの開閉・Escapeを確認。ブラウザ実行時エラーなし。320px / 1440pxの実描画も目視確認。
- 実装前後でDB全13モデルを比較し全行全値一致。書き込み・schema・Migration・Seed変更なし。
- iPhone Safari実機は未確認。

## 今後の課題

新規Lensは実際の体験・Course設計が成立した場合に別Issueで追加する。公開Lensと選択可能Courseが追加されれば診断候補へ自動反映する。未対応12件を数合わせで追加しない。iPhone Safari実機の最終E2Eは別途実施する。
