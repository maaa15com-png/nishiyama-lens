# Issue #47 追加LENS・時間別Course・季節候補

実装日: 2026-09-23（JST）。既存データを更新しない追加専用Seedで実装。

## データ構成

新規Lensは4件。LensにnameEnカラムはないため、既存と同じ英字name、日本語title/description、英語titleEn/descriptionEnを使用。新規カラムは増やさない。

| Lens | UUID | 日本語説明 |
| --- | --- | --- |
| FAMILY × SEASON | 38fc8d90-e2aa-4d5b-b135-2278f30347e5 | 家族で、季節の景色や花を楽しむLENS。 |
| COUPLE × SEASON | 91161523-145c-4fbe-b7f4-07b536731d48 | ふたりで、季節の景色をゆっくり楽しむLENS。 |
| FRIENDS × PHOTO | 6626da45-9386-4d2f-984b-1151e41396db | 友達と、景色や写真を楽しむLENS。 |
| SOLO × PHOTO | 5b83edc3-e839-4fd6-8302-52f7c94aef8c | ひとりで、自分のペースで景色や写真を楽しむLENS。 |

| Lens | 時間 | Course名 | Course UUID | Spot枠（番号順） |
| --- | --- | --- | --- | --- |
| FAMILY × SEASON | MINUTES_30_60 | 家族で季節を楽しむコース | 85d649b0-498e-46e6-b065-c8231eb6be78 | seasonal-highlight |
| FAMILY × SEASON | HOURS_1_2 | 家族で季節と遊びを楽しむコース | 0d85fd96-a449-4f6e-afe4-22cd1d20abe0 | seasonal-highlight → adventure-forest |
| FAMILY × SEASON | HOURS_2_3 | 家族で季節と景色を楽しむコース | 2e186bda-68b5-4d07-9c70-450962063cb9 | seasonal-highlight → adventure-forest → ai-no-kane-observation-deck → michi-no-eki-nishiyama |
| COUPLE × SEASON | MINUTES_30_60 | ふたりで季節を楽しむコース | 4ee9192b-f9f3-4960-8f63-18c806253eb3 | seasonal-highlight |
| COUPLE × SEASON | HOURS_1_2 | ふたりで季節と庭を楽しむコース | 13fdcc5d-a1e6-4c9e-a827-7bfa95c0440a | seasonal-highlight → shodoan |
| COUPLE × SEASON | HOURS_2_3 | ふたりで季節と景色を楽しむコース | 9a30e8b4-2c5c-43ce-b583-f5dc0d6b10eb | seasonal-highlight → shodoan → nishiyama-bridge → ai-no-kane-observation-deck |
| FRIENDS × PHOTO | MINUTES_30_60 | 友達と写真を楽しむコース | 2a5835e6-b9af-4e2e-a3a5-17b0737b767d | nishiyama-bridge |
| FRIENDS × PHOTO | HOURS_1_2 | 友達と季節を撮るコース | 93ef2d88-b8c5-4652-a974-658b9cb96cba | nishiyama-bridge → seasonal-highlight |
| FRIENDS × PHOTO | HOURS_2_3 | 友達と西山公園を撮り歩くコース | 0c649512-e5b8-42ac-a543-faa475835913 | nishiyama-bridge → seasonal-highlight → ai-no-kane-observation-deck → michi-no-eki-nishiyama |
| SOLO × PHOTO | MINUTES_30_60 | ひとりで季節を撮るコース | 56e28f79-44d3-4679-b68a-16d57f7363f7 | seasonal-highlight |
| SOLO × PHOTO | HOURS_1_2 | ひとりで景色を撮り歩くコース | de1de61d-0028-4a68-bfeb-57644351b9df | seasonal-highlight → nishiyama-bridge |
| SOLO × PHOTO | HOURS_2_3 | ひとりで静かに写真を楽しむコース | b8fd7c8b-bcef-4ed8-9948-01e8b48e4490 | seasonal-highlight → nishiyama-bridge → shodoan → ai-no-kane-observation-deck |

時間区分は既存の30〜60分/1〜2時間/2〜3時間。durationMinutesは既存Courseと同じ60/90/150の編集上の目安。測定した徒歩時間ではない。Course名に時間を重複記載しない。sortOrderは既存UIと同じMapの番号で、推奨巡回順の保証ではない。高低差のある展望台を含み、未確認のベビーカー可否や移動時間を追加していない。

季節枠はFAMILY×SEASONの3枠、COUPLE×SEASONの3枠、FRIENDS×PHOTOの中/長時間2枠、SOLO×PHOTOの3枠、計11枠。各枠3候補でCourseSpotSeasonは33件。既存4LensのCourseSpotには候補を追加しない。

## Schema / Migration

