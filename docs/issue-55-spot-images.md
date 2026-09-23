# Issue #55 — 公式画像の取り込み

調査・実装日: 2026-09-23。画像数の目標より、再利用条件の確認を優先。追加対応を含め、採用はツツジ・紅葉・西山動物園の3枚。桜は画像なしを維持する。

## 調査と採用

公式入口: https://data.city.sabae.lg.jp/opendata-list/
カタログAPI: https://ckan.odp.jig.jp/api/3/action/package_search （西山公園、画像、桜、さくら、sakura、愛の鐘、冒険の森、松堂庵、西山橋を検索）。西山公園11データセット、画像45データセットを確認。桜の専用画像データセットは見つからなかった。検索結果がないことを、画像が存在しないという断定には使わない。

| 対象 | 公式資料・調査結果 | 今回 |
| --- | --- | --- |
| ツツジ | 西山公園ツツジ画像、JPEG 7枚、福井県鯖江市、CC BY 2.1 JP | 西山公園ツツジ2.JPG を採用。花と芝生広場を目視確認 |
| 紅葉 | 西山公園の紅葉画像、JPEG 7枚、福井県鯖江市、CC BY 2.1 JP | 西山公園紅葉1.JPG を採用。園路沿いの紅葉を目視確認 |
| 桜 | 市の西山公園案内・ふくいドットコムに写真はあるが、今回画像自体の再利用条件まで確認できず | 保留。別の場所の桜を流用しない |
| 西山動物園 | レッサーパンダ画像(アケビ)など個体別ZIPのCC BY 2.1カタログあり | 追加対応でZIP内「アケビ３.jpg」を採用。詳細は末尾 |
| 愛の鐘・冒険の森 | 専用の再利用可能画像を確認できず | 保留 |
| 西山橋・松堂庵 | 公式施設案内の既存imageUrlあり。百景位置データも調査 | 今回新規採用しない。既存値は維持。既存画像の利用条件は別途確認が必要 |

動物園の候補: https://ckan.odp.jig.jp/dataset/18207_redpandaakebipicture （ZIP。追加対応で個別画像選定済み）
百景: https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-civicpoi-landscape 、 https://www.city.sabae.fukui.jp/ls/landscape.xml 。XMLに写真URLはあるが、位置データのライセンスがリンク先写真にも適用されるとは今回確定しない。旧www3ホストのTLS不整合もあり、証明書検証を無効にして取得しない。
桜の観光情報: https://www.fuku-e.com/spot/detail_1537.html 。掲載されているだけでは転載根拠にしない。

## 採用画像と出典

### nishiyama-azaleas

