# Issue #59 授乳・おむつ交換設備

## 方針・schema
既存ParkFacilityの付帯設備として扱い、施設・Markerを追加しない。
nullable BooleanのhasNursingRoom / hasDiaperChangeを追加。
trueは公式確認済み、falseは公式に「なし」と確認できた場合だけ、nullは未確認。
今回falseを登録する施設はない。ベビーベッド・ベビーシートを交換台と推測しない。
FacilityTypeはTOILET/PARKINGのまま。BABYは表示フィルターでありDBの種別ではない。
FacilityAmenity、Spot、NearbySpot、Courseとの新規relationは追加しない。

## 公式根拠と登録
- 鯖江市「まちなかキッズルーム」：道の駅に授乳・搾乳室とおむつ交換設備。
  https://www.city.sabae.fukui.jp/kosodate_site/riyo/sonotanojoho.html
- 市授乳室一覧：道の駅の授乳室は1階飲食スペース。PDFの写真・施設名を確認。
  https://www.city.sabae.fukui.jp/kosodate_kyoiku/ninshin_shussan/Ke0120250.html
  https://www.city.sabae.fukui.jp/kosodate_kyoiku/ninshin_shussan/Ke0120250.files/sabae.junyuusitu.pdf
- 動物園公式サービス案内：正門前とレッサーパンダのいえ館内に多目的トイレ、オムツ替えシート計2台。台数の個別配分・男女利用可否は断定しない。
  https://www.city.sabae.fukui.jp/nishiyama_zoo/info/service.html
- 施設の開館情報：https://nishiyama-park.jp/
- 既存座標：https://data.odp.jig.jp/viewcsv/jp/fukui/sabae/202.csv

| 既存施設ID | 施設 | hasNursingRoom | hasDiaperChange |
| --- | --- | --- | --- |
| 96902ac7-2229-42d6-a55e-db58a0125caf | 道の駅西山公園 | true | true |
| 586282f7-ea81-4520-afd2-197f04073ba3 | 西山公園(西山動物園) | null | true |
| その他8施設 | 未確認 | null | null |

名称・座標・ID・externalUrl・公開状態は変更しない。座標は既存施設の位置であり、個々の授乳室・交換台の位置ではない。
道の駅の授乳室は館内設備。既存トイレの24時間利用とは別で、授乳室24時間とは表示しない。
おむつ交換設備がトイレ内にあるとは断定せず、詳細位置は未確認と記載。
建物・飲食の営業時間と授乳室専用の利用時間を同一視しない。

## Migration / Seed
Prisma 8 RC Composer / ORMのcontract emit → migration plan → db migrate → db verify。
Migration: migrations/app/20260922T1806_add_facility_baby_amenities。
ADD COLUMN boolを2操作。両列nullable、defaultなし。既存行の新規20値はすべてnullであることを適用直後に検証。
既存カラム・テーブルの削除や変更、データの削除なし。

npm run db:seed:park-facilitiesを再利用。
未登録施設の追加処理と既存ID/name/typeの衝突検出を維持。
確認済み2施設の設備フラグと説明追記だけを更新。既存編集文は保持し、同じ説明を重複追記しない。
未確認施設のフラグ・公開状態・位置・名称は書き換えない。
- 1回目：inserted 0 / updated 2 / skipped 8 / total 10
- 2回目：inserted 0 / updated 0 / skipped 10 / total 10
- 2回目はupdatedAtを含め全値一致。
- 対象2件のみ設備列・説明・更新日時が変更。対象外8施設は既存全値一致。
- 他12モデルは全行全カラム一致：Lens8/Course24/CourseSpot53/CourseSpotSeason33/Spot10/Season3/TodaysFind6/NearbySpot8/LensNearbySpot1/RedPanda7/News0/Event0。