CourseSpotSeason: id(UUID), courseSpotId, seasonId, spotId。courseSpotId×seasonIdが一意。3つの外部キーと検索索引を追加。外部キー削除動作は既存と同じ指定なし（PostgreSQLの既定NO ACTION）。既存CourseSpot.spotIdは通常/fallbackとして保持。

Prisma 8 RCのcontract emit → migration plan → db migrate → db verifyを使用。classic Prisma Clientは使用しない。
Migration: migrations/app/20260922T1653_add_course_spot_seasons/。新規テーブル・制約・索引のみの8操作。DROP/既存テーブルの列変更/既存行の更新なし。生成snapshotとschema.json/schema.d.tsもコミット対象。

適用前storage hash: 2c5775f19def5aa838f687486538045c29c35b519f77d17ce934f6afba1b1a44
適用後storage hash: 1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998

生成・適用したコマンド:

~~~sh
npx prisma contract emit
npx prisma migration plan --from 2c5775f19def5aa838f687486538045c29c35b519f77d17ce934f6afba1b1a44 --name add_course_spot_seasons
npx prisma db migrate
npx prisma db verify
npm run db:seed:issue-47
~~~

別環境では生成済みMigrationをdb migrateで適用してから追加Seedを実行する。既存Spot10件と春のツツジ/秋の紅葉Seasonが前提。依存データ不足・ID/unique衝突・季節重複・既存の枠/候補の対応不一致はエラーで全体rollback。従来の更新型db:seedを今回の追加のために実行しない。

## 季節の判定

| Season | 期間（日本時間・両端含む） | Spot |
| --- | --- | --- |
| spring-cherry-blossoms | 4/1〜4/10 | nishiyama-cherry-blossoms |
| spring-azaleas | 既存5月全体（日NULL） | nishiyama-azaleas |
| autumn-leaves | 既存11月全体（日NULL） | nishiyama-autumn-leaves |

桜Season UUID: 123eb7a8-b1e2-4130-ba23-254f176eb756。name=春の桜、seasonGroup=SPRING、公開。
根拠: https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/koen.html
**公式の「4月上旬」という表現をもとに、アプリ内掲載期間を4/1〜4/10として設定。実際の開花・満開を保証しない。** 5月・11月も掲載期間でありリアルタイムの見頃情報ではない。

共通サーバー関数resolveCourseSpotsがisSeasonActiveを再利用。SQL includeで公開Season/候補Spotを取得し、有効候補が1件だけなら採用、0件/複数ならfallback。複数時はCourseSpot IDをログへ出す。fallbackを使う場合にそのSpotが非公開なら枠除外。季節候補が公開ならfallbackの公開状態に依存せず選択可能。

戻り値にはcourseId、courseSpotId、sortOrder、fallbackSpotId、selectedSeasonId、実spotIdとSpot本文/slug/座標を保持。生のfallback IDと実Spot IDを混同しない。
getCourseDetailが候補を取得して解決し、getCourseMap・SpotのCourse所属判定・getRecapが共通結果を利用。Mapboxのmarker/Popup/fitBounds/GPS nearestは従来どおりgetCourseMapのspotsを使う。画面側の差し替えなし。
Spot詳細とRecapでは1リクエスト内のatをCourseとFindに共通で渡す。別リクエストをまたぐ時刻・選択結果の固定、訪問履歴保存はしない。4/10深夜から4/11等の境界をまたぐ場合は将来課題。

## TODAY'S FIND

| UUID | Spot | タイトル | Season |
| --- | --- | --- | --- |
| f10b6e8c-4960-4248-a8e7-7e2c669e876e | nishiyama-cherry-blossoms | お気に入りの桜を見つけよう | spring-cherry-blossoms |
| 62304c47-1be7-4008-bec0-3abd2eeb3086 | nishiyama-azaleas | お気に入りのツツジを見つけよう | spring-azaleas |
| 40dd7853-dd8e-49e6-9922-7572a3b77c4d | nishiyama-autumn-leaves | お気に入りの紅葉を見つけよう | autumn-leaves |

新規Findは3件を共用（lensId=NULL）、具体Spot×Seasonに限定。2つのSEASON Lensだけに各3件を複製すると6Findになり、想定件数に合わない。今回PHOTOにも季節枠があるため同じFindを共用し、Camera→Recapを提供する。既存12Courseには具体季節Spotがなく、既存Findの挙動は変えない。既存「季節の見どころ」のFind2件はそのまま保持。直接Spot URLでもその期間のFindが見える既存仕様を維持。

Findのない季節外fallbackでは季節のCameraテーマを新造しない。RecapはCourseの振り返りで、写真/達成/訪問の永続保存は行わない。

## Seed・データ保護

