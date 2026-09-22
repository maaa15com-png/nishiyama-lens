# Issue #48 公式Spot調査・追加記録

調査日: 2026-09-17、追加調査・実装: 2026-09-22。西山橋・松堂庵に加え、公式KMLで確認できた愛の鐘（展望台広場）を登録。追加は計3件、Spot総数7件。残り11件は下記B/Cとして保留。施設名を確認できたことと、登録可能な位置情報を確認できたことを区別する。

## 情報源

- [S1: 鯖江市 施設のご案内](https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/Nishiyama-Shisetsu.html)
- [S2: 鯖江市 西山公園でたっぷり遊ぼ！](https://www.city.sabae.fukui.jp/kanko/feature/nishiyama.html)
- [S3: 鯖江市 ウォーキングマップA](https://www.city.sabae.fukui.jp/kenko_fukushi/hoken_kenkozukuri/oshirase/walkingmapsabae.files/nishiyama-map-a.pdf)
- [S4: 鯖江市 ウォーキングマップB](https://www.city.sabae.fukui.jp/kenko_fukushi/hoken_kenkozukuri/oshirase/walkingmapsabae.files/nishiyama-map-b.pdf)
- [S5: 鯖江百景7・西山橋](https://www.city.sabae.fukui.jp/kanko_sangyo/kankoshisetsu_meisho/sabaehyakkei/sabae-hyakkei-07.html)
- [S6: 鯖江百景6・松堂庵](https://www.city.sabae.fukui.jp/kanko_sangyo/kankoshisetsu_meisho/sabaehyakkei/sabae-hyakkei-06.html)
- [S7: 令和8年度松堂庵呈茶サービス](https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/Koen0120260420.html)
- [S8: 祈りの道](https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/inorinomichi.html)
- [S9: 上段の庭](https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/nishiyama-niwa.html)
- [S10: 北の庭](https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/kitaniwa.html)

## 14件の調査

全件で公式英語名称・公式英語説明は未確認（不明）。slugはアプリ内部識別子の候補であり、公式英語名称ではない。categoryも公式分類ではなく、確認できた用途に基づく既存enumへのアプリ側マッピング案。

| 公式資料の日本語表記 | slug候補 | 説明の根拠・要約 | category案 | 子ども連れ情報 | 季節との関係 | ソース |
| --- | --- | --- | --- | --- | --- | --- |
| 芝生広場（お祭り広場） | lawn-plaza | 催し物に利用される広場 | REST | 個別設備は不明 | 通年の催し物 | S1 |
| 結びの広場（結びのチャイム） | musubi-plaza | 家族等の絆を深めるためのチャイムがある広場 | VIEW | 家族も対象、個別設備不明 | 不明 | S1 |
| 大噴水 | great-fountain | 夜間のライトアップの紹介あり | VIEW | 不明（水遊び可とは判断しない） | 不明 | S1/S2 |
| 西山橋 | nishiyama-bridge | 東西の山を結ぶ橋 | OTHER | 不明 | 春の芝桜 | S1/S2/S4/S5 |
| 上段の庭 | upper-garden | 四阿のある和風庭園 | GARDEN | 休憩用四阿あり、ベビーカー可否不明 | 紅葉期のライトアップ紹介あり | S9/S4 |
| 北の庭 | north-garden | 花菖蒲と藤棚の庭園 | GARDEN | 不明 | 初夏の花菖蒲・藤 | S10/S2 |
| 愛の鐘（展望台広場） | ai-no-kane-observation-deck | 山頂の鐘と市内を望める展望台 | VIEW | 不明 | 不明 | S1 |
| 松堂庵 | shodoan | 嚮陽庭園の休憩所、呈茶サービス | REST | 休憩所、ベビーカー・トイレ不明 | 桜・紅葉、呈茶は開催日限定 | S6/S7 |
| 祈りの道 | inori-path | 石像や句碑がある園路 | OTHER | 不明 | 不明 | S8 |
| ピクニック広場 | picnic-plaza | 市のウォーキングコース起終点として記載 | REST | 不明 | 不明 | S3/S4 |
| 中央広場 | central-plaza | 市のウォーキングマップに記載 | OTHER | 不明 | 不明 | S3/S4 |
| エントランス広場 | entrance-plaza | 大噴水のある広場 | OTHER | 不明 | 不明 | S2/S3/S4 |
| カタクリの小径 | katakuri-path | 展望台から忠霊塔へ向かう尾根道で紹介 | FLOWER | 不明 | 3月下旬頃のカタクリ | S3 |
| 尾根道 | ridge-path | 小ピークと起伏のある散策路 | OTHER | 不明（幼児向けとは判断しない） | 不明 | S3 |

大噴水の稼働時刻はS1に記載されているが2017年更新。登録保留のため営業時間データには採用しない。松堂庵の10～15時は特定日の呈茶サービス時間であり、施設自体の通常開館時間としては採用しない。

## 座標・画像

| Spot | 緯度 | 経度 | 座標の取得元 | 写真参照 |
| --- | --- | --- | --- | --- |
| 芝生広場（お祭り広場） | 不明 | 不明 | 施設別座標未確認 | S1: shisetsu2.jpg |
| 結びの広場（結びのチャイム） | 採用保留 | 採用保留 | 市と県の公式地図で約547m不一致（C） | S1: shisetsu12.JPG |
| 大噴水 | 不明 | 不明 | 施設別座標未確認 | S1: shisetsu4.jpg |
| 西山橋 | 35.9512552 | 136.1832167 | S5の施設名付きaddMarkerと地図リンクのq | S1: shisetsu5.jpg |
| 上段の庭 | 不明 | 不明 | 施設別座標未確認 | S1: shisetsu6.jpg |
| 北の庭 | 不明 | 不明 | 施設別座標未確認 | S1: shisetsu7.jpg |
| 愛の鐘（展望台広場） | 35.952253 | 136.1810642 | S11経由のS12「西山公園展望台」Point | 利用条件未確認のためimageUrl=NULL |
| 松堂庵 | 35.9507532 | 136.1842103 | S6の施設名付きaddMarkerと地図リンクのq | S1: shisetsu11.jpg |
| 祈りの道 | 採用保留 | 採用保留 | 市markerはあるが園路のどの地点か未確認（C） | 写真掲載あり(S2/S8)、採用するimageUrlは未確定 |
| ピクニック広場 | 不明 | 不明 | 施設別座標未確認 | 不明（単独の写真URL未確認） |
| 中央広場 | 不明 | 不明 | 施設別座標未確認 | 不明 |
| エントランス広場 | 不明 | 不明 | 施設別座標未確認 | 不明（噴水写真を広場写真として代用しない） |
| カタクリの小径 | 不明 | 不明 | 施設別座標未確認 | PDF内写真あり(S3)、単独imageUrl不明 |
| 尾根道 | 不明 | 不明 | 施設別座標未確認 | PDF内写真あり(S3)、単独imageUrl不明 |

S1写真のURL基底は https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/Nishiyama-Shisetsu.images/ 。掲載HTMLから相対URLを確認。今回採用したshisetsu5.jpgとshisetsu11.jpgはHTTP 200、JPEG 500×333pxも確認。その他は掲載参照のみでDBへは未登録。

数値は地図の表示中心から推測したものではなく、公式HTMLの施設マーカー。schemaのNumeric(9,6)に合わせ、西山橋は35.951255/136.183217、松堂庵は35.950753/136.184210を登録。測量精度を保証する数値ではない。公園代表点・トイレの座標・図上の目測・第三者投稿地点は代用しない。

## schemaへのマッピング

| カラム | 採用方針 |
| --- | --- |
| id | この追加Seed専用の固定UUID。既存slugがあれば既存IDを保持 |
| name / slug | 上表の日本語名称 / 内部slug |
| nameEn / descriptionEn | 公式英語が不明なのでNULL |
| description | 確認できた事実の短い要約。推測を含めない |
| category | 西山橋OTHER、松堂庵REST、愛の鐘VIEW。公式分類との混同を避ける |
| latitude / longitude | 必須。確認済み3件のみ、小数6桁 |
| imageUrl | 既存2件は維持。愛の鐘は利用条件未確認のためNULL |
| strollerAccessible / hasToilet | 不明なのでNULL（falseにしない） |
| hasRestArea | 松堂庵true、橋・愛の鐘NULL |
| openingHours / feeText / feeTextEn / stayMinutes | 不明なのでNULL |
| externalUrl | 橋・愛の鐘S1、松堂庵S7 |
| isPublished | 追加3件はtrue（アプリ側公開設定） |

childInfoや季節専用カラムは存在しない。季節情報は本調査記録に留め、Season/TodaysFindとの関係を新設しない。schema変更なし。

## Seedの実行方法と保護範囲

実行: npm run db:seed:official-spots

従来のnpm run db:seedは既存Spot・Lens・Course等を更新するため、今回の追加には使用しない。追加専用Seedは独立したトランザクションでSpotだけをINSERTする。既存slugは内容・ID・公開状態を含め一切更新しない。固定IDが別slugと衝突した場合は全体をロールバックして失敗する。削除なし。

初回実装（2026-09-17）の記録:

1回目: inserted=2 / skipped=0 / totalSpots=6。
2回目: inserted=0 / skipped=2 / totalSpots=6。

DB全カラムを実行前・1回目後・2回目後に比較。既存4SpotはID・内容・タイムスタンプを含め一致。2回目後は1回目後の全レコードと一致。

| テーブル | 前 | 後 | 比較 |
| --- | ---: | ---: | --- |
| Spot | 4 | 6 | 既存4件完全一致、追加2件再実行で一致 |
| Lens | 4 | 4 | 全件完全一致 |
| Course | 12 | 12 | 全件完全一致 |
| CourseSpot | 25 | 25 | 全件完全一致 |
| Season | 2 | 2 | 全件完全一致 |
| TodaysFind | 3 | 3 | 全件完全一致 |
| RedPanda | 7 | 7 | 全件完全一致 |
| NearbySpot | 1 | 1 | 全件完全一致 |
| LensNearbySpot | 1 | 1 | 全件完全一致 |

## 画面とMap

Spot詳細はisPublished=trueとslugで取得する。今回imageUrlのSELECTと、存在する画像のみ表示する処理を追加。子連れ設備はtrueだけ表示する既存動作を維持し、不明項目は作らない。

MapはgetCourseDetail → CourseSpot → 公開Spotから取得。全Spot自動表示ではない。追加3件にはCourseSpotを追加しないため、Marker/Popup/fitBounds/GPS nearestの入力は変わらない。将来Courseへ組み込む際にルート・順序・滞在時間を別途検討する。

残る11件は、施設別の公式位置情報（園路はどの地点をSpotとするかも含む）が必要。座標を任意で補完する実装や、nullable化は行っていない。

## 初回実装の検証結果（2026-09-17）

- 全62テストPASS（既存58件 + 追加4件）。追加は再実行・既存slug保護・ID衝突ロールバック・公開Spot取得/画像SELECT。
- TypeScript: tsc --noEmit PASS。本番build内TypeScriptもPASS。
- npm run build: PASS。
- Chromium本番サーバー: 6Spotの名称・説明、新規2件の画像デコード・公式リンク・不明設備の非表示を確認。375pxで横はみ出しなし。松堂庵のスクリーンショットも目視確認。
- 存在しないSpotはnot-found画面とnoindexを確認。既存Suspenseによるストリーミング応答ではHTTP 200になるケースがあるため、404ステータスの保証とは区別する。
- 実DBで公開Spot6件、slug6種。getCourseMapを12コースで実行し、追加前のSpot/順序/座標/categoryと一致。Mapbox描画自体は今回再テストしていない（入力・実装とも変更なし）。
- schema・DB migration・既存Seedは変更なし。専用Seedの.mts拡張子付きimportを型チェックするため、既存noEmit設定にallowImportingTsExtensionsを追加。

- 変更ファイルESLint: PASS（--max-warnings=0。最終追加テストファイルも個別再実行PASS）。
- git diff --check: PASS。


## 追加調査の最終分類と実装（2026-09-22）

- [S11: 鯖江市公式ウォーキング案内](https://www.city.sabae.fukui.jp/kenko_fukushi/hoken_kenkozukuri/oshirase/walkingmapsabae.html)
- [S12: ファミリーコース公開KML](https://www.google.com/maps/d/kml?mid=1wrfJ2YneZs_SSFnSpTTmMK4xkcKdzzk&forcekml=1)
- [S13: チャレンジコース公開KML](https://www.google.com/maps/d/kml?mid=1iPuR4vKWfB-k8zBc4H_DBKqQJgbGmSk&forcekml=1)
- [S14: 市パワースポット案内](https://www.city.sabae.fukui.jp/kanko/feature/powerspot/index.html)
- [S15: 県公式・結びのチャイム](https://www.fuku-e.com/spot/detail_1328.html)

残り12件の最終分類:

| 分類 | Spot | 判断 |
| --- | --- | --- |
| A（今回追加） | 愛の鐘（展望台広場） | 市公式案内のQRから到達する公開KML内の名前付きPointを確認 |
| B（保留・9件） | 芝生広場、大噴水、上段の庭、北の庭、ピクニック広場、中央広場、エントランス広場、カタクリの小径、尾根道 | 公式資料で存在・名称は確認できるが、施設別座標は確認できない |
| C（保留・2件） | 結びの広場、祈りの道 | 結びは公式位置情報の不一致、祈りは園路の代表地点の意味が未確認 |

結びのチャイムは市markerが35.954569/136.180914、県iframeが35.949982/136.183105で約547m異なる。祈りの道は市markerに35.954570/136.180892があるが約900mの道のどこを表すか不明。いずれもDB未登録。

愛の鐘と展望台広場はS1の同一案内項目、KMLの「西山公園展望台」の説明にも愛の鐘があるため1Spotとして扱う。採用元は35.952253/136.1810642。S13では35.9522411/136.1810483（約2m差）。schema Numeric(9,6)に従いDBは35.952253/136.181064を保存する。公園代表座標や目測は使用せず、測量精度は保証しない。

- UUID: d906ef59-b9d6-401d-9844-deba2a40a1e2（固定）
- slug: ai-no-kane-observation-deck
- name: 愛の鐘（展望台広場）
- description: 西山の山頂に愛の鐘と展望台があり、展望台から鯖江市内を見渡せます。（S1の事実の要約）
- category: VIEW（既存enumへのアプリ側分類）
- externalUrl: S1。isPublished: true。
- imageUrl/nameEn/descriptionEn/営業時間/設備/料金/滞在時間: NULL。childInfoカラムは存在せず追加しない。

### 実DB検証

npm run db:seed:official-spots を2回実行。

| 実行 | 追加 | スキップ | 更新 | Spot総数 |
| --- | ---: | ---: | ---: | ---: |
| 1回目 | 1 | 2 | 0 | 7 |
| 2回目 | 0 | 3 | 0 | 7 |

実行前・1回目後・2回目後に全カラム（ID・時刻を含む）を比較。既存6Spotは完全一致、2回目後は1回目後の全レコードと完全一致。公開Spot7件、slug7種。

| テーブル | 前 | 後 | 結果 |
| --- | ---: | ---: | --- |
| Spot | 6 | 7 | 既存6件一致、新規1件のみ |
| Lens | 4 | 4 | 全件一致 |
| Course | 12 | 12 | 全件一致 |
| CourseSpot | 25 | 25 | 全件一致 |
| Season | 2 | 2 | 全件一致 |
| TodaysFind | 3 | 3 | 全件一致 |
| RedPanda | 7 | 7 | 全件一致 |
| NearbySpot | 1 | 1 | 全件一致 |
| LensNearbySpot | 1 | 1 | 全件一致 |

schema・Course・CourseSpot・Map・Spot詳細実装は今回変更なし。CourseSpot未追加のため、既存Mapの取得対象は変わらない。


### 追加実装の検証結果（2026-09-22）

- 全63テストPASS。既存2公式Spotの編集内容・公開状態を維持したまま1件のみ追加し、再実行で全行不変となる回帰テストを追加。
- TypeScript: npx tsc --noEmit PASS。本番buildの型チェックもPASS。
- ESLint: 変更したSeed/テスト、専用Seedコマンド、src全体は --max-warnings=0 でPASS。
- 全体ESLint（eslint . --max-warnings=0）は既存の生成型ファイルや同梱スキル由来の8 errors / 40 warningsでFAIL。今回の変更対象外のため修正していない。
- npm run build: PASS。制限環境ではGoogle Fonts取得に失敗したため、接続可能な環境で再実行して完了。
- Chromium・本番サーバーで /spots/ai-no-kane-observation-deck を320/375/1440pxで検証。HTTP 200、名称・説明・公式リンク一致、画像と未確認設備欄の非表示、横はみ出しなし、ブラウザ実行エラーなし。
- Map仕様・CourseSpotを変更していないためMapへの自動追加はない。Mapbox描画自体は今回再検証していない。
- git diff --check: PASS。

今回の変更ファイルは prisma/official-spots.mts、tests/official-spots.test.mjs、本記録の3件。以前からの未コミット変更は維持。

## 季節Spot追加（2026-09-23）

今回の対象4件のうち愛の鐘（展望台広場）は追加済み。同じUUID・slug・内容を維持し、桜・ツツジ・紅葉の3件だけを新規追加した。現時点のSpot総数は10件。上記の7件という件数は前回実装時点の履歴。

| 名称 | UUID | slug | 緯度 | 経度 | nameEn | externalUrl |
| --- | --- | --- | --- | --- | --- | --- |
| 愛の鐘（展望台広場） | d906ef59-b9d6-401d-9844-deba2a40a1e2 | ai-no-kane-observation-deck | 35.952253 | 136.181064 | NULL | https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/Nishiyama-Shisetsu.html |
| 西山公園の桜 | be4553c3-fda6-446f-8488-16a5a114b6fe | nishiyama-cherry-blossoms | 35.950872 | 136.182828 | Cherry Blossoms at Nishiyama Park | https://www.fuku-e.com/spot/detail_1537.html |
| 西山公園のツツジ | d2436ba8-ccef-4158-a2a6-cbcd69195115 | nishiyama-azaleas | 35.950982 | 136.181685 | Azaleas of Nishiyama Park | https://www.fuku-e.com/spot/detail_1536.html |
| 西山公園の紅葉 | edd5befa-d48b-4f8e-992d-df26e7b5b281 | nishiyama-autumn-leaves | 35.951793 | 136.182227 | Autumn Foliage at Nishiyama Park | https://www.fuku-e.com/spot/detail_1538.html |

登録説明文：
- 愛の鐘（展望台広場）: 西山の山頂に愛の鐘と展望台があり、展望台から鯖江市内を見渡せます。
- 西山公園の桜: 春の西山公園を彩る桜。園内には約1,000本の桜が咲き、花を眺めながら散策を楽しめます。
- 西山公園のツツジ: 約5万本のツツジが咲く西山公園。春には園内を彩る花を楽しめ、つつじまつりでも賑わいます。
- 西山公園の紅葉: 約1,600本のもみじが植えられた西山公園。秋には赤く色づく園内を散策しながら紅葉を楽しめます。

### 公式根拠・保存方針
- 桜・ツツジ・紅葉は上記externalUrlの公式ページ本文を要約。HTML内のGoogle Maps embed/v1/placeのqから、対象ページ別に数値座標を再確認。公園の共通座標へ置換していない。
- 桜: 元座標35.9508723 / 136.1828278。
- ツツジ: 元座標35.950982454181144 / 136.18168473243713。
- 紅葉: 元座標35.951793 / 136.182227。
- 既存Numeric(9,6)に合わせ小数6桁へ四捨五入。季節Spotの公式掲載代表地点であり、花木の分布範囲や個体位置を意味しない。
- 英語名は https://www.fuku-e.com/en/attractions/detail_1537.html 、https://www.fuku-e.com/en/attractions/detail_1536.html 、https://www.fuku-e.com/en/attractions/detail_1538.html の見出しを採用。descriptionEnはNULL。
- 愛の鐘の根拠は既述のS1/S11/S12を再利用。元座標35.952253 / 136.1810642、保存値35.952253 / 136.181064。名称は既存の「愛の鐘（展望台広場）」を維持。
- 対象4件のimageUrlはNULL（画像利用条件未確認）、isPublished=true。nameEnは愛の鐘のみNULL。
- 季節3件のcategoryは既存FLOWER（UI「花・自然」）、愛の鐘は既存VIEW。設備・営業時間等の未知情報は補完しない。
- 固定UUIDをSeed内に保存。既存slugは更新しない。別slugとのUUID衝突はtransaction全体を中止。schema・UI変更なし。

### 実DBでの2回実行
npm run db:seed:official-spots を2回実行。

| 実行 | 追加 | skip | 更新 | Spot総数 |
| --- | ---: | ---: | ---: | ---: |
| 実行前 | — | — | — | 7 |
| 1回目 | 3 | 3 | 0 | 10 |
| 2回目 | 0 | 6 | 0 | 10 |

既存7Spotの全カラム（ID・時刻を含む）を維持。2回目は全テーブルの全行が1回目と完全一致。slugは10件すべて一意。対象4件の公開状態・登録値も実DBで照合。

Lens 4、Course 12、CourseSpot 25、Season 2、TodaysFind 3、RedPanda 7、NearbySpot 8、LensNearbySpot 1、News 0、Event 0はいずれも件数・全カラム不変。
季節の見どころも保持。Course差し替え、Season紐付け、Map仕様変更なし。MapはgetCourseMapからCourseSpot経由で取得するため、今回のSpotは自動追加されない。Mapbox自体の描画再検証は今回行っていない。

### 検証
- 全66テストPASS。既存3公式Spotの編集済み内容を保持した季節3件追加、再実行、UUID・slug、公開状態、英語名を確認するSeedテストを更新。
- TypeScript: npx tsc --noEmit PASS。
- 変更ファイルESLint: official-spots.mts / official-spots.test.mjs、--max-warnings=0 PASS。
- npm run build PASS。
- 本番サーバー＋Chromiumで対象4件×320/375/1440pxを確認。HTTP200、名称・説明・公式リンク一致、画像NULLでimg要素なし、横はみ出しなし、pageerrorなし。Safari実機は未検証。
- git diff --checkと今回変更の未追跡3ファイルに対する個別whitespace検査PASS。

保留11件は未追加：芝生広場、大噴水、上段の庭、北の庭、ピクニック広場、中央広場、エントランス広場、カタクリの小径、尾根道、結びのチャイム（公式間の座標不一致）、祈りの道。
今回変更したファイルはprisma/official-spots.mts、tests/official-spots.test.mjs、本docsの3件。以前からの未コミット変更を維持。