## Map / Accessibility
初期表示はCourseのみ。トイレ・駐車場・ベビーの3トグルを1行配置。
BABYはhasNursingRoom === true OR hasDiaperChange === true。型フィルターとの組み合わせは和集合。
施設配列を1回走査して表示を判定し、既存ID単位のMarkerを再利用するため重複しない。
Popupと施設一覧に「授乳室あり」「おむつ交換設備あり」を文字表示。nullやfalseを「なし」と表示しない。
画面上にも、表示されない設備は未確認の場合があることを説明。
施設一覧はフィルターの状態にかかわらず残し、WebGL非対応でも情報を確認可能。
native button / aria-pressed / ベビーのaria-label / focus-visible / 44px以上。
GPSは既存Course Spot配列だけを使用。nearest Babyは未実装。
CourseSpotSeason・query・GlobalHeaderの処理は変更しない。

## 保留
- 中央広場・松堂亭：CSVのベビーベッド記載を保持し、交換台trueへ変換しない。
- 八角・冒険の森・中段・北の庭：設備欄未確認。公園地図の凡例だけで個別施設の設備を断定しない。
- 嚮陽会館：授乳室旧案内あり。ただし工事中は全館利用不可。再開後に設備・位置・時間を再調査。
  https://www.city.sabae.fukui.jp/about_city/shichonoheya/shoshinhyomei/reiwa8/Sogo01202605261.html
- まなべの館：申し出による授乳室・ベビーシートの観光公式情報あり。ただしNearbySpot登録済みであり今回はParkFacilityへ重複登録しない。
  https://www.the-kansai-guide.com/ja/directory/item/21113/
  将来は「施設単位のParkFacilityにまとめる」か「NearbySpotにも設備属性を持たせる」かを、検索範囲と同一施設の重複表示防止を含め別Issueで判断する。
- 徒歩経路・所要時間・男女利用可否・詳細位置・設備専用時間を推測しない。

## 検証
- 全99テストPASS。新規6件：確認済み三値、既存値保護と再実行、フィルター和集合、設備テキスト、公開取得、nullable契約と追加Migration。
- TypeScript PASS / npm run build PASS / Prisma db verify PASS。
- 手書き変更ファイルと生成MigrationのESLint PASS。
- Prisma生成型schema.d.ts・snapshot contract.d.tsまで通常ルールでlintすると8 errors/24 warnings。既存生成形式のno-empty-object-typeと未使用importが原因で、生成物は手修正しない。
- Migration前後のスナップショットを使い、4季節×24Course = 96 Map入力が一致。
- iPhone Safari実機・GPS実測は未確認。ブラウザGPSはテスト座標を使用。

### ブラウザ最終確認
Chromium本番buildで320/375/768/1280/1440pxを確認。
- 全幅で3フィルターが1行、44px以上、横スクロールなし。
- 初期施設0 / ベビー2 / トイレ+ベビー8 / 全フィルター10。ID・Markerの重複なし。
- トイレをOFFにしてもベビーONなら対象2施設を維持する和集合。
- Popupは地図枠内。設備と名称が最初に見えるようfocusAfterOpen:falseを指定し、末尾リンクへの自動フォーカスによるスクロールを防止。長文はPopup内でスクロールできる。
- 道の駅の館内条件、動物園の計2台・授乳未確認の表示を確認。非表示になった施設のPopupも閉じる。
- Tab/Space、aria-pressed、focus-visible、GlobalHeader開閉/Escape/triggerへのfocus戻しを確認。
- GPSテスト座標は道の駅施設点を使用。それでも推薦はCourse Spotだけで、設備切り替え前後で不変。
- lang/companion/interest/同名foo=1&foo=2の復帰Link維持。
- WebGLを無効化した状態でも全10施設・授乳1件/交換2件の文言・公式リンク10件にアクセス可能。
- スクリーンショットを目視確認。Safari実機は未確認。
- git diff --check PASS。
- 生成型のESLint指摘はHEADのschema.d.tsでも4 errors/12 warningsと再現（新規snapshotにも同じ形式）。手書き変更ファイルと生成Migrationは通常ルールでPASS。