- Spot UUID: d2436ba8-ccef-4158-a2a6-cbcd69195115
- データセット: [西山公園ツツジ画像](https://ckan.odp.jig.jp/dataset/18207_nishiyamakoentsutsuzipicture)
- 公開元: 鯖江市（カタログ組織名「福井県鯖江市」）。個別撮影者: 不明
- resource URL: https://ckan.odp.jig.jp/dataset/5485cc00-e0ff-4d75-b620-9402ed08a823/resource/2f205454-50ec-4f2c-8b72-a8b893cca4d1
- 元画像URL: https://ckan.odp.jig.jp/dataset/5485cc00-e0ff-4d75-b620-9402ed08a823/resource/2f205454-50ec-4f2c-8b72-a8b893cca4d1/download/2.jpg
- 作品名: 西山公園ツツジ2.JPG
- 形式: JPEG → JPEG
- 保存先: public/images/spots/nishiyama-azaleas.jpg
- 元寸法: 3648 × 2432 → 1600 × 1067
- 保存サイズ: 608932 bytes
- alt: 西山公園の斜面を彩るピンクや白のツツジと芝生広場

### nishiyama-autumn-leaves

- Spot UUID: edd5befa-d48b-4f8e-992d-df26e7b5b281
- データセット: [西山公園の紅葉画像](https://ckan.odp.jig.jp/dataset/18207_nishiyamakoenkoyopicture)
- 公開元: 鯖江市（カタログ組織名「福井県鯖江市」）。個別撮影者: 不明
- resource URL: https://ckan.odp.jig.jp/dataset/02c6e2d3-91b7-409e-b2af-0883d90cd842/resource/226ee460-2fa0-4407-8e5e-93b29898b75e
- 元画像URL: https://ckan.odp.jig.jp/dataset/02c6e2d3-91b7-409e-b2af-0883d90cd842/resource/226ee460-2fa0-4407-8e5e-93b29898b75e/download/1.jpg
- 作品名: 西山公園紅葉1.JPG
- 形式: JPEG → JPEG
- 保存先: public/images/spots/nishiyama-autumn-leaves.jpg
- 元寸法: 4320 × 2880 → 1600 × 1067
- 保存サイズ: 509401 bytes
- alt: 西山公園の園路沿いに広がる赤や黄色の紅葉

公式APIのライセンスと選定resourceの記録は sources/issue-55-image-catalog.json。元画像・加工後画像のSHA-256と完全なメタデータは src/lib/media/spot-images.json。

## 利用条件

根拠: [CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) / [利用許諾本文](https://creativecommons.org/licenses/by/2.1/jp/legalcode.ja)。カタログのlicense_idはCC-BY-2.1、license_urlは上記JP版。

| 項目 | 両採用画像の扱い |
| --- | --- |
| 著作権・attribution | 公開元「鯖江市」、提供された作品名、出典URL、ライセンスURLを保持。個別著作者名は不明で補わない |
| 商用利用 | ライセンス条件を守れば可 |
| 改変・縮小・トリミング | 可。今回は縮小・JPEG圧縮のみ、トリミングなし。加工内容を明記 |
| 再配布・アプリ内保存 | 条件を守れば可。画像と一緒にATTRIBUTION.mdを配布 |
| 外部hotlink | サーバー運用上の許可は不明。採用しない |

再利用許諾は商標・肖像等のあらゆる権利を保証するものではない。選定画像は公園風景。人物を主題にせず、不要な加工をしない。

## 保存・DB設計比較

外部参照は簡単だがURL変更・停止・hotlink条件に依存。ローカル保存は出典管理が必要だが安定表示・最適化が可能なため採用。1600px長辺へ縮小し、JPEG圧縮。Next Imageで画面に合わせて配信。

| 案 | 実装量・保守 | ライセンス | 詳細・#51再利用 | 複数画像 | MVP |
| --- | --- | --- | --- | --- | --- |
| A: Spot.imageUrl + 共通定義 | 小。画像と定義を同時レビュー | 作品単位の出典・alt・加工・ハッシュを一元管理 | 共通component/helperを再利用可能 | 複数主画像を選ぶ用途には追加設計が必要 | 採用 |
| B: SpotImageテーブル | migration・relation・取得・管理画面が増える | DBで一元管理可能 | 同様に再利用可能 | 複数画像・管理画面に適する | 2枚には過剰。将来検討 |

schema・Migration・Season relationは変更しない。新規依存も追加しない。将来のカードも同じmetadataを参照し、表示ごとに出典義務を満たすこと。#51 UIは未実装。

## 実装と運用

- SpotImageはServer Component。承認済みslugとimagePathの一致時だけローカル画像と正しいクレジットを表示する。
- nullや未承認相対パスは画像要素なし。既存本文・公式情報リンクは残る。既存HTTP(S)画像は以前の表示を維持し、CCライセンスを勝手に付けない。
- width/heightで比率を予約、h-auto・object-contain・sizes・lazy loadingを利用。出典リンクにfocus-visible。
- 「代表イメージです。現在の開花・紅葉状況を示すものではありません。」と表示。満開判定には利用しない。
- 新規環境は既存Spot導入後、npm run db:seed:spot-images を実行。通常の公式Spot Seedはinsert-onlyのまま。
- image SeedはUUID/slugを照合し、既存imageUrlがNULLの場合だけ更新。既存の別画像・対象欠落はtransaction全体を中止して手動確認を要求する。Spotを追加しない。
- 1回目: inserted 0 / updated 2 / skipped 0。2回目: inserted 0 / updated 0 / skipped 2。
- 実DB全13モデルを前後比較。変更は2SpotのimageUrlと自動updatedAtのみ。2回目はupdatedAt含む全値一致。
- 件数維持: Lens 8 / Course 24 / CourseSpot 53 / CourseSpotSeason 33 / Season 3 / TodaysFind 6 / Spot 10 / NearbySpot 8 / ParkFacility 10 / LensNearbySpot 1 / RedPanda 7 / News 0 / Event 0。

## 初回実装の検証

- 全105テストPASS（既存99 + 画像関連6）。画像ハッシュ・寸法・出典、seed冪等性・衝突時rollback、実Spotページの画像有無・query維持を確認。
- TypeScript: npx tsc --noEmit --incremental false PASS。
- 手書き変更ファイルESLint PASS。
- npm run build PASS。
- git diff --check PASS。
- schema変更なしのためPrisma db verifyは対象外。
- production buildをローカルChromeで確認。ツツジ・紅葉・桜（画像なし）の3ページ × 320 / 375 / 768 / 1280 / 1440px = 15ケースPASS。
- 最適化画像の読み込み、自然な縦横比、alt、出典・ライセンスリンク、keyboard focus-visible、横スクロールなし、ブラウザ例外なしを確認。320pxとPCのスクリーンショットも目視確認。
- iPhone Safari実機は未確認。GPS・Map・Cameraコードは未変更。

## 残る課題

桜の写真自体を対象とする公式再利用許諾の確認。愛の鐘・冒険の森の再利用可能資料。橋・松堂庵の既存外部画像の利用条件確認（本Issueでは追加・再配布しない）。複数画像やCMS運用が必要になった際のSpotImageテーブル化。

## 追加対応 — 西山動物園

- データセット: [レッサーパンダ画像(アケビ)](https://ckan.odp.jig.jp/dataset/18207_redpandaakebipicture)。公開元は福井県鯖江市、説明は「レッサーパンダのアケビの画像」。JPEG 5枚をZIPで公開。
- Resource: https://ckan.odp.jig.jp/dataset/5bf06c84-16c5-48c3-909f-1f326acdb916/resource/d6aa290e-484a-4d56-9435-9875030ab341
- ZIP URL: https://ckan.odp.jig.jp/dataset/5bf06c84-16c5-48c3-909f-1f326acdb916/resource/d6aa290e-484a-4d56-9435-9875030ab341/download/.zip
- 個別画像URL: 不明（カタログに独立したJPEG URLはなく、ZIP内メンバーで特定する）。URLを推測して作らない。
- 採用メンバー: レッサーパンダ画像(アケビ)サイズ変更/アケビ３.jpg
- 被写体: アケビ。データセット名・説明・内部ファイル名で公式確認。姿だけから個体を推定していない。
- 西山動物園との関係: [市の公式個体紹介](https://www.city.sabae.fukui.jp/nishiyama_zoo/panda/redpanda_akebi.html)で同園の飼育個体と確認。写真には竹の葉を食べる姿が写る。動物園を代表するレッサーパンダの写真として採用。
- 撮影日時・具体的撮影場所: 不明。西山動物園で撮影されたと断定しない。現時点で必ず会えるという表示もしない。
- ライセンス: CC BY 2.1 JP（APIのlicense_id・license_url確認）。商用利用・改変・アプリ内保存・再配布は表示条件を守れば可。個別撮影者は不明。鯖江市、データセット名、ファイル名、出典リンク、ライセンスリンク、加工内容を表示する。
- 対象Spot: 西山動物園 / UUID 39ad31f0-58be-40d6-90c9-ea52e1a84b7d / slug nishiyama-zoo。実DBで全て照合し、旧imageUrl=NULLを確認。
- 保存先: public/images/spots/nishiyama-zoo.jpg。1632 × 1224 → 1600 × 1200、341,211 bytes。JPEG圧縮、トリミングなし。
- alt: 竹の葉を食べるレッサーパンダ。本文・altに未確認の撮影場所や日時を追加しない。
- ZIP・取り出した原画像・加工後画像のSHA-256を共通メタデータに記録。API証拠も既存JSONへ追記。
- schema / Migration / Spot ID / slug / その他のSpot値は変更なし。画像Seedの既存ロジックをそのまま利用。
- 追加対応Seed 1回目: inserted 0 / updated 1 / skipped 2。2回目: inserted 0 / updated 0 / skipped 3。
- DB全13モデルを前後比較し、西山動物園のimageUrl・updatedAtのみ変更。2回目は更新日時も含め全値不変。ツツジ・紅葉の画像URLと桜のNULLも維持。
- 画像下の代表イメージ案内をメタデータ化。動物園だけ展示状況についての注意書きにし、既存季節画像の文言は維持。

追加対応の検証: 全106テストPASS / TypeScript PASS / 手書き変更ファイルESLint PASS / npm run build PASS / git diff --check PASS。schema変更なし。

Chromeで4ページ（動物園・ツツジ・紅葉・画像なし桜）× 320 / 375 / 1280 / 1440pxの16ケースを確認。画像のデコード・縦横比・alt・出典・ライセンス・加工内容・注意書き・focus-visible・横スクロールなし・ブラウザ例外なしを確認。320pxの動物園画面も目視確認。iPhone Safari実機は未確認。