全UUIDはissue-47-data.mtsへ固定保存。実行時生成・update・upsert・deleteなし。自然キーとIDを照合してskipする。既存内容を更新せず、関係先の不整合は失敗させる。Season候補の期間重複は閏年/通常年の日本時間カレンダーで検証。

| テーブル | 前 | 1回目追加 | 最終 | 2回目追加 |
| --- | ---: | ---: | ---: | ---: |
| Lens | 4 | 4 | 8 | 0 |
| Course | 12 | 12 | 24 | 0 |
| CourseSpot | 25 | 28 | 53 | 0 |
| Season | 2 | 1 | 3 | 0 |
| TodaysFind | 3 | 3 | 6 | 0 |
| CourseSpotSeason | 0 | 33 | 33 | 0 |
| Spot | 10 | 0 | 10 | 0 |
| NearbySpot | 8 | 0 | 8 | 0 |
| LensNearbySpot | 1 | 0 | 1 | 0 |
| RedPanda | 7 | 0 | 7 | 0 |
| News / Event | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

Migration直前の全行を保存し、Migration直後、Seed1回目、2回目に照合。全既存行が時刻を含む全カラム一致。Seed1回目81行追加、2回目0行、全テーブル内容完全一致。

## 検証

- 既存66＋追加21＝全87テストPASS。
- 追加テスト: Seed件数/固定UUID/冪等性/ID衝突rollback/重複期間rollback、新規4Lens×3Duration順、桜期間開始終了（JST）、各季節/fallback、非公開Season/候補/fallback、複数候補、未設定枠維持、実サーバー関数によるCourse/Map/Spot所属/Recap/Find一致。
- 実DB: 新規12Courseと既存12Courseを4/5/8/11月で検証。既存12CourseのSpot IDとsortOrderは変わらず、Findも既存3件の範囲で保持。
- TypeScript: PASS。変更コードESLint（生成Migration.tsを含む）: PASS。
- npm run build: PASS。

## 残る課題

- ページ遷移中の季節境界をまたぐ選択固定、訪問履歴保存は将来対応。
- 実際の開花・紅葉状況、天候、通行状況は連動しない。
- Course時間は編集上の目安。実地での歩行・休憩時間や高低差に応じた調整は別途。
- 新規LensへのNearbySpot紐付けは未実施（既存1件維持）。
- 桜Seasonは公開SPRINGデータのため、既存Parkの季節紹介にも表示される。Parkの取得/UIの変更はなし。

### ブラウザ検証結果

Chromium＋本番buildを320/375/1440pxで検証。季節検証は一時NodeプロセスのDateだけを差し替えて実施し、アプリに日付切替API・URLパラメータ・テスト用コードを追加していない。検証後は通常起動に戻し、現在時刻のfallbackと主要ページHTTP200も確認。

- 新規4Lensの結果画面・新規12Courseを全幅で確認。英字Lens名と3Durationの順序、横はみ出しなし。
- 桜/ツツジ/紅葉/fallbackでMap marker・Popup・GPS nearest・Spot詳細の同一名称/slugを確認。lang、courseId、同名foo query 2件を維持。
- 3季節ともSpotのTODAY'S FIND→画像選択→「見つけた！」→Recapを全幅で確認。実カメラ撮影は行わず、ブラウザfilechooserからテスト画像を選択。
- 新規4Lensの長時間Courseでは全幅で4markerがMap領域内に収まることを確認（fitBounds）。
- 診断radioのSpace操作、label選択、戻るで回答保持、Enterで結果表示を確認。
- Headerの開閉、Escape、triggerへのfocus戻し、focus-visible、44px以上のタップ領域を確認。UI・MapClientの変更なし。
- ブラウザpageerrorなし。初回自動画像選択は一度hydration待ち不足でタイムアウトし、実filechooser操作で再検証してPASS。
- Safari実機、GPS実測、実カメラは未検証。GPSはブラウザのテスト位置情報を使用。
- git diff --check、および追加ファイル個別のwhitespace検査PASS。

### 変更ファイル

- package.json（db:seed:issue-47追加）
- prisma/schema.prisma、schema.json、schema.d.ts
- prisma/issue-47-data.mts、issue-47-seed.mts、seed-issue-47.mts
- migrations/app/20260922T1653_add_course_spot_seasons/（migration.ts・migration.json・ops.json）
- migrations/snapshots/1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998/（contract.json・contract.d.ts）
- src/lib/server/resolve-course-spots.ts、course-detail.ts、course-map.ts、recap.ts
- src/app/spots/[slug]/page.tsx（CourseとFindのリクエスト内判定時点を共通化）
- tests/issue-47.test.mjs、tests/helpers/issue-47-db.mjs
- docs/issue-47-lenses-courses.md
