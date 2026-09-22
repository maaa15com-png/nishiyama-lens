# Issue #48 NearbySpot追加記録

実装日: 2026-09-23。ユーザー承認済みの7件のみを追加。既存の鯖江市まなべの館は全カラム維持。LensNearbySpotの新規紐付けは行わない。

## 追加データ

| name | 固定UUID | slug | 緯度 / 経度 | nameEn | externalUrl |
| --- | --- | --- | --- | --- | --- |
| 地蔵橋 | 97f6f7de-4b22-4df4-a50f-c9839df231f1 | jizo-bridge | 35.950064 / 136.185587 | Jizō Bridge | https://www.fuku-e.com/spot/detail_1030.html |
| 本山誠照寺 | 118036b6-f155-4c38-8aee-eab8bd4074e4 | honzan-jyosyoji | 35.947063 / 136.184255 | Jyosyoji Temple | https://www.jyosyoji.org/ |
| 萬慶寺 | 99d58837-7d39-4b0a-a042-3bd0648170e9 | mankeiji-temple | 35.941533 / 136.184958 | Mankei-ji Temple | https://www.fuku-e.com/spot/detail_1100.html |
| 恵美写真館洋館・表門 | ea625a39-c984-4580-978c-c5f0d1a87e63 | emi-photo-studio | 35.946702 / 136.186172 | NULL | https://www.city.sabae.fukui.jp/kanko/sightseeing/emisyasinkan.html |
| めがねミュージアム | 1a6856c2-9d21-4998-b77c-5845070be2fc | megane-museum | 35.942623 / 136.198832 | Megane Museum | https://www.megane.gr.jp/museum/ |
| 王山古墳群 | e3e258c0-0a6c-4ca6-a9e7-7431df50d399 | ozan-kofun-group | 35.939827 / 136.185127 | Oyama Tumuli | https://www.city.sabae.fukui.jp/kanko/sightseeing/ozankohun.html |
| 兜山古墳 | 2755a9c3-8bc5-4098-af3d-3bf9744ef6a3 | kabutoyama-kofun | 35.974432 / 136.183388 | Kabutoyama Kofun | https://www.city.sabae.fukui.jp/kosodate_kyoiku/manabenoyakata/bunkazai/sabae_bunkazai/shiseki/kabutoyama-national.html |

全件category=SIGHTSEEING、isPublished=true。imageUrlとdescriptionEnはNULL。今回指定のないaddress/addressEn/openingHoursもNULL。恵美写真館は「内部非公開で、見学は写真館への事前問い合わせが必要です。」を説明に保持。

## 根拠・座標

- 地蔵橋、本山誠照寺、萬慶寺、王山古墳群、兜山古墳: ふくいドットコム個別ページの埋め込みMap。誠照寺の座標根拠は https://www.fuku-e.com/spot/detail_1077.html 、王山は https://www.fuku-e.com/spot/detail_1005.html 、兜山は https://www.fuku-e.com/spot/detail_1007.html 。施設URLとは区別する。
- 恵美写真館: 市文化財ページの施設名付きmarker、35.946702/136.186172。https://www.city.sabae.fukui.jp/kosodate_kyoiku/manabenoyakata/bunkazai/sabae_bunkazai/kenzoubutu/tourokuyuukei/18-0005-touroku.html
- めがねミュージアム: 施設公式ページのiframe先にある名称・住所付き施設Point、35.9426227/136.1988319。表示中心の値や、位置が異なる県観光ページの値は採用しない。
- 王山の元の値は35.9398274/136.1851269。めがねミュージアムとともに既存Numeric(9,6)へ丸めたユーザー指定値を使用。
- 公式英語名が未確認の恵美写真館だけnameEn=NULL。王山は公式掲載表記Oyama Tumuli、誠照寺は寺院自身のJyosyoji Templeを使用。独自英訳のdescriptionEnは作成しない。

## Seed設計

実行: npm run db:seed:official-nearby-spots

既存の通常Seedはまなべの館、Lensなどをupsert更新するため使用しない。Spot追加用コマンドとも分離。新コマンドはNearbySpotのみをトランザクション内でINSERTする。

- 固定UUID・slugで照会。既存slugはID・内容・公開状態を含め一切更新しない。
- 固定UUIDが別slugに使われていた場合はエラーとし、それ以前の追加もロールバック。
- LensNearbySpot、priority、recommendationReasonには触れない。
- schema・Migration・アプリ画面・取得処理・既存Seedの変更なし。

## 実DB検証

| 実行 | 追加 | スキップ | 更新 | NearbySpot総数 |
| --- | ---: | ---: | ---: | ---: |
| 1回目 | 7 | 0 | 0 | 8 |
| 2回目 | 0 | 7 | 0 | 8 |

実行前・1回目後・2回目後に全テーブル全カラムを読み取り比較。既存まなべの館のUUID b23c8a02-a9d9-45b7-be8e-6d358a52a412 / slug sabae-manabe-museum は更新日時も含め一致。2回目後は1回目後の全レコードと一致。slug8種、UUID8種。

| テーブル | 前 | 後 | 比較 |
| --- | ---: | ---: | --- |
| NearbySpot | 1 | 8 | 既存1件全値維持、新規7件のみ |
| LensNearbySpot | 1 | 1 | 全値維持 |
| Lens | 4 | 4 | 全値維持 |
| Course | 12 | 12 | 全値維持 |
| CourseSpot | 25 | 25 | 全値維持 |
| Spot | 7 | 7 | 全値維持 |
| Season | 2 | 2 | 全値維持 |
| TodaysFind | 3 | 3 | 全値維持 |
| RedPanda | 7 | 7 | 全値維持 |
| News | 0 | 0 | 不変 |
| Event | 0 | 0 | 不変 |

実際のgetNearbySpotsを実DBに対して全4Lensで実行し、追加前後の戻り値が完全一致。RecapはLensNearbySpot経由なので新規7件は自動表示されない。既存FAMILY × PANDAのまなべの館のみを維持する。

## 保留

- 鯖江藩家老植田家長屋門: 公式座標の不一致。追加しない。
- 旧瓜生家住宅: 2028年1月31日予定まで修理休館。追加しない。
- 誠市: 3～12月第2日曜日のEvent候補。NearbySpotにもEventにも追加しない。
- Lensへの紐付け・推薦優先順位は次の検討ステップ。


## 検証結果

- 全66テストPASS。新規3テスト: 7件追加・再実行・まなべ維持、既存slug保護、UUID衝突ロールバック。
- TypeScript: npx tsc --noEmit PASS。
- 変更コード3ファイルESLint: --max-warnings=0 PASS。
- npm run build: PASS。
- Chromium本番サーバーでRecapを375px/1440pxで確認。FAMILY × PANDAのCourseではまなべの館の1カード・公式リンクを維持。紐付けのないLensのCourseではNearbySpot欄なし。新規7件は両ケースで非表示。HTTP 200、ブラウザ実行エラーなし、横はみ出しなし。
- git diff --check: PASS。新規未追跡ファイルは別途差分チェック。
- 登録データのname/nameEn/description/slug/座標を添付依頼文とプログラムで照合し一致。王山以外のexternalUrlも指定値と一致、王山は承認済み市公式観光ページを使用。

今回の変更: package.json、prisma/official-nearby-spots.mts、prisma/seed-official-nearby-spots.mts、tests/official-nearby-spots.test.mjs、本記録。以前からの未コミット変更は維持。
